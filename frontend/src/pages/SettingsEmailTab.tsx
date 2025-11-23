
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Mail } from "lucide-react";

export const SettingsEmailTab = () => (
  <Card className="bg-gray-700 border-purple-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-purple-100">
        <Mail className="h-5 w-5 text-purple-400" />
        Configuración SMTP
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="smtpHost" className="text-purple-300">Servidor SMTP</Label>
          <Input id="smtpHost" placeholder="smtp.gmail.com"
            className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="smtpPort" className="text-purple-300">Puerto</Label>
          <Input id="smtpPort" placeholder="587"
            className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="smtpUser" className="text-purple-300">Usuario</Label>
          <Input id="smtpUser" placeholder="tu-email@gmail.com"
            className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="smtpPass" className="text-purple-300">Contraseña</Label>
          <Input id="smtpPass" type="password" placeholder="••••••••"
            className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fromEmail" className="text-purple-300">Email Remitente</Label>
        <Input id="fromEmail" placeholder="noreply@miecommerce.com"
          className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="smtpSsl" />
        <Label htmlFor="smtpSsl" className="text-purple-300">Usar SSL/TLS</Label>
      </div>

      <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
        <Save className="h-4 w-4 mr-2 text-purple-200" />
        Guardar Configuración SMTP
      </Button>
    </CardContent>
  </Card>
);
