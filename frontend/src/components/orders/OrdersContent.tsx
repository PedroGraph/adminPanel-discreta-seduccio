import { useState, useMemo } from "react";
import { useOrders } from "./OrdersProvider";
import { OrdersStats } from "./OrdersStats";
import { OrdersTableFilters } from "./OrdersTableFilters";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailModal } from "./OrderDetailModal";
import { OrderTrackingModal } from "./OrderTrackingModal";

export const OrdersContent = () => {
  const { orders, isLoading } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pendiente").length,
      completed: orders.filter((o) => o.status === "Completado").length,
      cancelled: orders.filter((o) => o.status === "Cancelado").length,
    };
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const orderDate = new Date(order.created_at);
        const today = new Date();
        const diffTime = today.getTime() - orderDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            matchesDate = diffDays === 0;
            break;
          case "week":
            matchesDate = diffDays <= 7;
            break;
          case "month":
            matchesDate = diffDays <= 30;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleViewTracking = (order: any) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <>
      <OrdersStats
        stats={stats}
        onStatusFilter={handleStatusFilter}
        currentFilter={statusFilter}
        isLoading={isLoading}
      />

      <OrdersTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <OrdersTable
        orders={filteredOrders}
        onViewDetails={handleViewDetails}
        onViewTracking={handleViewTracking}
      />

      <OrderDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        order={selectedOrder}
      />

      <OrderTrackingModal
        open={isTrackingModalOpen}
        onOpenChange={setIsTrackingModalOpen}
        order={selectedOrder}
      />
    </>
  );
};
