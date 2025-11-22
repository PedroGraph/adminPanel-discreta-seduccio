import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '@appTypes/middleware.js';
import logger from '@utils/logger.js';

export const errorHandler: ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(err.stack);

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};