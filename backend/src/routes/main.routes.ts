import { Router } from 'express';
import productsRoutes from './products.routes.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';
import inventoryRoutes from './inventory.routes.js';
import analyticsRoutes from './analytics.routes.js';
import ordersRoutes from './orders.routes.js';
import couponsRoutes from './coupons.routes.js';
import categoriesRoutes from './categories.routes.js';
import returnsRoutes from './returns.routes.js';
import reportsRoutes from './reports.routes.js';

const router = Router();

router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/orders', ordersRoutes);
router.use('/returns', returnsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/reports', reportsRoutes);

export default router;
