import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/auth.service.js';
import { LogService } from '@services/log.service.js';
import logger from '@utils/logger.js';
import { AppError } from '@utils/AppError.js';
import { sendSuccess } from '@utils/response.utils.js';

const authService = new AuthService();
const logService = new LogService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      
      await logService.createLog(req, {
        email,
        action: 'login',
        entityType: 'user',
        entityId: result.id,
        description: 'Usuario logueado exitosamente'
      });

      sendSuccess(res, result, 'Login exitoso');
    } catch (error) {
      logger.error('Error en login:', error);
      if (error instanceof Error) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const result = await authService.register(userData);

      await logService.createLog(req, {
        email: userData.email,
        action: 'register',
        entityType: 'user',
        entityId: result.id,
        description: 'Nuevo usuario registrado'
      });

      sendSuccess(res, result, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      logger.error('Error en registro:', error);
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }
}