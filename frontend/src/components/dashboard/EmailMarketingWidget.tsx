
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";

const mockCampaigns = [
  { id: 1, name: "Promo Día del Padre", sent: "2025-06-09", emails: 1582, openRate: 42, clickRate: 10 },
  { id: 2, name: "Rebajas Verano", sent: "2025-06-01", emails: 2120, openRate: 37, clickRate: 7 },
];

export const EmailMarketingWidget = () => {
  const navigate = useNavigate();
  const t = useI18n();

  return (
    <Card className="bg-gray-700 border-pink-600">
      <CardHeader>
        <CardTitle className="text-pink-300 flex items-center gap-2">
          <Mail className="h-5 w-5" /> {t("email_marketing")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {mockCampaigns.map((c) => (
            <div key={c.id} className="flex justify-between items-center border-b border-gray-600 py-1">
              <div>
                <span className="font-medium text-purple-100">{c.name}</span>
                <span className="text-xs text-purple-400 ml-2">{c.sent}</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-green-400">{t("opened")}: {c.openRate}%</span>
                <span className="text-blue-400">{t("clicks")}: {c.clickRate}%</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          className="bg-pink-700 hover:bg-pink-600 border border-pink-500 text-pink-100 w-full"
          onClick={() => navigate("/email-templates")}
        >
          <Send className="mr-2" /> {t("send_newsletter")}
        </Button>
      </CardContent>
    </Card>
  );
};
