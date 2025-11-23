import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useShipments } from "@/hooks/useShipments";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
};
type Props = {
  orders: Order[];
};

const defaultForm = {
  order_id: "",
  customer: "",
  carrier: "",
  tracking_number: "",
  status: "Preparando" as "Preparando" | "En tránsito" | "Entregado" | "Problema",
  origin: "",
  destination: "",
  estimated_delivery: "",
  cost: ""
};

export const NewShipmentModal = ({ orders }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...defaultForm });

  const { createShipment } = useShipments();

  const handleOrderChange = (orderId: string) => {
    setForm(f => {
      const selectedOrder = orders.find(o => o.id === orderId);
      return {
        ...f,
        order_id: orderId,
        customer: selectedOrder?.customer_name || "",
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.order_id) {
      toast.error("Selecciona una orden.");
      return;
    }
    createShipment.mutate({
      id: "#SHP" + Date.now().toString().slice(-5),
      ...form,
      status: form.status as "Preparando" | "En tránsito" | "Entregado" | "Problema",
      estimated_delivery: form.estimated_delivery ? form.estimated_delivery : null,
      cost: Number(form.cost) || 0
    }, {
      onSuccess: () => {
        toast.success("Envío creado exitosamente.");
        setForm({ ...defaultForm });
        setOpen(false);
      },
      onError: () => {
        toast.error("Error al crear el envío.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground border border-primary hover:bg-primary/80 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Envío
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Nuevo Envío</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Orden</label>
            <Select value={form.order_id} onValueChange={handleOrderChange}>
              <SelectTrigger className="bg-gray-700 text-foreground border border-primary">
                <SelectValue placeholder="Selecciona una orden" />
              </SelectTrigger>
              <SelectContent>
                {orders.map(order =>
                  <SelectItem key={order.id} value={order.id}>
                    {order.id} - {order.customer_name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Transportista</label>
            <Input
              value={form.carrier}
              onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))}
              placeholder="DHL, UPS, etc."
              className="bg-gray-700 text-foreground border border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Tracking</label>
            <Input
              value={form.tracking_number}
              onChange={e => setForm(f => ({ ...f, tracking_number: e.target.value }))}
              placeholder="Código de seguimiento"
              className="bg-gray-700 text-foreground border border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Ruta / Origen</label>
            <Input
              value={form.origin}
              onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
              placeholder="Ciudad de origen"
              className="bg-gray-700 text-foreground border border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Destino</label>
            <Input
              value={form.destination}
              onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
              placeholder="Ciudad de destino"
              className="bg-gray-700 text-foreground border border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Entrega estimada</label>
            <Input
              type="date"
              value={form.estimated_delivery}
              onChange={e => setForm(f => ({ ...f, estimated_delivery: e.target.value }))}
              className="bg-gray-700 text-foreground border border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Costo (€)</label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="0.00"
              className="bg-gray-700 text-foreground border border-primary placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Estado</label>
            <Select value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val as "Preparando" | "En tránsito" | "Entregado" | "Problema" }))}>
              <SelectTrigger className="bg-gray-700 text-foreground border border-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preparando">Preparando</SelectItem>
                <SelectItem value="En tránsito">En tránsito</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Problema">Problema</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/80">
              Crear Envío
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="ml-2">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
