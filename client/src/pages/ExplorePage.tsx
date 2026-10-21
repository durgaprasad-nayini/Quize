import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import QuizCard from '../components/QuizCard';
import { getQuizzes } from '../services/api';
import type { Quiz, User } from '../types';

interface ExplorePageProps {
  user: User | null;
}

export default function ExplorePage({ user }: ExplorePageProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const results = await getQuizzes({ search, category, difficulty });
        setQuizzes(results);
      } catch {
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [search, category, difficulty]);

  return (
    <div className="space-y-8">
      <section className="premium-card rounded-[28px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-violet-300">Explore</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Curated skill assessments</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm font-medium text-violet-200">
            <SlidersHorizontal className="h-4 w-4" />
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Ready to start'}
          </div>
        </div>
      </section>

      <section className="premium-card rounded-[28px] p-6">
        <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search quizzes"
              className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] py-3 pl-11 pr-4 text-white outline-none transition focus:border-violet-400 focus:bg-[rgba(255,255,255,0.04)]"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:bg-[rgba(255,255,255,0.04)]"
          >
            <option value="all" className="bg-slate-900">All categories</option>
            <option value="Technology" className="bg-slate-900">Technology</option>
            <option value="Cybersecurity" className="bg-slate-900">Cybersecurity</option>
            <option value="Network Security" className="bg-slate-900">Network Security</option>
            <option value="Ethical Hacking" className="bg-slate-900">Ethical Hacking</option>
            <option value="Cloud Security" className="bg-slate-900">Cloud Security</option>
            <option value="Digital Forensics" className="bg-slate-900">Digital Forensics</option>
            <option value="Programming" className="bg-slate-900">Programming</option>
            <option value="General Knowledge" className="bg-slate-900">General Knowledge</option>
            <option value="Cloud Computing" className="bg-slate-900">Cloud Computing</option>
          </select>

          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:bg-[rgba(255,255,255,0.04)]"
          >
            <option value="all" className="bg-slate-900">All levels</option>
            <option value="Easy" className="bg-slate-900">Easy</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Hard" className="bg-slate-900">Hard</option>
          </select>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.03)]" />
            ))}
          </div>
        ) : quizzes.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.map((quiz) => <QuizCard key={quiz._id ?? quiz.id} quiz={quiz} />)}
          </div>
        ) : (
          <div className="premium-card rounded-[28px] p-8 text-center text-[var(--text-soft)]">
            No quizzes match your current search or filter selection.
          </div>
        )}
      </section>
    </div>
  );
}
