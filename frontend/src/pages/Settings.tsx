
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Mail, Shield, Bell, Palette, Globe } from "lucide-react";
import { useState } from "react";
// Se elimina useBranding y SettingsBrandingTab
import { SettingsGeneralTab } from "./SettingsGeneralTab";
import { SettingsEmailTab } from "./SettingsEmailTab";
import { SettingsSecurityTab } from "./SettingsSecurityTab";
import { SettingsNotificationsTab } from "./SettingsNotificationsTab";

export const Settings = () => {
  // Se eliminan los estados de branding (logo, color, siteName, branding, updateBranding)
  const [language, setLanguage] = useState("es");

  // Security (Change password, 2FA toggle)
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">Configuración</h1>
        <p className="text-purple-400">Gestiona la configuración del sistema</p>
      </div>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full h-auto grid-cols-2 sm:grid-cols-4 bg-gray-800 text-purple-300 border border-purple-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">General</TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">Email SMTP</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">Notificaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <SettingsGeneralTab />
        </TabsContent>
        {/* Se elimina completamente la TabsContent de branding */}
        <TabsContent value="email">
          <SettingsEmailTab />
        </TabsContent>
        <TabsContent value="security">
          <SettingsSecurityTab />
        </TabsContent>
        <TabsContent value="notifications">
          <SettingsNotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

