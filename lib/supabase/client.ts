import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Uses @supabase/ssr so it stays in sync with the cookie-based session
 * managed by the server client and middleware.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Singleton for components that don't re-render often.
 * For components that need a fresh client on every render, call createClient() directly.
 */
export const supabase = createClient();
