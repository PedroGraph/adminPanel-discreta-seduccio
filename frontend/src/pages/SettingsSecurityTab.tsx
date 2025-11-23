
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Shield } from "lucide-react";
import { useState } from "react";

export const SettingsSecurityTab = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <Card className="bg-gray-700 border-purple-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Shield className="h-5 w-5 text-purple-400" />
          Configuración de Seguridad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">Autenticación de Dos Factores</Label>
              <p className="text-sm text-purple-400">Requiere verificación adicional para iniciar sesión</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">Bloqueo por Intentos Fallidos</Label>
              <p className="text-sm text-purple-400">Bloquea cuentas después de varios intentos fallidos</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">Log de Actividades Detallado</Label>
              <p className="text-sm text-purple-400">Registra todas las acciones de los usuarios</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxAttempts" className="text-purple-300">Máximo Intentos de Login</Label>
            <Input id="maxAttempts" defaultValue="5" type="number"
              className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lockoutTime" className="text-purple-300">Tiempo de Bloqueo (minutos)</Label>
            <Input id="lockoutTime" defaultValue="30" type="number"
              className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="border-purple-600 text-purple-300"
          >
            Cambiar Contraseña
          </Button>
          {showPasswordFields && (
            <form className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="newpass" className="text-purple-300">Nueva contraseña</Label>
                <Input id="newpass" type="password" className="bg-gray-800 border-purple-700 text-purple-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmpass" className="text-purple-300">Confirma nueva contraseña</Label>
                <Input id="confirmpass" type="password" className="bg-gray-800 border-purple-700 text-purple-100" />
              </div>
              <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
                Guardar Contraseña
              </Button>
            </form>
          )}
        </div>

        <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
          <Save className="h-4 w-4 mr-2 text-purple-200" />
          Guardar Configuración de Seguridad
        </Button>
      </CardContent>
    </Card>
  );
};
