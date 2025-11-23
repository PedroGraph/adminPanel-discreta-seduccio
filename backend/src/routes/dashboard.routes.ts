import { Router } from 'express';
import { DashboardController } from '@controllers/dashboard.controller.js';
import { auth } from '@middleware/auth.js';

const router = Router();
const dashboardController = new DashboardController();

router.get('/stats', auth, dashboardController.getDashboardStats);

export default router;
