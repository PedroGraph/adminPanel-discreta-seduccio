
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit,
  Percent,
  Package
} from "lucide-react";

interface VolumeDiscount {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
}

interface VolumeDiscountsProps {
  productId?: string;
  discounts?: VolumeDiscount[];
  onDiscountsChange?: (discounts: VolumeDiscount[]) => void;
}

export const VolumeDiscounts = ({ productId, discounts = [], onDiscountsChange }: VolumeDiscountsProps) => {
  const [localDiscounts, setLocalDiscounts] = useState<VolumeDiscount[]>(discounts);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<VolumeDiscount | null>(null);
  const [formData, setFormData] = useState({
    minQuantity: '',
    maxQuantity: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDiscount: VolumeDiscount = {
      id: editingDiscount?.id || Date.now(),
      minQuantity: parseInt(formData.minQuantity),
      maxQuantity: formData.maxQuantity ? parseInt(formData.maxQuantity) : null,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      description: formData.description
    };

    let updatedDiscounts;
    if (editingDiscount) {
      updatedDiscounts = localDiscounts.map(d => 
        d.id === editingDiscount.id ? newDiscount : d
      );
    } else {
      updatedDiscounts = [...localDiscounts, newDiscount];
    }

    setLocalDiscounts(updatedDiscounts);
    onDiscountsChange?.(updatedDiscounts);
    
    // Reset form
    setFormData({
      minQuantity: '',
      maxQuantity: '',
      discountType: 'percentage',
      discountValue: '',
      description: ''
    });
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleEdit = (discount: VolumeDiscount) => {
    setEditingDiscount(discount);
    setFormData({
      minQuantity: discount.minQuantity.toString(),
      maxQuantity: discount.maxQuantity?.toString() || '',
      discountType: discount.discountType,
      discountValue: discount.discountValue.toString(),
      description: discount.description
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const updatedDiscounts = localDiscounts.filter(d => d.id !== id);
    setLocalDiscounts(updatedDiscounts);
    onDiscountsChange?.(updatedDiscounts);
  };

  const formatDiscount = (discount: VolumeDiscount) => {
    if (discount.discountType === 'percentage') {
      return `${discount.discountValue}%`;
    } else {
      return `$${discount.discountValue}`;
    }
  };

  const formatQuantityRange = (discount: VolumeDiscount) => {
    if (discount.maxQuantity) {
      return `${discount.minQuantity} - ${discount.maxQuantity}`;
    } else {
      return `${discount.minQuantity}+`;
    }
  };

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Descuentos por Volumen
        </CardTitle>
        <Button 
          onClick={() => setShowForm(true)}
          size="sm"
          className="bg-purple-700 hover:bg-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Descuento
        </Button>
      </CardHeader>
      <CardContent>
        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-300">Cantidad Mínima</Label>
                <Input
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-300">Cantidad Máxima (opcional)</Label>
                <Input
                  type="number"
                  value={formData.maxQuantity}
                  onChange={(e) => setFormData({...formData, maxQuantity: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Dejar vacío para sin límite"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-300">Tipo de Descuento</Label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                  className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Cantidad Fija</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-300">
                  Valor del Descuento {formData.discountType === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="text-gray-300">Descripción</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Ej: Descuento por compra al mayoreo"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-700 hover:bg-green-600">
                {editingDiscount ? 'Actualizar' : 'Guardar'} Descuento
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingDiscount(null);
                  setFormData({
                    minQuantity: '',
                    maxQuantity: '',
                    discountType: 'percentage',
                    discountValue: '',
                    description: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Discounts List */}
        {localDiscounts.length > 0 ? (
          <div className="space-y-3">
            {localDiscounts.map((discount) => (
              <div key={discount.id} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-purple-600 text-white">
                        <Package className="h-3 w-3 mr-1" />
                        {formatQuantityRange(discount)} unidades
                      </Badge>
                      <Badge className="bg-green-600 text-white">
                        <Percent className="h-3 w-3 mr-1" />
                        {formatDiscount(discount)} descuento
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{discount.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(discount)}
                      className="text-xs"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(discount.id)}
                      className="text-xs text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay descuentos por volumen configurados</p>
            <p className="text-sm">Agrégalos para incentivar compras en mayor cantidad</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
