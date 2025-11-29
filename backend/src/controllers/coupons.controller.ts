import { Request, Response, NextFunction } from 'express';
import { CouponsService } from '@services/coupons.service.js';
import { sendSuccess } from '@utils/response.utils.js';

const couponsService = new CouponsService();

export class CouponsController {

    async getCoupons(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const type = req.query.type as string;

            const result = await couponsService.getCoupons({ page, limit, search, status, type });
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await couponsService.getStats();
            sendSuccess(res, stats);
        } catch (error) {
            next(error);
        }
    }

    async createCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const coupon = await couponsService.createCoupon(req.body);
            sendSuccess(res, coupon, 201);
        } catch (error) {
            next(error);
        }
    }

    async updateCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const coupon = await couponsService.updateCoupon(id, req.body);
            sendSuccess(res, coupon);
        } catch (error) {
            next(error);
        }
    }

    async deleteCoupon(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            await couponsService.deleteCoupon(id);
            sendSuccess(res, { message: 'Coupon deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
