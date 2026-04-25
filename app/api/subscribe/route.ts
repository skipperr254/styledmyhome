import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, source } = await req.json() as { email?: string; source?: string };

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  // TODO: connect to mailing list provider (Mailchimp, ConvertKit, etc.)
  // For now, log and return success so the UI flow works end-to-end.
  console.log("[subscribe]", { email, source });

  return NextResponse.json({ ok: true });
}
