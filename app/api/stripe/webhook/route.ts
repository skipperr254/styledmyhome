import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createServerClient } from "@/lib/supabase/server";

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
    const session = event.data.object as { metadata?: { quizSessionId?: string; purchaseType?: string }; id: string; customer_email?: string | null };
    const { quizSessionId, purchaseType } = session.metadata ?? {};

    if (quizSessionId && purchaseType) {
      const supabase = createServerClient();
      await supabase.from("purchases").upsert(
        {
          quiz_session_id: quizSessionId,
          email: session.customer_email ?? "",
          purchase_type: purchaseType,
          stripe_checkout_session_id: session.id,
        },
        { onConflict: "stripe_checkout_session_id" }
      );
    }
  }

  return NextResponse.json({ received: true });
}
