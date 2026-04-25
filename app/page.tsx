"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WelcomePage() {
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
    <main className="relative flex flex-col lg:flex-row min-h-screen">
      {/* Hero image */}
      <div className="absolute inset-0 lg:relative lg:flex-1 lg:inset-auto">
        <Image
          src="/images/hero.jpg"
          alt="A beautifully styled home interior"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-brand-ink/50 lg:hidden" />
        {/* Desktop right-edge fade into content panel */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-brand-cream" />
      </div>

      {/* Content panel */}
      <div className="relative z-10 flex flex-col justify-center px-8 py-16 lg:px-14 lg:py-24 lg:w-[520px] lg:shrink-0 lg:bg-brand-cream">
        <div className="stagger-children">
          {/* Brand mark */}
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent mb-10">
            Styled My Home
          </p>

          <h1 className="text-4xl md:text-5xl font-light leading-tight text-white lg:text-brand-ink mb-4">
            Discover your interior design style.
          </h1>

          <p className="text-base leading-relaxed text-white/80 lg:text-brand-stone mb-12 max-w-sm">
            Answer 11 visual questions and we'll reveal the design aesthetic that
            speaks to you — with a personalized guide to help you bring it home.
          </p>

          {/* Name input */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-xs font-medium tracking-widest uppercase mb-2 text-white/60 lg:text-brand-muted"
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
              className="w-full max-w-xs px-4 py-3 rounded-lg border bg-white/10 lg:bg-white border-white/30 lg:border-brand-border text-white lg:text-brand-ink placeholder:text-white/40 lg:placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
            />
          </div>

          <button
            onClick={handleBegin}
            className="w-full max-w-xs px-8 py-4 rounded-lg bg-brand-accent hover:bg-brand-accent-dark text-white font-medium text-sm tracking-wide transition-colors duration-200"
          >
            Let's Begin
          </button>

          <p className="mt-6 text-xs text-white/40 lg:text-brand-muted">
            Takes about 5 minutes &middot; No account needed
          </p>
        </div>
      </div>
    </main>
  );
}
