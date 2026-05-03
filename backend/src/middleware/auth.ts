import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthMiddleware, AuthRequest } from '@appTypes/middleware.js';

export const auth: AuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-only-insecure-secret');
    req.user = decoded as jwt.JwtPayload;
 
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};