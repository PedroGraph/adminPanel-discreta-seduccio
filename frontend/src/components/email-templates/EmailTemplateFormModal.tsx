
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmailTemplateForm, EmailTemplateFormValues } from "./EmailTemplateForm";
import { EmailTemplate } from "@/types/email-template";
import { TablesInsert } from '@/integrations/supabase/types';

interface EmailTemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TablesInsert<'email_templates'>) => Promise<void>;
  template: EmailTemplate | null;
}

export const EmailTemplateFormModal = ({ isOpen, onClose, onSubmit, template }: EmailTemplateFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EmailTemplateFormValues) => {
    setIsSubmitting(true);
    await onSubmit({ ...template, ...data });
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[625px] bg-gray-900 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle>{template ? "Editar Plantilla de Email" : "Crear Nueva Plantilla de Email"}</DialogTitle>
          <DialogDescription className="text-purple-400">
            {template ? "Modifica los detalles de la plantilla." : "Rellena los campos para crear una nueva plantilla."}
          </DialogDescription>
        </DialogHeader>
        <EmailTemplateForm
          initialData={template}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
