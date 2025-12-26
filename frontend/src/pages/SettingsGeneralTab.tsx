import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Palette, Globe } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useLanguage } from "@/contexts/LanguageContext";

export const SettingsGeneralTab = () => {
  const t = useI18n();
  const tr = t("settings_general") as any;
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <div className="mb-4">
        <Label htmlFor="language" className="text-purple-300 flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-400" /> {tr.language}
        </Label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
          className="bg-gray-800 border border-purple-700 text-purple-100 rounded mt-1 p-2 focus:ring-2 focus:ring-purple-700 outline-none"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-100">
            <Palette className="h-5 w-5 text-purple-400" />
            {tr.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-purple-300">{tr.site_name}</Label>
              <Input id="siteName" defaultValue="Mi Ecommerce"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl" className="text-purple-300">{tr.site_url}</Label>
              <Input id="siteUrl" defaultValue="https://miecommerce.com"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-300">{tr.description}</Label>
            <Textarea
              id="description"
              defaultValue="La mejor tienda online para todos tus productos favoritos"
              className="min-h-20 bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-purple-300">{tr.currency}</Label>
              <Input id="currency" defaultValue="USD"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-purple-300">{tr.timezone}</Label>
              <Input id="timezone" defaultValue="America/Mexico_City"
                className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
            </div>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
            <Save className="h-4 w-4 mr-2 text-purple-200" />
            {tr.save_button}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
