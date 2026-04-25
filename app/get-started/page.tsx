"use client";

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
    <main className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md stagger-children">
        {/* Logo */}
        <a href="/" aria-label="Styled My Home — home" className="inline-block mb-10">
          <img src="/images/styled-my-home-logo.png" alt="Styled My Home" className="h-14 w-auto" />
        </a>

        <h1 className="font-sans text-4xl md:text-5xl font-light leading-tight text-brand-ink mb-4">
          Discover your interior design style.
        </h1>

        <p className="text-base leading-relaxed text-brand-stone mb-12 max-w-sm">
          Answer 11 visual questions and we&rsquo;ll reveal the design aesthetic that
          speaks to you — with a personalized guide to help you bring it home.
        </p>

        {/* Name input */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-xs font-medium tracking-widest uppercase mb-2 text-brand-muted"
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
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-white text-brand-ink placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
          />
        </div>

        <button
          onClick={handleBegin}
          className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
        >
          Let&rsquo;s Begin
        </button>

        <p className="mt-6 text-xs text-brand-muted">
          Takes about 5 minutes &middot; No account needed
        </p>
      </div>
    </main>
  );
}
