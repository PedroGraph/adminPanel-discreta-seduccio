import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from "lucide-react";
import { useUsers } from "./UsersProvider";
import { formatReadableDate } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

export const UserDetailModal = () => {
  const { isDetailModalOpen, setIsDetailModalOpen, selectedUser } = useUsers();
  const t = useI18n();

  if (!selectedUser) return null;

  return (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-purple-200 flex items-center gap-2">
            <User className="h-5 w-5" />
            {(t("user_details") as any).title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8 text-purple-200" />
            </div>
            <h3 className="text-xl font-semibold text-purple-100">{selectedUser.name}</h3>
            <p className="text-purple-400">{selectedUser.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-300">{(t("user_details") as any).role}</span>
              <Badge
                variant="outline"
                className={
                  selectedUser.role === "Admin" ? "border-red-600 text-red-400 bg-red-900/20" :
                    selectedUser.role === "Editor" ? "border-blue-600 text-blue-400 bg-blue-900/20" : "border-green-600 text-green-400 bg-green-900/20"
                }
              >
                {selectedUser.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-300">{(t("user_details") as any).status}</span>
              <Badge
                variant="outline"
                className={selectedUser.status === "Activo" ? "border-green-600 text-green-400 bg-green-900/20" : "border-red-600 text-red-400 bg-red-900/20"}
              >
                {selectedUser.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {(t("user_details") as any).last_login}
              </span>
              <span className="text-purple-100">{formatReadableDate(selectedUser.last_login)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {(t("user_details") as any).email}
              </span>
              <span className="text-purple-100 text-sm">{selectedUser.email}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
