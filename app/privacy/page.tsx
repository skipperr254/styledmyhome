import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — Styled My Home",
  description:
    "How Styled My Home collects, uses, shares, and protects your personal information.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-serif text-2xl text-ink md:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteHeader variant="light" />

      <section className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-12">
          <div className="text-center">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-5 font-serif text-3xl md:text-5xl">Privacy Policy</h1>
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
              Styled My Home (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              respects your privacy. This Privacy Policy explains what personal
              information we collect when you visit the Styled My Home website (the
              &ldquo;Site&rdquo;) or purchase any digital products, downloads, templates,
              guides, or other digital content (collectively, the &ldquo;Digital
              Products&rdquo;), how we use and share that information, and the rights and
              choices available to you.
            </p>

            <Section title="1. Who This Policy Applies To">
              <p>
                This Privacy Policy applies to visitors, customers, and subscribers of
                the Site. It should be read together with our{" "}
                <Link
                  href="/terms"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and our{" "}
                <Link
                  href="/cookies"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  Cookie Notice
                </Link>
                .
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect the following categories of information:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>
                  <strong className="font-medium text-ink">Information you provide.</strong>{" "}
                  Name, email address, billing address, and any other details you submit
                  when you place an order, subscribe to our mailing list, contact us, or
                  complete a style evaluation on the Site.
                </li>
                <li>
                  <strong className="font-medium text-ink">Transaction information.</strong>{" "}
                  Details of Digital Products you purchase, along with order numbers and
                  receipts. Payment card details are submitted directly to our
                  third-party payment processors; we do not store full payment card
                  numbers.
                </li>
                <li>
                  <strong className="font-medium text-ink">
                    Device and usage information.
                  </strong>{" "}
                  IP address, device type, browser type and version, operating system,
                  pages viewed, and general interaction data, collected automatically
                  through cookies and similar technologies.
                </li>
                <li>
                  <strong className="font-medium text-ink">Communications.</strong>{" "}
                  Messages you send us and records of our correspondence.
                </li>
              </ul>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>We use your personal information to:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>Process and deliver your orders, including sending download links and receipts.</li>
                <li>Provide customer support and manage your account.</li>
                <li>Operate, maintain, and improve the Site and Digital Products.</li>
                <li>Send marketing emails and updates, when you have opted in. You can unsubscribe at any time.</li>
                <li>Detect and prevent fraud, abuse, and other harmful activity.</li>
                <li>Comply with legal obligations and enforce our Terms.</li>
              </ul>
            </Section>

            <Section title="4. How We Share Your Information">
              <p>We do not sell your personal information. We share it only with:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-sage-deep">
                <li>
                  <strong className="font-medium text-ink">Service providers.</strong>{" "}
                  Trusted third parties including payment processors, hosting providers,
                  email platforms, and analytics tools, who are contractually required to
                  use your information only to provide services to us.
                </li>
                <li>
                  <strong className="font-medium text-ink">Legal and safety.</strong>{" "}
                  Government authorities and courts where required by law or to protect
                  rights and safety.
                </li>
                <li>
                  <strong className="font-medium text-ink">Business transfers.</strong>{" "}
                  Parties involved in a merger, acquisition, or sale of assets, subject
                  to confidentiality protections.
                </li>
              </ul>
            </Section>

            <Section title="5. Cookies and Tracking Technologies">
              <p>
                We use cookies and similar technologies to operate the Site, remember
                your preferences, and analyze usage. For full details, please see our{" "}
                <Link
                  href="/cookies"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  Cookie Notice
                </Link>
                .
              </p>
            </Section>

            <Section title="6. Data Retention">
              <p>
                We retain your personal information for as long as needed to provide the
                Site and Digital Products, comply with legal obligations, resolve
                disputes, and enforce our agreements.
              </p>
            </Section>

            <Section title="7. Security">
              <p>
                We use reasonable administrative, technical, and physical safeguards to
                protect your personal information, including encrypted connections for
                payment and account pages. No method of transmission or storage is
                completely secure.
              </p>
            </Section>

            <Section title="8. Your Privacy Rights">
              <p>
                Depending on where you live, you may have rights to access, correct,
                delete, or port your personal information, or to object to or restrict
                certain processing. To exercise these rights, contact us at{" "}
                <a
                  href="mailto:info@styledmyhome.com"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  info@styledmyhome.com
                </a>
                .
              </p>
            </Section>

            <Section title="9. Notice to U.S. Residents">
              <p>
                We do not sell personal information for money. Depending on your state of
                residence, you may have additional rights under laws such as the
                California Consumer Privacy Act (CCPA/CPRA). To exercise these rights,
                email us at{" "}
                <a
                  href="mailto:info@styledmyhome.com"
                  className="text-sage-deep underline-offset-4 hover:text-amber-deep hover:underline"
                >
                  info@styledmyhome.com
                </a>
                .
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes are
                effective when posted with an updated &ldquo;Last Updated&rdquo; date.
                Your continued use of the Site constitutes acceptance of the revised
                policy.
              </p>
            </Section>

            <Section title="11. Governing Law">
              <p>
                This Privacy Policy is governed by the laws of the State of Florida,
                United States. Any dispute shall be resolved exclusively in the state or
                federal courts located in Florida.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>
                For questions about this Privacy Policy or your personal information,
                please contact us at:
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
