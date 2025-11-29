
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar } from "lucide-react";

interface OrdersTableFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
}

export const OrdersTableFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}: OrdersTableFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder="Buscar órdenes por ID, cliente o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder="Estado" className="text-purple-300" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todos los estados</SelectItem>
            <SelectItem value="pending" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Pendiente</SelectItem>
            <SelectItem value="processing" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Procesando</SelectItem>
            <SelectItem value="shipped" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Enviado</SelectItem>
            <SelectItem value="delivered" className="text-green-300 hover:bg-green-900 focus:bg-green-900">Completado</SelectItem>
            <SelectItem value="cancelled" className="text-red-300 hover:bg-red-900 focus:bg-red-900">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todas las fechas</SelectItem>
            <SelectItem value="today" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Hoy</SelectItem>
            <SelectItem value="week" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Esta semana</SelectItem>
            <SelectItem value="month" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Este mes</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="bg-gray-800 border-purple-700 text-white hover:bg-purple-900 hover:text-white focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
