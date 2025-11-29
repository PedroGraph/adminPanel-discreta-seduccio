import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { Order, getOrders, getOrdersStats } from "@/services/orders.service";

type OrdersContextType = {
  orders: Order[];
  stats: any;
  isLoading: boolean;
  error: Error | null;
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string;
    date: string;
  };
  setFilters: (filters: any) => void;
  total: number;
  totalPages: number;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "all",
    date: "all",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
  });

  const { data: statsData } = useQuery({
    queryKey: ['orders-stats'],
    queryFn: getOrdersStats,
  });

  const orders = data?.orders || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;
  const stats = statsData || { total: 0, pending: 0, completed: 0, cancelled: 0 };

  const updateFilters = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      stats,
      isLoading,
      error: error as Error | null,
      filters,
      setFilters: updateFilters,
      total,
      totalPages
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
