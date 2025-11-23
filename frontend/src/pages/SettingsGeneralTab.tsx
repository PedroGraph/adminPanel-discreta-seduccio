
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Palette, Globe } from "lucide-react";
import { useState } from "react";

export const SettingsGeneralTab = () => {
  const [language, setLanguage] = useState("es");

  return (
    <>
      <div className="mb-4">
        <Label htmlFor="language" className="text-purple-300 flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-400" /> Idioma
        </Label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 border border-purple-700 text-purple-100 rounded mt-1"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Palette className="h-5 w-5 text-purple-400" />
            Configuración General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-purple-300">Nombre del Sitio</Label>
              <Input id="siteName" defaultValue="Mi Ecommerce"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl" className="text-purple-300">URL del Sitio</Label>
              <Input id="siteUrl" defaultValue="https://miecommerce.com"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">Descripción</Label>
            <Textarea 
              id="description" 
              defaultValue="La mejor tienda online para todos tus productos favoritos"
              className="min-h-20 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-purple-300">Moneda</Label>
              <Input id="currency" defaultValue="USD"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-purple-300">Zona Horaria</Label>
              <Input id="timezone" defaultValue="America/Mexico_City"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
            <Save className="h-4 w-4 mr-2 text-purple-200" />
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
