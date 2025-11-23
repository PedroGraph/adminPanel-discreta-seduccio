
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailTemplate } from "@/types/email-template";
import { Eye, Edit, Trash2, Send } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EmailTemplatesTableProps {
  templates: EmailTemplate[];
  onView: (template: EmailTemplate) => void;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (template: EmailTemplate) => void;
}

export const EmailTemplatesTable = ({ templates, onView, onEdit, onDelete }: EmailTemplatesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-purple-800">
          <TableHead className="text-purple-300">Nombre</TableHead>
          <TableHead className="text-purple-300 hidden md:table-cell">Asunto</TableHead>
          <TableHead className="text-purple-300 hidden sm:table-cell">Tipo</TableHead>
          <TableHead className="text-purple-300">Estado</TableHead>
          <TableHead className="text-purple-300 hidden lg:table-cell">Apertura</TableHead>
          <TableHead className="text-purple-300 hidden lg:table-cell">Clicks</TableHead>
          <TableHead className="text-right text-purple-300">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.map((template) => (
          <TableRow key={template.id} className="border-purple-800 hover:bg-gray-800">
            <TableCell>
              <div>
                <div className="font-medium text-purple-100">{template.name}</div>
                <div className="text-sm text-purple-400 hidden sm:block">Modificado: {format(new Date(template.updated_at), 'dd MMM yyyy', { locale: es })}</div>
              </div>
            </TableCell>
            <TableCell className="text-purple-100 hidden md:table-cell">{template.subject}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant={template.type === "Marketing" ? "default" : "secondary"} className={template.type === "Marketing" ? "bg-purple-700 text-purple-100" : "border-purple-600 text-purple-400"}>{template.type}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={template.status === "Activo" ? "default" : "outline"} className={template.status === "Activo" ? "bg-green-700 text-green-100" : "border-purple-600 text-purple-400"}>{template.status}</Badge>
            </TableCell>
            <TableCell className="text-green-400 font-medium hidden lg:table-cell">{template.opens}%</TableCell>
            <TableCell className="text-purple-400 font-medium hidden lg:table-cell">{template.clicks}%</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="text-purple-400 hover:bg-purple-900 h-8 w-8" onClick={() => onView(template)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-purple-400 hover:bg-purple-900 h-8 w-8" onClick={() => onEdit(template)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-purple-400 hover:bg-purple-900 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-gray-900 h-8 w-8" onClick={() => onDelete(template)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
