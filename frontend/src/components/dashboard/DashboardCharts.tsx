
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useI18n } from "@/hooks/use-i18n";

type SalesData = {
  name: string;
  total_sales: number;
  total_orders: number;
};

interface DashboardChartsProps {
  salesData: SalesData[];
}

export const DashboardCharts = ({ salesData }: DashboardChartsProps) => {
  const t = useI18n();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-700 border-purple-700 hover:bg-gray-600 transition-colors">
        <CardHeader>
          <CardTitle className="text-purple-200">{t("sales_by_month")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #7C3AED',
                  borderRadius: '6px',
                  color: '#E5E7EB'
                }}
              />
              <Line
                type="monotone"
                dataKey="total_sales"
                name={t("total_sales")}
                stroke="#A855F7"
                strokeWidth={2}
                dot={{ fill: "#A855F7" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-green-600 hover:bg-gray-600 transition-colors">
        <CardHeader>
          <CardTitle className="text-purple-200">{t("orders_by_month")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374151',
                  border: '1px solid #10B981',
                  borderRadius: '6px',
                  color: '#E5E7EB'
                }}
              />
              <Bar dataKey="total_orders" name={t("total_orders")} fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
