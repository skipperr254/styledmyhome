"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type OpenPanel = "none" | "contact" | "faq";

const faqs: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "What makes your product unique from other quizzes out there?",
    answer: (
      <p>
        We are not just a quiz that quickly gives a glimpse at your results, while asking
        you to promote the website on social media as you wait for the expected follow up
        phone call or email to sell more. In fact, that is reason why we don&rsquo;t ask
        for you to share but give you the benefit of downloading instead. We wanted to
        ensure that the results that are uniquely yours along with the information behind
        your interior design style, is yours to keep.
      </p>
    ),
  },
  {
    question: "Who needs the style and design evaluation?",
    answer: (
      <>
        <p>
          If you&rsquo;re just starting out decorating your first apartment or upgrading
          to your forever home and want a look that&rsquo;s more &ldquo;you&rdquo;, you
          will benefit from getting your Style and Design Evaluation results.
        </p>
        <p>
          Are you more of a DIY decorator but would like some formal knowledge and
          expertise about your design style, downloading the full report with all of the
          information, will be a useful resource for you on your decorating journey.
        </p>
      </>
    ),
  },
  {
    question: "How do I use my results?",
    answer: (
      <ol className="list-decimal space-y-3 pl-5 marker:text-sage-deep">
        <li>Stay focused to the interior design style of your choice.</li>
        <li>
          Get to know your style. Look for design inspiration specific to your design
          choice. Build a vision board or collage to become familiar with the key
          characteristics that make your design unique.
        </li>
        <li>
          Make a buying plan. Identify a few key pieces of furniture or décor and invest
          in these statement pieces.
        </li>
        <li>
          Purchase furnishings made of solid wood and higher quality upholstery. You can
          then add elements of color and texture in your accessories to give a pop of
          color.
        </li>
        <li>
          Many of the interior design styles use a neutral backdrop. Some timeless
          neutrals: white, beige, cream, linen, browns, blacks.
        </li>
        <li>
          When searching for a product, begin your search with the style first, then the
          product (e.g. mid-century modern sofa).
        </li>
      </ol>
    ),
  },
  {
    question:
      "How to make an impact towards reducing furniture waste entering landfills?",
    answer: (
      <ol className="list-decimal space-y-3 pl-5 marker:text-sage-deep">
        <li>Invest in good quality furnishings made of solid woods, metals and leathers.</li>
        <li>
          Well wearing fabrics such as heavy weight upholstery, cottons and linens help
          prevent premature aging.
        </li>
        <li>
          Try to avoid purchasing flat pack or &ldquo;fast furniture&rdquo; for statement
          pieces like dining tables, bookcases, and coffee tables.
        </li>
        <li>
          Consider repurposing used furniture pieces with a coat of paint — reduce waste
          and create a unique piece at the same time.
        </li>
      </ol>
    ),
  },
  {
    question:
      "My results showed three different design styles — how do I get the other reports?",
    answer: (
      <p>
        Purchase the full Style and Design Guide to view all 8 design styles, including
        your second and third choices.
      </p>
    ),
  },
  {
    question: "Why do you cover these eight interior design styles?",
    answer: (
      <p>
        These are today&rsquo;s trending top eight interior design styles. Overtime, most
        have remained classic or are founded on very classical design aesthetics. Take
        Japandi for instance — it is a blend of Japanese and Scandinavian furniture
        design, both representing classic, age-old materials unique to their region.
      </p>
    ),
  },
];

export function SiteFooter() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<OpenPanel>("none");
  const isContactOpen = openPanel === "contact";
  const isFaqOpen = openPanel === "faq";
  const togglePanel = (panel: Exclude<OpenPanel, "none">) =>
    setOpenPanel((current) => (current === panel ? "none" : panel));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!res.ok) throw new Error(`Unexpected response: ${res.status}`);
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <footer id="contact" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div
          className={`grid gap-10 border-t border-ink/10 pt-12 ${
            openPanel !== "none" ? "md:grid-cols-[1fr_1.1fr]" : ""
          }`}
        >
          <div className="flex flex-col gap-8">
            <div>
              <Link href="/" aria-label="Styled My Home — home" className="inline-block">
                <img
                  src="/images/styled-my-home-logo.png"
                  alt="Styled My Home"
                  className="h-24 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
                Discover your unique interior design style and create spaces that truly feel
                like home.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs tracking-[0.22em] uppercase text-ink">
              <div className="flex flex-col gap-2">
                <Link href="/about" className="hover:text-amber-deep transition-colors">
                  About
                </Link>
                <button
                  type="button"
                  onClick={() => togglePanel("contact")}
                  aria-expanded={isContactOpen}
                  aria-controls="footer-contact-form"
                  className="text-left tracking-[0.22em] uppercase hover:text-amber-deep transition-colors"
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => togglePanel("faq")}
                  aria-expanded={isFaqOpen}
                  aria-controls="footer-faq"
                  className="text-left tracking-[0.22em] uppercase hover:text-amber-deep transition-colors"
                >
                  FAQ
                </button>
                <div className="mt-4">
                  <p className="text-ink-soft">Follow us</p>
                  <a
                    href="https://www.instagram.com/styled.my.home/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sage hover:text-amber-deep transition-colors"
                  >
                    @styled.my.home
                  </a>
                  <a
                    href="https://www.facebook.com/styledmyhome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sage hover:text-amber-deep transition-colors"
                  >
                    facebook.com/styledmyhome
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/terms" className="hover:text-amber-deep transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-amber-deep transition-colors">
                  Privacy
                </Link>
                <Link href="/cookies" className="hover:text-amber-deep transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>

          <div id="footer-contact-form" hidden={!isContactOpen}>
            <p className="eyebrow">Get in touch</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  Name
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className="rounded-full border border-ink/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-ink placeholder-ink/40 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/30"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="rounded-full border border-ink/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-ink placeholder-ink/40 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/30"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Message
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="rounded-3xl border border-ink/15 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-ink placeholder-ink/40 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/30"
                />
              </label>

              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  className="btn-amber disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
                {status === "success" && (
                  <p className="text-xs tracking-[0.22em] uppercase text-sage-deep">
                    Thanks — your message is on its way.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-xs tracking-[0.22em] uppercase text-red-600">
                    {errorMessage ?? "Sorry, please try again."}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div id="footer-faq" hidden={!isFaqOpen}>
            <p className="eyebrow">Frequently asked</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-ink">
              Your questions, answered
            </h2>

            <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {faqs.map((item, index) => (
                <details key={item.question} className="group py-4" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-serif text-lg leading-snug text-ink transition hover:text-amber-deep [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-sage-deep transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[11px] tracking-[0.3em] uppercase text-ink-soft">
          © {new Date().getFullYear()} Styled My Home. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
