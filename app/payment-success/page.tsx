import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";

export const metadata: Metadata = {
  title: "You're All Set — Styled My Home",
};

type Props = {
  searchParams: Promise<{ checkout_session?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { checkout_session } = await searchParams;

  if (!checkout_session) redirect("/how-it-works");

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/get-started");

  // Verify the Stripe session and create the purchase record (idempotent)
  let verified = false;
  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(checkout_session);

    if (stripeSession.payment_status === "paid") {
      const serviceClient = createServiceClient();

      // Upsert purchase — idempotent via stripe_checkout_session_id unique constraint
      await serviceClient.from("purchases").upsert(
        {
          user_id: user.id,
          purchase_type: "quiz_access",
          stripe_checkout_session_id: checkout_session,
          retakes_used: 0,
          retakes_allowed: 3,
        },
        { onConflict: "stripe_checkout_session_id" },
      );

      verified = true;
    }
  } catch (err) {
    console.error("[payment-success] Stripe verification failed:", err);
  }

  if (!verified) redirect("/how-it-works?payment_failed=1");

  // Fetch user's first name for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={180}
            height={72}
            className="h-14 w-auto mx-auto"
            priority
          />
        </Link>

        {/* Success checkmark */}
        <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-amber"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-xs font-medium tracking-widest uppercase text-stone mb-3">
          Payment confirmed
        </p>

        <h1 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4 leading-tight">
          {firstName ? `You're all set, ${firstName}!` : "You're all set!"}
        </h1>

        <p className="text-base leading-relaxed text-ink-soft mb-3 max-w-sm mx-auto">
          Your style quiz is ready. Answer 11 visual questions and we&rsquo;ll
          reveal your interior design style — along with your personalized PDF
          guide.
        </p>

        <p className="text-sm text-stone mb-10">
          You have{" "}
          <span className="font-medium text-ink">3 quiz attempts</span> included
          with your purchase.
        </p>

        <Link
          href="/quiz"
          className="inline-flex items-center justify-center w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
        >
          Discover My Style →
        </Link>

        <p className="mt-4 text-xs text-stone">
          A confirmation has been sent to your email
        </p>
      </div>
    </main>
  );
}
