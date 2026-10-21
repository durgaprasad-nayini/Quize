import { AlertTriangle, ChevronLeft, ChevronRight, Clock3, ListChecks } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getQuizById, submitQuiz as submitQuizRequest } from '../services/api';
import type { Question, Quiz, User } from '../types';

interface QuizPageProps {
  user: User | null;
}

export default function QuizPage({ user }: QuizPageProps) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const loadQuiz = async () => {
      try {
        const currentQuiz = await getQuizById(quizId);
        setQuiz(currentQuiz);
        setTimeRemaining((currentQuiz.durationMinutes || 1) * 60)
      } catch {
        toast.error('Unable to load the selected quiz.');
        navigate('/explore');
      }
    };

    loadQuiz();
  }, [quizId, navigate]);

  useEffect(() => {
    if (!quiz || timeRemaining <= 0) return;

    const timer = window.setInterval(() => {
      setTimeRemaining((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          void handleSubmit(true);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz]);

  const currentQuestion = quiz?.questions[currentIndex];
  const answeredCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);
  const progress = quiz ? ((currentIndex + 1) / quiz.questions.length) * 100 : 0;

  const handleAnswerSelect = (questionId: string, option: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (expired = false) => {
    if (!quiz || !quizId || isSubmitting) return;

    const confirmed = expired || window.confirm('Submit your answers now? You cannot edit them after submission.');
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const response = await submitQuizRequest(quizId, {
        answers,
        timeSpentSeconds: Math.max(quiz.durationMinutes * 60 - timeRemaining, 0),
      });

      navigate(`/results/${response.attempt.id ?? response.attempt._id ?? 'latest'}`, { state: { attempt: response.attempt } });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Submission failed.');
      setIsSubmitting(false);
    }
  };

  if (!quiz || !currentQuestion) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-500">Loading quiz...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">{quiz.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{quiz.title}</h1>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            <Clock3 className="h-4 w-4 text-brand-600" />
            {Math.max(timeRemaining, 0)}s left
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span className="flex items-center gap-2"><ListChecks className="h-4 w-4" /> Question {currentIndex + 1} of {quiz.questions.length}</span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="mb-6 text-xl font-semibold text-slate-900">{currentQuestion.question}</p>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => {
            const selected = answers[currentQuestion.id] === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                className={`rounded-2xl border px-4 py-4 text-left text-base font-medium transition ${
                  selected
                    ? 'border-brand-400 bg-brand-50 text-brand-800 ring-2 ring-brand-100'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentIndex === quiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => void handleSubmit(false)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit quiz'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => Math.min(quiz.questions.length - 1, value + 1))}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {timeRemaining <= 10 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Time is running low. Finish before the timer ends.
          </div>
        </div>
      )}
    </div>
  );
}
