
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface ReturnsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export const ReturnsFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: ReturnsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder="Buscar devoluciones por ID, orden, cliente o producto..."
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
            <SelectItem value="Pendiente" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Pendiente</SelectItem>
            <SelectItem value="Procesando" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Procesando</SelectItem>
            <SelectItem value="Aprobado" className="text-green-300 hover:bg-green-900 focus:bg-green-900">Aprobado</SelectItem>
            <SelectItem value="Rechazado" className="text-red-300 hover:bg-red-900 focus:bg-red-900">Rechazado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todos los tipos</SelectItem>
            <SelectItem value="Reembolso" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Reembolso</SelectItem>
            <SelectItem value="Intercambio" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Intercambio</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
