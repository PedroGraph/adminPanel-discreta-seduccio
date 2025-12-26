import { OrdersProvider } from "@/components/orders/OrdersProvider";
import { OrdersContent } from "@/components/orders/OrdersContent";

import { useI18n } from "@/hooks/use-i18n";

const Orders = () => {
  const t = useI18n();
  return (
    <OrdersProvider>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-100">{t("orders_title")}</h1>
        </div>

        <OrdersContent />
      </div>
    </OrdersProvider>
  );
};

export default Orders;
