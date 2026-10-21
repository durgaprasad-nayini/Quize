import { useEffect, useState } from 'react';
import { ArrowRight, Award, BookOpenCheck, CheckCircle2, CircleHelp, Clock3, TrendingUp, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAttemptHistory } from '../services/api';
import type { QuizAttempt, User } from '../types';

interface ProfilePageProps {
  user: User | null;
}

const formatDate = (value?: string | Date) => {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

const formatDuration = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
};

export default function ProfilePage({ user }: ProfilePageProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    getAttemptHistory()
      .then((history) => {
        if (isActive) setAttempts(history);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const completedCount = attempts.length;
  const averageScore = completedCount
    ? Math.round(attempts.reduce((total, attempt) => total + attempt.percentage, 0) / completedCount)
    : 0;
  const bestScore = completedCount ? Math.max(...attempts.map((attempt) => attempt.percentage)) : 0;
  const correctCount = attempts.reduce((total, attempt) => total + attempt.correctAnswers, 0);
  const incorrectCount = attempts.reduce((total, attempt) => total + attempt.incorrectAnswers, 0);
  const unansweredCount = attempts.reduce((total, attempt) => total + attempt.unanswered, 0);

  const stats = [
    { label: 'Completed quizzes', value: completedCount, icon: BookOpenCheck, color: 'text-cyan-300' },
    { label: 'Average score', value: `${averageScore}%`, icon: TrendingUp, color: 'text-violet-300' },
    { label: 'Best score', value: `${bestScore}%`, icon: Award, color: 'text-amber-300' },
    { label: 'Correct answers', value: correctCount, icon: CheckCircle2, color: 'text-emerald-300' },
    { label: 'Incorrect answers', value: incorrectCount, icon: XCircle, color: 'text-rose-300' },
    { label: 'Not answered', value: unansweredCount, icon: CircleHelp, color: 'text-amber-200' },
  ];

  return (
    <div className="space-y-8">
      <section className="premium-card rounded-[28px] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">Your profile</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.name?.trim() || 'Learner'}</h1>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{user?.email}</p>
          </div>
          <p className="text-sm text-[var(--text-soft)]">Your completed quizzes and performance at a glance.</p>
        </div>
      </section>

      <section aria-label="Quiz progress summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="premium-card flex items-center gap-4 rounded-2xl p-5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-soft)]">{label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="premium-card rounded-[28px] p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">History</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Completed quizzes</h2>
          </div>
          <Clock3 className="h-5 w-5 text-violet-200" />
        </div>

        {isLoading ? (
          <p className="py-8 text-sm text-[var(--text-soft)]">Loading your quiz history...</p>
        ) : hasError ? (
          <p role="alert" className="py-8 text-sm text-rose-300">Could not load quiz history. Check your connection and refresh.</p>
        ) : attempts.length === 0 ? (
          <div className="py-8">
            <p className="text-sm text-[var(--text-soft)]">No completed quizzes yet.</p>
            <Link to="/explore" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white">
              Find a quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {attempts.map((attempt, index) => {
              const attemptId = attempt._id ?? attempt.id;
              return (
                <article key={attemptId ?? `${attempt.title}-${index}`} className="py-5 first:pt-2 last:pb-2">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white">{attempt.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">{formatDate(attempt.completedAt)} · {formatDuration(attempt.timeSpentSeconds)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span className="font-bold text-white">Score {attempt.percentage}%</span>
                      <span className="text-emerald-300">{attempt.correctAnswers} correct</span>
                      <span className="text-rose-300">{attempt.incorrectAnswers} incorrect</span>
                      <span className="text-amber-200">{attempt.unanswered} unanswered</span>
                    </div>
                    {attemptId ? (
                      <Link
                        to={`/results/${attemptId}`}
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white"
                      >
                        Review answers <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">Review unavailable</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
