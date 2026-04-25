import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import PaymentClient from "./payment-client";

type Props = {
  searchParams: Promise<{ session?: string; name?: string; style?: string; cancelled?: string }>;
};

export default async function PaymentPage({ searchParams }: Props) {
  const { session: sessionId, name, cancelled } = await searchParams;

  if (!sessionId) notFound();

  const supabase = createServerClient();

  const { data: quizSession } = await supabase
    .from("quiz_sessions")
    .select("id, dominant_style_id, user_name, style_scores")
    .eq("id", sessionId)
    .single();

  if (!quizSession) notFound();

  const { data: style } = await supabase
    .from("styles")
    .select("id, name, description, hero_image_url")
    .eq("id", quizSession.dominant_style_id)
    .single();

  if (!style) notFound();

  const displayName = name || quizSession.user_name || null;

  return (
    <PaymentClient
      sessionId={sessionId}
      styleName={style.name}
      styleDescription={style.description}
      heroImageUrl={style.hero_image_url}
      displayName={displayName}
      showCancelledNotice={cancelled === "1"}
    />
  );
}
