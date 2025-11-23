
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Package } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Props = {
  open: boolean;
  shipment: Tables<"shipments"> | null;
  onClose: () => void;
};

export function ShipmentTrackingModal({ open, shipment, onClose }: Props) {
  if (!shipment) return null;

  // Simula un "timeline" sencillo de tracking (se podría mejorar agregando eventos en el futuro)
  const statusSteps = [
    { label: "Preparando", color: "text-blue-400" },
    { label: "En tránsito", color: "text-blue-400" },
    { label: "Entregado", color: "text-green-400" }
  ];

  let currentIndex = statusSteps.findIndex(x => x.label === shipment.status);
  currentIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="bg-gray-800 border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-white">Tracking del Envío</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-white font-semibold text-xl flex items-center gap-2">
            <Package className="h-5 w-5" color="white" /> {shipment.tracking_number || shipment.id}
          </div>
          <div className="flex flex-col gap-4 py-3">
            {statusSteps.map((step, i) => (
              <div
                key={step.label}
                className={`flex items-center gap-3 ${i <= currentIndex ? step.color : "text-gray-400"}`}
              >
                <div className="flex-shrink-0">
                  {i === 0
                    ? <MapPin className="h-5 w-5" color="white" />
                    : i === 1
                    ? <Truck className="h-5 w-5" color="white" />
                    : <Package className="h-5 w-5" color="white" />}
                </div>
                <div className={`flex-1 font-bold ${i <= currentIndex ? "text-white" : "text-gray-400"}`}>{step.label}</div>
                {i === currentIndex && (
                  <span className="text-xs ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded">Actual</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-gray-200 text-sm mt-2">
            <b className="text-white">Destino:</b> <span className="text-white">{shipment.destination || "—"}</span>
          </div>
          {shipment.estimated_delivery && (
            <div className="text-gray-200 text-sm">
              <b className="text-white">Entrega estimada:</b> <span className="text-white">{new Date(shipment.estimated_delivery).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button variant="secondary" className="mt-4">Cerrar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
