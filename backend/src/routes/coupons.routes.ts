import { Router } from 'express';
import { CouponsController } from '@controllers/coupons.controller.js';

const router = Router();
const couponsController = new CouponsController();

router.get('/', couponsController.getCoupons.bind(couponsController));
router.get('/stats', couponsController.getStats.bind(couponsController));
router.post('/', couponsController.createCoupon.bind(couponsController));
router.put('/:id', couponsController.updateCoupon.bind(couponsController));
router.delete('/:id', couponsController.deleteCoupon.bind(couponsController));

export default router;
