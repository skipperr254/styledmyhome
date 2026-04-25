"use client";

import Link from "next/link";

export default function ResultsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent mb-8">
        Styled My Home
      </p>
      <h1 className="text-2xl font-light text-brand-ink mb-3">
        Couldn't load your results
      </h1>
      <p className="text-brand-stone mb-8 max-w-xs text-sm">
        There was a problem retrieving your style results. Please try again or
        contact us if the issue persists.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-brand-accent hover:bg-brand-accent-dark text-white text-sm font-medium tracking-wide transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-brand-border text-brand-stone hover:bg-brand-warm text-sm font-medium transition-colors"
        >
          Start over
        </Link>
      </div>
    </main>
  );
}
