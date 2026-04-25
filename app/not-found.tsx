import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent mb-8">
        Styled My Home
      </p>
      <h1 className="text-5xl font-light text-brand-ink mb-3">404</h1>
      <p className="text-brand-stone mb-8 max-w-xs">
        This page doesn't exist, or the link may have expired.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-lg bg-brand-accent hover:bg-brand-accent-dark text-white text-sm font-medium tracking-wide transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
