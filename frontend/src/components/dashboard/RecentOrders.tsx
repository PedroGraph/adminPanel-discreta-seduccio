import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RecentOrdersProps {
  orders: Array<{
    id: number;
    orderNumber: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }> | null;
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const t = useI18n();

  if (!orders) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'completado':
        return "border-green-600 text-green-400 bg-green-900/20";
      case 'shipped':
      case 'enviado':
        return "border-blue-600 text-blue-400 bg-blue-900/20";
      case 'processing':
      case 'procesando':
        return "border-yellow-600 text-yellow-400 bg-yellow-900/20";
      case 'cancelled':
      case 'cancelado':
        return "border-red-600 text-red-400 bg-red-900/20";
      default:
        return "border-gray-600 text-gray-400 bg-gray-900/20";
    }
  };

  return (
    <Card className="bg-gray-700 border-purple-700 mt-6">
      <CardHeader>
        <CardTitle className="text-purple-200">{t("recent_orders")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-purple-700 hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="font-medium text-purple-100">{order.orderNumber}</p>
                  <p className="text-sm text-purple-400">{order.customer}</p>
                  <p className="text-xs text-gray-400">{format(new Date(order.date), 'dd MMM yyyy', { locale: es })}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-purple-100">{formatCurrency(order.amount)}</span>
                <Badge
                  variant="outline"
                  className={getStatusColor(order.status)}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
