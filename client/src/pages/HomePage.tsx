import { Activity, ArrowRight, BarChart3, CircleDashed, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { getDashboardStats, getQuizzes } from '../services/api';
import type { DashboardStats, Quiz, User } from '../types';

interface HomePageProps {
  user: User | null;
}

export default function HomePage({ user }: HomePageProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [dashboardStats, quizList] = await Promise.all([getDashboardStats(), getQuizzes()]);
        setStats(dashboardStats as DashboardStats);
        setQuizzes(quizList.slice(0, 3));
      } catch {
        setStats({ totalQuizzes: 0, totalCompleted: 0, averageScore: 0, bestScore: 0, currentActivity: 'No activity yet', recentAttempts: [] });
        setQuizzes([]);
      }
    };

    loadHomeData();
  }, []);

  const statCards = [
    { label: 'Completed', value: stats?.totalCompleted ?? 0, icon: Activity },
    { label: 'Average score', value: `${stats?.averageScore ?? 0}%`, icon: BarChart3 },
    { label: 'Best score', value: `${stats?.bestScore ?? 0}%`, icon: Trophy },
    { label: 'Current activity', value: stats?.currentActivity ?? 'No activity yet', icon: CircleDashed },
  ];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="aurora premium-card relative overflow-hidden rounded-[32px] p-8 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.26),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.15),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              Premium performance hub
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[0.96] md:text-6xl">
              Your <span className="gradient-text">next level</span> starts here.
            </h1>
            <p className="mt-4 max-w-xl text-base text-[var(--text-soft)] md:text-lg">
              Turn everyday practice into measurable momentum with sharpened assessments, instant feedback, and focused learning flows.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(99,102,241,0.42)] hover:brightness-110"
              >
                Explore quizzes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/results"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-5 py-3 text-sm font-semibold text-white hover:bg-[rgba(255,255,255,0.06)]"
              >
                View progress
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-[rgba(8,9,13,0.38)] p-4 shadow-[0_18px_54px_rgba(8,9,13,0.65)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Pulse</p>
                <p className="mt-1 text-xl font-semibold text-white">Learning velocity</p>
              </div>
              <div className="rounded-full bg-[rgba(34,211,238,0.12)] px-2.5 py-1 text-xs font-semibold text-cyan-300">+12.4%</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['34', 'Quizzes'],
                ['8.7k', 'Questions'],
                ['92%', 'Accuracy'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
                  <div className="mono text-xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-[11px] text-[var(--text-soft)]">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
              <div className="flex items-center justify-between text-sm text-[var(--text-soft)]">
                <span>Weekly completion</span>
                <span className="font-semibold text-white">76%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-300" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="premium-card rounded-[24px] p-5"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(139,92,246,0.12)] text-violet-200">
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-[var(--text-soft)]">{label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="premium-card rounded-[28px] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Featured</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Choose your challenge</h2>
            </div>
            <Link to="/explore" className="text-sm font-semibold text-violet-200 hover:text-white">
              Explore all
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.length ? quizzes.map((quiz) => <QuizCard key={quiz._id ?? quiz.id} quiz={quiz} />) : <p className="text-[var(--text-soft)]">No featured quizzes available right now.</p>}
          </div>
        </div>

        <div className="premium-card rounded-[28px] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent attempts</h2>
            <Sparkles className="h-5 w-5 text-violet-200" />
          </div>
          <div className="mt-6 space-y-4">
            {stats?.recentAttempts?.length ? (
              stats.recentAttempts.map((attempt) => (
                <div key={attempt.id ?? attempt._id} className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{attempt.title}</p>
                    <span className="rounded-full bg-[rgba(52,211,153,0.14)] px-2 py-1 text-[11px] font-semibold text-emerald-300">{attempt.percentage}%</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{attempt.correctAnswers} correct • {attempt.totalQuestions} total</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-soft)]">Your recent quiz attempts will appear here once you complete a quiz.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
