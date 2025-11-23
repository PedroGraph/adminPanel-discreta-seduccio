
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, User } from "lucide-react";

export const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Administrador",
    email: "admin@ejemplo.com",
    role: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Guardando cambios del perfil:", formData);
    // Aquí iría la lógica para guardar los cambios
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">Mi Perfil</h1>
        <p className="text-purple-400">Gestiona tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <Card className="bg-gray-700 border-purple-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-100">
              <User className="h-5 w-5 text-purple-400" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-300">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-purple-300">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="bg-gray-800 border-purple-700 text-purple-100 focus:ring-2 focus:ring-purple-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700">
                  <SelectItem value="admin" className="text-purple-100 hover:bg-purple-800">Administrador</SelectItem>
                  <SelectItem value="manager" className="text-purple-100 hover:bg-purple-800">Gerente</SelectItem>
                  <SelectItem value="user" className="text-purple-100 hover:bg-purple-800">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Cambiar Contraseña */}
        <Card className="bg-gray-700 border-purple-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-100">
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-purple-300">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-purple-300">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-300">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
                placeholder="••••••••"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors"
        >
          <Save className="h-4 w-4 mr-2 text-purple-200" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};
