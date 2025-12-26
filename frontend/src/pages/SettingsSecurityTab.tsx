import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Shield } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/hooks/use-i18n";

export const SettingsSecurityTab = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const t = useI18n();
  const tr = t("settings_security") as any;

  return (
    <Card className="bg-gray-700 border-purple-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-100">
          <Shield className="h-5 w-5 text-purple-400" />
          {tr.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">{tr.two_factor}</Label>
              <p className="text-sm text-purple-400">{tr.two_factor_desc}</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">{tr.lockout}</Label>
              <p className="text-sm text-purple-400">{tr.lockout_desc}</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-purple-300">{tr.detailed_log}</Label>
              <p className="text-sm text-purple-400">{tr.detailed_log_desc}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxAttempts" className="text-purple-300">{tr.max_attempts}</Label>
            <Input id="maxAttempts" defaultValue="5" type="number"
              className="bg-gray-800 border-purple-700 text-purple-100 placeholder:text-purple-500 focus:ring-2 focus:ring-purple-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lockoutTime" className="text-purple-300">{tr.lockout_time}</Label>
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
            {tr.change_password}
          </Button>
          {showPasswordFields && (
            <form className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="newpass" className="text-purple-300">{tr.new_password}</Label>
                <Input id="newpass" type="password" className="bg-gray-800 border-purple-700 text-purple-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmpass" className="text-purple-300">{tr.confirm_password}</Label>
                <Input id="confirmpass" type="password" className="bg-gray-800 border-purple-700 text-purple-100" />
              </div>
              <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
                {tr.save_password}
              </Button>
            </form>
          )}
        </div>

        <Button className="bg-purple-700 hover:bg-purple-600 text-purple-100 border border-purple-500 transition-colors">
          <Save className="h-4 w-4 mr-2 text-purple-200" />
          {tr.save_button}
        </Button>
      </CardContent>
    </Card>
  );
};
