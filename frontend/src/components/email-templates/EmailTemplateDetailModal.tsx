
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmailTemplate } from "@/types/email-template";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EmailTemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
}

export const EmailTemplateDetailModal = ({ isOpen, onClose, template }: EmailTemplateDetailModalProps) => {
  if (!isOpen || !template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-gray-900 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription className="text-purple-400">{template.subject}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="flex items-center gap-4">
            <Badge variant={template.type === "Marketing" ? "default" : "secondary"} className={template.type === "Marketing" ? "bg-purple-700 text-purple-100" : "border-purple-600 text-purple-400"}>{template.type}</Badge>
            <Badge variant={template.status === "Activo" ? "default" : "outline"} className={template.status === "Activo" ? "bg-green-700 text-green-100" : "border-purple-600 text-purple-400"}>{template.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-purple-200">
            <div><span className="font-semibold text-purple-300">Aperturas:</span> {template.opens}%</div>
            <div><span className="font-semibold text-purple-300">Clicks:</span> {template.clicks}%</div>
            <div><span className="font-semibold text-purple-300">Creado:</span> {format(new Date(template.created_at), 'dd MMM yyyy', { locale: es })}</div>
            <div><span className="font-semibold text-purple-300">Actualizado:</span> {format(new Date(template.updated_at), 'dd MMM yyyy', { locale: es })}</div>
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Previsualización del cuerpo:</h4>
            <div className="border border-purple-700 rounded-md p-4 bg-gray-800 max-h-64 overflow-y-auto">
              <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: template.body }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
