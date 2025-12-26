import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SettingsGeneralTab } from "./SettingsGeneralTab";
import { SettingsEmailTab } from "./SettingsEmailTab";
import { SettingsSecurityTab } from "./SettingsSecurityTab";
import { SettingsNotificationsTab } from "./SettingsNotificationsTab";
import { useI18n } from "@/hooks/use-i18n";

export const Settings = () => {
  const t = useI18n();
  const tabs = t("settings_tabs") as any;
  const [language, setLanguage] = useState("es");

  // Security (Change password, 2FA toggle)
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-200">{t("settings_title")}</h1>
        <p className="text-purple-400">{t("settings_subtitle")}</p>
      </div>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full h-auto grid-cols-2 sm:grid-cols-4 bg-gray-800 text-purple-300 border border-purple-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">{tabs.general}</TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">{tabs.email}</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">{tabs.security}</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-700 data-[state=active]:text-purple-100">{tabs.notifications}</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <SettingsGeneralTab />
        </TabsContent>
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

