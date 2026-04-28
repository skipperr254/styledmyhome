type PurchaseEmailOptions = {
  purchaseType: "single" | "complete";
  styleName: string;
  downloadUrl: string;
  resultsUrl: string;
};

export function buildPurchaseConfirmationEmail({
  purchaseType,
  styleName,
  downloadUrl,
  resultsUrl,
}: PurchaseEmailOptions): { subject: string; html: string } {
  const isComplete = purchaseType === "complete";

  const subject = isComplete
    ? "Your Complete Style & Design Guide is here 🎉"
    : `Your ${styleName} Style Guide is here 🎉`;

  const headline = isComplete
    ? "Your Complete Style & Design Guide is ready."
    : `Your ${styleName} Style Guide is ready.`;

  const bodyText = isComplete
    ? `Your purchase is confirmed — thank you! We've attached your <strong>Complete Style &amp; Design Guide</strong> to this email, covering all 8 interior design styles in one beautifully formatted PDF. It's yours to keep forever.`
    : `Your purchase is confirmed — thank you! We've attached your personalized <strong>${styleName} Style Guide</strong> to this email. It's yours to keep and reference any time you like.`;

  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:40px 0;background:#f6f5f4;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">

    <!-- Header -->
    <div style="background:#0f0f10;padding:24px 40px;">
      <p style="margin:0;color:#e0a85e;font-size:20px;font-weight:600;letter-spacing:0.05em;">Styled My Home</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <!-- Confirmation badge -->
      <div style="display:inline-flex;align-items:center;gap:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:999px;padding:6px 14px;margin-bottom:24px;">
        <span style="color:#16a34a;font-size:14px;">✓</span>
        <span style="color:#15803d;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Payment confirmed</span>
      </div>

      <h1 style="margin:0 0 20px;color:#0f0f10;font-size:28px;font-weight:700;line-height:1.3;">
        ${headline}
      </h1>

      <p style="margin:0 0 24px;color:#2a2a2a;font-size:15px;line-height:1.7;">
        ${bodyText}
      </p>

      <p style="margin:0 0 28px;color:#2a2a2a;font-size:15px;line-height:1.7;">
        We're also sending you this email as a permanent copy — so you can open and download your guide any time, even from a different device.
      </p>

      <!-- Primary CTA -->
      <div style="text-align:center;margin:0 0 16px;">
        <a href="${downloadUrl}"
           style="display:inline-block;background:#e0a85e;color:#0f0f10;text-decoration:none;
                  border-radius:999px;padding:16px 36px;font-size:12px;font-weight:700;
                  letter-spacing:0.18em;text-transform:uppercase;">
          Download My Guide
        </a>
      </div>

      <!-- Secondary CTA -->
      <div style="text-align:center;margin:0 0 36px;">
        <a href="${resultsUrl}"
           style="color:#e0a85e;font-size:14px;font-weight:600;text-decoration:underline;">
          View my results page →
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e5e3df;margin:0 0 28px;" />

      <p style="margin:0;color:#6b6b6b;font-size:13px;line-height:1.7;">
        💡 <strong>Tip:</strong> Save this email so you always have access to your guide. The download link above is permanent and will work any time.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f6f5f4;border-top:1px solid #e5e3df;padding:24px 40px;">
      <p style="margin:0 0 4px;color:#b7b5af;font-size:12px;">
        © ${year} Styled My Home. All rights reserved.
      </p>
      <p style="margin:0;color:#b7b5af;font-size:12px;">
        You're receiving this because you made a purchase at styledmyhome.com.
      </p>
    </div>

  </div>
</body>
</html>`;

  return { subject, html };
}
