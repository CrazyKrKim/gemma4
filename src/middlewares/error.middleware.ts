import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    logger.warn({ path: req.path, errors: err.errors }, 'Validation error');
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error'
  });
};
