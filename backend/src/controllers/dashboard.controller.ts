import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '@services/dashboard.service.js';
import { sendSuccess } from '@utils/response.utils.js';
import logger from '@utils/logger.js';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
   
    try {
      const stats = await dashboardService.getDashboardStats();
      sendSuccess(res, stats);
    } catch (error) {
      logger.error('Error obteniendo estadísticas del dashboard:', error);
      next(error);
    }
  }
}
