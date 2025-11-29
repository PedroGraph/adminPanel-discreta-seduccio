import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '@services/orders.service.js';
import { sendSuccess } from '@utils/response.utils.js';

const ordersService = new OrdersService();

export class OrdersController {

    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const date = req.query.date as string;

            const result = await ordersService.getOrders({ page, limit, search, status, date });
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await ordersService.getStats();
            sendSuccess(res, stats);
        } catch (error) {
            next(error);
        }
    }
}
