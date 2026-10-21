import { Check, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createQuiz, deleteQuiz, getQuizzes, updateQuiz } from '../services/api';
import type { Question, Quiz, User } from '../types';

interface AdminPageProps {
  user: User | null;
}

const createEmptyQuestion = (): Question => ({
  id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
});

type QuizFormState = {
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number;
  questions: Question[];
};

const difficultyQuestionCounts = {
  Easy: 3,
  Medium: 10,
  Hard: 15,
} as const;

const createInitialForm = (): QuizFormState => ({
  title: '',
  description: '',
  category: 'Technology',
  difficulty: 'Easy',
  durationMinutes: 10,
  questions: Array.from({ length: difficultyQuestionCounts.Easy }, () => createEmptyQuestion()),
});

const normalizeQuestionCount = (difficulty: 'Easy' | 'Medium' | 'Hard', questions: Question[]) => {
  const targetCount = difficultyQuestionCounts[difficulty];
  if (questions.length === targetCount) return questions;

  if (questions.length < targetCount) {
    return [...questions, ...Array.from({ length: targetCount - questions.length }, () => createEmptyQuestion())];
  }

  return questions.slice(0, targetCount);
};

export default function AdminPage({ user }: AdminPageProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [form, setForm] = useState<QuizFormState>(createInitialForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch {
      toast.error('Unable to load quizzes.');
    }
  };

  useEffect(() => {
    void loadQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setForm((previous) => ({
      ...previous,
      questions: normalizeQuestionCount(previous.difficulty, [...previous.questions, createEmptyQuestion()]),
    }));
  };

  const handleDifficultyChange = (nextDifficulty: 'Easy' | 'Medium' | 'Hard') => {
    setForm((previous) => ({
      ...previous,
      difficulty: nextDifficulty,
      questions: normalizeQuestionCount(nextDifficulty, previous.questions),
    }));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: string | string[]) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question
      ),
    }));
  };

  const handleQuestionOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, currentIndex) => {
        if (currentIndex !== questionIndex) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(createInitialForm());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      durationMinutes: Number(form.durationMinutes),
      questions: form.questions.map((question) => ({
        id: question.id,
        question: question.question.trim(),
        options: question.options.map((option) => option.trim()),
        correctAnswer: (question.correctAnswer ?? '').trim(),
        explanation: (question.explanation ?? '').trim(),
      })),
    };

    try {
      if (editingId) {
        await updateQuiz(editingId, payload);
        toast.success('Quiz updated successfully.');
      } else {
        await createQuiz(payload);
        toast.success('Quiz created successfully.');
      }
      resetForm();
      await loadQuizzes();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to save the quiz.');
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingId(quiz._id ?? quiz.id ?? null);
    setForm({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer ?? '',
        explanation: question.explanation ?? '',
      })),
    });
  };

  const handleDelete = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      toast.success('Quiz deleted.');
      await loadQuizzes();
    } catch {
      toast.error('Unable to delete quiz.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-600">Admin</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Quiz management</h1>
          </div>
          <div className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
            {user?.role === 'admin' ? 'Administrator access' : 'User access'}
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit quiz' : 'Create quiz'}</h2>
            {editingId && (
              <button type="button" onClick={resetForm} className="text-sm font-semibold text-brand-600">
                Cancel edit
              </button>
            )}
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Quiz title</span>
              <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
              <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100" rows={3} required />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
                <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100">
                  <option>Technology</option>
                  <option>Cybersecurity</option>
                  <option>Programming</option>
                  <option>General Knowledge</option>
                  <option>Cloud Computing</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Difficulty</span>
                <select value={form.difficulty} onChange={(event) => handleDifficultyChange(event.target.value as 'Easy' | 'Medium' | 'Hard')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Duration (min)</span>
                <input type="number" min={1} value={form.durationMinutes} onChange={(event) => setForm((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100" required />
              </label>
            </div>

            <div className="space-y-5">
              {form.questions.map((question, index) => (
                <div key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-800">Question {index + 1}</p>
                    {form.questions.length > 1 && (
                      <button type="button" onClick={() => setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, questionIndex) => questionIndex !== index) }))} className="text-sm font-medium text-rose-600">
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="mb-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Question text</span>
                    <textarea value={question.question} onChange={(event) => handleQuestionChange(index, 'question', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100" rows={2} required />
                  </label>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={`${question.id}-option-${optionIndex}`} className="grid gap-2 md:grid-cols-[1fr_auto]">
                        <input
                          value={option}
                          onChange={(event) => handleQuestionOptionChange(index, optionIndex, event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleQuestionChange(index, 'correctAnswer', option)}
                          className={`rounded-2xl px-3 py-3 text-sm font-medium ${question.correctAnswer === option ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}
                        >
                          {question.correctAnswer === option ? <Check className="h-4 w-4" /> : 'Set answer'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Explanation</span>
                    <textarea value={question.explanation} onChange={(event) => handleQuestionChange(index, 'explanation', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100" rows={2} required />
                  </label>
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddQuestion} className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-300 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700">
              <Plus className="h-4 w-4" />
              Add question
            </button>

            <div className="pt-4">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                <Save className="h-4 w-4" />
                {editingId ? 'Update quiz' : 'Create quiz'}
              </button>
            </div>
          </div>
        </form>

        <aside className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-900">Quiz list</h2>
          <div className="mt-6 space-y-4">
            {quizzes.length ? quizzes.map((quiz) => (
              <div key={quiz._id ?? quiz.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{quiz.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{quiz.category} • {quiz.difficulty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(quiz)} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-600">Edit</button>
                    <button type="button" onClick={() => void handleDelete(quiz._id ?? quiz.id ?? '')} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">Delete</button>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No quizzes created yet.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
