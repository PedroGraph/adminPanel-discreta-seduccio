import { useState } from "react";
import { useReturns } from "./ReturnsProvider";
import { ReturnsStats } from "./ReturnsStats";
import { ReturnsFilters } from "./ReturnsFilters";
import { ReturnsTable } from "./ReturnsTable";
import { CreateReturnModal } from "./CreateReturnModal";
import { ReturnDetailModal } from "./ReturnDetailModal";
import { Return } from "@/types/return";

export const ReturnsContent = () => {
  const { returns, isLoading } = useReturns();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredReturns = returns.filter((returnItem) => {
    const matchesSearch =
      returnItem.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || returnItem.status === statusFilter;
    // El campo type no existe en el Return principal, está en return_items
    const matchesType = typeFilter === "all";

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (returnItem: Return) => {
    console.log("Aprobar devolución:", returnItem.id);
    // Implementar lógica de aprobación
  };

  const handleReject = (returnItem: Return) => {
    console.log("Rechazar devolución:", returnItem.id);
    // Implementar lógica de rechazo
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <>
      <ReturnsStats
        onStatusFilter={handleStatusFilter}
        currentFilter={statusFilter}
      />

      <ReturnsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <ReturnsTable
        returns={filteredReturns}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <CreateReturnModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <ReturnDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        returnItem={selectedReturn}
      />
    </>
  );
};
