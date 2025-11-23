import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "./UsersProvider";
import { Enums } from "@/integrations/supabase/types";
import { useI18n } from "@/hooks/use-i18n";

export const EditUserModal = () => {
  const { isEditModalOpen, setIsEditModalOpen, selectedUser, updateUser } = useUsers();
  const t = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "employee" as 'admin' | 'manager' | 'employee',
    status: "active" as 'active' | 'inactive',
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      });
    }
  }, [selectedUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role || !selectedUser) return;

    updateUser(selectedUser.id, formData);
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle className="text-purple-200">{(t("user_edit") as any).title}</DialogTitle>
          <DialogDescription className="text-purple-400">
            {(t("user_edit") as any).subtitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right text-purple-300">
                {(t("user_edit") as any).name}
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3 bg-gray-700 border-purple-600 text-purple-100"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right text-purple-300">
                {(t("user_edit") as any).email}
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3 bg-gray-700 border-purple-600 text-purple-100"
                placeholder="usuario@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right text-purple-300">
                {(t("user_edit") as any).role}
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'admin' | 'manager' | 'employee' }))}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-purple-600 text-purple-100">
                  <SelectValue placeholder={(t("user_edit") as any).role} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700">
                  <SelectItem value="admin" className="text-red-300 hover:bg-red-900">Admin</SelectItem>
                  <SelectItem value="manager" className="text-blue-300 hover:bg-blue-900">Manager</SelectItem>
                  <SelectItem value="employee" className="text-green-300 hover:bg-green-900">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right text-purple-300">
                {(t("user_edit") as any).status}
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-purple-600 text-purple-100">
                  <SelectValue placeholder={(t("user_edit") as any).status} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700">
                  <SelectItem value="active" className="text-green-300 hover:bg-green-900">{(t("active") as any)}</SelectItem>
                  <SelectItem value="inactive" className="text-red-300 hover:bg-red-900">{(t("inactive") as any)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-purple-600 text-purple-300 hover:bg-purple-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-purple-100"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
