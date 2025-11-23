
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Bell } from "lucide-react";

export const SettingsNotificationsTab = () => (
  <Card className="bg-gray-700 border-purple-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-purple-100">
        <Bell className="h-5 w-5 text-purple-400" />
        Configuración de Notificaciones
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-purple-300">Nuevas Órdenes</Label>
            <p className="text-sm text-purple-400">Notificar cuando se reciba una nueva orden</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-purple-300">Stock Bajo</Label>
            <p className="text-sm text-purple-400">Notificar cuando el stock esté bajo</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-purple-300">Nuevos Usuarios</Label>
            <p className="text-sm text-purple-400">Notificar cuando se registre un nuevo usuario</p>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-purple-300">Reseñas Nuevas</Label>
            <p className="text-sm text-purple-400">Notificar cuando se publique una nueva reseña</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notificationEmail" className="text-purple-300">Email para Notificaciones</Label>
        <Input id="notificationEmail" placeholder="admin@miecommerce.com"
          className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
      </div>

      <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
        <Save className="h-4 w-4 mr-2 text-purple-200" />
        Guardar Configuración de Notificaciones
      </Button>
    </CardContent>
  </Card>
);
