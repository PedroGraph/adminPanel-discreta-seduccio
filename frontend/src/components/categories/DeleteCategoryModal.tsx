
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCategories, Category } from "@/hooks/useCategories";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess?: () => void;
}

import { useI18n } from "@/hooks/use-i18n";

export const DeleteCategoryModal = ({ open, onOpenChange, category, onSuccess }: DeleteCategoryModalProps) => {
  const t = useI18n();
  const { deleteCategory } = useCategories();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setLoading(true);
    const success = await deleteCategory(category.id);
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
    setLoading(false);
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{(t("category_delete") as any).title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-300">
            {(t("category_delete") as any).warning} <strong>{category.name}</strong>?
          </p>

          <p className="text-sm text-gray-500">
            {(t("category_delete") as any).sub_warning}
          </p>

          {category.productCount && category.productCount > 0 && (
            <p className="text-sm text-yellow-600 font-medium">
              {(t("category_delete") as any).products_associated} ({category.productCount})
            </p>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {(t("category_form") as any).cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (t("category_delete") as any).deleting : (t("category_delete") as any).confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
