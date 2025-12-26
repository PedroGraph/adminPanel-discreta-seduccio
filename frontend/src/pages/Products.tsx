
import { useState } from "react";
import { ProductsProvider, useProducts } from "@/components/products/ProductsProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { AddProductModal } from "@/components/AddProductModal";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteProductModal } from "@/components/products/DeleteProductModal";
import { ProductsStatsSkeleton, ProductsTableSkeleton } from "@/components/products/ProductsSkeleton";
import { toast } from "sonner";

const ProductsContent = () => {
  const {
    products,
    filteredProducts,
    stats,
    pagination,
    currentPage,
    setCurrentPage,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    deleteProduct
  } = useProducts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  console.log(products)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-600';
      case 'inactive': return 'bg-red-600';
      case 'discontinued': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'Activo';
      case 'inactive': return 'Agotado';
      case 'discontinued': return 'Descontinuado';
      default: return status;
    }
  };

  // Removed early return for isLoading

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setShowDeleteModal(false);
        setSelectedProduct(null);
      } catch (error) {
        toast.error("Failed to delete product. Contact support.");
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Productos</h1>
        <p className="text-gray-400">Administra tu catálogo de productos</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <ProductsStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gray-700 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-blue-400">En el catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Productos Activos</CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.activeProducts || 0}
              </div>
              <p className="text-xs text-green-400">Disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Valor Inventario</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${stats?.totalInventoryValue?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-yellow-400">Total en stock</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-300">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.lowStockProducts || 0}
              </div>
              <p className="text-xs text-red-400">Requieren atención</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todas las categorías</option>
                <option value="Electronica">Electrónica</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="draft">Borrador</option>
              </select>
              <Button
                className="bg-purple-700 hover:bg-purple-600"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      {isLoading ? (
        <ProductsTableSkeleton />
      ) : (
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Lista de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left p-3 text-gray-300">Producto</th>
                    <th className="text-left p-3 text-gray-300">Categoría</th>
                    <th className="text-center p-3 text-gray-300">Precio</th>
                    <th className="text-center p-3 text-gray-300">Stock</th>
                    <th className="text-center p-3 text-gray-300">Estado</th>
                    <th className="text-center p-3 text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        No se encontraron productos
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-600">
                        <td className="p-3">
                          <div className="flex items-center">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium text-white">{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-gray-400">{product.description.substring(0, 50)}...</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-300">
                          {typeof product.category === 'object' && product.category !== null
                            ? (product.category as any).name
                            : product.category || 'Sin categoría'}
                        </td>
                        <td className="p-3 text-center text-white font-medium">${Number(product.price).toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <Badge
                            variant="outline"
                            className={`${(product.stock || 0) < 20 ? 'text-red-300 border-red-500' : 'text-green-300 border-green-500'}`}
                          >
                            {product.stock || 0}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={`text-white ${getStatusColor(product.status || 'Activo')}`}>
                            {getStatusLabel(product.status || 'Activo')}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-3 w-3 text-blue-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs text-red-400"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} productos
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Anterior
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage
                          ? "bg-purple-700 hover:bg-purple-600"
                          : "border-gray-600 text-gray-300 hover:bg-gray-700"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddProductModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
      <EditProductModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        product={selectedProduct}
      />
      <DeleteProductModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export const Products = () => {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  );
};
