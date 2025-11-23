
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCategories, Category } from "@/hooks/useCategories";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const DeleteCategoryModal = ({ open, onOpenChange, category }: DeleteCategoryModalProps) => {
  const { deleteCategory } = useCategories();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setLoading(true);
    const success = await deleteCategory(category.id);
    if (success) {
      onOpenChange(false);
    }
    setLoading(false);
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Eliminar Categoría</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar la categoría <strong>{category.name}</strong>?
          </p>
          
          <p className="text-sm text-gray-500">
            Esta acción no se puede deshacer. Se eliminará la categoría y todas sus subcategorías.
          </p>

          {category.products_count && category.products_count > 0 && (
            <p className="text-sm text-yellow-600 font-medium">
              ⚠️ Esta categoría tiene {category.products_count} productos asociados.
            </p>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
