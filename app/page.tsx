import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SubscribeForm } from "@/components/SubscribeForm";

function StarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title:
    "Styled My Home — Find Your Interior Design Style | Personalized PDF Style Guide",
  description:
    "Take our visual interior design style quiz and discover which of the 8 curated aesthetics — French Country, Japandi, Modern Farmhouse, Coastal, Industrial, Bohemian, Mid-Century Modern, or Transitional — feels like home. Get a personalized PDF style guide with color palettes, finishes, and expert tips for $9.99.",
  keywords:
    "interior design style quiz, what is my design style, home decor quiz, personalized design style guide, interior design PDF guide",
};

const features = [
  {
    title: "Personalized Style Quiz",
    body: "Discover your unique interior design style through our visual room-by-room quiz — tailored to your instinctive preferences.",
  },
  {
    title: "Downloadable Style Guides",
    body: "Get a beautifully crafted PDF style guide with color palettes, furniture recommendations, and expert design tips.",
  },
  {
    title: "8 Curated Design Styles",
    body: "From French Country to Japandi, explore eight carefully curated aesthetics to find the one that feels like home.",
  },
  {
    title: "Color Palette Insights",
    body: "Unlock personalized color palettes that bring your style to life — from wall colors to accent pieces.",
  },
  {
    title: "Finish Recommendations",
    body: "Know exactly which metal and wood finishes complement your style — from brushed brass to reclaimed oak.",
  },
  {
    title: "Intentional Design Choices",
    body: "Make sensible, purposeful purchases that last — skip the trends, focus on timeless pieces, and design with the earth in mind.",
  },
];

const testimonials = [
  {
    quote:
      "Styled My Home changed the way I think about my space. Everything feels more intentional and curated now.",
    name: "Priya Sharma",
    role: "Homeowner, Los Angeles",
  },
  {
    quote:
      "The style quiz nailed my aesthetic perfectly. The PDF guide gave me actionable tips I used right away.",
    name: "Jessica Morales",
    role: "Interior Design Enthusiast",
  },
  {
    quote:
      "I finally have a clear vision for my home. The color palette and finish recommendations were exactly what I needed.",
    name: "Amara Okafor",
    role: "First-Time Homeowner",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Styled My Home — Personalized Interior Design Style Guide",
  description:
    "A visual interior design style quiz plus a personalized PDF style guide with color palettes, finishes, and expert home decor tips across 8 curated aesthetics.",
  image: "https://styledmyhome.com/images/styled-my-home-hero.jpg",
  brand: { "@type": "Brand", name: "Styled My Home" },
  category: "Home & Garden > Interior Design",
  offers: {
    "@type": "Offer",
    price: "9.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://styledmyhome.com/how-it-works",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "3",
  },
};

export default function HomePage() {
  return (
    <main className="bg-cream text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-[92vh] w-full overflow-hidden bg-cover bg-top"
        style={{ backgroundImage: "url('/images/styled-my-home-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/15" />
        <SiteHeader variant="dark" />
        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-110px)] max-w-7xl items-center px-6 md:px-12">
          <h1 className="font-serif text-5xl font-normal leading-[1.08] text-white drop-shadow-sm md:text-7xl lg:text-[88px]">
            Design the home
            <br />
            <span className="italic">you love</span>
          </h1>
        </div>
      </section>

      {/* DISCOVER YOUR STYLE CTA */}
      <section className="bg-cream pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-12">
          <p className="eyebrow">Discover your style</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight md:text-[44px]">
            Uncover the interior style that feels like home
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ink-soft md:text-base">
            Take our visual design quiz and receive your personalized PDF style
            guide — complete with color palettes, finishes, and expert tips.
          </p>
          <Link href="/get-started" className="btn-amber mt-10">
            Discover your style →
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Features</p>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl">
              Everything you need to style your home
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm text-ink-soft md:text-base">
              Powerful design tools that make creating your dream space
              effortless.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="soft-card text-center">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-ink">
                  {f.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVER YOUR SIGNATURE STYLE */}
      <section className="border-y border-ink/5 bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Personalized for you</p>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl">
              Discover your signature style
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-ink-soft md:text-base">
              Stop guessing. Our visual design quiz analyzes your instinctive
              room preferences to reveal the interior style that truly feels
              like home — complete with a personalized style report you can
              download and share.
            </p>
          </div>

          <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-20">
            <ul className="space-y-10 text-center text-sm tracking-[0.15em] text-ink md:text-[13px]">
              <li>
                <p className="font-semibold uppercase">
                  Visual Room-by-Room Quiz
                </p>
                <p className="mt-3 uppercase text-ink-soft">
                  Choose from beautifully curated room images — kitchens,
                  bedrooms, living rooms, and more.
                </p>
              </li>
              <li>
                <p className="font-semibold uppercase">
                  Personalized Style Report
                </p>
                <p className="mt-3 uppercase text-ink-soft">
                  Get a downloadable PDF with your top design style, color
                  palettes, and expert tips.
                </p>
              </li>
              <li>
                <p className="font-semibold uppercase">
                  8 Unique Design Styles
                </p>
                <p className="mt-3 uppercase text-ink-soft">
                  From French Country to Japandi, discover which of our curated
                  aesthetics matches your taste.
                </p>
              </li>
              <li>
                <p className="font-semibold uppercase">
                  Actionable Design Tips
                </p>
                <p className="mt-3 uppercase text-ink-soft">
                  Practical recommendations for furniture, finishes, metals, and
                  color schemes.
                </p>
              </li>
            </ul>

            <div className="flex flex-col items-center justify-center text-center">
              <p className="eyebrow">Design Style Quiz</p>
              <p className="mt-8 max-w-xs text-sm uppercase tracking-[0.2em] text-ink">
                Take the quiz, uncover your style, and receive your personalized
                PDF style guide.
              </p>
              <Link href="/get-started" className="btn-amber mt-10">
                Discover your style →
              </Link>
              <p className="mt-10 font-serif text-5xl">$9.99</p>
              <p className="mt-4 text-xs tracking-[0.18em] text-ink-soft">
                Instant access · Personalized PDF Style Guide
              </p>
              <p className="mt-1 text-xs tracking-[0.14em] text-ink-soft">
                Includes color palettes, finishes &amp; design tips
              </p>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-ink/5 pt-10 text-[11px] tracking-[0.22em] uppercase text-ink-soft">
            <span className="flex items-center gap-1.5 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </span>
            <span>4.9 average rating</span>
            <span className="text-ink/30">·</span>
            <span>Interactive &amp; fun</span>
            <span className="text-ink/30">·</span>
            <span>8 unique design styles</span>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section id="about" className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl">
              Our purpose &amp; promise
            </h2>
          </div>

          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-20">
            <article className="text-center">
              <h3 className="font-serif text-2xl italic md:text-[28px]">
                Our Mission
              </h3>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft md:text-[15px]">
                We are dedicated to helping you enhance your living spaces and
                the comfort of your lives. Our Style and Design Evaluation
                reveals your personalized choices when it comes to selecting a
                style that suits you best. We believe that by teaching you the
                foundation of your preferred expression of the eight design
                styles, you can learn to create stunning spaces that exude your
                unique individualism. We want you to experience the pride and
                joy of coming home to a beautiful sanctuary, one that speaks to
                your soul.
              </p>
            </article>

            <article className="text-center">
              <h3 className="font-serif text-2xl italic md:text-[28px]">
                Our Vision
              </h3>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft md:text-[15px]">
                Focusing your purchases and investments into meaningful
                creations, as you develop your own aesthetic, is good for all of
                us. Investing your time and money into making wise and
                purposeful decisions to enhance your spaces, thus reducing
                landfill waste with the trends of today, is a start. By
                providing you with an introduction into the eight essential
                design styles of today, we feel that you will begin to design
                and decorate for your future, while reducing the amount of
                &ldquo;fast furniture&rdquo; filling landfills today.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Stories</p>
            <h2 className="mt-5 font-serif text-3xl md:text-5xl">
              Trusted by homeowners
            </h2>
            <p className="mt-5 text-sm text-ink-soft md:text-base">
              Hear from homeowners who&rsquo;ve transformed their spaces with
              Styled My Home.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="soft-card flex h-full flex-col items-center text-center"
              >
                <div className="flex items-center gap-1 text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <blockquote className="mt-6 text-sm leading-relaxed text-ink md:text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-1 text-xs tracking-wide text-ink-soft">
                    {t.role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="bg-cream py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
          <p className="eyebrow">
            Stay inspired — get a free measurement guide
          </p>
          <SubscribeForm className="mt-6" source="home-measurement-guide" />
          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-ink">
            Subscribe &amp; get a free home measurement guide PDF
          </p>
          <p className="mt-8 max-w-md text-sm uppercase tracking-[0.18em] text-ink-soft">
            Discover your unique interior design style and create spaces that
            truly feel like home.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="bg-[#efece8] py-24 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="eyebrow">Ready to discover your style?</p>
          <h2 className="mt-6 font-serif text-3xl leading-tight md:text-[44px]">
            Join thousands of homeowners already thriving with Styled My Home.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm text-ink-soft md:text-base">
            Take the quiz and receive your personalized PDF style guide.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/get-started" className="btn-amber">
              Discover your style →
            </Link>
          </div>
          <p className="mt-8 text-xs tracking-[0.22em] uppercase text-ink-soft">
            $9.99 one-time · Personalized PDF style guide included
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
