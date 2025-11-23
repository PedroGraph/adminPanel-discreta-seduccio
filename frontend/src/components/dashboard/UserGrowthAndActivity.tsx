
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Activity as ActivityType } from "@/types/activity";
import { useI18n } from "@/hooks/use-i18n";
import { useLanguage } from "@/contexts/LanguageContext";

type UserGrowthData = {
  date: string;
  usuarios: number;
};

interface UserGrowthAndActivityProps {
  userGrowthData: UserGrowthData[];
  recentActivities: ActivityType[];
  isLoadingActivities: boolean;
}

export const UserGrowthAndActivity = ({ userGrowthData, recentActivities, isLoadingActivities }: UserGrowthAndActivityProps) => {
  const t = useI18n();
  const { language } = useLanguage();
  const dateLocale = language === "es" ? es : enUS;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-700 border-red-500 hover:bg-gray-600 transition-colors">
        <CardHeader>
          <CardTitle className="text-red-300 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("user_growth")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #EF4444',
                  borderRadius: '6px',
                  color: '#E5E7EB'
                }}
              />
              <Bar dataKey="usuarios" fill="#F87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-200 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("recent_activity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingActivities ? (
              <p className="text-purple-400">{t("loading_activity")}</p>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-black/20 mt-1">
                      <IconComponent className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="text-sm flex-1">
                      <div>
                        <span className="font-medium text-purple-100">{activity.user}</span>
                        <span className="text-muted-foreground mx-1">{t(activity.action.toLowerCase() as any)}</span>
                        <span className="font-medium text-purple-100 break-all">{activity.target}</span>
                      </div>
                      <p className="text-xs text-purple-500">{format(new Date(activity.timestamp), "d MMM yyyy, HH:mm", { locale: dateLocale })}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-purple-400 text-center py-4">{t("no_activity")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
