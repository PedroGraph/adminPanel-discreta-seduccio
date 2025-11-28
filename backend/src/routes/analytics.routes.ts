import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(auth);
router.get('/', (req, res) => analyticsController.getAnalytics(req, res));
router.get('/conversion-rate', (req, res) => analyticsController.getConversionRate(req, res));

export default router;
