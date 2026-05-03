import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resolveUserDestination } from "@/lib/auth/resolve-destination";

/**
 * GET /api/auth/destination
 *
 * Returns the URL an authenticated user should be redirected to based
 * on their current state (quiz results, quiz access, no purchase yet).
 * Called client-side by pages that need to smart-route an existing session.
 */
export async function GET(_req: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ destination: "/get-started" }, { status: 401 });
  }

  const destination = await resolveUserDestination(user.id, supabase);
  return NextResponse.json({ destination });
}
