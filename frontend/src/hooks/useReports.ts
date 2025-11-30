import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { reportsService, ScheduledReport as APIScheduledReport, CreateScheduledReportData } from '@/services/reports.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ReportData {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'customers' | 'orders' | 'retention' | 'returns' | 'coupons';
  format: 'excel' | 'pdf' | 'csv';
  data: any[];
  generatedAt: string;
}

export interface ScheduledReport {
  id: number;
  name: string;
  frequency: string;
  lastRun: string | null;
  nextRun: string;
  status: 'Activo' | 'Pausado';
  format: string;
  type: string;
}

export const useReports = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch scheduled reports
  const { data: scheduledReportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ['scheduledReports'],
    queryFn: async () => {
      const reports = await reportsService.getScheduledReports();
      // Transform API data to match UI format
      return reports.map((report): ScheduledReport => ({
        id: report.id,
        name: report.name,
        frequency: formatFrequency(report.frequency),
        lastRun: report.lastRun,
        nextRun: report.nextRun,
        status: report.status === 'active' ? 'Activo' : 'Pausado',
        format: formatFormat(report.format),
        type: report.type,
      }));
    },
  });

  const scheduledReports = scheduledReportsData || [];

  // Fetch retention metrics
  const { data: retentionData } = useQuery({
    queryKey: ['retentionMetrics'],
    queryFn: () => reportsService.getRetentionMetrics(),
  });

  // Create scheduled report mutation
  const createReportMutation = useMutation({
    mutationFn: (data: CreateScheduledReportData) => reportsService.createScheduledReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      toast({
        title: 'Reporte programado creado',
        description: 'El reporte se ha creado exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo crear el reporte programado.',
        variant: 'destructive',
      });
    },
  });

  // Update report status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reportsService.updateScheduledReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      toast({
        title: 'Estado actualizado',
        description: 'El estado del reporte se ha actualizado.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el estado.',
        variant: 'destructive',
      });
    },
  });

  // Run report mutation
  const runReportMutation = useMutation({
    mutationFn: (id: number) => reportsService.runReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      toast({
        title: 'Reporte ejecutado',
        description: 'El reporte se ha generado y enviado exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo ejecutar el reporte.',
        variant: 'destructive',
      });
    },
  });

  // Helper functions
  const formatFrequency = (frequency: string): string => {
    const map: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      yearly: 'Anual',
    };
    return map[frequency] || frequency;
  };

  const formatFormat = (format: string): string => {
    const map: Record<string, string> = {
      pdf: 'PDF',
      excel: 'Excel',
      csv: 'CSV',
    };
    return map[format] || format;
  };

  const reverseFormatFrequency = (frequency: string): string => {
    const map: Record<string, string> = {
      'Diario': 'daily',
      'Semanal': 'weekly',
      'Mensual': 'monthly',
      'Trimestral': 'quarterly',
      'Anual': 'yearly',
    };
    return map[frequency] || frequency.toLowerCase();
  };

  const reverseFormatFormat = (format: string): string => {
    const map: Record<string, string> = {
      'PDF': 'pdf',
      'Excel': 'excel',
      'CSV': 'csv',
    };
    return map[format] || format.toLowerCase();
  };

  // Export report
  const exportReport = useCallback(async (
    type: string,
    format: 'excel' | 'pdf' | 'csv',
    startDate?: Date,
    endDate?: Date
  ) => {
    setIsGenerating(true);
    try {
      const blob = await reportsService.exportReport(type, format, startDate, endDate);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'excel' ? 'xlsx' : format;
      link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Reporte exportado',
        description: `El reporte se ha descargado como ${format.toUpperCase()}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo exportar el reporte.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  // Run scheduled report
  const runScheduledReport = useCallback((id: number) => {
    runReportMutation.mutate(id);
  }, [runReportMutation]);

  // Toggle report status
  const toggleReportStatus = useCallback((id: number) => {
    const report = scheduledReports.find(r => r.id === id);
    if (!report) return;

    const newStatus = report.status === 'Activo' ? 'inactive' : 'active';
    updateStatusMutation.mutate({ id, status: newStatus });
  }, [scheduledReports, updateStatusMutation]);

  // Create scheduled report
  const createScheduledReport = useCallback((data: {
    name: string;
    type: string;
    frequency: string;
    format: string;
    subscriberIds?: number[];
  }) => {
    const apiData: CreateScheduledReportData = {
      name: data.name,
      type: data.type,
      frequency: reverseFormatFrequency(data.frequency),
      format: reverseFormatFormat(data.format),
      subscriberIds: data.subscriberIds,
    };
    createReportMutation.mutate(apiData);
  }, [createReportMutation]);

  return {
    scheduledReports,
    isLoadingReports,
    retentionData: retentionData || [],
    isGenerating,
    exportReport,
    runScheduledReport,
    toggleReportStatus,
    createScheduledReport,
  };
};
