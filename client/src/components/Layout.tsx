import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import type { User } from '../types';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: ReactNode;
}

export default function Layout({ user, onLogout, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-60px] h-[320px] w-[320px] rounded-full bg-[rgba(139,92,246,0.18)] blur-[100px]" />
        <div className="absolute right-[-80px] top-36 h-[260px] w-[260px] rounded-full bg-[rgba(34,211,238,0.12)] blur-[100px]" />
      </div>

      <Navbar user={user} onLogout={onLogout} />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
