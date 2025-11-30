import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(auth);

// Get all scheduled reports
router.get('/scheduled', reportsController.getScheduledReports.bind(reportsController));

// Create a new scheduled report
router.post('/scheduled', reportsController.createScheduledReport.bind(reportsController));

// Update scheduled report status
router.patch('/scheduled/:id/status', reportsController.updateScheduledReportStatus.bind(reportsController));

// Run a report manually
router.post('/scheduled/:id/run', reportsController.runReport.bind(reportsController));

// Get retention metrics
router.get('/retention', reportsController.getRetentionMetrics.bind(reportsController));

// Export report on-demand
router.post('/export', reportsController.exportReport.bind(reportsController));

export default router;
