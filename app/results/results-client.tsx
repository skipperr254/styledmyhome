"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  styleName: string;
  hasCompletePurchase: boolean;
  justPurchasedSingle?: boolean;
  justPurchasedComplete?: boolean;
};

const ALL_8_STYLES = [
  "Bohemian",
  "Coastal",
  "French Country",
  "Industrial",
  "Japandi",
  "Mid-Century Modern",
  "Modern Farmhouse",
  "Transitional",
];

const COMPLETE_FEATURES = [
  "Color palettes & material guides for every style",
  "Design tips and décor recommendations",
  "Style history and key characteristics",
  "Beautiful PDF format — 50+ pages",
];

const PAID_SESSION_KEY = "smh_paid_session";

async function triggerDownload(sessionId: string, type: "single" | "complete") {
  const res = await fetch(`/api/download?session=${sessionId}&type=${type}`);
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
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
  justPurchasedSingle = false,
  justPurchasedComplete = false,
}: Props) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [completeDownloading, setCompleteDownloading] = useState(false);
  const [successBannerVisible, setSuccessBannerVisible] = useState(
    justPurchasedSingle || justPurchasedComplete,
  );

  const singleDownloadRef = useRef<HTMLDivElement>(null);
  const completeDownloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(PAID_SESSION_KEY, sessionId);
  }, [sessionId]);

  // Scroll to the relevant download card after a payment return
  useEffect(() => {
    if (!justPurchasedSingle && !justPurchasedComplete) return;
    const target = justPurchasedComplete
      ? completeDownloadRef.current
      : singleDownloadRef.current;
    if (!target) return;
    const timer = setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timer);
  }, [justPurchasedSingle, justPurchasedComplete]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDialog]);

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

  return (
    <section className="border-t border-ink/10 pt-10 space-y-6">
      {/* Payment success banner */}
      {successBannerVisible && (
        <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5">
          <span className="text-emerald-500 text-xl shrink-0 mt-0.5">✓</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-emerald-900 text-sm mb-1">
              {justPurchasedComplete
                ? "Complete Guide unlocked — you're all set!"
                : "Payment confirmed — your style guide is ready!"}
            </p>
            <p className="text-emerald-700 text-xs leading-relaxed">
              {justPurchasedComplete
                ? "Your Complete Style & Design Guide is available to download below. We've also sent a permanent copy to your email — open it any time, even from a different device."
                : "Your personalized PDF is ready to download below. We've also sent a permanent copy to your email so you can access it any time you like."}
            </p>
          </div>
          <button
            onClick={() => setSuccessBannerVisible(false)}
            className="text-emerald-400 hover:text-emerald-600 shrink-0 text-lg leading-none transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Download single PDF */}
      <div
        ref={singleDownloadRef}
        className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 ${
          justPurchasedSingle
            ? "border-amber ring-2 ring-amber/20"
            : "border-ink/10"
        }`}
      >
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
            Want to learn more?
          </p>
          <h3 className="font-serif text-2xl text-ink mb-1">
            Complete Style & Design Guide — $29.99
          </h3>
          <p className="text-sm text-ink-soft mb-4">
            Get the full design guide to explore your additional design styles.
          </p>

          {/* All 8 styles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_8_STYLES.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-cream border border-ink/10 text-xs text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>

          <ul className="space-y-1.5 mb-6">
            {COMPLETE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="text-amber shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowDialog(true)}
            className="px-7 py-3 rounded-full bg-amber hover:bg-amber-deep text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200"
          >
            Get Complete Guide — $29.99
          </button>
        </div>
      )}

      {/* Complete guide download (already purchased) */}
      {hasCompletePurchase && (
        <div
          ref={completeDownloadRef}
          className={`bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 ${
            justPurchasedComplete
              ? "border-amber ring-2 ring-amber/20"
              : "border-ink/10"
          }`}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-stone mb-2">
            Complete Guide
          </p>
          <h3 className="font-serif text-2xl text-ink mb-1">
            Complete Style & Design Guide
          </h3>
          <p className="text-sm text-ink-soft mb-5">
            {justPurchasedComplete
              ? "Your purchase is confirmed. Download all 8 style guides in one beautiful PDF — yours to keep."
              : "You have access to the full collection. Download all 8 style guides below."}
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


      {/* Complete guide purchase dialog — portal escapes ancestor CSS transform */}
      {showDialog &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
            onClick={(e) =>
              e.target === e.currentTarget && setShowDialog(false)
            }
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
                  className="w-full px-6 py-3 rounded-full border border-ink/10 text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-amber transition text-sm"
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
                  className="px-6 py-3 rounded-full border border-ink/10 text-ink-soft hover:bg-ink/5 text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-stone text-center mt-4">
                Secure payment via Stripe &middot; Instant PDF download
              </p>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
