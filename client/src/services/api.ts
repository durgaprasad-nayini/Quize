import axios from 'axios';
import type { Quiz, QuizAttempt, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

export const registerUser = async (payload: { name: string; email: string; password: string }): Promise<User> => {
  const response = await api.post<{ data: { user: User } }>('/auth/register', payload);
  return response.data.data.user;
};

export const loginUser = async (payload: { email: string; password: string }): Promise<User> => {
  const response = await api.post<{ data: { user: User } }>('/auth/login', payload);
  return response.data.data.user;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<{ data: { user: User } }>('/auth/me');
    return response.data.data.user;
  } catch {
    return null;
  }
};

export const getDashboardStats = async (): Promise<{ totalQuizzes: number; totalCompleted: number; averageScore: number; bestScore: number; currentActivity: string; recentAttempts: QuizAttempt[] }> => {
  const response = await api.get<{ data: { stats: any } }>('/dashboard/stats');
  return response.data.data.stats;
};

export const getQuizzes = async (params?: { search?: string; category?: string; difficulty?: string }): Promise<Quiz[]> => {
  const response = await api.get<{ data: { quizzes: Quiz[] } }>('/quizzes', { params });
  return response.data.data.quizzes;
};

export const getQuizById = async (quizId: string): Promise<Quiz> => {
  const response = await api.get<{ data: { quiz: Quiz } }>(`/quizzes/${quizId}`);
  return response.data.data.quiz;
};

export const submitQuiz = async (
  quizId: string,
  payload: { answers: Record<string, string | undefined>; timeSpentSeconds?: number }
): Promise<{ attempt: QuizAttempt }> => {
  const response = await api.post<{ data: { attempt: QuizAttempt } }>(`/quizzes/${quizId}/submit`, payload);
  return response.data.data;
};

export const getAttemptHistory = async (): Promise<QuizAttempt[]> => {
  const response = await api.get<{ data: { attempts: QuizAttempt[] } }>('/attempts');
  return response.data.data.attempts;
};

export const getAttemptById = async (attemptId: string): Promise<QuizAttempt> => {
  const response = await api.get<{ data: { attempt: QuizAttempt } }>(`/attempts/${attemptId}`);
  return response.data.data.attempt;
};

export const createQuiz = async (payload: Omit<Quiz, '_id' | 'id'>): Promise<Quiz> => {
  const response = await api.post<{ data: { quiz: Quiz } }>('/quizzes', payload);
  return response.data.data.quiz;
};

export const updateQuiz = async (quizId: string, payload: Omit<Quiz, '_id' | 'id'>): Promise<Quiz> => {
  const response = await api.put<{ data: { quiz: Quiz } }>(`/quizzes/${quizId}`, payload);
  return response.data.data.quiz;
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  await api.delete(`/quizzes/${quizId}`);
};

export default api;
