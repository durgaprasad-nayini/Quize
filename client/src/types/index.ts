export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  explanation?: string;
  correctAnswer?: string;
}

export interface Quiz {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: QuizDifficulty;
  durationMinutes: number;
  questions: Question[];
  questionsCount?: number;
  createdBy?: string;
}

export interface QuizAttempt {
  id?: string;
  _id?: string;
  title: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  review?: Array<{
    questionId: string;
    question: string;
    selectedAnswer?: string;
    correctAnswer: string;
    explanation: string;
    isCorrect: boolean;
  }>;
  completedAt?: string | Date;
  timeSpentSeconds?: number;
}

export interface DashboardStats {
  totalQuizzes: number;
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  currentActivity: string;
  recentAttempts: QuizAttempt[];
}
