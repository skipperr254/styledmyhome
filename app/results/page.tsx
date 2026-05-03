import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import ResultsClient from "./results-client";

type StyleRow = {
  id: string;
  name: string;
  description: string;
  history: string;
  key_characteristics: string[];
  design_tips: string[];
  color_palette: string[];
  metal_finishes: string[];
  wood_finishes: string[];
  hero_image_url: string | null;
  style_guide_pdf_url: string | null;
};

type SearchParams = {
  session?: string;
  complete_checkout?: string;
  cancelled?: string;
};

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { session: sessionId } = await searchParams;
  if (!sessionId) return { title: "Your Results — Styled My Home" };

  const service = createServiceClient();
  const { data } = await service
    .from("quiz_sessions")
    .select("dominant_style_id, styles(name)")
    .eq("id", sessionId)
    .single();

  const styleName = (data?.styles as { name?: string } | null)?.name;
  if (!styleName) return { title: "Your Results — Styled My Home" };

  return {
    title: `You're ${styleName} — Styled My Home`,
    description: `Discover your full ${styleName} interior design style guide — color palettes, décor tips, and more.`,
  };
}

export default async function ResultsPage({ searchParams }: Props) {
  const { session: sessionId, complete_checkout, cancelled } = await searchParams;

  if (!sessionId) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/get-started?redirect=/results?session=${sessionId}`);

  const service = createServiceClient();

  // Handle complete guide purchase return from Stripe
  if (complete_checkout) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(complete_checkout);
      if (stripeSession.payment_status === "paid") {
        await service.from("purchases").upsert(
          {
            user_id: user.id,
            purchase_type: "complete_guide",
            stripe_checkout_session_id: complete_checkout,
            retakes_used: 0,
            retakes_allowed: 0,
          },
          { onConflict: "stripe_checkout_session_id" },
        );
      }
    } catch (err) {
      console.error("[results] complete_guide purchase verification failed:", err);
    }
  }

  // Load quiz session — RLS ensures user can only see their own
  const { data: quizSession } = await supabase
    .from("quiz_sessions")
    .select("id, dominant_style_id, user_name, style_scores, purchase_id")
    .eq("id", sessionId)
    .single();

  if (!quizSession) {
    // Session doesn't exist or doesn't belong to this user
    redirect("/my-results");
  }

  const { data: styleRaw } = await service
    .from("styles")
    .select("*")
    .eq("id", quizSession.dominant_style_id)
    .single();

  const style = styleRaw as StyleRow | null;

  if (!style) notFound();

  // Check for complete guide purchase
  const { data: completePurchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("purchase_type", "complete_guide")
    .maybeSingle();

  // How many quiz retakes does the user have left?
  const { data: activePurchase } = await supabase
    .from("purchases")
    .select("retakes_used, retakes_allowed")
    .eq("user_id", user.id)
    .eq("purchase_type", "quiz_access")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const retakesRemaining = activePurchase
    ? activePurchase.retakes_allowed - activePurchase.retakes_used
    : 0;

  // Style match breakdown
  const scores = quizSession.style_scores as Record<string, number>;
  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0);
  const topStyleIds = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({
      id,
      pct: Math.round((count / totalAnswers) * 100),
    }));

  const { data: styleNames } = await service
    .from("styles")
    .select("id, name")
    .in("id", topStyleIds.map((s) => s.id));

  const nameMap = Object.fromEntries((styleNames ?? []).map((s) => [s.id, s.name]));
  const topStyles = topStyleIds.map((s) => ({
    ...s,
    name: nameMap[s.id] ?? s.id,
  }));

  // Get user's first name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? quizSession.user_name ?? null;

  return (
    <main className="min-h-screen bg-cream">
      <header className="px-8 py-4 border-b border-ink/10 bg-cream sticky top-0 z-10">
        <Link href="/">
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={180}
            height={72}
            className="h-12 w-auto"
            priority
          />
        </Link>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-14 space-y-16 animate-fade-up">
        {/* ── Headline ── */}
        <section className="text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">
            Your interior design style
          </p>
          {firstName && (
            <p className="font-serif text-3xl md:text-4xl text-ink-soft mb-2">
              {firstName}, you&apos;re
            </p>
          )}
          <h1 className="font-serif text-5xl md:text-7xl text-amber mb-6 leading-none">
            {style.name}
          </h1>
          <p className="text-ink-soft leading-relaxed max-w-xl mx-auto">
            {style.description}
          </p>
        </section>

        {/* ── Hero Image ── */}
        {style.hero_image_url && (
          <section className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-md">
            <Image
              src={style.hero_image_url}
              alt={`${style.name} interior design`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </section>
        )}

        {/* ── Style History ── */}
        <section>
          <SectionLabel>Style History</SectionLabel>
          <p className="text-ink-soft leading-relaxed">{style.history}</p>
        </section>

        {/* ── Key Characteristics ── */}
        <section>
          <SectionLabel>Key Characteristics</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {style.key_characteristics.map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-full border border-ink/10 bg-white text-sm font-medium text-ink shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ── Design Tips ── */}
        <section>
          <SectionLabel>Design &amp; Décor Tips</SectionLabel>
          <div className="space-y-4">
            {style.design_tips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl bg-white border border-ink/10"
              >
                <span className="text-amber font-semibold shrink-0 text-sm w-5 mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-ink-soft text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Color Palette ── */}
        <section>
          <SectionLabel>Color Palette</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {style.color_palette.map((color) => (
              <span
                key={color}
                className="px-4 py-2 rounded-full bg-white border border-ink/10 text-sm text-ink"
              >
                {color}
              </span>
            ))}
          </div>
        </section>

        {/* ── Metal & Wood Finishes ── */}
        <section className="grid md:grid-cols-2 gap-10">
          <div>
            <SectionLabel>Metal Finishes</SectionLabel>
            <ul className="space-y-3">
              {style.metal_finishes.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Wood Finishes</SectionLabel>
            <ul className="space-y-3">
              {style.wood_finishes.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Style Match Breakdown ── */}
        <section>
          <SectionLabel>Your Style Match Breakdown</SectionLabel>
          <p className="text-sm text-stone mb-6">
            Based on your answers, here&apos;s how your top styles scored.
          </p>
          <div className="bg-white rounded-2xl border border-ink/10 shadow-sm px-6 py-6 space-y-6">
            {topStyles.map((s, i) => (
              <div key={s.id}>
                <div className="flex justify-between items-baseline text-sm mb-2">
                  <span className={`font-medium ${i === 0 ? "text-ink" : "text-ink-soft"}`}>
                    {s.name}
                    {i === 0 && (
                      <span className="ml-2 text-xs font-normal text-amber">
                        Your dominant style
                      </span>
                    )}
                  </span>
                  <span className="text-stone font-medium tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-amber" : "bg-stone/40"}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Actions: Download + Complete Guide Upsell + Retake ── */}
        <ResultsClient
          sessionId={sessionId}
          styleName={style.name}
          hasCompletePurchase={!!completePurchase}
          retakesRemaining={retakesRemaining}
          justPurchasedComplete={!!complete_checkout}
        />
      </article>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-ink mb-5">
      {children}
    </p>
  );
}
