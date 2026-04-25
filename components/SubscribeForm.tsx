"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  className?: string;
  source?: string;
};

export function SubscribeForm({ className, source = "measurement-guide" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Thanks! Check your inbox for your free measurement guide.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`w-full max-w-md text-center ${className ?? ""}`}>
        <p className="text-sm uppercase tracking-[0.18em] text-ink">{message}</p>
        <p className="mt-4 text-xs tracking-[0.18em] text-ink-soft">
          We&rsquo;ll also keep you posted on new design tips — unsubscribe any time.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md ${className ?? ""}`}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-full border border-ink/10 bg-white px-2 py-2 shadow-sm"
      >
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          disabled={status === "loading"}
          className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-ink/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-sage px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-sage-deep disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Subscribe →"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-red-600" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
