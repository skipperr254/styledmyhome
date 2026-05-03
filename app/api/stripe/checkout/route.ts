import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createServerClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

const PRICES = {
  quiz_access: 999,     // $9.99
  complete_guide: 2999, // $29.99
} as const;

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json() as {
    purchaseType: "quiz_access" | "complete_guide";
    quizSessionId?: string; // only required for complete_guide
    styleName?: string;
    userId?: string; // passed from client as confirmation (we verify against session)
  };

  const { purchaseType, quizSessionId, styleName } = body;

  if (!purchaseType || !PRICES[purchaseType]) {
    return NextResponse.json({ error: "Invalid purchase type" }, { status: 400 });
  }

  if (purchaseType === "complete_guide" && !quizSessionId) {
    return NextResponse.json({ error: "Missing quiz session ID" }, { status: 400 });
  }

  // Fetch customer email from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .maybeSingle();

  const productName =
    purchaseType === "quiz_access"
      ? "Style Quiz + Personalized Style Guide"
      : `${styleName ?? "Complete"} Interior Design Style Guide`;

  const description =
    purchaseType === "quiz_access"
      ? "Discover your interior design style — includes 3 quiz attempts and your personalized PDF style guide."
      : "Complete interior design guide covering all 8 design styles — 100+ page PDF.";

  const successUrl =
    purchaseType === "quiz_access"
      ? `${BASE_URL}/payment-success?checkout_session={CHECKOUT_SESSION_ID}`
      : `${BASE_URL}/results?session=${quizSessionId}&complete_checkout={CHECKOUT_SESSION_ID}`;

  const cancelUrl =
    purchaseType === "quiz_access"
      ? `${BASE_URL}/how-it-works`
      : `${BASE_URL}/results?session=${quizSessionId}&cancelled=1`;

  const session = await stripe.checkout.sessions.create({
    ...(profile?.email ? { customer_email: profile.email } : {}),
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: PRICES[purchaseType],
          product_data: { name: productName, description },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      purchaseType,
      ...(quizSessionId ? { quizSessionId } : {}),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({ url: session.url });
}
