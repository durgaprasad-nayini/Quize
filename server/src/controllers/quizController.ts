import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { ApiError } from '../utils/apiErrors.js';
import { calculateQuizResult } from '../utils/quizScoring.js';
import { quizSchema, submitAnswersSchema } from '../schemas/quizSchema.js';
import type { AuthenticatedRequest } from '../types/index.js';

const sanitizeQuiz = (quiz: any) => ({
  ...quiz.toObject(),
  questions: (quiz.questions ?? []).map((question: any) => ({
    id: question.id ?? question._id?.toString(),
    question: question.question,
    options: question.options,
    explanation: question.explanation,
  })),
});

export const listQuizzes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = String(req.query.search ?? '').trim();
    const category = String(req.query.category ?? 'all');
    const difficulty = String(req.query.difficulty ?? 'all');

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category !== 'all') query.category = category;
    if (difficulty !== 'all') query.difficulty = difficulty;

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 }).lean();
    const sanitizedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      questions: undefined,
      questionsCount: quiz.questions.length,
    }));

    res.json({ success: true, data: { quizzes: sanitizedQuizzes } });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).lean();
    if (!quiz) {
      throw new ApiError(404, 'Quiz not found.');
    }

    const sanitized = {
      ...quiz,
      questions: (quiz.questions || []).map((question) => {
        const normalized = question as Record<string, unknown>;
        return {
          id: String(normalized.id ?? normalized._id ?? ''),
          question: String(normalized.question),
          options: Array.isArray(normalized.options) ? normalized.options.map((opt) => String(opt)) : [],
          explanation: String(normalized.explanation),
        };
      }),
    };

    res.json({ success: true, data: { quiz: sanitized } });
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Only admin users can create quizzes.');
    }

    const parsed = quizSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Validation failed', { issues: parsed.error.flatten() });
    }

    const quiz = await Quiz.create({
      ...parsed.data,
      questions: parsed.data.questions.map((question, index) => ({
        ...question,
        id: question.id ?? `q${index + 1}`,
      })),
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Quiz created', data: { quiz } });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Only admin users can update quizzes.');
    }

    const parsed = quizSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Validation failed', { issues: parsed.error.flatten() });
    }

    const { id } = req.params;
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      {
        ...parsed.data,
        questions: parsed.data.questions.map((question, index) => ({
          ...question,
          id: question.id ?? `q${index + 1}`,
        })),
      },
      { new: true }
    );

    if (!quiz) {
      throw new ApiError(404, 'Quiz not found.');
    }

    res.json({ success: true, message: 'Quiz updated', data: { quiz } });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Only admin users can delete quizzes.');
    }

    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      throw new ApiError(404, 'Quiz not found.');
    }

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const { id } = req.params;
    const parsed = submitAnswersSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Validation failed', { issues: parsed.error.flatten() });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      throw new ApiError(404, 'Quiz not found.');
    }

    const questionsForScoring = quiz.questions.map((question: any) => ({
      questionId: String(question.id ?? question._id),
      correctAnswer: String(question.correctAnswer),
      options: question.options,
    }));

    const result = calculateQuizResult(questionsForScoring, parsed.data.answers ?? {});
    const review = quiz.questions.map((question: any) => {
      const questionId = String(question.id ?? question._id);
      const selectedAnswer = parsed.data.answers?.[questionId];
      const isCorrect = selectedAnswer === question.correctAnswer;
      return {
        questionId,
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect,
      };
    });

    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quiz._id,
      title: quiz.title,
      answers: parsed.data.answers ?? {},
      review,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      incorrectAnswers: result.incorrectAnswers,
      unanswered: result.unanswered,
      percentage: result.percentage,
      completedAt: new Date(),
      timeSpentSeconds: parsed.data.timeSpentSeconds ?? 0,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attempt: {
          id: attempt._id.toString(),
          title: attempt.title,
          score: attempt.percentage,
          totalQuestions: attempt.totalQuestions,
          correctAnswers: attempt.correctAnswers,
          incorrectAnswers: attempt.incorrectAnswers,
          unanswered: attempt.unanswered,
          percentage: attempt.percentage,
          review: attempt.review,
          completedAt: attempt.completedAt,
          timeSpentSeconds: attempt.timeSpentSeconds,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
