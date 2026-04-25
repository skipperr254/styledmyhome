"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber mb-8">
        Styled My Home
      </p>
      <h1 className="text-2xl font-light text-ink mb-3">
        Something went wrong
      </h1>
      <p className="text-ink-soft mb-8 max-w-xs text-sm">
        An unexpected error occurred. Your quiz progress has been saved.
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-lg bg-amber hover:bg-amber-dark text-white text-sm font-medium tracking-wide transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
