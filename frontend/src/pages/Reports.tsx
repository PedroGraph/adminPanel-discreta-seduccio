
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Filter,
  Mail,
  Play,
  Pause,
  Edit
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useReports } from "@/hooks/useReports";
import { CreateScheduledReportModal } from "@/components/reports/CreateScheduledReportModal";

export const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportType, setReportType] = useState("sales");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    scheduledReports,
    isLoadingReports,
    retentionData,
    isGenerating,
    exportReport,
    runScheduledReport,
    toggleReportStatus,
    createScheduledReport
  } = useReports();

  const handleExportData = async (format: string) => {
    if (!dateRange.start || !dateRange.end) {
      // Si no hay fechas, usar un rango por defecto
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      setDateRange({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
    }

    const startDate = dateRange.start ? new Date(dateRange.start) : undefined;
    const endDate = dateRange.end ? new Date(dateRange.end) : undefined;
    await exportReport(reportType, format as 'excel' | 'pdf' | 'csv', startDate, endDate);
  };

  const getStatusColor = (status: string) => {
    return status === 'Activo' ? 'bg-green-600' : 'bg-gray-600';
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Reportes Avanzados</h1>
        <p className="text-gray-400">Exportación de datos y reportes programados</p>
      </div>

      {/* Export Section */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Datos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label className="text-gray-300">Tipo de Reporte</Label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                <option value="sales">Ventas</option>
                <option value="inventory">Inventario</option>
                <option value="customers">Clientes</option>
                <option value="orders">Órdenes</option>
                <option value="retention">Retención</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-300">Fecha Inicio</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Fecha Fin</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={() => handleExportData('excel')}
                className="bg-green-700 hover:bg-green-600 text-white"
                disabled={isGenerating}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'Excel'}
              </Button>
              <Button
                onClick={() => handleExportData('pdf')}
                className="bg-red-700 hover:bg-red-600 text-white"
                disabled={isGenerating}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : 'PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Metrics */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Métricas de Retención de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #6B7280',
                  borderRadius: '6px',
                  color: '#F3F4F6'
                }}
              />
              <Line type="monotone" dataKey="newCustomers" stroke="#60A5FA" strokeWidth={2} name="Nuevos Clientes" />
              <Line type="monotone" dataKey="retentionRate" stroke="#F59E0B" strokeWidth={2} name="Tasa de Retención %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reportes Programados
          </CardTitle>
          <Button
            className="bg-purple-700 hover:bg-purple-600 text-white"
            onClick={() => setShowCreateModal(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Nuevo Reporte
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Nombre</th>
                  <th className="text-center p-3 text-gray-300">Frecuencia</th>
                  <th className="text-center p-3 text-gray-300">Última Ejecución</th>
                  <th className="text-center p-3 text-gray-300">Próxima Ejecución</th>
                  <th className="text-center p-3 text-gray-300">Estado</th>
                  <th className="text-center p-3 text-gray-300">Formato</th>
                  <th className="text-center p-3 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {scheduledReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-3 text-white font-medium">{report.name}</td>
                    <td className="p-3 text-center text-gray-300">{report.frequency}</td>
                    <td className="p-3 text-center text-gray-300">{report.lastRun}</td>
                    <td className="p-3 text-center text-gray-300">{report.nextRun}</td>
                    <td className="p-3 text-center">
                      <Badge className={`text-white ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center text-gray-300">{report.format}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                          onClick={() => runScheduledReport(report.id)}
                          disabled={isGenerating}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Ejecutar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                          onClick={() => toggleReportStatus(report.id)}
                        >
                          {report.status === 'Activo' ? (
                            <Pause className="h-3 w-3 mr-1" />
                          ) : (
                            <Play className="h-3 w-3 mr-1" />
                          )}
                          {report.status === 'Activo' ? 'Pausar' : 'Activar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <CreateScheduledReportModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateReport={createScheduledReport}
      />
    </div>
  );
};
