import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe/client";
import { createServerClient } from "@/lib/supabase/server";
import { buildPurchaseConfirmationEmail } from "@/lib/email/purchase-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://styledmyhome.com";

// Storage paths for each guide type (relative to the "style-guides" bucket)
const COMPLETE_GUIDE_PATH = "complete/Styled-My-Home-Style-And-Design-Guide.pdf";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { quizSessionId?: string; purchaseType?: string };
      id: string;
      customer_email?: string | null;
    };

    const { quizSessionId, purchaseType } = session.metadata ?? {};
    const customerEmail = session.customer_email;

    if (quizSessionId && purchaseType) {
      const supabase = createServerClient();

      // 1. Record the purchase (idempotent)
      await supabase.from("purchases").upsert(
        {
          quiz_session_id: quizSessionId,
          email: customerEmail ?? "",
          purchase_type: purchaseType,
          stripe_checkout_session_id: session.id,
        },
        { onConflict: "stripe_checkout_session_id" }
      );

      // 2. Send the purchase confirmation email with a PDF download link
      if (customerEmail) {
        await sendPurchaseEmail({
          supabase,
          customerEmail,
          quizSessionId,
          purchaseType: purchaseType as "single" | "complete",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function sendPurchaseEmail({
  supabase,
  customerEmail,
  quizSessionId,
  purchaseType,
}: {
  supabase: ReturnType<typeof createServerClient>;
  customerEmail: string;
  quizSessionId: string;
  purchaseType: "single" | "complete";
}) {
  try {
    // Resolve the storage path and style name for the bought guide
    let storagePath: string;
    let styleName: string;

    if (purchaseType === "complete") {
      storagePath = COMPLETE_GUIDE_PATH;
      styleName = "Complete Style & Design";
    } else {
      // Look up the dominant style for this quiz session
      const { data: quizSession } = await supabase
        .from("quiz_sessions")
        .select("dominant_style_id")
        .eq("id", quizSessionId)
        .single();

      if (!quizSession) {
        console.error("[webhook] sendPurchaseEmail: quiz session not found", quizSessionId);
        return;
      }

      const { data: style } = await supabase
        .from("styles")
        .select("name, style_guide_pdf_url")
        .eq("id", quizSession.dominant_style_id)
        .single();

      if (!style?.style_guide_pdf_url) {
        console.error("[webhook] sendPurchaseEmail: style PDF path not found");
        return;
      }

      storagePath = style.style_guide_pdf_url;
      styleName = style.name;
    }

    // Generate a long-lived signed URL (7 days) so the link in the email stays valid
    const { data: signed, error: signError } = await supabase.storage
      .from("style-guides")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days

    if (signError || !signed?.signedUrl) {
      console.error("[webhook] sendPurchaseEmail: failed to create signed URL", signError);
      return;
    }

    const resultsUrl = `${BASE_URL}/results?session=${quizSessionId}`;

    const { subject, html } = buildPurchaseConfirmationEmail({
      purchaseType,
      styleName,
      downloadUrl: signed.signedUrl,
      resultsUrl,
    });

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "hello@styledmyhome.com",
      to: customerEmail,
      subject,
      html,
    });

    if (emailError) {
      console.error("[webhook] sendPurchaseEmail: resend error", emailError);
    } else {
      console.log(`[webhook] Purchase confirmation email sent to ${customerEmail} (${purchaseType})`);
    }
  } catch (err) {
    // Never let email failures break the webhook response
    console.error("[webhook] sendPurchaseEmail: unexpected error", err);
  }
}
