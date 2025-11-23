
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuppliers, Supplier } from "@/hooks/useSuppliers";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteSupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}

export const DeleteSupplierModal = ({ open, onOpenChange, supplier }: DeleteSupplierModalProps) => {
  const { deleteSupplier } = useSuppliers();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!supplier) return;

    setLoading(true);
    const success = await deleteSupplier(supplier.id);
    if (success) {
      onOpenChange(false);
    }
    setLoading(false);
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Eliminar Proveedor</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-300">
            ¿Estás seguro de que deseas eliminar el proveedor <strong className="text-white">{supplier.name}</strong>?
          </p>
          
          <p className="text-sm text-gray-400">
            Esta acción no se puede deshacer. Se eliminará toda la información del proveedor.
          </p>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
