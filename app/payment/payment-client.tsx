"use client";
import Link from "next/link";

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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
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
          customerEmail: email.trim(),
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
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-8 py-4 border-b border-ink/10">
        <Link href="/">
          <img
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            className="h-12 w-auto"
          />
        </Link>
      </header>

      {/* Hero image — full-width landscape banner */}
      {heroImageUrl && (
        <div className="relative w-full aspect-[16/9] max-h-[420px] overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={`${styleName} interior design style`}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
          {/* Style name overlay on the image */}
          <div className="absolute bottom-6 left-8 right-8">
            <p className="text-xs font-medium tracking-widest uppercase text-white/70 mb-1">
              Your result
            </p>
            <p className="font-serif text-3xl md:text-5xl text-white leading-tight">
              {displayName ? `${displayName}, you&apos;re` : "You're"}
            </p>
            <p className="font-serif text-3xl md:text-5xl font-italic text-white/90 leading-tight">
              {styleName}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-2xl mx-auto w-full px-8 py-12 lg:px-14 lg:py-16">
        <div>
          {showCancelledNotice && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Payment was cancelled. No charge was made — try again whenever
              you&apos;re ready.
            </div>
          )}

          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-3">
            Your personalized style guide
          </p>

          <p className="text-ink-soft text-sm leading-relaxed mb-8 max-w-lg">
            {styleDescription.split(".")[0]}. Unlock your full personalized
            results and PDF style guide below.
          </p>

          {/* What&apos;s included */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-4">
              What&apos;s included
            </p>
            <ul className="space-y-2">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-ink-soft"
                >
                  <span className="text-amber mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-full border border-ink/10 text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition text-sm mb-3"
              />
            </div>
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
                "Unlock My Results — $9.99"
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <p className="text-xs text-stone text-center">
              Secure payment via Stripe &middot; Instant PDF download
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
