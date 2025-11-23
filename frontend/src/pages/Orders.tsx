import { OrdersProvider } from "@/components/orders/OrdersProvider";
import { OrdersContent } from "@/components/orders/OrdersContent";

const Orders = () => {
  return (
    <OrdersProvider>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-100">Órdenes</h1>
        </div>

        <OrdersContent />
      </div>
    </OrdersProvider>
  );
};

export default Orders;
