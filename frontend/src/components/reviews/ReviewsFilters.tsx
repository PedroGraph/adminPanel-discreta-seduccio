
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw } from "lucide-react";

interface ReviewsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  ratingFilter: string;
  onRatingFilterChange: (value: string) => void;
  onRefresh: () => void;
}

export const ReviewsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  ratingFilter,
  onRatingFilterChange,
  onRefresh
}: ReviewsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por producto, cliente o comentario..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-700 border-purple-700 text-purple-100 placeholder-gray-400"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px] bg-gray-700 border-purple-700 text-purple-100">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-purple-700">
          <SelectItem value="all" className="text-purple-100">Todos los estados</SelectItem>
          <SelectItem value="pending" className="text-yellow-400">Pendientes</SelectItem>
          <SelectItem value="approved" className="text-green-400">Aprobadas</SelectItem>
          <SelectItem value="rejected" className="text-red-400">Rechazadas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ratingFilter} onValueChange={onRatingFilterChange}>
        <SelectTrigger className="w-[150px] bg-gray-700 border-purple-700 text-purple-100">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-purple-700">
          <SelectItem value="all" className="text-purple-100">Todas las estrellas</SelectItem>
          <SelectItem value="5" className="text-purple-100">⭐⭐⭐⭐⭐</SelectItem>
          <SelectItem value="4" className="text-purple-100">⭐⭐⭐⭐</SelectItem>
          <SelectItem value="3" className="text-purple-100">⭐⭐⭐</SelectItem>
          <SelectItem value="2" className="text-purple-100">⭐⭐</SelectItem>
          <SelectItem value="1" className="text-purple-100">⭐</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={onRefresh}
        variant="outline"
        size="icon"
        className="bg-gray-700 border-purple-700 text-purple-300 hover:bg-gray-600"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
