
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Undo2, TicketPercent } from 'lucide-react';
import { useI18n } from "@/hooks/use-i18n";

const recentlyAddedProducts = [
  { id: 'PROD-015', name: 'Auriculares Inalámbricos Pro', imageUrl: '/placeholder.svg', dateAdded: 'Hace 2 horas' },
  { id: 'PROD-089', name: 'Teclado Mecánico RGB', imageUrl: '/placeholder.svg', dateAdded: 'Ayer' },
  { id: 'PROD-102', name: 'Monitor Curvo 27"', imageUrl: '/placeholder.svg', dateAdded: 'Hace 3 días' },
];

const pendingReturns = [
  { orderId: '#ORD005', customer: 'Luisa Fernandez', reason: 'Producto incorrecto' },
  { orderId: '#ORD007', customer: 'Mario Gomez', reason: 'Dañado en el envío' },
];

const expiringCoupons = [
  { code: 'VERANO20', discount: '20% Descuento', expiresIn: '5' },
  { code: 'FLASH10', discount: '10€ Descuento', expiresIn: '22' },
];

export const InfoGrid = () => {
  const t = useI18n();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-purple-200 flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("recent_products")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentlyAddedProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-md bg-gray-800" />
                <div>
                  <p className="font-medium text-purple-100 text-sm">{product.name}</p>
                  <p className="text-xs text-purple-400">{product.dateAdded}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yellow-300 flex items-center gap-2">
            <Undo2 className="h-5 w-5" />
            {t("pending_returns")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingReturns.map((item) => (
              <div key={item.orderId}>
                <p className="font-medium text-purple-100 text-sm">{item.orderId} - {item.customer}</p>
                <p className="text-xs text-purple-400">{item.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-red-500">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-400 flex items-center gap-2">
            <TicketPercent className="h-5 w-5" />
            {t("coupons_expiring")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expiringCoupons.map((coupon) => (
              <div key={coupon.code} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-purple-100 text-sm">{coupon.code}</p>
                  <p className="text-xs text-purple-400">{coupon.discount}</p>
                </div>
                <p className="text-sm text-red-400">{t("expiresIn")} {coupon.expiresIn} {t("hours")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
