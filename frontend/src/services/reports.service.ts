import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ScheduledReport {
    id: number;
    name: string;
    type: string;
    frequency: string;
    format: string;
    status: string;
    lastRun: string | null;
    nextRun: string;
    createdAt: string;
    subscribers: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }[];
}

export interface CreateScheduledReportData {
    name: string;
    type: string;
    frequency: string;
    format: string;
    subscriberIds?: number[];
}

export interface RetentionMetric {
    month: string;
    newCustomers: number;
    returningCustomers?: number;
    retentionRate: number;
}

class ReportsService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    // Get all scheduled reports
    async getScheduledReports(): Promise<ScheduledReport[]> {
        const response = await axios.get(`${API_URL}/reports/scheduled`, this.getAuthHeader());
        return response.data.data;
    }

    // Create a new scheduled report
    async createScheduledReport(data: CreateScheduledReportData): Promise<ScheduledReport> {
        const response = await axios.post(`${API_URL}/reports/scheduled`, data, this.getAuthHeader());
        return response.data.data;
    }

    // Update scheduled report status
    async updateScheduledReportStatus(id: number, status: string): Promise<ScheduledReport> {
        const response = await axios.patch(
            `${API_URL}/reports/scheduled/${id}/status`,
            { status },
            this.getAuthHeader()
        );
        return response.data.data;
    }

    // Run a report manually
    async runReport(id: number): Promise<{ success: boolean; message: string }> {
        const response = await axios.post(
            `${API_URL}/reports/scheduled/${id}/run`,
            {},
            this.getAuthHeader()
        );
        return response.data.data;
    }

    // Get retention metrics
    async getRetentionMetrics(): Promise<RetentionMetric[]> {
        const response = await axios.get(`${API_URL}/reports/retention`, this.getAuthHeader());
        return response.data.data;
    }

    // Export report on-demand
    async exportReport(type: string, format: string, startDate?: Date, endDate?: Date): Promise<Blob> {
        const response = await axios.post(
            `${API_URL}/reports/export?type=${type}&format=${format}`,
            {
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            },
            {
                ...this.getAuthHeader(),
                responseType: 'blob',
            }
        );
        return response.data;
    }
}

export const reportsService = new ReportsService();
