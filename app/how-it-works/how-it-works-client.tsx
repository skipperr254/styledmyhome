"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  included: string[];
  hasActiveAccess: boolean;
  userId: string;
};

export default function HowItWorksClient({
  included,
  hasActiveAccess,
  userId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseType: "quiz_access",
          userId,
        }),
      });

      const { url, error: apiError } = await res.json();
      if (apiError || !url) throw new Error(apiError ?? "Unexpected error");
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // If already paid and retakes remain, skip payment entirely
  if (hasActiveAccess) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber/5 border border-amber/20 rounded-xl">
          <p className="text-sm text-ink-soft">
            <span className="font-medium text-ink">You&rsquo;re all set.</span>{" "}
            Your quiz access is active — take it whenever you&rsquo;re ready.
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center px-10 py-4 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
        >
          Start Quiz →
        </Link>
      </div>
    );
  }

  // First-time user — show pricing + payment CTA
  return (
    <div className="space-y-6">
      {/* What's included */}
      <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-1">
          What&rsquo;s included
        </p>
        <p className="font-serif text-2xl text-ink mb-5">
          Your Style Report &amp; PDF Guide — $9.99
        </p>
        <ul className="space-y-2.5 mb-6">
          {included.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-ink-soft"
            >
              <span className="text-amber mt-0.5 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Redirecting to checkout…
            </>
          ) : (
            "Discover My Style — $9.99"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 text-center mt-3">{error}</p>
        )}

        <p className="text-xs text-stone text-center mt-3">
          Secure payment via Stripe &middot; Instant PDF download after quiz
        </p>
      </div>
    </div>
  );
}
