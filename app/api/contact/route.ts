import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json() as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
  }

  // TODO: send via email provider (Resend, SendGrid, etc.)
  console.log("[contact]", { name, email, message });

  return NextResponse.json({ ok: true });
}
