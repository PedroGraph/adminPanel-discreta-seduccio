import { useState, useMemo } from "react";
import { useOrders } from "./OrdersProvider";
import { OrdersStats } from "./OrdersStats";
import { OrdersTableFilters } from "./OrdersTableFilters";
import { OrdersTable } from "./OrdersTable";
import { OrderDetailModal } from "./OrderDetailModal";
import { OrderTrackingModal } from "./OrderTrackingModal";

export const OrdersContent = () => {
  const { orders, isLoading, stats, filters, setFilters } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Handlers for filters
  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value, page: 1 });
  };

  const handleDateChange = (value: string) => {
    setFilters({ date: value, page: 1 });
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleViewTracking = (order: any) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ status: status, page: 1 });
  };

  return (
    <>
      <OrdersStats
        stats={stats}
        onStatusFilter={handleStatusFilter}
        currentFilter={filters.status}
        isLoading={isLoading}
      />

      <OrdersTableFilters
        searchTerm={filters.search}
        setSearchTerm={handleSearchChange}
        statusFilter={filters.status}
        setStatusFilter={handleStatusChange}
        dateFilter={filters.date}
        setDateFilter={handleDateChange}
      />

      <OrdersTable
        orders={orders}
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
