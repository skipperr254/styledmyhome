import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/server";
import { buildPurchaseConfirmationEmail } from "@/lib/email/purchase-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://styledmyhome.com";
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
      metadata?: {
        userId?: string;
        purchaseType?: string;
        quizSessionId?: string;
      };
      id: string;
      customer_email?: string | null;
      payment_status: string;
    };

    const { userId, purchaseType, quizSessionId } = session.metadata ?? {};
    const customerEmail = session.customer_email;

    if (!userId || !purchaseType || session.payment_status !== "paid") {
      console.warn("[webhook] Missing metadata or unpaid session:", session.id);
      return NextResponse.json({ received: true });
    }

    const service = createServiceClient();

    // Record the purchase (idempotent via stripe_checkout_session_id unique constraint)
    await service.from("purchases").upsert(
      {
        user_id: userId,
        purchase_type: purchaseType,
        stripe_checkout_session_id: session.id,
        retakes_used: 0,
        retakes_allowed: purchaseType === "quiz_access" ? 3 : 0,
      },
      { onConflict: "stripe_checkout_session_id" },
    );

    // Send confirmation email
    if (customerEmail) {
      await sendPurchaseEmail({
        service,
        customerEmail,
        userId,
        quizSessionId,
        purchaseType: purchaseType as "quiz_access" | "complete_guide",
      });
    }
  }

  return NextResponse.json({ received: true });
}

async function sendPurchaseEmail({
  service,
  customerEmail,
  userId,
  quizSessionId,
  purchaseType,
}: {
  service: ReturnType<typeof createServiceClient>;
  customerEmail: string;
  userId: string;
  quizSessionId?: string;
  purchaseType: "quiz_access" | "complete_guide";
}) {
  try {
    let storagePath: string;
    let styleName: string;

    if (purchaseType === "complete_guide") {
      storagePath = COMPLETE_GUIDE_PATH;
      styleName = "Complete Style & Design";
    } else {
      // quiz_access — look up style from the user's most recent quiz session
      const { data: session } = await service
        .from("quiz_sessions")
        .select("dominant_style_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!session) {
        // Quiz hasn't been taken yet — that's fine, email will come after quiz
        console.log("[webhook] No quiz session yet for user", userId, "— skipping email");
        return;
      }

      const { data: style } = await service
        .from("styles")
        .select("name, style_guide_pdf_url")
        .eq("id", session.dominant_style_id)
        .single();

      if (!style?.style_guide_pdf_url) {
        console.error("[webhook] Style PDF path not found for", session.dominant_style_id);
        return;
      }

      storagePath = style.style_guide_pdf_url;
      styleName = style.name;
    }

    // 7-day signed URL
    const { data: signed, error: signError } = await service.storage
      .from("style-guides")
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    if (signError || !signed?.signedUrl) {
      console.error("[webhook] Failed to create signed URL:", signError);
      return;
    }

    const resultsUrl = quizSessionId
      ? `${BASE_URL}/results?session=${quizSessionId}`
      : `${BASE_URL}/my-results`;

    const { subject, html } = buildPurchaseConfirmationEmail({
      purchaseType: purchaseType === "quiz_access" ? "single" : "complete",
      styleName,
      downloadUrl: signed.signedUrl,
      resultsUrl,
    });

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: customerEmail,
      subject,
      html,
    });

    if (emailError) {
      console.error("[webhook] Resend error:", emailError);
    } else {
      console.log(`[webhook] Confirmation email sent to ${customerEmail} (${purchaseType})`);
    }
  } catch (err) {
    console.error("[webhook] sendPurchaseEmail unexpected error:", err);
  }
}
