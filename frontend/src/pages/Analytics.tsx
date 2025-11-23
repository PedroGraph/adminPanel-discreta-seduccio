
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

const salesData = [
  { month: 'Ene', ventas: 12000, ordenes: 45 },
  { month: 'Feb', ventas: 15000, ordenes: 52 },
  { month: 'Mar', ventas: 18000, ordenes: 61 },
  { month: 'Abr', ventas: 22000, ordenes: 78 },
  { month: 'May', ventas: 25000, ordenes: 85 },
  { month: 'Jun', ventas: 28000, ordenes: 92 },
];

const topProducts = [
  { name: 'Smartphone Galaxy S24', value: 35, color: '#8884d8' },
  { name: 'Laptop Dell XPS 13', value: 25, color: '#82ca9d' },
  { name: 'Auriculares Bluetooth', value: 20, color: '#ffc658' },
  { name: 'Reloj Inteligente', value: 15, color: '#ff7300' },
  { name: 'Otros', value: 5, color: '#0088fe' },
];

const conversionData = [
  { dia: 'Lun', visitantes: 1200, conversiones: 36 },
  { dia: 'Mar', visitantes: 1100, conversiones: 44 },
  { dia: 'Mié', visitantes: 1300, conversiones: 52 },
  { dia: 'Jue', visitantes: 1450, conversiones: 58 },
  { dia: 'Vie', visitantes: 1600, conversiones: 64 },
  { dia: 'Sáb', visitantes: 1800, conversiones: 72 },
  { dia: 'Dom', visitantes: 1400, conversiones: 42 },
];

export const Analytics = () => {
  const t = useI18n();
  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t("analytics_title")}</h1>
        <p className="text-gray-400">{t("analytics_subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">{t("total_income")}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$145,230</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-blue-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{t("new_customers")}</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">342</div>
            <p className="text-xs text-red-400 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">{t("sold_products")}</CardTitle>
            <Package className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,847</div>
            <p className="text-xs text-orange-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">{t("sales_by_month")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#374151',
                    border: '1px solid #6B7280',
                    borderRadius: '6px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="ventas" name={t("sales")} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">{t("most_sold_products")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">{t("weekly_conversion_rate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dia" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#374151',
                    border: '1px solid #6B7280',
                    borderRadius: '6px',
                    color: '#F3F4F6'
                  }}
                />
                <Line type="monotone" dataKey="visitantes" stroke="#60A5FA" strokeWidth={2} />
                <Line type="monotone" dataKey="conversiones" stroke="#34D399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
