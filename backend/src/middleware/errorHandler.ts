import { Request, Response, NextFunction } from 'express';
import logger from '@utils/logger.js';
import { AppError } from '@utils/AppError.js';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002':
      return new AppError('Valor duplicado en campo único', 400);
    case 'P2025':
      return new AppError('Registro no encontrado', 404);
    default:
      return new AppError('Error en base de datos', 500);
  }
};

const handleZodError = (err: ZodError): AppError => {
  const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
  return new AppError(`Datos inválidos: ${message}`, 400);
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(error);
    } else if (error instanceof ZodError) {
      error = handleZodError(error);
    } else {
      error = new AppError(error.message || 'Error interno del servidor', 500);
    }
  }

  const statusCode = (error as AppError).statusCode || 500;
  const status = (error as AppError).status || 'error';
  const message = error.message || 'Error interno del servidor';

  if (statusCode === 500) {
    logger.error('ERROR 💥', err);
  } else {
    logger.warn(`ERROR ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};