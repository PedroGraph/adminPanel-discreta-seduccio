
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmailTemplate } from "@/types/email-template";

interface DeleteEmailTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template: EmailTemplate | null;
}

export const DeleteEmailTemplateDialog = ({ isOpen, onClose, onConfirm, template }: DeleteEmailTemplateDialogProps) => {
  if (!isOpen || !template) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-900 border-red-700 text-purple-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-purple-400">
            Estás a punto de eliminar la plantilla "<strong>{template.name}</strong>". Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="text-purple-300 hover:bg-gray-700">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
