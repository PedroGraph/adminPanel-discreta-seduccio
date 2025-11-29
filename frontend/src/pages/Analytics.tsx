import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Loader2, AlertCircle } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useAnalytics } from "@/hooks/use-analytics";

const PRODUCT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

export const Analytics = () => {
  const t = useI18n();
  const { data: analytics, isLoading, error } = useAnalytics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2 bg-gray-700" />
          <Skeleton className="h-6 w-96 bg-gray-700" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-700" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-[400px] rounded-xl bg-gray-700" />
          <Skeleton className="h-[400px] rounded-xl bg-gray-700" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Error al cargar las estadísticas</p>
          <p className="text-gray-500 text-sm">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const { statsCards, charts } = analytics;

  const topProductsWithColors = charts.topProducts.map((product, index) => ({
    ...product,
    color: PRODUCT_COLORS[index % PRODUCT_COLORS.length]
  }));

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t("analytics_title")}</h1>
        <p className="text-gray-400">{t("analytics_subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Ingresos */}
        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">{t("total_income")}</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(statsCards.revenue.total)}</div>
            <p className={`text-xs flex items-center mt-1 ${statsCards.revenue.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {statsCards.revenue.percentage >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {statsCards.revenue.percentage >= 0 ? '+' : ''}{statsCards.revenue.percentage}% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        {/* Órdenes */}
        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{t("orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(statsCards.orders.total)}</div>
            <p className={`text-xs flex items-center mt-1 ${statsCards.orders.percentage >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {statsCards.orders.percentage >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {statsCards.orders.percentage >= 0 ? '+' : ''}{statsCards.orders.percentage}% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        {/* Clientes Nuevos */}
        <Card className="bg-gray-700 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">{t("new_customers")}</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(statsCards.newCustomers.total)}</div>
            <p className={`text-xs flex items-center mt-1 ${statsCards.newCustomers.percentage >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              {statsCards.newCustomers.percentage >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {statsCards.newCustomers.percentage >= 0 ? '+' : ''}{statsCards.newCustomers.percentage}% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>

        {/* Productos Vendidos */}
        <Card className="bg-gray-700 border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">{t("sold_products")}</CardTitle>
            <Package className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(statsCards.productsSold.total)}</div>
            <p className={`text-xs flex items-center mt-1 ${statsCards.productsSold.percentage >= 0 ? 'text-orange-400' : 'text-red-400'}`}>
              {statsCards.productsSold.percentage >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {statsCards.productsSold.percentage >= 0 ? '+' : ''}{statsCards.productsSold.percentage}% vs {t("previous_month")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ventas por Mes */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">{t("sales_by_month")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.monthlySales}>
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
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="sales" name={t("sales")} fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productos Más Vendidos */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">{t("most_sold_products")}</CardTitle>
          </CardHeader>
          <CardContent>
            {topProductsWithColors.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProductsWithColors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantity"
                  >
                    {topProductsWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} unidades`, 'Cantidad']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No hay datos de productos vendidos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
