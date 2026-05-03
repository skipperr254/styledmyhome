"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Step = "name" | "email" | "sent";

export default function GetStartedPage() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);
  // Tracks whether the user indicated they're returning (skipped name step)
  const [returningUser, setReturningUser] = useState(false);

  // If already authenticated, route them to where they actually need to be
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      // Ask the server where this user should go
      try {
        const res = await fetch("/api/auth/destination");
        const { destination } = await res.json();
        window.location.href = destination ?? "/how-it-works";
      } catch {
        window.location.href = "/how-it-works";
      }
    });
  }, []);

  function advanceTo(next: Step) {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 200);
  }

  function handleNameContinue() {
    setReturningUser(false);
    advanceTo("email");
  }

  function handleReturningUser() {
    setName("");
    setReturningUser(true);
    advanceTo("email");
  }

  function handleBack() {
    setReturningUser(false);
    advanceTo("name");
  }

  async function handleEmailSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        // Only attach name metadata for new users going through the name step
        data: !returningUser && name.trim() ? { full_name: name.trim() } : {},
        emailRedirectTo: `${baseUrl}/auth/callback?next=/how-it-works`,
      },
    });

    setLoading(false);

    if (otpError) {
      setError("Something went wrong. Please try again.");
      console.error("[get-started] signInWithOtp error:", otpError);
      return;
    }

    advanceTo("sent");
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={180}
            height={72}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* ── Step 1: Name (new users) ── */}
        {step === "name" && (
          <div
            className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            <p className="text-xs font-medium tracking-widest uppercase text-stone mb-3">
              Step 1 of 2
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-ink mb-4">
              What&rsquo;s your first name?
            </h1>
            <p className="text-base leading-relaxed text-ink-soft mb-10">
              We&rsquo;ll use it to personalise your style results. It&rsquo;s
              completely optional.
            </p>

            <div className="mb-6">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameContinue()}
                placeholder="e.g. Sarah"
                maxLength={50}
                autoFocus
                className="w-full px-4 py-4 rounded-xl border border-ink/10 bg-white text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition text-base"
              />
            </div>

            <button
              onClick={handleNameContinue}
              className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
            >
              {name.trim() ? "Continue" : "Skip & Continue"}
            </button>

            {/* Returning user shortcut */}
            <div className="mt-8 pt-6 border-t border-ink/10 text-center">
              <p className="text-sm text-stone mb-2">Already have access?</p>
              <button
                onClick={handleReturningUser}
                className="text-sm font-medium text-amber hover:text-amber-deep underline underline-offset-2 transition-colors"
              >
                Sign in with your email →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Email ── */}
        {step === "email" && (
          <div
            className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            {/* Contextual heading based on whether returning or new */}
            {returningUser ? (
              <>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-3">
                  Welcome back
                </p>
                <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-ink mb-4">
                  Enter your email to continue
                </h1>
                <p className="text-base leading-relaxed text-ink-soft mb-10">
                  We&rsquo;ll send a secure link to your inbox — click it and
                  you&rsquo;ll be right back where you left off.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-3">
                  Step 2 of 2
                </p>
                <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight text-ink mb-4">
                  {name.trim()
                    ? `Nice to meet you, ${name.trim()}.`
                    : "Almost there."}
                </h1>
                <p className="text-base leading-relaxed text-ink-soft mb-10">
                  We&rsquo;ll send your results and PDF style guide here — and
                  save them so you can come back any time, on any device.
                </p>
              </>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs font-medium tracking-widest uppercase mb-2 text-stone"
              >
                Your email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                placeholder="you@example.com"
                autoFocus
                className="w-full px-4 py-4 rounded-xl border border-ink/10 bg-white text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition text-base"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}

            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : returningUser ? (
                "Send My Sign-In Link"
              ) : (
                "Send My Link"
              )}
            </button>

            <button
              onClick={handleBack}
              className="mt-4 w-full text-sm text-stone hover:text-ink-soft transition-colors text-center"
            >
              ← Back
            </button>
          </div>
        )}

        {/* ── Step 3: Check email ── */}
        {step === "sent" && (
          <div
            className={`transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            {/* Envelope icon */}
            <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mb-8">
              <svg
                className="w-8 h-8 text-amber"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h1 className="font-serif text-4xl font-light text-ink mb-4">
              Check your inbox
            </h1>
            <p className="text-base leading-relaxed text-ink-soft mb-3">
              We sent a link to{" "}
              <span className="font-medium text-ink">{email}</span>.
            </p>
            <p className="text-sm text-stone mb-10">
              {returningUser
                ? "Click it and you'll be taken straight back to where you left off."
                : "Click the link to verify your address and continue. It'll only take a second."}
            </p>

            <div className="p-4 bg-amber/5 border border-amber/20 rounded-xl text-sm text-ink-soft">
              <p className="font-medium text-ink mb-1">Can&rsquo;t find it?</p>
              <p>
                Check your spam or junk folder. If it&rsquo;s not there,{" "}
                <button
                  onClick={() => advanceTo("email")}
                  className="text-amber underline underline-offset-2 hover:text-amber-deep transition-colors"
                >
                  try again
                </button>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
