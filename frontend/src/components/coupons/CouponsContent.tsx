import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponsStats } from "./CouponsStats";
import { CouponsFilters } from "./CouponsFilters";
import { CouponsTable } from "./CouponsTable";
import { CouponDetailModal } from "./CouponDetailModal";
import { useCoupons } from "./CouponsProvider";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const CouponsContent = () => {
  const {
    filteredCoupons,
    coupons,
    stats,
    searchTerm,
    statusFilter,
    typeFilter,
    selectedCoupon,
    isDetailModalOpen,
    setSearchTerm,
    setStatusFilter,
    setTypeFilter,
    setIsDetailModalOpen,
    fetchCoupons,
    handleViewDetails,
    handleEdit,
    handleDelete,
  } = useCoupons();

  // CSV export function
  const handleExportCSV = () => {
    const csv = [
      ["ID", "Nombre", "Tipo", "Valor", "Mín. Pedido", "Máx. Descuento", "Estado"],
      ...filteredCoupons.map(c =>
        [
          c.id, c.name, c.type, c.value, c.min_order, c.max_discount, c.status,
        ]
      ),
    ].map(arr => arr.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "cupones.csv";
    link.click();
  };

  return (
    <>
      <CouponsStats stats={stats} />

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-200 flex justify-between items-center">
            Filtros
            <Button
              variant="outline"
              className="border-[#333364] text-green-300 hover:bg-gray-800 hover:border-green-400"
              onClick={handleExportCSV}
            >
              <FileText className="h-4 w-4 mr-1" /> Exportar CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CouponsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            onRefresh={fetchCoupons}
          />
        </CardContent>
      </Card>

      <Card className="bg-gray-700 border-purple-700">
        <CardHeader>
          <CardTitle className="text-purple-200">
            Cupones ({filteredCoupons.length} de {coupons.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CouponsTable
            coupons={filteredCoupons}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CouponDetailModal
        coupon={selectedCoupon}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};
