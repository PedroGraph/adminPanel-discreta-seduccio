
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Package, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockOrderProducts } from "@/data/returnsData";

interface CreateReturnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  quantityToReturn: number;
  price: number;
  reason: string;
  returnType: "Reembolso" | "Intercambio";
}

export const CreateReturnModal = ({ open, onOpenChange }: CreateReturnModalProps) => {
  const { toast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [description, setDescription] = useState("");
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  useEffect(() => {
    if (orderId) {
      const orderData = mockOrderProducts.find(order => order.orderId === orderId);
      if (orderData) {
        setAvailableProducts(orderData.products);
        setSelectedProducts([]);
      } else {
        setAvailableProducts([]);
        setSelectedProducts([]);
      }
    }
  }, [orderId]);

  const handleAddProduct = (product: any) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        quantityToReturn: 1,
        price: product.price,
        reason: "",
        returnType: "Reembolso"
      }]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const updateProductField = (productId: string, field: keyof SelectedProduct, value: any) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  const updateQuantity = (productId: string, change: number) => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.id === productId) {
        const newQuantity = Math.max(1, Math.min(p.quantity, p.quantityToReturn + change));
        return { ...p, quantityToReturn: newQuantity };
      }
      return p;
    }));
  };

  const getTotalRefund = () => {
    return selectedProducts.reduce((total, product) =>
      total + (product.price * product.quantityToReturn), 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar una orden y al menos un producto para devolver",
        variant: "destructive"
      });
      return;
    }

    const incompleteProducts = selectedProducts.filter(p => !p.reason);
    if (incompleteProducts.length > 0) {
      toast({
        title: "Error",
        description: "Todos los productos deben tener un motivo de devolución",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Devolución creada",
      description: `Se ha creado la solicitud de devolución para ${selectedProducts.length} producto(s) de la orden ${orderId}`,
    });

    setOrderId("");
    setDescription("");
    setSelectedProducts([]);
    setAvailableProducts([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Nueva Solicitud de Devolución
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orderId" className="text-purple-300">ID de la Orden</Label>
            <Select value={orderId} onValueChange={setOrderId}>
              <SelectTrigger className="bg-gray-700 border-purple-600 text-purple-100">
                <SelectValue placeholder="Seleccionar orden" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-purple-700">
                {mockOrderProducts.map((order) => (
                  <SelectItem key={order.orderId} value={order.orderId}>
                    {order.orderId} ({order.products.length} productos)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableProducts.length > 0 && (
            <Card className="bg-gray-700 border-purple-600">
              <CardHeader>
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos Disponibles para Devolución
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {availableProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                      <div>
                        <span className="text-purple-100 font-medium">{product.name}</span>
                        <div className="text-purple-400 text-sm">
                          Cantidad: {product.quantity} | Precio: ${product.price}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddProduct(product)}
                        disabled={selectedProducts.some(p => p.id === product.id)}
                        className="border-purple-600 text-purple-300 hover:bg-purple-900"
                      >
                        {selectedProducts.some(p => p.id === product.id) ? "Añadido" : "Añadir"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedProducts.length > 0 && (
            <Card className="bg-gray-700 border-purple-600">
              <CardHeader>
                <CardTitle className="text-purple-200 text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Productos Seleccionados para Devolución
                  </span>
                  <Badge variant="outline" className="border-purple-600 text-purple-400 bg-purple-900/20">
                    Total: ${getTotalRefund().toFixed(2)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-purple-100 font-medium">{product.name}</h4>
                        <p className="text-purple-400 text-sm">Precio unitario: ${product.price}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-400 hover:bg-red-900 hover:text-red-300"
                      >
                        Quitar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-purple-300 text-sm">Cantidad a devolver</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={product.quantityToReturn <= 1}
                              className="border-purple-600 text-purple-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-purple-100 px-3">{product.quantityToReturn}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, 1)}
                              disabled={product.quantityToReturn >= product.quantity}
                              className="border-purple-600 text-purple-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="text-purple-400 text-sm ml-2">de {product.quantity}</span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-purple-300 text-sm">Tipo de Devolución</Label>
                          <Select
                            value={product.returnType}
                            onValueChange={(value: "Reembolso" | "Intercambio") => updateProductField(product.id, 'returnType', value)}
                          >
                            <SelectTrigger className="bg-gray-700 border-purple-600 text-purple-100 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-purple-700">
                              <SelectItem value="Reembolso">Reembolso</SelectItem>
                              <SelectItem value="Intercambio">Intercambio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-purple-300 text-sm">Motivo de Devolución</Label>
                        <Select
                          value={product.reason}
                          onValueChange={(value) => updateProductField(product.id, 'reason', value)}
                        >
                          <SelectTrigger className="bg-gray-700 border-purple-600 text-purple-100 mt-1">
                            <SelectValue placeholder="Seleccionar motivo" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-purple-700">
                            <SelectItem value="Defecto de fábrica">Defecto de fábrica</SelectItem>
                            <SelectItem value="No funciona correctamente">No funciona correctamente</SelectItem>
                            <SelectItem value="Artículo dañado en envío">Artículo dañado en envío</SelectItem>
                            <SelectItem value="No me gusta">No me gusta</SelectItem>
                            <SelectItem value="Talla incorrecta">Talla incorrecta</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <span className="text-purple-400 text-sm">Subtotal: </span>
                          <span className="text-purple-100 font-semibold">
                            ${(product.price * product.quantityToReturn).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">Descripción Adicional (Opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Información adicional sobre la devolución..."
              className="bg-gray-700 border-purple-600 text-purple-100"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-700 hover:bg-purple-600 text-purple-100"
              disabled={selectedProducts.length === 0}
            >
              Crear Devolución
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
