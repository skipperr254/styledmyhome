import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

const MASTER_GUIDE_PATH = "complete/Styled-My-Home-Style-And-Design-Guide.pdf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session");
  const type = searchParams.get("type") as "single" | "complete" | null;

  if (!sessionId || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Verify the requesting user is authenticated
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const service = createServiceClient();

  // Verify the quiz session belongs to this user
  const { data: quizSession } = await service
    .from("quiz_sessions")
    .select("id, dominant_style_id, user_id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!quizSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // For complete_guide downloads, verify they have a complete_guide purchase
  if (type === "complete") {
    const { data: completePurchase } = await service
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("purchase_type", "complete_guide")
      .maybeSingle();

    if (!completePurchase) {
      return NextResponse.json(
        { error: "No complete guide purchase found" },
        { status: 403 },
      );
    }
  } else {
    // For single (quiz_access) downloads, verify they have a quiz_access purchase
    const { data: quizPurchase } = await service
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("purchase_type", "quiz_access")
      .maybeSingle();

    if (!quizPurchase) {
      return NextResponse.json(
        { error: "No quiz access purchase found" },
        { status: 403 },
      );
    }
  }

  // Resolve the storage path and filename
  let storagePath: string;
  let filename: string;

  if (type === "complete") {
    storagePath = MASTER_GUIDE_PATH;
    filename = "Styled-My-Home-Complete-Style-Guide.pdf";
  } else {
    const { data: style } = await service
      .from("styles")
      .select("name, style_guide_pdf_url")
      .eq("id", quizSession.dominant_style_id)
      .single();

    if (!style?.style_guide_pdf_url) {
      return NextResponse.json(
        { error: "PDF not available for this style yet" },
        { status: 404 },
      );
    }

    storagePath = style.style_guide_pdf_url;
    filename = `Styled-My-Home-${style.name.replace(/\s+/g, "-")}-Style-Guide.pdf`;
  }

  // Generate a short-lived signed URL then stream the file through this route
  // so we can set Content-Disposition: attachment and keep the URL private.
  const { data: signed, error: signError } = await service.storage
    .from("style-guides")
    .createSignedUrl(storagePath, 60); // 60 s — only needs to survive the stream

  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      { error: "Could not generate download link" },
      { status: 500 },
    );
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
