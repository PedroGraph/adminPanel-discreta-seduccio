import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

const prisma = new PrismaClient();

export class ReportsService {
    // Get all scheduled reports
    async getScheduledReports() {
        return await prisma.scheduledReport.findMany({
            include: {
                subscribers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Create a new scheduled report
    async createScheduledReport(data: any) {
        const nextRun = this.calculateNextRun(data.frequency);

        const report = await prisma.scheduledReport.create({
            data: {
                name: data.name,
                type: data.type,
                frequency: data.frequency,
                format: data.format,
                createdById: data.createdById,
                nextRun,
                subscribers: data.subscriberIds
                    ? {
                        create: data.subscriberIds.map((userId: number) => ({
                            userId,
                        })),
                    }
                    : undefined,
            },
            include: {
                subscribers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return report;
    }

    // Update scheduled report status
    async updateScheduledReportStatus(id: number, status: any) {
        return await prisma.scheduledReport.update({
            where: { id },
            data: { status },
        });
    }

    // Calculate next run time based on frequency
    private calculateNextRun(frequency: string): Date {
        const now = new Date();
        switch (frequency) {
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            case 'monthly':
                return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            case 'quarterly':
                return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
            case 'yearly':
                return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
            default:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }
    }

    // Run a report manually
    async runReport(id: number) {
        const report = await prisma.scheduledReport.findUnique({
            where: { id },
            include: {
                subscribers: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!report) {
            throw new Error('Report not found');
        }

        // Generate report data
        const data = await this.generateReportData(report.type);

        // Generate file
        const fileBuffer = await this.generateFile(data, report.format, report.type);

        // Send emails to subscribers
        if (report.subscribers.length > 0) {
            await this.sendReportEmail(report, fileBuffer);
        }

        // Update last run and next run
        const nextRun = this.calculateNextRun(report.frequency);
        await prisma.scheduledReport.update({
            where: { id },
            data: {
                lastRun: new Date(),
                nextRun,
            },
        });

        return { success: true, message: 'Report generated and sent successfully' };
    }

    // Generate report data based on type
    private async generateReportData(type: string) {
        const now = new Date();
        const startDate = startOfMonth(subMonths(now, 1));
        const endDate = endOfMonth(subMonths(now, 1));

        switch (type) {
            case 'sales':
                return await this.getSalesData(startDate, endDate);
            case 'inventory':
                return await this.getInventoryData();
            case 'retention':
                return await this.getRetentionData();
            default:
                return [];
        }
    }

    // Sales report data
    private async getSalesData(startDate: Date, endDate: Date) {
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                items: true,
                customer: true,
            },
        });

        return orders.map((order) => ({
            orderNumber: order.orderNumber,
            date: order.createdAt,
            customer: order.customer?.name || 'Guest',
            total: order.totalAmount,
            items: order.items.length,
            status: order.status,
        }));
    }

    // Inventory report data
    private async getInventoryData() {
        const inventory = await prisma.inventory.findMany({
            include: {
                product: true,
                warehouse: true,
            },
        });

        return inventory.map((item) => ({
            product: item.product.name,
            sku: item.product.sku,
            warehouse: item.warehouse.name,
            quantity: item.quantity,
            available: item.availableQuantity,
        }));
    }

    // Retention metrics data
    private async getRetentionData() {
        const now = new Date();
        const months = [];

        for (let i = 5; i >= 0; i--) {
            const monthStart = startOfMonth(subMonths(now, i));
            const monthEnd = endOfMonth(subMonths(now, i));

            const newCustomers = await prisma.customer.count({
                where: {
                    createdAt: {
                        gte: monthStart,
                        lte: monthEnd,
                    },
                },
            });

            months.push({
                month: monthStart.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                newCustomers,
                retentionRate: 0,
            });
        }

        return months;
    }

    // Generate file (PDF or Excel)
    private async generateFile(data: any[], format: string, type: string): Promise<Buffer> {
        if (format === 'pdf') {
            return this.generatePDF(data, type);
        } else if (format === 'excel') {
            return this.generateExcel(data, type);
        } else {
            return this.generateCSV(data);
        }
    }

    // Generate PDF
    private async generatePDF(data: any[], type: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.fontSize(20).text(`${type.toUpperCase()} Report`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.moveDown(2);

            if (data.length > 0) {
                const keys = Object.keys(data[0]);
                doc.fontSize(10);

                data.forEach((item, index) => {
                    if (index > 0) doc.moveDown(0.5);
                    keys.forEach((key) => {
                        doc.text(`${key}: ${item[key]}`);
                    });
                });
            } else {
                doc.text('No data available for this period.');
            }

            doc.end();
        });
    }

    // Generate Excel
    private async generateExcel(data: any[], type: string): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${type} Report`);

        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            worksheet.columns = keys.map((key) => ({
                header: key.charAt(0).toUpperCase() + key.slice(1),
                key,
                width: 15,
            }));

            data.forEach((item) => {
                worksheet.addRow(item);
            });

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' },
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as Buffer;
    }

    // Generate CSV
    private async generateCSV(data: any[]): Promise<Buffer> {
        if (data.length === 0) {
            return Buffer.from('No data available');
        }

        const keys = Object.keys(data[0]);
        const header = keys.join(',');
        const rows = data.map((item) => keys.map((key) => item[key]).join(','));
        const csv = [header, ...rows].join('\n');

        return Buffer.from(csv);
    }

    // Send report email
    private async sendReportEmail(report: any, fileBuffer: Buffer) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const fileExtension = report.format === 'pdf' ? 'pdf' : report.format === 'excel' ? 'xlsx' : 'csv';
        const fileName = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;

        const emails = report.subscribers.map((sub: any) => sub.user.email);

        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@example.com',
            to: emails.join(','),
            subject: `Scheduled Report: ${report.name}`,
            html: `
        <h2>${report.name}</h2>
        <p>Your scheduled ${report.type} report is ready.</p>
        <p><strong>Frequency:</strong> ${report.frequency}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p>Please find the report attached.</p>
      `,
            attachments: [
                {
                    filename: fileName,
                    content: fileBuffer,
                },
            ],
        });
    }

    // Get retention metrics for dashboard
    async getRetentionMetrics() {
        return await this.getRetentionData();
    }

    // Export report on-demand
    async exportReport(type: string, format: string, startDate?: Date, endDate?: Date) {
        const data = await this.generateReportData(type);
        const fileBuffer = await this.generateFile(data, format, type);
        return fileBuffer;
    }
}

export const reportsService = new ReportsService();
