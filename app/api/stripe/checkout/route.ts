import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// Prices in cents
const PRICES = {
  single: 999,    // $9.99
  complete: 2999, // $29.99
} as const;

const DESCRIPTIONS = {
  single: "Your personalized interior design style guide — PDF download included.",
  complete: "Complete interior design style guide covering all 8 design styles.",
} as const;

export async function POST(req: NextRequest) {
  const { quizSessionId, purchaseType, styleName, customerEmail } = await req.json() as {
    quizSessionId: string;
    purchaseType: "single" | "complete";
    styleName: string;
    customerEmail?: string;
  };

  if (!quizSessionId || !purchaseType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: PRICES[purchaseType],
          product_data: {
            name:
              purchaseType === "single"
                ? `${styleName} Style Guide`
                : "Complete Interior Design Style Guide",
            description: DESCRIPTIONS[purchaseType],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      quizSessionId,
      purchaseType,
    },
    success_url:
      purchaseType === "single"
        ? `${BASE_URL}/results?session=${quizSessionId}&checkout_session={CHECKOUT_SESSION_ID}`
        : `${BASE_URL}/results?session=${quizSessionId}&complete_checkout={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/payment?session=${quizSessionId}&cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
