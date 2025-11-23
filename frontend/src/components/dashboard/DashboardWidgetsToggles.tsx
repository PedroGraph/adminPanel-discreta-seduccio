
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";

interface WidgetToggles {
  stats: boolean;
  charts: boolean;
  userGrowth: boolean;
  products: boolean;
  orders: boolean;
  email: boolean;
}

interface DashboardWidgetsTogglesProps {
  visibility: WidgetToggles;
  setVisibility: (widgets: WidgetToggles) => void;
}

export const DashboardWidgetsToggles = ({ visibility, setVisibility }: DashboardWidgetsTogglesProps) => {

  const t = useI18n();

  const handleToggle = (key: keyof WidgetToggles) => {
    setVisibility({
      ...visibility,
      [key]: !visibility[key]
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t("customize_dashboard_title") as string}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="stats"
              checked={visibility.stats}
              onCheckedChange={() => handleToggle('stats')}
            />
            <Label htmlFor="stats" className="text-sm">{t("statistics_switch") as string}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="charts"
              checked={visibility.charts}
              onCheckedChange={() => handleToggle('charts')}
            />
            <Label htmlFor="charts" className="text-sm">{t("charts_switch") as string}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="products"
              checked={visibility.products}
              onCheckedChange={() => handleToggle('products')}
            />
            <Label htmlFor="products" className="text-sm">{t("products_switch") as string}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="email"
              checked={visibility.email}
              onCheckedChange={() => handleToggle('email')}
            />
            <Label htmlFor="email" className="text-sm">{t("email_switch") as string}</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
