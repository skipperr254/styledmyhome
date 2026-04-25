import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { calculateScores } from "@/lib/quiz/scoring";

export async function POST(req: NextRequest) {
  const { userName, answers, paidSessionId } = await req.json() as {
    userName?: string;
    answers: { styleId: string }[];
    paidSessionId?: string;
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "No answers provided" }, { status: 400 });
  }

  const { dominant, scores } = calculateScores(answers);
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      user_name: userName || null,
      dominant_style_id: dominant,
      style_scores: scores,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("quiz_sessions insert failed:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }

  // If the user already paid in a previous session, grant access to this retake for free
  if (paidSessionId) {
    const { data: originalPurchase } = await supabase
      .from("purchases")
      .select("id, email")
      .eq("quiz_session_id", paidSessionId)
      .eq("purchase_type", "single")
      .maybeSingle();

    if (originalPurchase) {
      await supabase.from("purchases").insert({
        quiz_session_id: data.id,
        email: originalPurchase.email,
        purchase_type: "single",
        // No stripe_checkout_session_id — this is a free retake
      });

      return NextResponse.json({ sessionId: data.id, skipPayment: true });
    }
  }

  return NextResponse.json({ sessionId: data.id, dominantStyleId: dominant });
}
