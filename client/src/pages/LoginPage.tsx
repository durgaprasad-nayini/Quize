import { useState } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { loginUser } from '../services/api';
import type { User } from '../types';

interface LoginPageProps {
  onAuth: (user: User) => void;
}

export default function LoginPage({ onAuth }: LoginPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await loginUser(form);
      onAuth(user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_40%),linear-gradient(180deg,#08090d_0%,#0d1018_100%)] px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(17,20,31,0.82)] shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-xl lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_30%),linear-gradient(180deg,#0b1220_0%,#0d111a_100%)] p-8 text-white lg:p-10">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.08)] text-violet-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">QuizFlow</p>
                <p className="text-sm text-[var(--text-soft)]">Premium learning workspace</p>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white">Turn practice into progress.</h1>
            <p className="mt-4 max-w-md text-[var(--text-soft)]">
              Study smarter with timed assessments, deep insights, and progress tracking built for modern teams and learners.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {['Personalized dashboard', 'Secure admin tools', 'Detailed performance insights'].map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.04)] px-3 py-2.5">
                <CheckCircle2 className="h-5 w-5 text-violet-300" />
                <span className="text-sm text-slate-100">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-violet-300">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <Mail className="h-4 w-4" />
                Email address
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:bg-[rgba(255,255,255,0.04)]"
                placeholder="hello@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-soft)]">
                <LockKeyhole className="h-4 w-4" />
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-white outline-none transition focus:border-violet-400 focus:bg-[rgba(255,255,255,0.04)]"
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(99,102,241,0.42)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-soft)]">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-300 hover:text-violet-200">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
