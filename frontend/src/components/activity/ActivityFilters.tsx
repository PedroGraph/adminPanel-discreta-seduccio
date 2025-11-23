
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

interface ActivityFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  userFilter: string;
  setUserFilter: (value: string) => void;
  uniqueCategories: string[];
  uniqueUsers: string[];
}

export const ActivityFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  userFilter,
  setUserFilter,
  uniqueCategories,
  uniqueUsers,
}: ActivityFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder="Buscar actividades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700">
            <SelectValue placeholder="Categoría" className="text-purple-300" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900">Todas las categorías</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category} className="text-purple-200 hover:bg-purple-900 capitalize">{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700">
            <SelectValue placeholder="Usuario" className="text-purple-300" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900">Todos los usuarios</SelectItem>
            {uniqueUsers.map(user => (
              <SelectItem key={user} value={user} className="text-purple-200 hover:bg-purple-900">{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 focus:ring-2 focus:ring-purple-700">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
