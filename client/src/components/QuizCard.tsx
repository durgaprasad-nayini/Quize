import { ArrowRight, Clock3, Layers3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="premium-card group flex h-full flex-col rounded-[28px] p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex rounded-full border border-[rgba(139,92,246,0.28)] bg-[rgba(139,92,246,0.12)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
          {quiz.category}
        </span>
        <span className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-soft)]">
          {quiz.difficulty}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-cyan-300">
        <Sparkles className="h-4 w-4" />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em]">Featured</span>
      </div>

      <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-[var(--text-soft)]">{quiz.description}</p>

      <div className="mt-6 flex items-center justify-between text-sm text-[var(--text-soft)]">
        <div className="flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-violet-300" />
          {quiz.questionsCount ?? quiz.questions.length} questions
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-cyan-300" />
          {quiz.durationMinutes} min
        </div>
      </div>

      <Link
        to={`/quiz/${quiz._id ?? quiz.id}`}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.35)] transition hover:brightness-110"
      >
        Start quiz
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
