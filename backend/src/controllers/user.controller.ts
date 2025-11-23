import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/user.service.js';
import { sendSuccess } from '@utils/response.utils.js';
import { AppError } from '@utils/AppError.js';
import logger from '@utils/logger.js';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      sendSuccess(res, users);
    } catch (error) {
      logger.error('Error obteniendo usuarios:', error);
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      
      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }
      
      sendSuccess(res, user);
    } catch (error) {
      logger.error('Error obteniendo usuario:', error);
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      sendSuccess(res, user, 'Usuario creado exitosamente', 201);
    } catch (error) {
      logger.error('Error creando usuario:', error);
      if (error instanceof Error) {
        next(new AppError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await userService.updateUser(id, updates);
      sendSuccess(res, user, 'Usuario actualizado exitosamente');
    } catch (error) {
      logger.error('Error actualizando usuario:', error);
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await userService.deleteUser(id);
      sendSuccess(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
      logger.error('Error eliminando usuario:', error);
      next(error);
    }
  }
}
