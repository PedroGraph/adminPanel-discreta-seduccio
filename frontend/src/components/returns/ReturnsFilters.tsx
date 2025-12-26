import { useI18n } from "@/hooks/use-i18n";
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
  const t = useI18n();
  const tr = t("returns_filters") as any;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder={tr.search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={tr.status} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{tr.all_status}</SelectItem>
            <SelectItem value="Pendiente" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">{tr.pending}</SelectItem>
            <SelectItem value="Procesando" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">{tr.processing}</SelectItem>
            <SelectItem value="Aprobado" className="text-green-300 hover:bg-green-900 focus:bg-green-900">{tr.approved}</SelectItem>
            <SelectItem value="Rechazado" className="text-red-300 hover:bg-red-900 focus:bg-red-900">{tr.rejected}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={tr.type} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{tr.all_types}</SelectItem>
            <SelectItem value="Reembolso" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{tr.refund}</SelectItem>
            <SelectItem value="Intercambio" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{tr.exchange}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
