
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupport, SupportTicket } from "@/hooks/useSupport";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TicketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

export const TicketDetailModal = ({ open, onOpenChange, ticket }: TicketDetailModalProps) => {
  const { updateTicket } = useSupport();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(ticket?.status || "Abierto");
  const [assignedTo, setAssignedTo] = useState(ticket?.assigned_to || "");
  const [response, setResponse] = useState("");

  const handleUpdate = async () => {
    if (!ticket) return;

    setLoading(true);
    const success = await updateTicket(ticket.id, {
      status,
      assigned_to: assignedTo || null,
    });

    if (success) {
      onOpenChange(false);
    }
    setLoading(false);
  };

  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Abierto': return 'bg-red-600';
      case 'En Progreso': return 'bg-yellow-600';
      case 'Resuelto': return 'bg-green-600';
      case 'Cerrado': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-600';
      case 'Media': return 'bg-yellow-600';
      case 'Baja': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Detalles del Ticket #{ticket.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
              <p className="text-gray-400">Cliente: {ticket.customer_name}</p>
              <p className="text-gray-400">Email: {ticket.customer_email}</p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <Badge className={`text-white ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </Badge>
                <Badge className={`text-white ${getPriorityColor(ticket.priority)} ml-2`}>
                  {ticket.priority}
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Creado: {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-white">Descripción:</Label>
            <div className="mt-2 p-3 bg-gray-800 border border-gray-600 rounded text-gray-300">
              {ticket.description}
            </div>
          </div>

          {/* Update Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-white">Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Abierto" className="text-white hover:bg-gray-700 focus:bg-gray-700">Abierto</SelectItem>
                  <SelectItem value="En Progreso" className="text-white hover:bg-gray-700 focus:bg-gray-700">En Progreso</SelectItem>
                  <SelectItem value="Resuelto" className="text-white hover:bg-gray-700 focus:bg-gray-700">Resuelto</SelectItem>
                  <SelectItem value="Cerrado" className="text-white hover:bg-gray-700 focus:bg-gray-700">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assigned_to" className="text-white">Asignado a</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Seleccionar agente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="none" className="text-white hover:bg-gray-700 focus:bg-gray-700">Sin asignar</SelectItem>
                  <SelectItem value="Juan Pérez" className="text-white hover:bg-gray-700 focus:bg-gray-700">Juan Pérez</SelectItem>
                  <SelectItem value="María García" className="text-white hover:bg-gray-700 focus:bg-gray-700">María García</SelectItem>
                  <SelectItem value="Carlos López" className="text-white hover:bg-gray-700 focus:bg-gray-700">Carlos López</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Response */}
          <div>
            <Label htmlFor="response" className="text-white">Respuesta al cliente</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              placeholder="Escribir respuesta..."
              className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700">
              Cerrar
            </Button>
            <Button type="button" onClick={handleUpdate} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? "Actualizando..." : "Actualizar Ticket"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
