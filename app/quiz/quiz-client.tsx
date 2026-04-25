"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { calculateScores } from "@/lib/quiz/scoring";

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

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Kick off browser fetches for a list of image URLs so they warm the cache. */
function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

function QuizSkeleton() {
  return (
    <main className="min-h-screen bg-brand-cream flex flex-col">
      <header className="sticky top-0 z-10 bg-brand-cream border-b border-brand-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent">
            Styled My Home
          </p>
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="max-w-5xl mx-auto mt-3">
          <div className="skeleton h-px w-full rounded-full" />
        </div>
      </header>
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

export default function QuizClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ styleId: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Track which question indexes have already been preloaded
  const preloadedRef = useRef<Set<number>>(new Set());

  // Load quiz data
  useEffect(() => {
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
  }, []);

  // Preload strategy: as soon as questions are available, immediately kick off
  // loading for all questions. We use the Supabase-transformed URLs (smaller
  // files) so the browser caches the same URLs the <img> tags will use.
  useEffect(() => {
    if (questions.length === 0) return;

    // Preload current + next question immediately (highest priority)
    const urgent = questions.slice(currentIndex, currentIndex + 2);
    urgent.forEach((q, offset) => {
      const idx = currentIndex + offset;
      if (preloadedRef.current.has(idx)) return;
      preloadedRef.current.add(idx);
      preloadImages(q.images.map((img) => img.image_url));
    });

    // Schedule remaining questions at low priority after a short delay
    // so we don't compete with the current question's images
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
        const { dominant, scores } = calculateScores(newAnswers);

        try {
          const paidSessionId =
            localStorage.getItem("smh_paid_session") ?? undefined;

          const res = await fetch("/api/quiz/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: name || undefined,
              answers: newAnswers,
              paidSessionId,
            }),
          });

          if (!res.ok) throw new Error("Failed to save session");

          const { sessionId, skipPayment } = await res.json();

          if (skipPayment) {
            router.push(`/results?session=${sessionId}`);
          } else {
            const nameParam = name ? `&name=${encodeURIComponent(name)}` : "";
            router.push(
              `/payment?session=${sessionId}${nameParam}&style=${dominant}`,
            );
          }
        } catch {
          const { dominant: dom } = calculateScores(newAnswers);
          router.push(`/payment?style=${dom}`);
        }
      }
    },
    [
      answers,
      currentIndex,
      questions.length,
      submitting,
      transitioning,
      name,
      router,
    ],
  );

  if (loading) return <QuizSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center px-6">
          <p className="text-brand-ink mb-2 font-medium">
            Couldn't load the quiz
          </p>
          <p className="text-sm text-brand-stone mb-6">
            Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-accent text-white rounded-lg text-sm font-medium hover:bg-brand-accent-dark transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-muted text-sm tracking-widest uppercase">
            Calculating your style…
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const progressPct = (currentIndex / questions.length) * 100;

  return (
    <main className="min-h-screen bg-brand-cream flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-accent">
            Styled My Home
          </p>
          <p className="text-xs font-medium text-brand-muted">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 pb-3">
          <div className="h-px bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question text */}
      <div
        className={`max-w-5xl mx-auto w-full px-6 pt-8 pb-5 transition-opacity duration-150 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-xl md:text-2xl font-light text-brand-ink leading-snug">
          {question.question_text}
        </h1>
        <p className="text-xs text-brand-muted mt-2">
          Click the image you're most drawn to
        </p>
      </div>

      {/* Image grid */}
      <div
        className={`max-w-5xl mx-auto w-full px-4 pb-10 transition-opacity duration-150 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {question.images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => handleAnswer(img.style_id)}
              disabled={submitting || transitioning}
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:cursor-default bg-brand-warm"
            >
              <Image
                src={img.image_url}
                alt={img.alt_text}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
              {/* Letter badge */}
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-brand-ink pointer-events-none z-10">
                {LETTERS[i]}
              </span>
              {/* Hover tint */}
              <div className="absolute inset-0 bg-brand-accent/0 group-hover:bg-brand-accent/10 transition-colors duration-300 rounded-xl pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
