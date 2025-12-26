
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

import { useI18n } from "@/hooks/use-i18n";

export const OrdersTableFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}: OrdersTableFiltersProps) => {
  const t = useI18n();
  const filters = t("orders_filters") as any;

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder={filters.search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={filters.status} className="text-purple-300" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{filters.all_status}</SelectItem>
            <SelectItem value="pending" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">{filters.pending}</SelectItem>
            <SelectItem value="processing" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">{filters.processing}</SelectItem>
            <SelectItem value="shipped" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">{filters.shipped}</SelectItem>
            <SelectItem value="delivered" className="text-green-300 hover:bg-green-900 focus:bg-green-900">{filters.delivered}</SelectItem>
            <SelectItem value="cancelled" className="text-red-300 hover:bg-red-900 focus:bg-red-900">{filters.cancelled}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={filters.date} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{filters.all_dates}</SelectItem>
            <SelectItem value="today" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{filters.today}</SelectItem>
            <SelectItem value="week" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{filters.week}</SelectItem>
            <SelectItem value="month" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{filters.month}</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="bg-gray-800 border-purple-700 text-white hover:bg-purple-900 hover:text-white focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
