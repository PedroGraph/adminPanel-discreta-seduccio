
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CouponStats } from "@/types/coupon";

interface CouponsStatsProps {
  stats: CouponStats;
}

export const CouponsStats = ({ stats }: CouponsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Total Cupones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.total}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-300">Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-blue-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-300">Usos Este Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{stats.totalUsage}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-red-600 hover:bg-gray-600 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-300">Ahorro Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">${stats.totalSavings.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};
