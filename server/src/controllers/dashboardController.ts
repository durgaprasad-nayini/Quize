import type { NextFunction, Response } from 'express';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { ApiError } from '../utils/apiErrors.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const [quizCount, userAttempts, allAttempts] = await Promise.all([
      Quiz.countDocuments(),
      QuizAttempt.find({ user: req.user.id }).sort({ completedAt: -1 }).limit(5).lean(),
      QuizAttempt.find({ user: req.user.id }).lean(),
    ]);

    const averageScore = allAttempts.length
      ? Number((allAttempts.reduce((sum, item) => sum + item.percentage, 0) / allAttempts.length).toFixed(2))
      : 0;

    const bestScore = allAttempts.length ? Math.max(...allAttempts.map((item) => item.percentage)) : 0;

    const stats = {
      totalQuizzes: quizCount,
      totalCompleted: allAttempts.length,
      averageScore,
      bestScore,
      recentAttempts: userAttempts,
      currentActivity: userAttempts[0]?.title ?? 'No activity yet',
    };

    res.json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
};
