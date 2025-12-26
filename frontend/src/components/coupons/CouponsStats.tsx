import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CouponStats } from "@/services/coupons.service";

interface CouponsStatsProps {
  stats: CouponStats;
}

export const CouponsStats = ({ stats }: CouponsStatsProps) => {
  const t = useI18n();
  const tr = t("coupons_stats") as any;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">{tr.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.total}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-300">{tr.active}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-blue-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-300">{tr.usage_month}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{stats.totalUsage}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-red-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-300">{tr.total_savings}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">${stats.totalSavings.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};
