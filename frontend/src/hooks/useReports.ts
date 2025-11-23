
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ReportData {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'customers' | 'orders' | 'retention';
  format: 'excel' | 'pdf';
  data: any[];
  generatedAt: string;
}

export interface ScheduledReport {
  id: number;
  name: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  status: 'Activo' | 'Pausado';
  format: string;
  type: string;
}

export const useReports = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: 1,
      name: "Reporte Mensual de Ventas",
      frequency: "Mensual",
      lastRun: "2024-01-15",
      nextRun: "2024-02-15",
      status: "Activo",
      format: "PDF",
      type: "sales"
    },
    {
      id: 2,
      name: "Análisis Semanal de Inventario",
      frequency: "Semanal",
      lastRun: "2024-01-14",
      nextRun: "2024-01-21",
      status: "Activo",
      format: "Excel",
      type: "inventory"
    },
    {
      id: 3,
      name: "Retención de Clientes",
      frequency: "Trimestral",
      lastRun: "2024-01-01",
      nextRun: "2024-04-01",
      status: "Pausado",
      format: "PDF",
      type: "retention"
    }
  ]);

  const generateMockData = useCallback((type: string) => {
    switch (type) {
      case 'sales':
        return [
          { fecha: '2024-01-01', ventas: 15000, ordenes: 45, productos: 120 },
          { fecha: '2024-01-02', ventas: 18000, ordenes: 52, productos: 134 },
          { fecha: '2024-01-03', ventas: 12000, ordenes: 38, productos: 95 }
        ];
      case 'inventory':
        return [
          { producto: 'Laptop Pro', stock: 25, minimo: 10, valor: 25000 },
          { producto: 'Mouse Inalámbrico', stock: 150, minimo: 50, valor: 1500 },
          { producto: 'Teclado Mecánico', stock: 8, minimo: 15, valor: 3200 }
        ];
      case 'customers':
        return [
          { nombre: 'Juan Pérez', email: 'juan@email.com', ordenes: 5, total: 2500 },
          { nombre: 'María García', email: 'maria@email.com', ordenes: 3, total: 1800 },
          { nombre: 'Carlos López', email: 'carlos@email.com', ordenes: 7, total: 3500 }
        ];
      case 'orders':
        return [
          { id: 'ORD-001', cliente: 'Juan Pérez', total: 500, estado: 'Completado' },
          { id: 'ORD-002', cliente: 'María García', total: 750, estado: 'Enviado' },
          { id: 'ORD-003', cliente: 'Carlos López', total: 300, estado: 'Pendiente' }
        ];
      case 'retention':
        return [
          { mes: 'Enero', nuevos: 120, retenidos: 85, tasa: 70.8 },
          { mes: 'Febrero', nuevos: 150, retenidos: 112, tasa: 74.7 },
          { mes: 'Marzo', nuevos: 180, retenidos: 142, tasa: 78.9 }
        ];
      default:
        return [];
    }
  }, []);

  const exportReport = useCallback(async (type: string, format: string, dateRange: { start: string; end: string }) => {
    setIsGenerating(true);
    
    try {
      // Simular generación del reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = generateMockData(type);
      const reportData: ReportData = {
        id: `RPT-${Date.now()}`,
        name: `Reporte de ${type}`,
        type: type as any,
        format: format as any,
        data,
        generatedAt: new Date().toISOString()
      };

      // Simular descarga del archivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.name}_${dateRange.start}_${dateRange.end}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Reporte generado",
        description: `El reporte de ${type} en formato ${format.toUpperCase()} se ha descargado exitosamente.`,
      });

      return reportData;
    } catch (error) {
      toast({
        title: "Error al generar reporte",
        description: "No se pudo generar el reporte. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [generateMockData, toast]);

  const runScheduledReport = useCallback(async (reportId: number) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (!report) return;

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar la fecha de última ejecución
      setScheduledReports(prev => prev.map(r => 
        r.id === reportId 
          ? { ...r, lastRun: new Date().toISOString().split('T')[0] }
          : r
      ));

      toast({
        title: "Reporte ejecutado",
        description: `El reporte "${report.name}" se ha ejecutado exitosamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al ejecutar reporte",
        description: "No se pudo ejecutar el reporte programado.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [scheduledReports, toast]);

  const toggleReportStatus = useCallback((reportId: number) => {
    setScheduledReports(prev => prev.map(r => 
      r.id === reportId 
        ? { ...r, status: r.status === 'Activo' ? 'Pausado' : 'Activo' }
        : r
    ));

    const report = scheduledReports.find(r => r.id === reportId);
    if (report) {
      toast({
        title: "Estado actualizado",
        description: `El reporte "${report.name}" ha sido ${report.status === 'Activo' ? 'pausado' : 'activado'}.`,
      });
    }
  }, [scheduledReports, toast]);

  const createScheduledReport = useCallback((reportData: Omit<ScheduledReport, 'id' | 'lastRun' | 'nextRun'>) => {
    const newReport: ScheduledReport = {
      ...reportData,
      id: Math.max(...scheduledReports.map(r => r.id)) + 1,
      lastRun: 'Nunca',
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setScheduledReports(prev => [...prev, newReport]);
    
    toast({
      title: "Reporte programado",
      description: `El reporte "${newReport.name}" ha sido programado exitosamente.`,
    });

    return newReport;
  }, [scheduledReports, toast]);

  return {
    scheduledReports,
    isGenerating,
    exportReport,
    runScheduledReport,
    toggleReportStatus,
    createScheduledReport
  };
};
