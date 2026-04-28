import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const GUIDE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL +
  "/storage/v1/object/public/measurement-guide/My_Home_Styled_App_Notes_4.26.26.pdf";

function buildWelcomeEmail(guideUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:40px 0;background:#f6f5f4;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">

    <div style="background:#0f0f10;padding:24px 40px;">
      <p style="margin:0;color:#e0a85e;font-size:20px;font-weight:600;letter-spacing:0.05em;">Styled My Home</p>
    </div>

    <div style="padding:40px;">
      <h1 style="margin:0 0 20px;color:#0f0f10;font-size:28px;font-weight:700;line-height:1.3;">
        Your free guide is here.
      </h1>
      <p style="margin:0 0 24px;color:#2a2a2a;font-size:15px;line-height:1.7;">
        Thank you for joining the Styled My Home community. As promised, here's your complimentary
        <strong>Home Measurement Guide</strong> — the essential tool for planning your space before
        you buy or arrange a single piece of furniture.
      </p>

      <div style="text-align:center;margin:0 0 32px;">
        <a href="${guideUrl}"
           style="display:inline-block;background:#e0a85e;color:#0f0f10;text-decoration:none;
                  border-radius:999px;padding:14px 32px;font-size:12px;font-weight:700;
                  letter-spacing:0.18em;text-transform:uppercase;">
          Download Your Free Guide
        </a>
      </div>

      <p style="margin:0 0 24px;color:#2a2a2a;font-size:15px;line-height:1.7;">
        While you're here — have you discovered your interior design style yet?
        Our visual quiz reveals your dominant aesthetic in just 5 minutes, with a
        personalized PDF style guide included.
      </p>

      <div style="text-align:center;margin:0 0 8px;">
        <a href="https://styledmyhome.com/get-started"
           style="color:#e0a85e;font-size:14px;font-weight:600;text-decoration:underline;">
          Take the Style Quiz →
        </a>
      </div>
    </div>

    <div style="background:#f6f5f4;border-top:1px solid #e5e3df;padding:24px 40px;">
      <p style="margin:0 0 4px;color:#b7b5af;font-size:12px;">
        © ${new Date().getFullYear()} Styled My Home. All rights reserved.
      </p>
      <p style="margin:0;color:#b7b5af;font-size:12px;">
        You're receiving this because you subscribed at styledmyhome.com.
      </p>
    </div>

  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const { email, source } = (await req.json()) as {
    email?: string;
    source?: string;
  };

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const normalised = email.trim().toLowerCase();
  const supabase = createServerClient();

  // Silently succeed for duplicates so we don't leak whether an email is subscribed
  const { data: existing } = await supabase
    .from("subscribers")
    .select("id")
    .eq("email", normalised)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email: normalised, source: source ?? "landing_page" });

    if (insertError) {
      console.error("[subscribe] insert error:", insertError.message);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  }

  // Send welcome email regardless (idempotent — Resend deduplicates on their end)
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "hello@styledmyhome.com",
    to: normalised,
    subject: "Your free Home Measurement Guide is here 🎉",
    html: buildWelcomeEmail(GUIDE_URL),
  });

  if (emailError) {
    console.error("[subscribe] email error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
