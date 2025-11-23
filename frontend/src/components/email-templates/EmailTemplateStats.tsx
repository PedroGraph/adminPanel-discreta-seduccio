
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailTemplateStats as StatsType } from "@/types/email-template";

interface EmailTemplateStatsProps {
  stats: StatsType;
}

export const EmailTemplateStats = ({ stats }: EmailTemplateStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Total Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-100">{stats.total}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Activos</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Tasa Apertura (Prom.)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-300">{stats.avgOpens.toFixed(1)}%</div>
        </CardContent>
      </Card>
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300">Tasa Clicks (Prom.)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">{stats.avgClicks.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
};
