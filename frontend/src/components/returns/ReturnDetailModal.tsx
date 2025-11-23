
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Package, Calendar, User, CreditCard } from "lucide-react";
import { Return } from "@/types/return";

interface ReturnDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnItem: Return | null;
}

export const ReturnDetailModal = ({ open, onOpenChange, returnItem }: ReturnDetailModalProps) => {
  if (!returnItem) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprobado":
        return "border-green-600 text-green-400 bg-green-900/20";
      case "Pendiente":
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      case "Procesando":
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      default:
        return "border-red-600 text-red-400 bg-red-900/20";
    }
  };

  const getReturnTypeColor = (type: string) => {
    return type === "Reembolso" ? "border-purple-600 text-purple-400 bg-purple-900/20" : "border-blue-600 text-blue-400 bg-blue-900/20";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Detalles de la Devolución {returnItem.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Estado y información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-700 border-purple-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-purple-400 text-sm">Estado:</span>
                  <Badge variant="outline" className={`ml-2 ${getStatusColor(returnItem.status)}`}>
                    {returnItem.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Fecha de solicitud:</span>
                  <span className="text-purple-100 ml-2">{returnItem.request_date}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Total productos:</span>
                  <span className="text-purple-100 ml-2">{returnItem.return_items.length}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Monto total:</span>
                  <span className="text-purple-100 ml-2 font-semibold">${returnItem.total_refund_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-purple-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-purple-400 text-sm">Nombre:</span>
                  <span className="text-purple-100 ml-2">{returnItem.customer}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Orden original:</span>
                  <span className="text-purple-100 ml-2">{returnItem.order_id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-purple-700" />

          {/* Lista de productos */}
          <Card className="bg-gray-700 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                <Package className="h-4 w-4" />
                Productos a Devolver ({returnItem.return_items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnItem.return_items.map((item, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-purple-400 text-sm">Producto:</span>
                          <span className="text-purple-100 ml-2 font-medium">{item.product_name}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">Cantidad a devolver:</span>
                          <span className="text-purple-100 ml-2">{item.quantity_to_return} de {item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">Precio unitario:</span>
                          <span className="text-purple-100 ml-2">${item.unit_price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-purple-400 text-sm">Motivo:</span>
                          <span className="text-purple-100 ml-2">{item.reason}</span>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">Tipo:</span>
                          <Badge variant="outline" className={`ml-2 ${getReturnTypeColor(item.return_type)}`}>
                            {item.return_type}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-purple-400 text-sm">Subtotal:</span>
                          <span className="text-purple-100 ml-2 font-semibold">${item.total_price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proceso de reembolso */}
          <Card className="bg-gray-700 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Proceso de Reembolso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 text-sm">
                {returnItem.status === "Aprobado" 
                  ? "El reembolso será procesado en 3-5 días hábiles al método de pago original."
                  : returnItem.status === "Pendiente"
                  ? "La solicitud está siendo revisada por nuestro equipo."
                  : returnItem.status === "Procesando"
                  ? "La devolución está siendo procesada."
                  : "La solicitud de devolución ha sido rechazada."
                }
              </p>
              {returnItem.return_items.some(item => item.return_type === "Intercambio") && (
                <p className="text-blue-300 text-sm mt-2">
                  ⚠️ Esta devolución incluye productos para intercambio. Se coordinará el envío de los productos de reemplazo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
