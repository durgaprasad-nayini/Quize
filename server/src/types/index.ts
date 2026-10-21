import type { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';
import type { Types } from 'mongoose';

export type UserRole = 'user' | 'admin';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface IQuiz {
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number;
  questions: IQuestion[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnswerMap {
  [questionId: string]: string | undefined;
}

export interface IQuizReviewItem {
  questionId: string;
  question: string;
  selectedAnswer?: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
}

export interface IQuizAttempt {
  _id?: string;
  user: string | Types.ObjectId;
  quiz: string | Types.ObjectId;
  title: string;
  answers: IAnswerMap;
  review: IQuizReviewItem[];
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  completedAt: Date;
  timeSpentSeconds: number;
}

export interface IAuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface IApiError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}
