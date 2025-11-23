
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, Eye } from "lucide-react";
import { useUsers } from "./UsersProvider";
import { formatReadableDate } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

export const UsersTable = () => {

  const t = useI18n();

  const {
    filteredUsers,
    setSelectedUser,
    setIsDetailModalOpen,
    setIsDeleteModalOpen,
    setIsEditModalOpen,
    isLoading
  } = useUsers();

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/5 bg-gray-600" />
              <Skeleton className="h-3 w-4/5 bg-gray-600" />
            </div>
            <Skeleton className="h-6 w-20 rounded-md bg-gray-600" />
            <Skeleton className="h-6 w-20 rounded-md bg-gray-600" />
            <Skeleton className="h-8 w-24 rounded-md bg-gray-600" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-600">
          <TableHead className="text-purple-300">{(t("user_header") as any).user}</TableHead>
          <TableHead className="text-purple-300">{(t("user_header") as any).role}</TableHead>
          <TableHead className="text-purple-300">{(t("user_header") as any).status}</TableHead>
          <TableHead className="text-purple-300">{(t("user_header") as any).last_login}</TableHead>
          <TableHead className="text-right text-purple-300">{(t("user_header") as any).actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user.id} className="hover:bg-gray-800 border-gray-600 transition-colors">
            <TableCell>
              <div>
                <div className="font-medium text-purple-100">{user.name}</div>
                <div className="text-sm text-purple-400">{user.email}</div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  user.role === "admin" ? "border-red-600 text-red-400 bg-red-900/20" :
                    user.role === "manager" ? "border-blue-600 text-blue-400 bg-blue-900/20" : "border-green-600 text-green-400 bg-green-900/20"
                }
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={user.status === "active" ? "border-green-600 text-green-400 bg-green-900/20" : "border-red-600 text-red-400 bg-red-900/20"}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell className="text-purple-100">{formatReadableDate(user.lastLogin)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(user)}
                  className="text-purple-400 hover:bg-purple-900 hover:text-purple-300 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(user)}
                  className="text-blue-400 hover:bg-blue-900 hover:text-blue-300 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(user)}
                  className="text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
