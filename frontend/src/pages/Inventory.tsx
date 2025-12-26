
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Search
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { AddMovementModal } from "@/components/inventory/AddMovementModal";

import { useI18n } from "@/hooks/use-i18n";

export const Inventory = () => {
  const t = useI18n();
  const { products, movements, stats, loading, fetchInventory, createMovement } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyFilters = (search?: string, status?: string) => {
    const filterStatus = status || statusFilter;
    const filterSearch = search !== undefined ? search : searchTerm;
    let backendStatus = 'all';

    // Logic remains based on stable keys, but labels are translated
    if (filterStatus === 'in_stock') backendStatus = 'in_stock';
    else if (filterStatus === 'low_stock') backendStatus = 'low_stock';
    else if (filterStatus === 'out_of_stock') backendStatus = 'out_of_stock';

    fetchInventory({
      search: filterSearch || undefined,
      status: backendStatus
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    applyFilters(searchTerm, status);
  };

  const getStatusText = (item: typeof products[0]) => {
    const filters = t("inventory_filters") as any;
    if (item.current_stock === 0) return filters.out_of_stock;
    if (item.current_stock <= item.min_stock) return filters.low_stock;
    return filters.in_stock;
  };

  const getStatusColor = (status: string) => {
    const filters = t("inventory_filters") as any;
    if (status === filters.in_stock) return 'bg-green-600';
    if (status === filters.low_stock) return 'bg-yellow-600';
    if (status === filters.out_of_stock) return 'bg-red-600';
    return 'bg-gray-600';
  };

  const handleCardClick = (filterType: string) => {
    if (filterType !== statusFilter) {
      handleStatusFilterChange(filterType);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{t("inventory_title")}</h1>
          <p className="text-gray-400">{t("inventory_subtitle")}</p>
        </div>

        {/* Skeleton Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-700 border border-gray-600 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-40 bg-gray-600 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Real Filters */}
        <Card className="bg-gray-700 border-gray-600 mb-6">
          <CardHeader>
            <CardTitle className="text-white">{(t("inventory_filters") as any).title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={(t("inventory_filters") as any).search_placeholder}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8 bg-gray-800 border-gray-600 text-white"
                    disabled
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled className="text-sm text-black">
                  {(t("inventory_filters") as any).all} (0)
                </Button>
                <Button variant="outline" disabled className="text-sm text-black">
                  {(t("inventory_filters") as any).in_stock} (0)
                </Button>
                <Button variant="outline" disabled className="text-sm text-black">
                  {(t("inventory_filters") as any).low_stock} (0)
                </Button>
                <Button variant="outline" disabled className="text-sm text-black">
                  {(t("inventory_filters") as any).out_of_stock} (0)
                </Button>
              </div>
              <Button className="bg-purple-700 hover:bg-purple-600" disabled>
                <Plus className="h-4 w-4 mr-2" />
                {(t("inventory_filters") as any).add_movement}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Table and Movements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">{(t("inventory_table") as any).title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-600 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">{(t("inventory_movements") as any).title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-600 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const getStatusFilterLabel = (filter: string) => {
    const filters = t("inventory_filters") as any;
    switch (filter) {
      case 'in_stock': return filters.in_stock;
      case 'low_stock': return filters.low_stock;
      case 'out_of_stock': return filters.out_of_stock;
      default: return filters.all;
    }
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t("inventory_title")}</h1>
        <p className="text-gray-400">{t("inventory_subtitle")}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          className={`bg-gray-700 border-blue-500 transition-all ${statusFilter === 'all' ? 'ring-2 ring-blue-400 cursor-default' : 'cursor-pointer hover:bg-gray-600'}`}
          onClick={() => handleCardClick('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">{(t("inventory_stats") as any).total_value_label}</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-blue-400">{(t("inventory_stats") as any).total_value_sub}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gray-700 border-green-500 transition-all ${statusFilter === 'in_stock' ? 'ring-2 ring-green-400 cursor-default' : 'cursor-pointer hover:bg-gray-600'}`}
          onClick={() => handleCardClick('in_stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">{(t("inventory_stats") as any).in_stock_label}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.inStock}</div>
            <p className="text-xs text-green-400">{(t("inventory_stats") as any).in_stock_sub}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gray-700 border-yellow-500 transition-all ${statusFilter === 'low_stock' ? 'ring-2 ring-yellow-400 cursor-default' : 'cursor-pointer hover:bg-gray-600'}`}
          onClick={() => handleCardClick('low_stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">{(t("inventory_stats") as any).low_stock_label}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.lowStock}</div>
            <p className="text-xs text-yellow-400">{(t("inventory_stats") as any).low_stock_sub}</p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gray-700 border-red-500 transition-all ${statusFilter === 'out_of_stock' ? 'ring-2 ring-red-400 cursor-default' : 'cursor-pointer hover:bg-gray-600'}`}
          onClick={() => handleCardClick('out_of_stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-300">{(t("inventory_stats") as any).out_of_stock_label}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.outOfStock}</div>
            <p className="text-xs text-red-400">{(t("inventory_stats") as any).out_of_stock_sub}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardHeader>
          <CardTitle className="text-white">{(t("inventory_filters") as any).title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={(t("inventory_filters") as any).search_placeholder}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("all")}
                disabled={statusFilter === "all"}
                className={`text-sm ${statusFilter === "all" ? "cursor-not-allowed opacity-90 text-white" : "text-black"}`}
              >
                {(t("inventory_filters") as any).all} ({stats.inStock + stats.lowStock + stats.outOfStock})
              </Button>
              <Button
                variant={statusFilter === "in_stock" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("in_stock")}
                disabled={statusFilter === "in_stock"}
                className={`text-sm ${statusFilter === "in_stock" ? "cursor-not-allowed opacity-90 text-white" : "text-black"}`}
              >
                {(t("inventory_filters") as any).in_stock} ({stats.inStock})
              </Button>
              <Button
                variant={statusFilter === "low_stock" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("low_stock")}
                disabled={statusFilter === "low_stock"}
                className={`text-sm ${statusFilter === "low_stock" ? "cursor-not-allowed opacity-90 text-white" : "text-black"}`}
              >
                {(t("inventory_filters") as any).low_stock} ({stats.lowStock})
              </Button>
              <Button
                variant={statusFilter === "out_of_stock" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("out_of_stock")}
                disabled={statusFilter === "out_of_stock"}
                className={`text-sm ${statusFilter === "out_of_stock" ? "cursor-not-allowed opacity-90 text-white" : "text-black"}`}
              >
                {(t("inventory_filters") as any).out_of_stock} ({stats.outOfStock})
              </Button>
            </div>
            <Button
              className="bg-purple-700 hover:bg-purple-600"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {(t("inventory_filters") as any).add_movement}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">
                {(t("inventory_table") as any).title}
                {statusFilter !== 'all' && (
                  <span className="text-gray-400 font-normal ml-2">
                    - {(t("inventory_table") as any).filtered_by}: {getStatusFilterLabel(statusFilter)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left p-2 text-gray-300">{(t("inventory_table") as any).product}</th>
                      <th className="text-left p-2 text-gray-300">{(t("inventory_table") as any).sku}</th>
                      <th className="text-center p-2 text-gray-300">{(t("inventory_table") as any).current_stock}</th>
                      <th className="text-center p-2 text-gray-300">{(t("inventory_table") as any).min_max}</th>
                      <th className="text-center p-2 text-gray-300">{(t("inventory_table") as any).status}</th>
                      <th className="text-right p-2 text-gray-300">{(t("inventory_table") as any).value}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => {
                      const status = getStatusText(item);
                      return (
                        <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-600">
                          <td className="p-2">
                            <div>
                              <div className="font-medium text-white">{item.name}</div>
                              <div className="text-xs text-gray-400">{item.supplier}</div>
                            </div>
                          </td>
                          <td className="p-2 text-gray-300">{item.sku}</td>
                          <td className="p-2 text-center">
                            <span className={`font-bold ${item.current_stock <= item.min_stock ? 'text-red-400' : 'text-white'}`}>
                              {item.current_stock}
                            </span>
                          </td>
                          <td className="p-2 text-center text-gray-300">
                            {item.min_stock}/{item.max_stock}
                          </td>
                          <td className="p-2 text-center">
                            <Badge className={`text-white ${getStatusColor(status)}`}>
                              {status}
                            </Badge>
                          </td>
                          <td className="p-2 text-right text-white">
                            ${(item.current_stock * item.cost).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    {(t("inventory_table") as any).no_products}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white">{(t("inventory_movements") as any).title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movements.map((movement) => {
                  const product = products.find(p => p.id === movement.product_id);
                  const movementTypes = (t("inventory_movements") as any).types;
                  return (
                    <div key={movement.id} className="border-b border-gray-600 pb-3 last:border-b-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-white">
                          {product?.name || (t("inventory_movements") as any).product_deleted}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${movement.movement_type === 'entrada' ? 'bg-green-600' :
                          movement.movement_type === 'salida' ? 'bg-red-600' : 'bg-blue-600'
                          } text-white`}>
                          {movement.movement_type === 'entrada' ? '+' :
                            movement.movement_type === 'salida' ? '-' : '±'}{movement.quantity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{movement.reason}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(movement.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
                {movements.length === 0 && (
                  <div className="text-center py-4 text-gray-400">
                    {(t("inventory_movements") as any).no_movements}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onCreateMovement={createMovement}
      />
    </div>
  );
};
