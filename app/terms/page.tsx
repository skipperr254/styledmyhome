import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms and Conditions — Styled My Home",
  description:
    "Terms and Conditions governing the use of the Styled My Home website and digital products.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-ink md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteHeader variant="light" />

      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-5 font-serif text-3xl md:text-5xl">
              Terms and Conditions
            </h1>
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
              Welcome to Styled My Home. These Terms and Conditions
              (&ldquo;Terms&rdquo;) govern your access to and use of the Styled My Home
              website (the &ldquo;Site&rdquo;) and your purchase and use of any digital
              products, downloads, templates, guides, or other digital content
              (collectively, the &ldquo;Digital Products&rdquo;) offered through the
              Site. By accessing the Site or purchasing any Digital Product, you agree
              to be bound by these Terms.
            </p>

            <Section title="1. About Us">
              <p>
                Styled My Home (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
                &ldquo;our&rdquo;) provides digital home styling content, including
                downloadable guides, templates, mood boards, checklists, and related
                digital resources.
              </p>
            </Section>

            <Section title="2. Eligibility">
              <p>
                You must be at least 18 years old, or the age of legal majority in your
                jurisdiction, to purchase Digital Products from the Site. By placing an
                order, you represent and warrant that you meet this requirement and that
                all information you provide is accurate and complete.
              </p>
            </Section>

            <Section title="3. Orders, Pricing, and Payment">
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>All prices are displayed in U.S. Dollars (USD) and are subject to change without notice.</li>
                <li>Payment is processed at the time of purchase through our third-party payment processors. We do not store full payment card details.</li>
                <li>We reserve the right to refuse, cancel, or limit any order at our sole discretion.</li>
                <li>You are responsible for any applicable taxes, duties, or fees unless otherwise stated.</li>
              </ul>
            </Section>

            <Section title="4. Delivery of Digital Products">
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>Digital Products are delivered electronically via a download link, typically immediately after payment confirmation.</li>
                <li>It is your responsibility to provide a valid email address and ensure you can receive emails from us.</li>
                <li>Download links may expire after a set period. If you experience an issue, contact us and we will work in good faith to resolve it.</li>
              </ul>
            </Section>

            <Section title="5. No Refunds Policy">
              <p>
                <strong className="font-medium text-ink">All sales are final.</strong>{" "}
                Because our products are digital and delivered instantly,{" "}
                <strong className="font-medium text-ink">
                  we do not offer refunds, returns, exchanges, or cancellations
                </strong>{" "}
                once a purchase has been completed, regardless of whether the Digital
                Product has been downloaded, accessed, or used.
              </p>
              <p>By completing your purchase, you expressly acknowledge and agree that:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>You waive any right to a refund, chargeback, or reversal of payment.</li>
                <li>You have reviewed the product description and any sample content before purchasing.</li>
                <li>Dissatisfaction with the style, design, or content does not constitute grounds for a refund.</li>
                <li>Technical issues on your device or a change of mind are not grounds for a refund.</li>
              </ul>
              <p>
                If a Digital Product file is genuinely corrupted and we are unable to
                resolve the issue, we may, at our sole discretion, provide a replacement
                file. No cash refund will be issued.
              </p>
            </Section>

            <Section title="6. License and Permitted Use">
              <p>
                Upon purchase, we grant you a limited, non-exclusive, non-transferable,
                revocable license to use the Digital Product for your{" "}
                <strong className="font-medium text-ink">
                  personal, non-commercial use only
                </strong>
                . No commercial-use license is granted under any circumstances.
              </p>
              <p>You <strong className="font-medium text-ink">may not</strong>:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>Resell, redistribute, share, sublicense, or transfer the Digital Product in whole or in part.</li>
                <li>Upload the Digital Product to any public repository or file-sharing service.</li>
                <li>Claim authorship of or present the Digital Product as your own.</li>
                <li>Use the Digital Product for any commercial purpose.</li>
                <li>Remove or alter any copyright, trademark, or proprietary notices.</li>
              </ul>
            </Section>

            <Section title="7. Intellectual Property">
              <p>
                All content on the Site and in the Digital Products — including text,
                images, graphics, designs, templates, logos, and code — is owned by
                Styled My Home or its licensors and is protected by copyright, trademark,
                and other intellectual property laws.
              </p>
            </Section>

            <Section title="8. Disclaimers">
              <p>
                The Site and Digital Products are provided{" "}
                <strong className="font-medium text-ink">
                  &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
                </strong>{" "}
                without warranties of any kind. Any styling suggestions or design
                content are provided for inspirational purposes only.
              </p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Styled My Home shall not be
                liable for any indirect, incidental, special, consequential, or punitive
                damages. Our total aggregate liability shall not exceed the amount you
                paid for the specific Digital Product giving rise to the claim.
              </p>
            </Section>

            <Section title="10. Changes to These Terms">
              <p>
                We reserve the right to update or modify these Terms at any time.
                Changes are effective when posted with an updated &ldquo;Last
                Updated&rdquo; date. Your continued use of the Site constitutes
                acceptance of the revised Terms.
              </p>
            </Section>

            <Section title="11. Governing Law and Dispute Resolution">
              <p>
                These Terms are governed by the laws of the State of Florida, United
                States. Any dispute shall be resolved exclusively in the state or federal
                courts located in Florida, and you consent to the personal jurisdiction
                of those courts.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>For questions about these Terms, please contact us at:</p>
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
