import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, MapPin, CheckCircle, Clock } from "lucide-react";
import { Order } from "@/services/orders.service";

interface OrderTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

import { useI18n } from "@/hooks/use-i18n";

const getTrackingSteps = (order: Order, t: any) => {
  const tr = t("order_tracking") as any;
  const steps = [
    {
      id: 1,
      title: tr.steps.confirmed.title,
      description: tr.steps.confirmed.desc,
      icon: CheckCircle,
      completed: true,
      date: new Date(order.created_at).toLocaleString()
    },
    {
      id: 2,
      title: tr.steps.preparing.title,
      description: tr.steps.preparing.desc,
      icon: Package,
      completed: ["processing", "shipped", "delivered"].includes(order.status),
      date: ["processing", "shipped", "delivered"].includes(order.status) ? tr.status.completed : tr.status.pending
    },
    {
      id: 3,
      title: tr.steps.shipped.title,
      description: tr.steps.shipped.desc,
      icon: Truck,
      completed: ["shipped", "delivered"].includes(order.status),
      date: ["shipped", "delivered"].includes(order.status) ? (order.tracking_number ? `Tracking: ${order.tracking_number}` : tr.status.completed) : tr.status.pending
    },
    {
      id: 4,
      title: tr.steps.in_transit.title,
      description: tr.steps.in_transit.desc,
      icon: MapPin,
      completed: ["delivered"].includes(order.status),
      date: tr.status.in_route
    },
    {
      id: 5,
      title: tr.steps.delivered.title,
      description: tr.steps.delivered.desc,
      icon: CheckCircle,
      completed: order.status === "delivered",
      date: order.status === "delivered" ? tr.status.delivered : tr.status.pending
    }
  ];
  return steps;
};

export const OrderTrackingModal = ({ open, onOpenChange, order }: OrderTrackingModalProps) => {
  const t = useI18n();
  const tr = t("order_tracking") as any;

  if (!order) return null;

  const trackingSteps = getTrackingSteps(order, t);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {tr.title} {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg border border-purple-600">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-purple-200 font-semibold">{order.customer_name}</h3>
                <p className="text-purple-400 text-sm">{tr.order_date}: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <Badge
                variant="outline"
                className={
                  order.status === "delivered" ? "border-green-600 text-green-400 bg-green-900/20" :
                    order.status === "shipped" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
                      order.status === "processing" ? "border-yellow-600 text-yellow-400 bg-yellow-900/20" :
                        order.status === "pending" ? "border-orange-600 text-orange-400 bg-orange-900/20" : "border-red-600 text-red-400 bg-red-900/20"
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
