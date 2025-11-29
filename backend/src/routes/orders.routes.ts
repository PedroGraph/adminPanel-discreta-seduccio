import { Router } from 'express';
import { OrdersController } from '@controllers/orders.controller.js';

const router = Router();
const ordersController = new OrdersController();

router.get('/', ordersController.getOrders);
router.get('/stats', ordersController.getStats);

export default router;
