import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { calculateScores } from "@/lib/quiz/scoring";

export async function POST(req: NextRequest) {
  // Verify auth
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { answers, purchaseId } = (await req.json()) as {
    answers: { styleId: string }[];
    purchaseId: string;
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "No answers provided" }, { status: 400 });
  }

  if (!purchaseId) {
    return NextResponse.json({ error: "Missing purchase ID" }, { status: 400 });
  }

  // Use service client for writes (bypasses RLS cleanly)
  const service = createServiceClient();

  // Verify the purchase belongs to this user and has retakes remaining
  const { data: purchase, error: purchaseErr } = await service
    .from("purchases")
    .select("id, user_id, retakes_used, retakes_allowed")
    .eq("id", purchaseId)
    .eq("user_id", user.id)
    .eq("purchase_type", "quiz_access")
    .maybeSingle();

  if (purchaseErr || !purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  if (purchase.retakes_used >= purchase.retakes_allowed) {
    return NextResponse.json({ error: "No retakes remaining" }, { status: 403 });
  }

  const { dominant, scores } = calculateScores(answers);

  // Save the quiz session
  const { data: session, error: sessionErr } = await service
    .from("quiz_sessions")
    .insert({
      user_id: user.id,
      purchase_id: purchaseId,
      dominant_style_id: dominant,
      style_scores: scores,
    })
    .select("id")
    .single();

  if (sessionErr || !session) {
    console.error("[quiz/complete] quiz_sessions insert failed:", sessionErr);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 },
    );
  }

  // Increment retakes_used
  const { error: updateErr } = await service
    .from("purchases")
    .update({ retakes_used: purchase.retakes_used + 1 })
    .eq("id", purchaseId);

  if (updateErr) {
    console.error("[quiz/complete] retakes_used update failed:", updateErr);
    // Non-fatal — session is saved, don't fail the request
  }

  return NextResponse.json({ sessionId: session.id });
}
