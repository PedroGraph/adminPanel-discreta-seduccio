
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw } from "lucide-react";

interface CouponsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  onRefresh: () => void;
}

export const CouponsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onRefresh,
}: CouponsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder="Buscar cupones por código, nombre o categoría..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todos</SelectItem>
            <SelectItem value="active" className="text-green-300 hover:bg-green-900 focus:bg-green-900">Activo</SelectItem>
            <SelectItem value="inactive" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Inactivo</SelectItem>
            <SelectItem value="expired" className="text-red-300 hover:bg-red-900 focus:bg-red-900">Expirado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Todos los tipos</SelectItem>
            <SelectItem value="percentage" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Porcentaje</SelectItem>
            <SelectItem value="fixed" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Fijo</SelectItem>
            <SelectItem value="free_shipping" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">Envío Gratis</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
