import { BarChart3, BookOpenCheck, LogOut, ShieldCheck, Sparkles, UserCircle2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const navLinks = [
  { label: 'Dashboard', to: '/', icon: Sparkles },
  { label: 'Explore', to: '/explore', icon: BookOpenCheck },
  { label: 'Results', to: '/results', icon: BarChart3 },
];

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(8,9,13,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] via-violet-500 to-[var(--secondary)] text-white shadow-[0_16px_30px_rgba(139,92,246,0.45)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">QuizFlow</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-soft)]">Learning studio</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[rgba(139,92,246,0.18)] text-violet-200 ring-1 ring-[rgba(139,92,246,0.35)]'
                    : 'text-[var(--text-soft)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[rgba(34,211,238,0.12)] text-cyan-200 ring-1 ring-[rgba(34,211,238,0.25)]'
                    : 'text-[var(--text-soft)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                }`
              }
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              aria-label="Open profile and quiz progress"
              title="Profile and quiz progress"
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-2 transition hover:border-violet-400/50 hover:bg-[rgba(255,255,255,0.06)]"
            >
              <UserCircle2 className="h-4 w-4 text-[var(--text-soft)]" />
              <span className="hidden text-sm font-medium text-white sm:inline">{user.name || 'Profile'}</span>
            </Link>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm font-medium text-white hover:bg-[rgba(255,255,255,0.05)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2 text-sm font-medium text-white shadow-[0_16px_30px_rgba(99,102,241,0.45)] hover:brightness-110"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
