import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const MASTER_GUIDE_PATH = "complete/Styled-My-Home-Style-And-Design-Guide.pdf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session");
  const type = searchParams.get("type") as "single" | "complete" | null;

  if (!sessionId || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, purchase_type")
    .eq("quiz_session_id", sessionId)
    .eq("purchase_type", type)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "No valid purchase found" }, { status: 403 });
  }

  let storagePath: string;
  let filename: string;

  if (type === "complete") {
    storagePath = MASTER_GUIDE_PATH;
    filename = "Styled-My-Home-Complete-Style-Guide.pdf";
  } else {
    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("dominant_style_id")
      .eq("id", sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { data: style } = await supabase
      .from("styles")
      .select("name, style_guide_pdf_url")
      .eq("id", session.dominant_style_id)
      .single();

    if (!style?.style_guide_pdf_url) {
      return NextResponse.json({ error: "PDF not available" }, { status: 404 });
    }

    storagePath = style.style_guide_pdf_url;
    filename = `Styled-My-Home-${style.name.replace(/\s+/g, "-")}-Style-Guide.pdf`;
  }

  await supabase.rpc("increment_download_count", { purchase_id: purchase.id });

  // Generate a short-lived signed URL then proxy the file through this route.
  // Proxying (rather than redirecting) lets us set Content-Disposition: attachment
  // so the browser downloads the file without navigating away.
  const { data: signed, error: signError } = await supabase.storage
    .from("style-guides")
    .createSignedUrl(storagePath, 60); // 60 s — only needs to survive the proxy fetch

  if (signError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Could not generate download link" }, { status: 500 });
  }

  const fileRes = await fetch(signed.signedUrl);
  if (!fileRes.ok) {
    return NextResponse.json({ error: "File fetch failed" }, { status: 502 });
  }

  return new NextResponse(fileRes.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
