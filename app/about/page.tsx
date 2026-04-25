import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Styled My Home — Meet Founder Colleen | Interior Design Style",
  description:
    "Meet Colleen, the founder of Styled My Home. Learn how our visual interior design style quiz and PDF style guides help homeowners create timeless, intentional spaces that feel like home.",
};

export default function AboutPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteHeader variant="light" />

      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Our story</p>
            <h1 className="mt-5 font-serif text-3xl md:text-5xl">
              Meet Colleen, the founder
            </h1>
          </div>

          <div className="mt-14 grid gap-10 text-center text-sm leading-relaxed text-ink-soft md:grid-cols-2 md:gap-16 md:text-left md:text-[15px]">
            <div className="space-y-5">
              <p>
                Growing up with exquisitely set dining room tables to marvelous gardens
                reminiscent of the English countryside, my eye for detail and passion for
                creating beautiful spaces has been handed down to me from my mother and
                her mother before. Together, they taught me the principals of design.
              </p>
              <p>
                With my memories of my grandmother&rsquo;s green toile draperies in the
                guest room I slept in as a child, to the Sanderson Fabric floral sofa I
                sat on, watching cartoons most Saturday mornings; pattern, color and
                texture have been instilled in me.
              </p>
              <p>
                Those days when my mother would enlist me to help her redesign our home
                together, moving furniture and quite properly hanging artwork, still
                represent some of my fondest childhood memories. Through my own
                exploration over the years, I discovered my own personal design style.
              </p>
            </div>
            <div className="space-y-5">
              <p>
                From an award winning design consultant with a global furnishings company
                in my early career to a worldwide corporate trainer, I have helped many
                people experience the beauty of what it is to live in a designed space.
              </p>
              <p>
                Life&rsquo;s journey prompted me to begin searching for a means to
                create a beautiful, yet more simplified life, embrace and own my
                creativity, while still feeling the joy of helping others.
              </p>
              <p>
                Today, I find great pleasure in helping my customers elevate their living
                spaces by sharing my passion and experience. Through giving you the
                individualized choice and the knowledge about the design style that
                represents your decision, you too can embark on the journey to your
                design destination.
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4">
            <Link href="/get-started" className="btn-amber">
              Discover your style →
            </Link>
            <p className="text-xs tracking-[0.22em] uppercase text-ink-soft">
              $9.99 one-time · Personalized PDF style guide included
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
