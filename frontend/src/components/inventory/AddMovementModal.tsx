
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InventoryProduct } from "@/hooks/useInventory";

interface AddMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryProduct[];
  onCreateMovement: (movement: {
    product_id: string;
    movement_type: string;
    quantity: number;
    reason: string;
    cost_per_unit?: number;
  }) => Promise<boolean>;
}

export const AddMovementModal = ({
  isOpen,
  onClose,
  products,
  onCreateMovement,
}: AddMovementModalProps) => {
  const [formData, setFormData] = useState({
    product_id: "",
    movement_type: "",
    quantity: "",
    reason: "",
    cost_per_unit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.movement_type || !formData.quantity || !formData.reason) {
      return;
    }

    const movement = {
      product_id: formData.product_id,
      movement_type: formData.movement_type,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      cost_per_unit: formData.cost_per_unit ? parseFloat(formData.cost_per_unit) : undefined,
    };

    const success = await onCreateMovement(movement);
    if (success) {
      setFormData({
        product_id: "",
        movement_type: "",
        quantity: "",
        reason: "",
        cost_per_unit: "",
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-700 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle>Agregar Movimiento de Inventario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Producto</Label>
            <Select value={formData.product_id} onValueChange={(value) => handleInputChange("product_id", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="movement_type">Tipo de Movimiento</Label>
            <Select value={formData.movement_type} onValueChange={(value) => handleInputChange("movement_type", value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
                <SelectItem value="ajuste">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="bg-gray-800 border-gray-600"
              placeholder="Ingrese la cantidad"
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="cost_per_unit">Costo por Unidad (Opcional)</Label>
            <Input
              id="cost_per_unit"
              type="number"
              step="0.01"
              value={formData.cost_per_unit}
              onChange={(e) => handleInputChange("cost_per_unit", e.target.value)}
              className="bg-gray-800 border-gray-600"
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className="bg-gray-800 border-gray-600"
              placeholder="Describa el motivo del movimiento"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-purple-700 hover:bg-purple-600">
              Crear Movimiento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
