"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  styleName: string;
  hasCompletePurchase: boolean;
};

const COMPLETE_FEATURES = [
  "All 8 interior design styles covered",
  "Color palettes & material guides for every style",
  "Design tips and décor recommendations",
  "Style history and key characteristics",
  "Beautiful PDF format — 100+ pages",
];

const RETAKE_KEY = "smh_retake_count";
const PAID_SESSION_KEY = "smh_paid_session";
const MAX_RETAKES = 3;

async function triggerDownload(sessionId: string, type: "single" | "complete") {
  const res = await fetch(`/api/download?session=${sessionId}&type=${type}`);
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  // The filename comes from Content-Disposition but this is a fallback
  a.download =
    type === "complete"
      ? "Styled-My-Home-Complete-Style-Guide.pdf"
      : "Styled-My-Home-Style-Guide.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export default function ResultsClient({
  sessionId,
  styleName,
  hasCompletePurchase,
}: Props) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [completeDownloading, setCompleteDownloading] = useState(false);
  const [retakeCount, setRetakeCount] = useState(0);

  useEffect(() => {
    // Persist that this session was paid — retakes will use this to skip payment
    localStorage.setItem(PAID_SESSION_KEY, sessionId);

    let count = parseInt(localStorage.getItem(RETAKE_KEY) ?? "1", 10);
    if (count < 1) {
      count = 1;
      localStorage.setItem(RETAKE_KEY, "1");
    }
  }, [sessionId]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await triggerDownload(sessionId, "single");
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [sessionId]);

  const handleCompleteDownload = useCallback(async () => {
    setCompleteDownloading(true);
    try {
      await triggerDownload(sessionId, "complete");
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setCompleteDownloading(false);
    }
  }, [sessionId]);

  async function handleCompleteCheckout() {
    if (!email.trim() || !email.includes("@")) {
      setDialogError("Please enter a valid email address.");
      return;
    }

    setDialogLoading(true);
    setDialogError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizSessionId: sessionId,
          purchaseType: "complete",
          styleName,
          customerEmail: email.trim(),
        }),
      });

      const { url, error } = await res.json();
      if (error || !url) throw new Error(error ?? "Unexpected error");
      router.push(url);
    } catch {
      setDialogError("Something went wrong. Please try again.");
      setDialogLoading(false);
    }
  }

  function handleRetake() {
    const next = retakeCount + 1;
    localStorage.setItem(RETAKE_KEY, String(next));
    router.push("/how-it-works");
  }

  const canRetake = retakeCount < MAX_RETAKES;

  return (
    <section className="border-t border-ink/10 pt-10 space-y-6">
      {/* Download single PDF */}
      <div className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">
          Your Style Guide
        </p>
        <h3 className="font-serif text-2xl text-ink mb-1">
          {styleName} Style Guide — PDF
        </h3>
        <p className="text-sm text-ink-soft mb-5">
          Your personalized guide is ready. Download it now and start designing
          your space with confidence.
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-7 py-3 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200 flex items-center gap-2"
        >
          {downloading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Preparing download…
            </>
          ) : (
            "Download My Style Guide"
          )}
        </button>
      </div>

      {/* Complete guide upsell */}
      {!hasCompletePurchase && (
        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">
            Want more?
          </p>
          <h3 className="font-serif text-2xl text-ink mb-1">
            Complete Style & Design Guide — $29.99
          </h3>
          <p className="text-sm text-ink-soft mb-4">
            Explore all 8 design styles in depth. Perfect if you scored close
            across multiple styles or want to explore every option.
          </p>
          <ul className="space-y-1.5 mb-5">
            {COMPLETE_FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-ink-soft"
              >
                <span className="text-amber shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowDialog(true)}
            className="px-7 py-3 rounded-lg border border-amber text-amber hover:bg-amber hover:text-white font-medium text-sm tracking-wide transition-colors duration-200"
          >
            Get Complete Guide — $29.99
          </button>
        </div>
      )}

      {/* Complete guide download (already purchased) */}
      {hasCompletePurchase && (
        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">
            Complete Guide
          </p>
          <h3 className="text-lg font-medium text-ink mb-1">
            Complete Style & Design Guide
          </h3>
          <p className="text-sm text-ink-soft mb-5">
            Thank you for your purchase! Download your complete style guide
            below.
          </p>
          <button
            onClick={handleCompleteDownload}
            disabled={completeDownloading}
            className="px-7 py-3 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200 flex items-center gap-2"
          >
            {completeDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Preparing download…
              </>
            ) : (
              "Download Complete Guide"
            )}
          </button>
        </div>
      )}

      {/* Retake */}
      {canRetake && (
        <div className="text-center pt-2">
          <button
            onClick={handleRetake}
            className="text-sm text-stone hover:text-ink-soft underline-offset-2 hover:underline transition-colors"
          >
            Take the quiz again ({MAX_RETAKES - retakeCount} retake
            {MAX_RETAKES - retakeCount !== 1 ? "s" : ""} remaining)
          </button>
        </div>
      )}

      {/* Complete guide purchase dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowDialog(false)}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-medium text-ink mb-1">
              Complete Style & Design Guide
            </h2>
            <p className="text-sm text-ink-soft mb-6">
              All 8 design styles in one beautiful PDF. Enter your email for
              your receipt, then complete the secure checkout.
            </p>

            <ul className="space-y-1.5 mb-6">
              {COMPLETE_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-ink-soft"
                >
                  <span className="text-amber shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mb-4">
              <label className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-ink/10 text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition text-sm"
              />
            </div>

            {dialogError && (
              <p className="text-sm text-red-600 mb-4">{dialogError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCompleteCheckout}
                disabled={dialogLoading}
                className="flex-1 py-3 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2"
              >
                {dialogLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Redirecting…
                  </>
                ) : (
                  "Purchase Now — $29.99"
                )}
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="px-5 py-3 rounded-lg border border-ink/10 text-ink-soft hover:bg-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-stone text-center mt-4">
              Secure payment via Stripe &middot; Instant PDF download
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
