import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, FileText } from "lucide-react";

interface CreateScheduledReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReport: (reportData: {
    name: string;
    frequency: string;
    status: 'Activo' | 'Pausado';
    format: string;
    type: string;
  }) => void;
}

export const CreateScheduledReportModal = ({
  open,
  onOpenChange,
  onCreateReport
}: CreateScheduledReportModalProps) => {
  const t = useI18n();
  const tr = t("reports_modal") as any;
  const types = t("reports_types") as any;
  const table = t("reports_table") as any;

  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    format: '',
    type: '',
    status: 'Activo' as 'Activo' | 'Pausado'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.frequency && formData.format && formData.type) {
      onCreateReport(formData);
      setFormData({
        name: '',
        frequency: '',
        format: '',
        type: '',
        status: 'Activo'
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {tr.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">{tr.name_label}</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={tr.name_placeholder}
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">{tr.type_label}</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder={tr.type_placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="sales">{types.sales}</SelectItem>
                  <SelectItem value="inventory">{types.inventory}</SelectItem>
                  <SelectItem value="customers">{types.customers}</SelectItem>
                  <SelectItem value="orders">{types.orders}</SelectItem>
                  <SelectItem value="retention">{types.retention}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">{tr.frequency_label}</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder={tr.frequency_placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="Diario">{tr.frequencies.daily}</SelectItem>
                  <SelectItem value="Semanal">{tr.frequencies.weekly}</SelectItem>
                  <SelectItem value="Mensual">{tr.frequencies.monthly}</SelectItem>
                  <SelectItem value="Trimestral">{tr.frequencies.quarterly}</SelectItem>
                  <SelectItem value="Anual">{tr.frequencies.yearly}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">{tr.format_label}</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder={tr.format_placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">{tr.status_label}</Label>
              <Select value={formData.status} onValueChange={(value: 'Activo' | 'Pausado') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="Activo">{table.status_active}</SelectItem>
                  <SelectItem value="Pausado">{table.status_paused}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              {tr.create_button}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
