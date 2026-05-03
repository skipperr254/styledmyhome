import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Given an authenticated user, inspects their DB state and returns
 * the URL they should be taken to next.
 *
 * Priority order:
 *  1. They have a completed quiz session → show their latest results
 *  2. They have a paid quiz_access purchase but no session yet → take the quiz
 *  3. They have no purchase → go pay (/how-it-works)
 */
export async function resolveUserDestination(
  userId: string,
  supabase: SupabaseClient,
): Promise<string> {
  // 1. Do they have any completed quiz sessions?
  const { data: latestSession } = await supabase
    .from("quiz_sessions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestSession) {
    return `/results?session=${latestSession.id}`;
  }

  // 2. Do they have an active quiz_access purchase?
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, retakes_used, retakes_allowed")
    .eq("user_id", userId)
    .eq("purchase_type", "quiz_access")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (purchase) {
    // Paid but haven't taken the quiz yet
    return "/quiz";
  }

  // 3. No purchase → take them to the payment page
  return "/how-it-works";
}
