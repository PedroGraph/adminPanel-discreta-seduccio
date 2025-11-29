import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivities } from "@/components/activity/ActivityProvider";
import { useUsers } from "@/components/users/UsersProvider";
import { format, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { UserGrowthAndActivity } from "@/components/dashboard/UserGrowthAndActivity";
import { InfoGrid } from "@/components/dashboard/InfoGrid";
import { ProductInfo } from "@/components/dashboard/ProductInfo";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardWidgetsToggles } from "@/components/dashboard/DashboardWidgetsToggles";
import { EmailMarketingWidget } from "@/components/dashboard/EmailMarketingWidget";
import { useI18n } from "@/hooks/use-i18n";
import * as DashboardService from "@/services/dashboard.service";

const DEFAULT_WIDGETS_STATE = {
  stats: true,
  charts: true,
  userGrowth: true,
  products: true,
  orders: true,
  email: true,
};

export const Dashboard = () => {
  const { activities, isLoading: isLoadingActivities } = useActivities();
  const { users } = useUsers();
  const t = useI18n();
  const [stats, setStats] = useState<DashboardService.DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [widgetsVisibility, setWidgetsVisibility] = useState(DEFAULT_WIDGETS_STATE);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentActivities = activities.slice(0, 5);

  const userGrowthData = useMemo(() => {
    if (!users || users.length === 0) return [];
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    const dailyCounts = last7Days.map(day => {
      const formattedDayStr = format(day, 'yyyy-MM-dd');
      const count = users.filter(user => format(parseISO(user.createdAt), 'yyyy-MM-dd') === formattedDayStr).length;
      return {
        date: format(day, 'dd MMM', { locale: es }),
        usuarios: count,
      };
    });
    return dailyCounts;
  }, [users]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <Skeleton className="h-9 w-64 mb-2 bg-gray-900/20" />
          <Skeleton className="h-6 w-96 bg-purple-900/20" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-gray-900/20" />
          ))}
        </div>

        {/* Widgets Toggles Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full bg-gray-900/20" />
          ))}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-900/20" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-xl bg-gray-900/20" />
          <Skeleton className="h-[400px] rounded-xl bg-gray-900/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-200">{t("dashboard_title") as string}</h1>
        <p className="text-purple-400">{t("dashboard_subtitle") as string}</p>
      </div>

      <QuickActions />

      <div>
        <DashboardWidgetsToggles
          visibility={widgetsVisibility}
          setVisibility={setWidgetsVisibility}
        />
      </div>

      {widgetsVisibility.stats && <StatsCards stats={stats?.stats_cards} />}
      {widgetsVisibility.charts && <DashboardCharts salesData={stats?.graphs || []} />}

      {widgetsVisibility.products && <ProductInfo products={stats?.products} />}
      {widgetsVisibility.email && (
        <div>
          <EmailMarketingWidget />
        </div>
      )}
    </div>
  );
};
