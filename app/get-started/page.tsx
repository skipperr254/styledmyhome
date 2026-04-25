"use client";
import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GetStartedPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  function handleBegin() {
    const query = name.trim() ? `?name=${encodeURIComponent(name.trim())}` : "";
    router.push(`/how-it-works${query}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleBegin();
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md stagger-children">
        {/* Logo */}
        <Link href="/">
          <img
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            className="h-14 w-auto"
          />
        </Link>

        <h1 className="font-sans text-4xl md:text-5xl font-light leading-tight text-ink mb-4">
          Discover your interior design style.
        </h1>

        <p className="text-base leading-relaxed text-ink-soft mb-12 max-w-sm">
          Answer 11 visual questions and we&rsquo;ll reveal the design aesthetic
          that speaks to you — with a personalized guide to help you bring it
          home.
        </p>

        {/* Name input */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-xs font-medium tracking-widest uppercase mb-2 text-stone"
          >
            Your first name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Sarah"
            maxLength={50}
            className="w-full px-4 py-3 rounded-lg border border-ink/10 bg-white text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition"
          />
        </div>

        <button
          onClick={handleBegin}
          className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
        >
          Let&rsquo;s Begin
        </button>

        <p className="mt-6 text-xs text-stone">
          Takes about 5 minutes &middot; No account needed
        </p>
      </div>
    </main>
  );
}
