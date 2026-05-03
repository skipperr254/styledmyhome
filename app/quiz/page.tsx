import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
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

  // Find the user's most recent quiz_access purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, retakes_used, retakes_allowed")
    .eq("user_id", user.id)
    .eq("purchase_type", "quiz_access")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // No purchase → send to payment
  if (!purchase) redirect("/how-it-works");

  // Out of retakes → quiz client will show the "buy more" prompt
  const retakesRemaining = purchase.retakes_allowed - purchase.retakes_used;

  // Get first name for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  return (
    <QuizClient
      purchaseId={purchase.id}
      retakesRemaining={retakesRemaining}
      firstName={firstName}
    />
  );
}
