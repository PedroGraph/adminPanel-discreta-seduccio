import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '@services/inventory.service.js';
import { sendSuccess, sendCreated } from '@utils/response.utils.js';
import logger from '@utils/logger.js';

const inventoryService = new InventoryService();

export class InventoryController {
  
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const status = req.query.status as 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';

      const result = await inventoryService.getInventory({ page, limit, search, status });
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const movements = await inventoryService.getMovements(limit);
      sendSuccess(res, movements);
    } catch (error) {
      next(error);
    }
  }

  async createMovement(req: Request, res: Response, next: NextFunction) {
    try {
      const movement = await inventoryService.createMovement(req.body);
      sendCreated(res, movement, 'Movimiento creado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await inventoryService.getStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}
