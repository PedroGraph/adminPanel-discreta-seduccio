import { Request, Response } from 'express';
import { reportsService } from '../services/reports.service.js';
import { schedulerService } from '../services/scheduler.service.js';
import { successResponse, errorResponse } from '../utils/response.utils.js';

export class ReportsController {
    // Get all scheduled reports
    async getScheduledReports(req: Request, res: Response) {
        try {
            const reports = await reportsService.getScheduledReports();
            return successResponse(res, reports, 'Scheduled reports retrieved successfully');
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    // Create a new scheduled report
    async createScheduledReport(req: Request, res: Response) {
        try {
            const { name, type, frequency, format, subscriberIds } = req.body;
            const createdById = (req as any).user?.id || 1;

            if (!name || !type || !frequency || !format) {
                return errorResponse(res, 'Missing required fields', 400);
            }

            const report = await reportsService.createScheduledReport({
                name,
                type,
                frequency,
                format,
                createdById,
                subscriberIds,
            });

            await schedulerService.scheduleReport(report.id, report.frequency, report.nextRun);

            return successResponse(res, report, 'Scheduled report created successfully', 201);
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    // Update scheduled report status
    async updateScheduledReportStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return errorResponse(res, 'Status is required', 400);
            }

            const report = await reportsService.updateScheduledReportStatus(parseInt(id), status);

            if (status === 'active') {
                await schedulerService.rescheduleReport(parseInt(id));
            } else {
                schedulerService.stopReport(parseInt(id));
            }

            return successResponse(res, report, 'Scheduled report status updated successfully');
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    // Run a report manually
    async runReport(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await reportsService.runReport(parseInt(id));
            return successResponse(res, result, 'Report executed successfully');
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    // Get retention metrics
    async getRetentionMetrics(req: Request, res: Response) {
        try {
            const metrics = await reportsService.getRetentionMetrics();
            return successResponse(res, metrics, 'Retention metrics retrieved successfully');
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    // Export report on-demand
    async exportReport(req: Request, res: Response) {
        try {
            const { type, format } = req.query;
            const { startDate, endDate } = req.body;

            if (!type || !format) {
                return errorResponse(res, 'Type and format are required', 400);
            }

            const fileBuffer = await reportsService.exportReport(
                type as string,
                format as string,
                startDate ? new Date(startDate) : undefined,
                endDate ? new Date(endDate) : undefined
            );

            const fileExtension = format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'csv';
            const fileName = `${type}_report_${new Date().toISOString().split('T')[0]}.${fileExtension}`;

            res.setHeader('Content-Type', this.getContentType(format as string));
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(fileBuffer);
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    private getContentType(format: string): string {
        switch (format) {
            case 'pdf':
                return 'application/pdf';
            case 'excel':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'csv':
                return 'text/csv';
            default:
                return 'application/octet-stream';
        }
    }
}

export const reportsController = new ReportsController();
