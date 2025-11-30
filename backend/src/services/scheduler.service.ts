import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { reportsService } from './reports.service.js';

const prisma = new PrismaClient();

export class SchedulerService {
    private jobs: Map<number, cron.ScheduledTask> = new Map();

    // Initialize all active scheduled reports
    async initialize() {
        const reports = await prisma.scheduledReport.findMany({
            where: {
                status: 'active',
            },
        });

        reports.forEach((report) => {
            this.scheduleReport(report.id, report.frequency, report.nextRun);
        });

        console.log(`Initialized ${reports.length} scheduled reports`);
    }

    // Schedule a report
    scheduleReport(reportId: number, frequency: string, nextRun: Date) {
        this.stopReport(reportId);

        const cronExpression = this.getCronExpression(frequency, nextRun);

        const job = cron.schedule(cronExpression, async () => {
            try {
                console.log(`Running scheduled report ${reportId}`);
                await reportsService.runReport(reportId);
            } catch (error) {
                console.error(`Error running scheduled report ${reportId}:`, error);
            }
        });

        this.jobs.set(reportId, job);
        console.log(`Scheduled report ${reportId} with expression: ${cronExpression}`);
    }

    // Stop a scheduled report
    stopReport(reportId: number) {
        const job = this.jobs.get(reportId);
        if (job) {
            job.stop();
            this.jobs.delete(reportId);
            console.log(`Stopped scheduled report ${reportId}`);
        }
    }

    // Convert frequency to cron expression
    private getCronExpression(frequency: string, nextRun: Date): string {
        const hour = nextRun.getHours();
        const minute = nextRun.getMinutes();

        switch (frequency) {
            case 'daily':
                return `${minute} ${hour} * * *`;
            case 'weekly':
                const dayOfWeek = nextRun.getDay();
                return `${minute} ${hour} * * ${dayOfWeek}`;
            case 'monthly':
                const dayOfMonth = nextRun.getDate();
                return `${minute} ${hour} ${dayOfMonth} * *`;
            case 'quarterly':
                return `${minute} ${hour} 1 */3 *`;
            case 'yearly':
                const month = nextRun.getMonth() + 1;
                const day = nextRun.getDate();
                return `${minute} ${hour} ${day} ${month} *`;
            default:
                return `${minute} ${hour} * * *`;
        }
    }

    // Reschedule a report
    async rescheduleReport(reportId: number) {
        const report = await prisma.scheduledReport.findUnique({
            where: { id: reportId },
        });

        if (report && report.status === 'active') {
            this.scheduleReport(reportId, report.frequency, report.nextRun);
        }
    }

    // Stop all scheduled reports
    stopAll() {
        this.jobs.forEach((job, reportId) => {
            job.stop();
            console.log(`Stopped scheduled report ${reportId}`);
        });
        this.jobs.clear();
    }
}

export const schedulerService = new SchedulerService();
