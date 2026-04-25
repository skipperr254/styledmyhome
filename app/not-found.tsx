import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber mb-8">
        Styled My Home
      </p>
      <h1 className="text-5xl font-light text-ink mb-3">404</h1>
      <p className="text-ink-soft mb-8 max-w-xs">
        This page doesn&apos;t exist, or the link may have expired.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-lg bg-amber hover:bg-amber-dark text-white text-sm font-medium tracking-wide transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
