import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Styled My Home",
};

const STEPS = [
  {
    number: "01",
    title: "Answer the visual questions",
    description:
      "You'll see 11 sets of beautiful images — rooms, textures, colors, and details. Click the one you're most drawn to. There are no right or wrong answers.",
  },
  {
    number: "02",
    title: "Get your personalized style result",
    description:
      "Based on your choices, we identify your dominant interior design style from 8 distinct aesthetics, with a full breakdown of what makes your style unique.",
  },
  {
    number: "03",
    title: "Use your style guide to decorate with confidence",
    description:
      "Unlock your personalized PDF style guide — packed with color palettes, material recommendations, décor tips, and inspiration tailored to you.",
  },
];

type Props = {
  searchParams: Promise<{ name?: string }>;
};

export default async function HowItWorksPage({ searchParams }: Props) {
  const { name } = await searchParams;
  const quizHref = name ? `/quiz?name=${encodeURIComponent(name)}` : "/quiz";

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col">
      <header className="px-8 py-4 border-b border-brand-border">
        <a href="/" aria-label="Styled My Home — home" className="inline-block">
          <img src="/images/styled-my-home-logo.png" alt="Styled My Home" className="h-12 w-auto" />
        </a>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-2xl stagger-children">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-muted mb-4">
            Here&rsquo;s how it works
          </p>

          <h1 className="font-sans text-3xl md:text-4xl font-light text-brand-ink mb-4 leading-snug">
            {name ? `Ready, ${name}?` : "Ready to find your style?"}
          </h1>

          <p className="text-brand-stone mb-14 max-w-md leading-relaxed text-sm md:text-base">
            This takes approximately 5 minutes. Your results are personalized to your
            exact choices — no one else will get quite the same result.
          </p>

          <ol className="space-y-10 mb-16">
            {STEPS.map((step) => (
              <li key={step.number} className="flex gap-6">
                <span className="font-sans text-3xl font-light text-brand-accent shrink-0 w-10 leading-none">
                  {step.number}
                </span>
                <div>
                  <h2 className="font-sans font-medium text-brand-ink mb-1 text-sm md:text-base">
                    {step.title}
                  </h2>
                  <p className="text-sm text-brand-stone leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href={quizHref}
            className="inline-flex items-center px-10 py-4 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
          >
            Start Quiz
          </Link>

          <p className="mt-6 text-xs text-brand-muted">
            11 questions &middot; Visual answers only &middot; Instant results
          </p>
        </div>
      </div>
    </main>
  );
}
