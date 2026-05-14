import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Checks if a user is an admin.
 * Assumes the 'profiles' table has an 'is_admin' column.
 */
export async function isUserAdmin(
  userId: string,
  supabase: SupabaseClient,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return false;
    return !!data.is_admin;
  } catch (err) {
    console.error("Error checking admin status:", err);
    return false;
  }
}
