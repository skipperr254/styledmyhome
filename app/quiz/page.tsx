import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { isUserAdmin } from "@/lib/auth/admin";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "Style Quiz — Styled My Home",
};

export default async function QuizPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles unauthenticated redirect, but double-check here
  if (!user) redirect("/get-started");

  // Check if user is an admin
  const isAdmin = await isUserAdmin(user.id, supabase);

  // Find the user's most recent quiz_access purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, retakes_used, retakes_allowed")
    .eq("user_id", user.id)
    .eq("purchase_type", "quiz_access")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If not admin and no purchase → send to payment
  if (!isAdmin && !purchase) redirect("/how-it-works");

  // For admins without a purchase, we provide a dummy purchase ID or similar
  // Actually, it's better if they have a purchase, but for testing we can mock it.
  // We'll pass isAdmin to the client so it can bypass checks.
  const purchaseId = purchase?.id ?? "admin-test-mode";
  const retakesRemaining = isAdmin 
    ? 999 
    : (purchase ? purchase.retakes_allowed - purchase.retakes_used : 0);

  // Get first name for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  return (
    <QuizClient
      purchaseId={purchaseId}
      retakesRemaining={retakesRemaining}
      firstName={firstName}
      isAdmin={isAdmin}
    />
  );
}

