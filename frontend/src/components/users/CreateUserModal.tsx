
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useToast } from "@/hooks/use-toast";
import { useUsers } from "./UsersProvider";
import { Enums } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

type FormData = {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | '';
  status: 'active' | 'inactive';
  password: string;
};

export const CreateUserModal = () => {
  const t = useI18n();
  const { toast } = useToast();
  const { isCreateModalOpen, setIsCreateModalOpen, addUser } = useUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    status: "active",
    password: "",
  });

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      toast({ title: "Campo requerido", description: "Por favor, selecciona un rol.", variant: "destructive" });
      return;
    }
    if (!formData.password) {
      toast({ title: "Campo requerido", description: "Por favor, genera o introduce una contraseña.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await addUser(formData as Omit<FormData, 'role'> & { role: 'admin' | 'manager' | 'employee' });
      toast({
        title: "Usuario Creado",
        description: `${formData.name} ha sido creado y notificado por correo.`,
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error al crear usuario",
        description: error.message || "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", role: "", status: "active", password: "" });
    setIsCreateModalOpen(false);
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-purple-700 text-purple-100">
        <DialogHeader>
          <DialogTitle className="text-purple-200">{(t("new_user") as any).title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-purple-300">
                {(t("new_user") as any).name}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3 bg-gray-700 border-purple-600 text-purple-100"
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-purple-300">
                {(t("new_user") as any).email}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3 bg-gray-700 border-purple-600 text-purple-100"
                placeholder="usuario@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right text-purple-300">
                {(t("new_user") as any).password}
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="password"
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-700 border-purple-600 text-purple-100"
                  placeholder="Contraseña temporal"
                  required
                />
                <Button type="button" variant="outline" size="sm" onClick={generatePassword} className="border-purple-600 text-purple-300 hover:bg-purple-900">
                  {(t("new_user") as any).generate_password}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-purple-300">
                {(t("new_user") as any).role}
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as 'admin' | 'manager' | 'employee' }))}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-purple-600 text-purple-100">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700">
                  <SelectItem value="admin" className="text-red-300 hover:bg-red-900">Admin</SelectItem>
                  <SelectItem value="manager" className="text-blue-300 hover:bg-blue-900">Manager</SelectItem>
                  <SelectItem value="employee" className="text-green-300 hover:bg-green-900">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-purple-300">
                {(t("new_user") as any).status}
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}>
                <SelectTrigger className="col-span-3 bg-gray-700 border-purple-600 text-purple-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700">
                  <SelectItem value="active" className="text-green-300 hover:bg-green-900">Activo</SelectItem>
                  <SelectItem value="inactive" className="text-red-300 hover:bg-red-900">Inactivo</SelectItem>
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
              disabled={isSubmitting}
            >
              {(t("new_user") as any).cancel}
            </Button>
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-600 text-purple-100 w-48"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? (t("new_user") as any).sending : (t("new_user") as any).send_credentials}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
