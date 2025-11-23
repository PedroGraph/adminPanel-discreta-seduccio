
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useUsers } from "./UsersProvider";
import { useI18n } from "@/hooks/use-i18n";

export const UsersFilters = () => {
  const t = useI18n();
  const {
    searchTerm,
    roleFilter,
    statusFilter,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
  } = useUsers();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder={t("search_users") as string}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-400 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={t("roles") as string} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{t("all_roles") as string}</SelectItem>
            <SelectItem value="Admin" className="text-red-300 hover:bg-red-900 focus:bg-red-900">Admin</SelectItem>
            <SelectItem value="Editor" className="text-blue-300 hover:bg-blue-900 focus:bg-blue-900">Editor</SelectItem>
            <SelectItem value="Viewer" className="text-green-300 hover:bg-green-900 focus:bg-green-900">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-purple-700 text-purple-200 focus:ring-2 focus:ring-purple-700 hover:border-purple-600 transition-colors">
            <SelectValue placeholder={t("status") as string} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-purple-100 border-purple-700 z-30">
            <SelectItem value="all" className="text-purple-200 hover:bg-purple-900 focus:bg-purple-900">{t("all_status") as string}</SelectItem>
            <SelectItem value="Activo" className="text-green-300 hover:bg-green-900 focus:bg-green-900">{t("active") as string}</SelectItem>
            <SelectItem value="Inactivo" className="text-red-300 hover:bg-red-900 focus:bg-red-900">{t("inactive") as string}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900 hover:text-purple-300 focus:ring-2 focus:ring-purple-700 transition-colors">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
