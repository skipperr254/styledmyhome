import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
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
  checkout_session?: string;
  complete_checkout?: string;
};

type Props = { searchParams: Promise<SearchParams> };

async function verifyAndRecordPurchase(
  supabase: ReturnType<typeof createServerClient>,
  quizSessionId: string,
  checkoutSessionId: string,
  purchaseType: "single" | "complete"
) {
  const { data: existing } = await supabase
    .from("purchases")
    .select("id")
    .eq("stripe_checkout_session_id", checkoutSessionId)
    .maybeSingle();

  if (existing) return true;

  const stripeSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  if (stripeSession.payment_status !== "paid") return false;

  await supabase.from("purchases").upsert(
    {
      quiz_session_id: quizSessionId,
      email: stripeSession.customer_email ?? "",
      purchase_type: purchaseType,
      stripe_checkout_session_id: checkoutSessionId,
    },
    { onConflict: "stripe_checkout_session_id" }
  );

  return true;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { session: sessionId } = await searchParams;
  if (!sessionId) return { title: "Your Results — Styled My Home" };

  const supabase = createServerClient();
  const { data } = await supabase
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
  const { session: sessionId, checkout_session, complete_checkout } = await searchParams;

  if (!sessionId) notFound();

  const supabase = createServerClient();

  if (checkout_session) {
    const ok = await verifyAndRecordPurchase(supabase, sessionId, checkout_session, "single");
    if (!ok) redirect(`/payment?session=${sessionId}&cancelled=1`);
  }

  if (complete_checkout) {
    await verifyAndRecordPurchase(supabase, sessionId, complete_checkout, "complete");
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("quiz_session_id", sessionId)
    .eq("purchase_type", "single")
    .maybeSingle();

  if (!purchase) redirect(`/payment?session=${sessionId}`);

  const { data: quizSession } = await supabase
    .from("quiz_sessions")
    .select("id, dominant_style_id, user_name, style_scores")
    .eq("id", sessionId)
    .single();

  if (!quizSession) notFound();

  const { data: style } = await supabase
    .from("styles")
    .select("*")
    .eq("id", quizSession.dominant_style_id)
    .single<StyleRow>();

  if (!style) notFound();

  const { data: completePurchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("quiz_session_id", sessionId)
    .eq("purchase_type", "complete")
    .maybeSingle();

  const scores = quizSession.style_scores as Record<string, number>;
  const totalAnswers = Object.values(scores).reduce((a, b) => a + b, 0);
  const topStyleIds = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, count]) => ({ id, pct: Math.round((count / totalAnswers) * 100) }));

  const { data: styleNames } = await supabase
    .from("styles")
    .select("id, name")
    .in("id", topStyleIds.map((s) => s.id));

  const nameMap = Object.fromEntries((styleNames ?? []).map((s) => [s.id, s.name]));
  const topStyles = topStyleIds.map((s) => ({ ...s, name: nameMap[s.id] ?? s.id }));

  return (
    <main className="min-h-screen bg-brand-cream">
      <header className="px-8 py-4 border-b border-brand-border bg-brand-cream sticky top-0 z-10">
        <a href="/" aria-label="Styled My Home — home" className="inline-block">
          <img src="/images/styled-my-home-logo.png" alt="Styled My Home" className="h-12 w-auto" />
        </a>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-14 space-y-16 animate-fade-up">

        {/* ── Headline ── */}
        <section className="text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-brand-muted mb-4">
            Your interior design style
          </p>
          {quizSession.user_name && (
            <p className="text-2xl font-light text-brand-stone mb-1">
              {quizSession.user_name}, you're
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-semibold text-brand-accent mb-6 leading-none">
            {style.name}
          </h1>
          <p className="text-brand-stone leading-relaxed max-w-xl mx-auto">
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
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </section>
        )}

        {/* ── Style History ── */}
        <section>
          <SectionLabel>Style History</SectionLabel>
          <p className="text-brand-stone leading-relaxed">{style.history}</p>
        </section>

        {/* ── Key Characteristics ── */}
        <section>
          <SectionLabel>Key Characteristics</SectionLabel>
          <div className="flex flex-wrap gap-3">
            {style.key_characteristics.map((c) => (
              <span
                key={c}
                className="px-4 py-2 rounded-full border border-brand-border bg-white text-sm font-medium text-brand-ink shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ── Design Tips ── */}
        <section>
          <SectionLabel>Design & Décor Tips</SectionLabel>
          <div className="space-y-4">
            {style.design_tips.map((tip, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-brand-border">
                <span className="text-brand-accent font-semibold shrink-0 text-sm w-5 mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-brand-stone text-sm leading-relaxed">{tip}</p>
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
                className="px-4 py-2 rounded-full bg-brand-warm border border-brand-border text-sm text-brand-ink"
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
                <li key={f} className="flex items-center gap-3 text-sm text-brand-stone">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Wood Finishes</SectionLabel>
            <ul className="space-y-3">
              {style.wood_finishes.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-brand-stone">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Style Match Breakdown ── */}
        <section>
          <SectionLabel>Your Style Match Breakdown</SectionLabel>
          <p className="text-sm text-brand-muted mb-8">
            Based on your answers, here's how your top styles scored.
          </p>
          <div className="space-y-6">
            {topStyles.map((s, i) => (
              <div key={s.id}>
                <div className="flex justify-between items-baseline text-sm mb-2">
                  <span className={`font-medium ${i === 0 ? "text-brand-ink" : "text-brand-stone"}`}>
                    {s.name}
                    {i === 0 && (
                      <span className="ml-2 text-xs font-normal text-brand-accent">
                        Your dominant style
                      </span>
                    )}
                  </span>
                  <span className="text-brand-muted font-medium tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-2 bg-brand-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      i === 0 ? "bg-brand-accent" : "bg-brand-stone/40"
                    }`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Actions ── */}
        <ResultsClient
          sessionId={sessionId}
          styleName={style.name}
          hasCompletePurchase={!!completePurchase}
        />
      </article>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-brand-muted mb-5">
      {children}
    </p>
  );
}
