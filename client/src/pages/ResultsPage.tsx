import { ArrowRight, CheckCircle2, CircleHelp, RefreshCcw, Sparkles, XCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAttemptById } from '../services/api';
import type { QuizAttempt, User } from '../types';

interface ResultsPageProps {
  user: User | null;
}

export default function ResultsPage({ user }: ResultsPageProps) {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const loadAttempt = async () => {
      if (!attemptId) return;
      try {
        const result = await getAttemptById(attemptId);
        setAttempt(result);
      } catch {
        navigate('/explore');
      }
    };

    loadAttempt();
  }, [attemptId, navigate]);

  const currentAttempt = attempt;

  return (
    <div className="space-y-8">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Results</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Performance summary</h1>
          </div>

          <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            Explore more
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {!currentAttempt ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-soft">Loading your results...</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Score', value: `${currentAttempt.percentage}%`, signature: 'success' },
              { label: 'Correct', value: currentAttempt.correctAnswers, signature: 'correct' },
              { label: 'Incorrect', value: currentAttempt.incorrectAnswers, signature: 'wrong' },
              { label: 'Unanswered', value: currentAttempt.unanswered, signature: 'neutral' },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </section>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentAttempt.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Completion time: {currentAttempt.timeSpentSeconds ?? 0}s</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Great effort
              </div>
            </div>

            <div className="space-y-4">
              {currentAttempt.review?.map((item, index) => (
                <div key={`${item.questionId}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">Question {index + 1}: {item.question}</p>
                    {item.isCorrect ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                      </div>
                    ) : !item.selectedAnswer ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        <CircleHelp className="h-3.5 w-3.5" /> Not answered
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                        <XCircle className="h-3.5 w-3.5" /> Incorrect
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <p><span className="font-medium text-slate-700">Your answer:</span> {item.selectedAnswer || 'No answer selected'}</p>
                    <p><span className="font-medium text-slate-700">Correct answer:</span> {item.correctAnswer}</p>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Explanation:</span> {item.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Try another quiz
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
