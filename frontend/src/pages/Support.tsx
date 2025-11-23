
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Search,
  Plus
} from "lucide-react";
import { useSupport, SupportTicket } from "@/hooks/useSupport";
import { CreateTicketModal } from "@/components/support/CreateTicketModal";
import { TicketDetailModal } from "@/components/support/TicketDetailModal";

export const Support = () => {
  const { tickets, loading } = useSupport();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Cargando tickets...</div>
        </div>
      </div>
    );
  }

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Abierto').length;
  const inProgressTickets = tickets.filter(t => t.status === 'En Progreso').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resuelto').length;

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Soporte al Cliente</h1>
            <p className="text-gray-400">Gestión de tickets de soporte</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTickets}</div>
            <p className="text-xs text-blue-400">Todos los tickets</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-300">Abiertos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{openTickets}</div>
            <p className="text-xs text-red-400">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{inProgressTickets}</div>
            <p className="text-xs text-yellow-400">Siendo atendidos</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Resueltos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resolvedTickets}</div>
            <p className="text-xs text-green-400">Completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Filtros de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Bus  tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="Abierto">Abierto</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <Button 
                className="bg-purple-700 hover:bg-purple-600 text-white"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Lista de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">ID</th>
                  <th className="text-left p-3 text-gray-300">Título</th>
                  <th className="text-left p-3 text-gray-300">Cliente</th>
                  <th className="text-center p-3 text-gray-300">Prioridad</th>
                  <th className="text-center p-3 text-gray-300">Estado</th>
                  <th className="text-left p-3 text-gray-300">Asignado a</th>
                  <th className="text-center p-3 text-gray-300">Creado</th>
                  <th className="text-center p-3 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-3">
                      <span className="font-mono text-blue-400">#{ticket.id.slice(0, 8)}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-white">{ticket.title}</div>
                        <div className="text-xs text-gray-400">{ticket.category}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="text-white flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {ticket.customer_name}
                        </div>
                        <div className="text-xs text-gray-400">{ticket.customer_email}</div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`text-white ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`text-white ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-300">{ticket.assigned_to || "Sin asignar"}</td>
                    <td className="p-3 text-center text-gray-300">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron tickets
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateTicketModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
      <TicketDetailModal 
        open={!!selectedTicket} 
        onOpenChange={(open) => !open && setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
};
