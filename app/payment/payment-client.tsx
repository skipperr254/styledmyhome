"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  styleName: string;
  styleDescription: string;
  heroImageUrl: string | null;
  displayName: string | null;
  showCancelledNotice: boolean;
};

const INCLUDED = [
  "Your dominant design style revealed in full",
  "Style history and cultural origins",
  "Key characteristics & defining traits",
  "6 actionable design & décor tips",
  "Curated color palette (5 colors)",
  "Recommended metal & wood finishes",
  "Style match breakdown across all 8 styles",
  "Downloadable personalized PDF style guide",
];

export default function PaymentClient({
  sessionId,
  styleName,
  styleDescription,
  heroImageUrl,
  displayName,
  showCancelledNotice,
}: Props) {
  const router = useRouter();
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
          quizSessionId: sessionId,
          purchaseType: "single",
          styleName,
        }),
      });

      const { url, error: apiError } = await res.json();
      if (apiError || !url) throw new Error(apiError ?? "Unexpected error");
      router.push(url);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 border-b border-brand-border">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent">
          Styled My Home
        </p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full">
        {/* Left — hero image */}
        {heroImageUrl && (
          <div className="relative h-64 lg:h-auto lg:flex-1 lg:min-h-0">
            <Image
              src={heroImageUrl}
              alt={`${styleName} interior design style`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-cream/30" />
          </div>
        )}

        {/* Right — content */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 lg:w-[480px] lg:shrink-0">
          {showCancelledNotice && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Payment was cancelled. No charge was made — try again whenever you're ready.
            </div>
          )}

          <p className="text-xs font-medium tracking-widest uppercase text-brand-muted mb-3">
            Your result is ready
          </p>

          <h1 className="text-4xl md:text-5xl font-light text-brand-ink leading-tight mb-2">
            {displayName ? `${displayName}, you're` : "You're"}
          </h1>
          <h2 className="text-4xl md:text-5xl font-semibold text-brand-accent leading-tight mb-6">
            {styleName}
          </h2>

          <p className="text-brand-stone text-sm leading-relaxed mb-8 max-w-sm">
            {styleDescription.split(".")[0]}. Unlock your full personalized results
            and PDF style guide below.
          </p>

          {/* What's included */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-muted mb-4">
              What's included
            </p>
            <ul className="space-y-2">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-stone">
                  <span className="text-brand-accent mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 px-8 rounded-lg bg-brand-accent hover:bg-brand-accent-dark disabled:opacity-60 text-white font-medium text-sm tracking-wide transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Redirecting to checkout…
                </>
              ) : (
                "Unlock My Results — $9.99"
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <p className="text-xs text-brand-muted text-center">
              Secure payment via Stripe &middot; Instant PDF download
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
