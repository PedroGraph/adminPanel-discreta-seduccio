import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '@services/auth.service.js';
import { LogService } from '@services/log.service.js';
import logger from '@utils/logger.js';
import { AppError } from '@utils/AppError.js';
import { sendSuccess } from '@utils/response.utils.js';
import { AuthRequest } from '@appTypes/middleware.js';

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

   
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax', 
        maxAge: 24 * 60 * 60 * 1000 
      });

      
      const { token, ...userWithoutToken } = result;
      sendSuccess(res, { user: userWithoutToken }, 'Login exitoso');
    } catch (error) {
      logger.error('Error en login:', error);
      if (error instanceof Error) {
        next(new AppError(error.message, 401));
      } else {
        next(error);
      }
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token');
      sendSuccess(res, null, 'Logout exitoso');
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
     
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }
      sendSuccess(res, req.user, 'Perfil de usuario');
    } catch (error) {
      next(error);
    }
  }

  async getWsToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }
      const secret = process.env.JWT_SECRET || 'dev-only-insecure-secret';
      const wsToken = jwt.sign(
        { id: req.user.id, email: req.user.email, role: req.user.role },
        secret,
        { expiresIn: '5m' }
      );
      sendSuccess(res, { token: wsToken }, 'WebSocket token generado');
    } catch (error) {
      next(error);
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