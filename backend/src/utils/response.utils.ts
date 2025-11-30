import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendCreated = <T>(res: Response, data: T, message?: string) => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export const sendError = (res: Response, message: string, statusCode = 500) => {
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};