import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { FunnelHeader } from "@/components/FunnelHeader";
import HowItWorksClient from "./how-it-works-client";

export const metadata: Metadata = {
  title: "How It Works — Styled My Home",
};

const INCLUDED = [
  "Your dominant interior design style — fully revealed",
  "Style history, cultural origins & key characteristics",
  "6 actionable design & décor tips tailored to your style",
  "Curated color palette, metal & wood finish recommendations",
  "Your style match breakdown across all 8 aesthetics",
  "Downloadable personalized PDF style guide",
  "3 quiz attempts — retake any time and track how your taste evolves",
];

export default async function HowItWorksPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/get-started");
  }

  // Check if this user already has an active quiz_access purchase with retakes left
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, retakes_used, retakes_allowed")
    .eq("user_id", user.id)
    .eq("purchase_type", "quiz_access")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasActiveAccess =
    !!purchase && purchase.retakes_used < purchase.retakes_allowed;

  // Get the user's first name from their profile for personalisation
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <FunnelHeader />

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-2xl">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">
            Here&rsquo;s how it works
          </p>

          <h1 className="font-serif text-3xl md:text-4xl font-light text-ink mb-4 leading-snug">
            {firstName ? `Ready, ${firstName}?` : "Ready to find your style?"}
          </h1>

          <p className="text-ink-soft mb-14 max-w-md leading-relaxed text-sm md:text-base">
            This takes approximately 5 minutes. Your results are personalized to
            your exact choices — no one else will get quite the same result.
          </p>

          {/* Steps */}
          <ol className="space-y-10 mb-16">
            {[
              {
                number: "01",
                title: "Answer 11 visual questions",
                description:
                  "You'll see 11 sets of beautiful images — rooms, textures, colors, and details. Click the one you're most drawn to. There are no right or wrong answers.",
              },
              {
                number: "02",
                title: "Discover your design style",
                description:
                  "Based on your choices, we identify your dominant interior design style from 8 distinct aesthetics, with a full breakdown of what makes your style unique.",
              },
              {
                number: "03",
                title: "Get your personalized style guide",
                description:
                  "Download your personalized PDF — packed with color palettes, material recommendations, décor tips, and inspiration tailored exactly to you.",
              },
            ].map((step) => (
              <li key={step.number} className="flex gap-6">
                <span className="font-serif text-3xl font-light text-amber shrink-0 w-10 leading-none">
                  {step.number}
                </span>
                <div>
                  <h2 className="font-serif font-medium text-ink mb-1 text-lg">
                    {step.title}
                  </h2>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Payment / CTA section */}
          <HowItWorksClient
            included={INCLUDED}
            hasActiveAccess={hasActiveAccess}
            userId={user.id}
          />

          <p className="mt-6 text-xs text-stone">
            11 questions &middot; Visual answers only &middot; Instant results
          </p>
        </div>
      </div>
    </main>
  );
}
