import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, MapPin, CheckCircle, Clock } from "lucide-react";
import { Order } from "@/types/order";

interface OrderTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const trackingSteps = [
  {
    id: 1,
    title: "Pedido Confirmado",
    description: "Tu pedido ha sido confirmado y está siendo preparado",
    icon: CheckCircle,
    completed: true,
    date: "2024-01-15 10:30"
  },
  {
    id: 2,
    title: "En Preparación",
    description: "Estamos preparando tu pedido en nuestro almacén",
    icon: Package,
    completed: true,
    date: "2024-01-15 14:20"
  },
  {
    id: 3,
    title: "Enviado",
    description: "Tu pedido ha sido enviado y está en camino",
    icon: Truck,
    completed: true,
    date: "2024-01-16 09:15"
  },
  {
    id: 4,
    title: "En Tránsito",
    description: "Tu pedido está siendo transportado a su destino",
    icon: MapPin,
    completed: false,
    date: "Estimado: 2024-01-17 16:00"
  },
  {
    id: 5,
    title: "Entregado",
    description: "Tu pedido ha sido entregado exitosamente",
    icon: CheckCircle,
    completed: false,
    date: "Pendiente"
  }
];

export const OrderTrackingModal = ({ open, onOpenChange, order }: OrderTrackingModalProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Seguimiento de la Orden {order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg border border-purple-600">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-purple-200 font-semibold">{order.customer_name}</h3>
                <p className="text-purple-400 text-sm">Fecha del pedido: {order.order_date}</p>
              </div>
              <Badge 
                variant="outline" 
                className={
                  order.status === "Completado" ? "border-green-600 text-green-400 bg-green-900/20" :
                  order.status === "Enviado" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
                  order.status === "Procesando" ? "border-yellow-600 text-yellow-400 bg-yellow-900/20" :
                  order.status === "Pendiente" ? "border-orange-600 text-orange-400 bg-orange-900/20" : "border-red-600 text-red-400 bg-red-900/20"
                }
              >
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === trackingSteps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  <Card className={`bg-gray-700 border-purple-600 ${step.completed ? 'border-green-600' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${step.completed ? 'bg-green-900/20 text-green-400' : 'bg-gray-600 text-gray-400'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${step.completed ? 'text-green-400' : 'text-purple-300'}`}>
                              {step.title}
                            </h4>
                            <span className="text-purple-400 text-sm">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-purple-400 text-sm mt-1">
                            {step.description}
                          </p>
                        </div>
                        
                        {step.completed && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        
                        {!step.completed && step.id === 4 && (
                          <Clock className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {!isLast && (
                    <div className={`w-0.5 h-4 ml-6 ${step.completed ? 'bg-green-600' : 'bg-gray-600'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
