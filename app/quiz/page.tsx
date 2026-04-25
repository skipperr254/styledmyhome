import { Suspense } from "react";
import QuizClient from "./quiz-client";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-cream">
          <p className="text-brand-muted text-sm tracking-widest uppercase animate-pulse">
            Preparing your quiz…
          </p>
        </div>
      }
    >
      <QuizClient />
    </Suspense>
  );
}
