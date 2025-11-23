import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface StatsCardsProps {
  stats: {
    sales: {
      total: number;
      percentage: number;
    };
    orders: {
      total: number;
      percentage: number;
    };
  } | null;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const t = useI18n();

  if (!stats) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const renderPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? "text-green-400" : "text-red-400";

    return (
      <div className={`flex items-center text-xs ${colorClass}`}>
        <Icon className="h-3 w-3 mr-1" />
        {isPositive ? '+' : ''}{percentage}% vs {t("previous_month")}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">{t("total_sales")}</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{formatCurrency(stats.sales.total)}</div>
          {renderPercentage(stats.sales.percentage)}
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 hover:shadow-lg transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-300">{t("total_orders")}</CardTitle>
          <ShoppingCart className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.orders.total}</div>
          {renderPercentage(stats.orders.percentage)}
        </CardContent>
      </Card>
    </div>
  );
};
