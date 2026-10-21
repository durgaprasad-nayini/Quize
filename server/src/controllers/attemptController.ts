import type { NextFunction, Response } from 'express';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { ApiError } from '../utils/apiErrors.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const getAttemptHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const attempts = await QuizAttempt.find({ user: req.user.id }).sort({ completedAt: -1 }).lean();
    res.json({ success: true, data: { attempts } });
  } catch (error) {
    next(error);
  }
};

export const getAttemptById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    const attempt = await QuizAttempt.findById(req.params.id).lean();
    if (!attempt) {
      throw new ApiError(404, 'Attempt not found.');
    }

    if (attempt.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'You are not allowed to view this attempt.');
    }

    res.json({ success: true, data: { attempt } });
  } catch (error) {
    next(error);
  }
};
