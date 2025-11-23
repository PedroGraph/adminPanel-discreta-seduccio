import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye, Truck, Package, MapPin } from "lucide-react";
import { useShipments } from "@/hooks/useShipments";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewShipmentModal } from "@/components/shipments/NewShipmentModal";
import { ShipmentDetailModal } from "@/components/shipments/ShipmentDetailModal";
import { ShipmentTrackingModal } from "@/components/shipments/ShipmentTrackingModal";
import { toast } from "sonner";

export const Shipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const { shipments, isLoading, error } = useShipments();

  // Estados para los modales:
  const [detailModal, setDetailModal] = useState<{ open: boolean; shipment: any }>({ open: false, shipment: null });
  const [trackingModal, setTrackingModal] = useState<{ open: boolean; shipment: any }>({ open: false, shipment: null });

  // Traer órdenes para asociar con un envío
  const { data: ordersData = [] } = useQuery({
    queryKey: ["orders-list-for-shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name");
      if (error) throw error;
      return data as { id: string; customer_name: string }[];
    }
  });

  // Filtrado con memorización
  const filteredShipments = useMemo(() =>
    shipments.filter(shipment => {
      const matchesSearch =
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
      const matchesCarrier = carrierFilter === "all" || shipment.carrier === carrierFilter;
      return matchesSearch && matchesStatus && matchesCarrier;
    }),
    [shipments, searchTerm, statusFilter, carrierFilter]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-200">Gestión de Envíos</h1>
          <p className="text-purple-400">Administra todos los envíos y su seguimiento</p>
        </div>
        <NewShipmentModal orders={ordersData} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Total Envíos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-100">{shipments.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-blue-600 hover:bg-gray-600 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">En Tránsito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {shipments.filter(s => s.status === "En tránsito").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Entregados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {shipments.filter(s => s.status === "Entregado").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-700 border-red-600 hover:bg-gray-600 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-300">Con Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {shipments.filter(s => s.status === "Problema").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <ShipmentDetailModal
        open={detailModal.open}
        shipment={detailModal.shipment}
        onClose={() => setDetailModal({ open: false, shipment: null })}
      />
      <ShipmentTrackingModal
        open={trackingModal.open}
        shipment={trackingModal.shipment}
        onClose={() => setTrackingModal({ open: false, shipment: null })}
      />

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              <Input
                placeholder="Buscar envíos por ID, orden, cliente o tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
                  <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todos los estados</SelectItem>
                  <SelectItem value="Preparando">Preparando</SelectItem>
                  <SelectItem value="En tránsito">En tránsito</SelectItem>
                  <SelectItem value="Entregado">Entregado</SelectItem>
                  <SelectItem value="Problema">Problema</SelectItem>
                </SelectContent>
              </Select>
              <Select value={carrierFilter} onValueChange={setCarrierFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
                  <SelectValue placeholder="Transportista" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
                  <SelectItem value="all">Todos</SelectItem>
                  {Array.from(new Set(shipments.map(s => s.carrier).filter(Boolean) as string[])).map(carrier =>
                    <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-purple-300 text-center py-6">Cargando envíos...</div>
          ) : error ? (
            <div className="text-red-400 text-center py-6">Error cargando envíos.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-purple-300">Envío</TableHead>
                  <TableHead className="text-purple-300">Orden</TableHead>
                  <TableHead className="text-purple-300">Cliente</TableHead>
                  <TableHead className="text-purple-300">Transportista</TableHead>
                  <TableHead className="text-purple-300">Tracking</TableHead>
                  <TableHead className="text-purple-300">Ruta</TableHead>
                  <TableHead className="text-purple-300">Estado</TableHead>
                  <TableHead className="text-purple-300">Costo</TableHead>
                  <TableHead className="text-right text-purple-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-gray-800 border-gray-600 transition-colors">
                    <TableCell className="font-medium text-purple-100">{shipment.id}</TableCell>
                    <TableCell className="text-purple-100">{shipment.order_id}</TableCell>
                    <TableCell className="text-purple-100">{shipment.customer}</TableCell>
                    <TableCell className="text-purple-100">{shipment.carrier}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm text-purple-300">{shipment.tracking_number}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-purple-100 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shipment.destination}
                        </div>
                        <div className="text-purple-400 text-xs">desde {shipment.origin}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          shipment.status === "Entregado" ? "border-green-600 text-green-400 bg-green-900/20" :
                          shipment.status === "En tránsito" ? "border-blue-600 text-blue-400 bg-blue-900/20" :
                          shipment.status === "Preparando" ? "border-blue-600 text-blue-400 bg-blue-900/20" : "border-red-600 text-red-400 bg-red-900/20"
                        }
                      >
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-purple-100">{shipment.cost != null ? `€${shipment.cost.toFixed(2)}` : "--"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:bg-purple-900 hover:text-purple-300 transition-colors"
                          onClick={() => setDetailModal({ open: true, shipment })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:bg-purple-900 hover:text-purple-300 transition-colors"
                          onClick={() => setTrackingModal({ open: true, shipment })}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
