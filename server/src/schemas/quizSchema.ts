import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(8, 'Question is required'),
  options: z.array(z.string().min(1)).min(2, 'At least two options are required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().min(8, 'Explanation is required'),
});

export const quizSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description is required'),
  category: z.string().min(2, 'Category is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  durationMinutes: z.number().min(1).max(180),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export const submitAnswersSchema = z.object({
  answers: z.record(z.string(), z.string().optional()),
  timeSpentSeconds: z.number().min(0).max(3600).optional(),
});
