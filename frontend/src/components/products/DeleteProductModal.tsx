
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useI18n } from "@/hooks/use-i18n";

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    name: string;
  } | null;
  onConfirm: () => void;
}

export const DeleteProductModal = ({ open, onOpenChange, product, onConfirm }: DeleteProductModalProps) => {
  const { toast } = useToast();
  const t = useI18n();

  const handleDelete = () => {
    onConfirm();
    toast({
      title: (t("product_delete") as any).success_title,
      description: `${product?.name} ${(t("product_delete") as any).success_description}`,
    });
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-purple-100">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            {(t("product_delete") as any).title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <Trash2 className="h-6 w-6 text-red-400" />
            <div>
              <p className="font-medium text-red-200">
                {(t("product_delete") as any).warning}
              </p>
              <p className="text-sm text-red-300 mt-1">
                {(t("product_delete") as any).sub_warning}
              </p>
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded border border-gray-600">
            <p className="text-gray-300 text-sm">{(t("product_delete") as any).to_delete}</p>
            <p className="text-white font-semibold">{product.name}</p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            {(t("product_form") as any).cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {(t("product_delete") as any).confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
