import * as React from "react";

type Props = {
  guideUrl: string;
};

export function WelcomeSubscriberEmail({ guideUrl }: Props) {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </head>
      <body style={body}>
        <div style={container}>
          {/* Header */}
          <div style={header}>
            <p style={brand}>Styled My Home</p>
          </div>

          {/* Body */}
          <div style={content}>
            <h1 style={heading}>Your free guide is here.</h1>
            <p style={paragraph}>
              Thank you for joining the Styled My Home community. As promised,
              here's your complimentary <strong>Home Measurement Guide</strong> —
              the essential tool for planning your space before you buy or
              arrange a single piece of furniture.
            </p>

            {/* CTA */}
            <div style={ctaWrapper}>
              <a href={guideUrl} style={ctaButton}>
                Download Your Free Guide
              </a>
            </div>

            <p style={paragraph}>
              While you're here — have you discovered your interior design style yet?
              Our free visual quiz reveals your dominant aesthetic in just 5 minutes,
              and comes with a personalized PDF style guide.
            </p>

            <div style={ctaWrapper}>
              <a href="https://styledmyhome.com/get-started" style={ctaSecondary}>
                Take the Style Quiz →
              </a>
            </div>
          </div>

          {/* Footer */}
          <div style={footer}>
            <p style={footerText}>
              © {new Date().getFullYear()} Styled My Home. All rights reserved.
            </p>
            <p style={footerText}>
              You're receiving this because you subscribed at styledmyhome.com.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f6f5f4",
  fontFamily: "'Georgia', serif",
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "560px",
  margin: "0 auto",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#0f0f10",
  padding: "24px 40px",
};

const brand: React.CSSProperties = {
  color: "#e0a85e",
  fontSize: "20px",
  fontWeight: "600",
  margin: 0,
  letterSpacing: "0.05em",
};

const content: React.CSSProperties = {
  padding: "40px",
};

const heading: React.CSSProperties = {
  color: "#0f0f10",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 20px",
  lineHeight: "1.3",
};

const paragraph: React.CSSProperties = {
  color: "#2a2a2a",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 24px",
};

const ctaWrapper: React.CSSProperties = {
  textAlign: "center",
  margin: "0 0 32px",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#e0a85e",
  borderRadius: "999px",
  color: "#0f0f10",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.18em",
  padding: "14px 32px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const ctaSecondary: React.CSSProperties = {
  color: "#e0a85e",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "underline",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f6f5f4",
  borderTop: "1px solid #e5e3df",
  padding: "24px 40px",
};

const footerText: React.CSSProperties = {
  color: "#b7b5af",
  fontSize: "12px",
  margin: "0 0 4px",
};
