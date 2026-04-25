import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Cookie Notice — Styled My Home",
  description:
    "How Styled My Home uses cookies and similar technologies, and how you can manage your preferences.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-ink md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export default function CookiesPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteHeader variant="light" />

      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-5 font-serif text-3xl md:text-5xl">Cookie Notice</h1>
            <p className="mt-6 text-sm text-ink-soft">
              <span className="block">
                <strong className="font-medium text-ink">Website:</strong> Styled My Home
              </span>
              <span className="mt-1 block">
                <strong className="font-medium text-ink">Effective Date:</strong> January
                1, 2025
              </span>
              <span className="mt-1 block">
                <strong className="font-medium text-ink">Last Updated:</strong> April 15,
                2026
              </span>
            </p>
          </div>

          <div className="mt-14 space-y-10 text-sm leading-relaxed text-ink-soft md:text-[15px]">
            <p>
              This Cookie Notice explains how Styled My Home (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar
              technologies when you visit the Styled My Home website. It should be read
              together with our{" "}
              <Link
                href="/privacy"
                className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
              >
                Terms and Conditions
              </Link>
              .
            </p>

            <Section title="1. What Cookies Are">
              <p>
                Cookies are small text files placed on your device when you visit a
                website. They allow the site to recognize your device, remember your
                preferences, and understand how you interact with the site. We also use
                similar technologies such as pixels, web beacons, and local storage
                (collectively referred to as &ldquo;cookies&rdquo; in this notice).
              </p>
            </Section>

            <Section title="2. Categories of Cookies We Use">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-ink">a. Strictly Necessary</h3>
                  <p className="mt-2">
                    Required for the Site to function. They enable core features such as
                    page navigation, secure checkout, and download delivery. The Site
                    cannot function properly without these cookies, and they cannot be
                    switched off. Your consent is not required for these cookies.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ink">b. Functional</h3>
                  <p className="mt-2">
                    Help the Site remember choices you make, such as your preferences and
                    previously entered information, so we can provide a more personalized
                    experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ink">
                    c. Performance and Analytics
                  </h3>
                  <p className="mt-2">
                    Collect information about how visitors use the Site, such as which
                    pages are visited most often. This helps us improve the Site and
                    understand content performance.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ink">
                    d. Marketing and Advertising
                  </h3>
                  <p className="mt-2">
                    Used, where enabled, to deliver content and advertising that may be
                    of interest to you, and to measure the effectiveness of our marketing
                    campaigns.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="3. Managing Your Cookie Preferences">
              <p>
                Most browsers allow you to view, manage, delete, and block cookies.
                Instructions are generally available in your browser&rsquo;s help or
                settings menu:
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>Google Chrome: Settings → Privacy and security → Cookies and other site data.</li>
                <li>Apple Safari: Settings → Privacy.</li>
                <li>Mozilla Firefox: Settings → Privacy &amp; Security → Cookies and Site Data.</li>
                <li>Microsoft Edge: Settings → Cookies and site permissions.</li>
              </ul>
              <p>
                Please note that blocking cookies may affect your experience on the
                Site. Strictly necessary cookies cannot be disabled without preventing
                core features from functioning correctly.
              </p>
            </Section>

            <Section title="4. Third-Party Cookies and Services">
              <p>
                The Site may use third-party services such as payment processors, hosting
                providers, analytics tools, and email platforms. These providers may set
                their own cookies and are responsible for their own data practices.
              </p>
            </Section>

            <Section title="5. Changes to This Cookie Notice">
              <p>
                We may update this Cookie Notice from time to time. Changes are effective
                when posted with an updated &ldquo;Last Updated&rdquo; date. Please
                revisit this page regularly to stay informed.
              </p>
            </Section>

            <Section title="6. Contact Us">
              <p>
                For questions about this Cookie Notice or our use of cookies, please
                contact us at:
              </p>
              <p>
                <strong className="font-medium text-ink">Styled My Home</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:info@styledmyhome.com"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  info@styledmyhome.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
