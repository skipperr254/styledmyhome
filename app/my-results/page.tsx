import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Results — Styled My Home",
};

export default async function MyResultsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, show the magic-link prompt (handled client-side)
  // The middleware will have already redirected unauthenticated users,
  // so if we're here the user IS authenticated.
  if (!user) redirect("/get-started?redirect=/my-results");

  // Find their most recent quiz session
  const { data: latestSession } = await supabase
    .from("quiz_sessions")
    .select("id, dominant_style_id, created_at, styles(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If they have a session, redirect straight to it
  if (latestSession) {
    redirect(`/results?session=${latestSession.id}`);
  }

  // Authenticated but no quiz sessions yet — they haven't taken the quiz
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-12">
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={180}
            height={72}
            className="h-14 w-auto mx-auto"
            priority
          />
        </Link>

        <h1 className="font-serif text-3xl text-ink mb-4">
          No results yet
        </h1>
        <p className="text-ink-soft mb-8 leading-relaxed">
          It looks like you haven&rsquo;t taken the quiz yet. Once you do,
          your results will always be here waiting for you — on any device.
        </p>

        <Link
          href="/how-it-works"
          className="inline-flex items-center justify-center w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
        >
          Discover My Style
        </Link>
      </div>
    </main>
  );
}
