
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, User, CreditCard } from "lucide-react";
import { Order } from "@/services/orders.service";

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderDetailModal = ({ open, onOpenChange, order }: OrderDetailModalProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "border-green-600 text-green-400 bg-green-900/20";
      case "shipped":
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      case "processing":
        return "border-yellow-600 text-yellow-400 bg-yellow-900/20";
      case "pending":
        return "border-orange-600 text-orange-400 bg-orange-900/20";
      default:
        return "border-red-600 text-red-400 bg-red-900/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles de la Orden {order.id}
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
                  <Badge variant="outline" className={`ml-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Fecha:</span>
                  <span className="text-purple-100 ml-2">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Items:</span>
                  <span className="text-purple-100 ml-2">{order.items_count}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Total:</span>
                  <span className="text-purple-100 ml-2 font-semibold">${Number(order.total_amount).toFixed(2)}</span>
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
                  <span className="text-purple-100 ml-2">{order.customer_name}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Email:</span>
                  <span className="text-purple-100 ml-2">{order.customer_email}</span>
                </div>
                <div>
                  <span className="text-purple-400 text-sm">Teléfono:</span>
                  <span className="text-purple-100 ml-2">{order.phone || "No disponible"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-purple-700" />

          {/* Dirección de envío */}
          <Card className="bg-gray-700 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100">
                {order.address || "No disponible"}
              </p>
            </CardContent>
          </Card>

          {/* Información de pago y seguimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-700 border-purple-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-200 text-sm flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  {order.payment_method || "No disponible"}
                </p>
              </CardContent>
            </Card>

            {order.status === "shipped" && order.tracking_number && (
              <Card className="bg-gray-700 border-purple-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-200 text-sm">Número de Seguimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100 font-mono">
                    {order.tracking_number}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
