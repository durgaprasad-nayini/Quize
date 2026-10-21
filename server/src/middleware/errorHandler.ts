import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiErrors.js';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : 'Unexpected server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(error instanceof ApiError && error.details ? { details: error.details } : {}),
  });
};
