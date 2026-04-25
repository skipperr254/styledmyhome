"use client";

export default function GlobalError({
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
        Something went wrong
      </h1>
      <p className="text-brand-stone mb-8 max-w-xs text-sm">
        An unexpected error occurred. Your quiz progress has been saved.
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-lg bg-brand-accent hover:bg-brand-accent-dark text-white text-sm font-medium tracking-wide transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
