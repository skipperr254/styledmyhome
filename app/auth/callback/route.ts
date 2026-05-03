import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { resolveUserDestination } from "@/lib/auth/resolve-destination";

/**
 * Handles the magic-link / PKCE auth callback.
 *
 * After exchanging the token for a session, we look at the user's DB
 * state and route them to the right place rather than always /how-it-works:
 *
 *  - Has quiz results   → /results?session={latest}
 *  - Paid, no quiz yet  → /quiz
 *  - No purchase        → /how-it-works
 *
 * The `next` query param can still override this for explicit redirects
 * (e.g. when the user was trying to access /my-results on a new device).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "email"
    | "recovery"
    | "invite"
    | null;

  // If an explicit `next` override was provided, honour it.
  // We only smart-route when next is the default /how-it-works,
  // which means we should check where the user actually needs to go.
  const explicitNext = searchParams.get("next");
  const useSmartRouting =
    !explicitNext || explicitNext === "/how-it-works";

  // Build a mutable response to attach session cookies to
  const fallbackResponse = NextResponse.redirect(
    new URL(explicitNext ?? "/how-it-works", origin),
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            fallbackResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  let user = null;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error);
      return NextResponse.redirect(new URL("/get-started?error=auth", origin));
    }
    user = data.user;
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      console.error("[auth/callback] verifyOtp error:", error);
      return NextResponse.redirect(new URL("/get-started?error=auth", origin));
    }
    user = data.user;
  } else {
    // Neither code nor token_hash — bad link
    return NextResponse.redirect(new URL("/get-started?error=auth", origin));
  }

  // Smart routing: figure out where this user actually needs to go
  if (user && useSmartRouting) {
    const destination = await resolveUserDestination(user.id, supabase);
    const smartResponse = NextResponse.redirect(new URL(destination, origin));
    // Copy the session cookies to the smart-routed response
    fallbackResponse.cookies.getAll().forEach(({ name, value, ...rest }) => {
      smartResponse.cookies.set(name, value, rest as Parameters<typeof smartResponse.cookies.set>[2]);
    });
    return smartResponse;
  }

  return fallbackResponse;
}
