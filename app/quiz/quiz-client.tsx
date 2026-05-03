"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { calculateScores } from "@/lib/quiz/scoring";
import { FunnelHeader } from "@/components/FunnelHeader";

type QuizImage = {
  id: number;
  style_id: string;
  image_url: string;
  alt_text: string;
};

type Question = {
  id: number;
  question_text: string;
  images: QuizImage[];
};

type Props = {
  purchaseId: string;
  retakesRemaining: number;
  firstName: string | null;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

function QuizSkeleton() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <FunnelHeader
        rightContent={<div className="skeleton h-4 w-24 rounded" />}
        bottomContent={<div className="skeleton h-px w-full rounded-full" />}
      />
      <div className="max-w-5xl mx-auto w-full px-6 pt-8 pb-5">
        <div className="skeleton h-7 w-2/3 rounded mb-2" />
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <div className="max-w-5xl mx-auto w-full px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function QuizClient({
  purchaseId,
  retakesRemaining,
  firstName,
}: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ styleId: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showNoRetakesModal, setShowNoRetakesModal] = useState(false);
  const [buyingRetakes, setBuyingRetakes] = useState(false);
  const preloadedRef = useRef<Set<number>>(new Set());

  // Show out-of-retakes modal immediately if they're at 0
  useEffect(() => {
    if (retakesRemaining <= 0) {
      setShowNoRetakesModal(true);
    }
  }, [retakesRemaining]);

  // Load quiz data
  useEffect(() => {
    if (retakesRemaining <= 0) return; // Don't load if no retakes

    async function loadQuiz() {
      const [{ data: images, error: imgErr }, { data: qs, error: qErr }] =
        await Promise.all([
          supabase
            .from("question_images")
            .select("id, question_id, style_id, image_url, alt_text"),
          supabase.from("questions").select("id, question_text"),
        ]);

      if (imgErr || qErr || !images || !qs) {
        setError(true);
        return;
      }

      const grouped: Record<number, QuizImage[]> = {};
      for (const img of images) {
        if (!grouped[img.question_id]) grouped[img.question_id] = [];
        grouped[img.question_id].push(img);
      }

      const shuffled = shuffle(
        qs.map((q) => ({
          id: q.id,
          question_text: q.question_text,
          images: shuffle(grouped[q.id] ?? []),
        })),
      );

      setQuestions(shuffled);
      setLoading(false);
    }

    loadQuiz();
  }, [retakesRemaining]);

  // Image preloading
  useEffect(() => {
    if (questions.length === 0) return;

    const urgent = questions.slice(currentIndex, currentIndex + 2);
    urgent.forEach((q, offset) => {
      const idx = currentIndex + offset;
      if (preloadedRef.current.has(idx)) return;
      preloadedRef.current.add(idx);
      preloadImages(q.images.map((img) => img.image_url));
    });

    const timer = setTimeout(() => {
      questions.forEach((q, idx) => {
        if (preloadedRef.current.has(idx)) return;
        preloadedRef.current.add(idx);
        preloadImages(q.images.map((img) => img.image_url));
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [questions, currentIndex]);

  const handleAnswer = useCallback(
    async (styleId: string) => {
      if (submitting || transitioning) return;

      const newAnswers = [...answers, { styleId }];
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
          setTransitioning(false);
        }, 150);
      } else {
        setSubmitting(true);

        try {
          const res = await fetch("/api/quiz/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: newAnswers, purchaseId }),
          });

          if (!res.ok) throw new Error("Failed to save session");

          const { sessionId } = await res.json();
          router.push(`/results?session=${sessionId}`);
        } catch {
          const { dominant } = calculateScores(newAnswers);
          // Fallback — try to navigate even without a session
          router.push(`/results?style=${dominant}`);
        }
      }
    },
    [answers, currentIndex, questions.length, submitting, transitioning, purchaseId, router],
  );

  async function handleBuyMoreRetakes() {
    setBuyingRetakes(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseType: "quiz_access" }),
      });
      const { url, error: apiError } = await res.json();
      if (apiError || !url) throw new Error(apiError ?? "Unexpected error");
      window.location.href = url;
    } catch {
      setBuyingRetakes(false);
      alert("Something went wrong. Please try again.");
    }
  }

  // ── Out of retakes modal ──
  if (showNoRetakesModal) {
    return (
      <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-ink mb-3">
            You&rsquo;ve used all 3 retakes
          </h1>
          <p className="text-ink-soft mb-2 leading-relaxed">
            {firstName ? `${firstName}, your` : "Your"} quiz access included 3 attempts and you&rsquo;ve used them all.
          </p>
          <p className="text-sm text-stone mb-10">
            Purchase 3 more retakes for $9.99 to keep exploring your style — or head back to your results.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBuyMoreRetakes}
              disabled={buyingRetakes}
              className="w-full py-4 px-8 rounded-full bg-amber hover:bg-amber-deep disabled:opacity-60 text-ink hover:text-white font-semibold text-xs uppercase tracking-[0.22em] transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {buyingRetakes ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Redirecting…
                </>
              ) : (
                "Get 3 More Retakes — $9.99"
              )}
            </button>
            <button
              onClick={() => router.push("/my-results")}
              className="w-full py-3 px-8 rounded-full border border-ink/20 text-ink-soft hover:text-ink text-sm transition-colors"
            >
              View My Results Instead
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (loading) return <QuizSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-6">
          <p className="text-ink mb-2 font-medium">Couldn&apos;t load the quiz</p>
          <p className="text-sm text-ink-soft mb-6">
            Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber text-white rounded-full text-sm font-medium hover:bg-amber-dark transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink/10 border-t-amber rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone text-sm tracking-widest uppercase">
            Calculating your style…
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPct = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <FunnelHeader
        rightContent={
          <p className="text-xs font-medium text-stone">
            Question {currentIndex + 1} of {questions.length}
          </p>
        }
        bottomContent={
          <div className="h-px bg-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        }
      />

      <div
        className={`max-w-5xl mx-auto w-full px-6 pt-8 pb-5 transition-opacity duration-150 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="font-serif text-3xl md:text-[44px] text-ink leading-snug">
          {question.question_text}
        </h1>
        <p className="text-xs text-stone mt-2">
          Click the image you&apos;re most drawn to
        </p>
      </div>

      <div
        className={`max-w-5xl mx-auto w-full px-4 pb-10 transition-opacity duration-150 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {question.images.map((img) => (
            <button
              key={img.id}
              onClick={() => handleAnswer(img.style_id)}
              disabled={submitting || transitioning}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 disabled:cursor-default bg-white"
            >
              <Image
                src={img.image_url}
                alt={img.alt_text}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-colors duration-300 rounded-xl pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
