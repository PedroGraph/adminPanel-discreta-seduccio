
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Package } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Props = {
  open: boolean;
  shipment: Tables<"shipments"> | null;
  onClose: () => void;
};

export function ShipmentDetailModal({ open, shipment, onClose }: Props) {
  if (!shipment) return null;
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="bg-gray-800 border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-white">Detalle del Envío</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-white">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg text-white">{shipment.id}</div>
            <Badge variant="outline" className={
              shipment.status === "Entregado" ? "border-green-600 text-green-400 bg-green-900/20" :
              shipment.status === "En tránsito" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
              shipment.status === "Preparando" ? "border-blue-600 text-blue-400 bg-blue-900/20" : "border-red-600 text-red-400 bg-red-900/20"
            }>
              {shipment.status}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <span className="font-semibold text-white">Cliente:</span>{" "}
              <span className="text-gray-200">{shipment.customer}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Orden:</span>{" "}
              <span className="text-gray-200">{shipment.order_id}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Transportista:</span>{" "}
              <span className="text-gray-200">{shipment.carrier || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-white">Tracking:</span>{" "}
              <span className="text-gray-200">{shipment.tracking_number || "—"}</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm items-center">
            <MapPin className="h-4 w-4" color="white" />
            <span>
              <span className="font-semibold text-white">Origen:</span>{" "}
              <span className="text-gray-200">{shipment.origin || "—"}</span>
            </span>
            <span className="text-gray-300">→</span>
            <MapPin className="h-4 w-4" color="white" />
            <span>
              <span className="font-semibold text-white">Destino:</span>{" "}
              <span className="text-gray-200">{shipment.destination || "—"}</span>
            </span>
          </div>
          <div className="flex gap-2 text-sm items-center">
            <Truck className="h-4 w-4" color="white" />
            <span>
              <span className="font-semibold text-white">Entrega estimada:</span>{" "}
              <span className="text-gray-200">{shipment.estimated_delivery ? new Date(shipment.estimated_delivery).toLocaleDateString() : "—"}</span>
            </span>
          </div>
          <div className="flex gap-2 text-sm items-center">
            <Package className="h-4 w-4" color="white" />
            <span>
              <span className="font-semibold text-white">Costo:</span>{" "}
              <span className="text-gray-200">€{shipment.cost != null ? shipment.cost.toFixed(2) : "—"}</span>
            </span>
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">Cerrar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
