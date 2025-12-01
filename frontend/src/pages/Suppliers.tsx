
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Package,
  Star
} from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { CreateSupplierModal } from "@/components/suppliers/CreateSupplierModal";
import { EditSupplierModal } from "@/components/suppliers/EditSupplierModal";
import { DeleteSupplierModal } from "@/components/suppliers/DeleteSupplierModal";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const Suppliers = () => {
  const { suppliers, loading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-600';
      case 'Pendiente': return 'bg-yellow-600';
      case 'Inactivo': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDelete = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2 bg-gray-700" />
          <Skeleton className="h-5 w-96 bg-gray-700" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-700" />
          ))}
        </div>

        {/* Filters Skeleton */}
        <Skeleton className="h-24 w-full rounded-xl bg-gray-700 mb-6" />

        {/* Table Skeleton */}
        <TableSkeleton columns={8} rows={5} />
      </div>
    );
  }

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Activo').length;
  const totalProducts = suppliers.reduce((sum, s) => sum + (s.products_supplied || 0), 0);
  const avgRating = totalSuppliers > 0 ?
    (suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / totalSuppliers).toFixed(1) : '0.0';

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Proveedores</h1>
        <p className="text-gray-400">Administra tu red de proveedores y socios comerciales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Total Proveedores</CardTitle>
            <Building2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSuppliers}</div>
            <p className="text-xs text-blue-400">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Proveedores Activos</CardTitle>
            <Building2 className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeSuppliers}</div>
            <p className="text-xs text-green-400">Con suministros activos</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Productos Suministrados</CardTitle>
            <Package className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-purple-400">Total en catálogo</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgRating}</div>
            <p className="text-xs text-yellow-400">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proveedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="all">Todas las categorías</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
              </select>
              <Button
                className="bg-purple-700 hover:bg-purple-600"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Lista de Proveedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Proveedor</th>
                  <th className="text-left p-3 text-gray-300">Contacto</th>
                  <th className="text-left p-3 text-gray-300">Categoría</th>
                  <th className="text-center p-3 text-gray-300">Productos</th>
                  <th className="text-center p-3 text-gray-300">Calificación</th>
                  <th className="text-center p-3 text-gray-300">Estado</th>
                  <th className="text-center p-3 text-gray-300">Términos Pago</th>
                  <th className="text-center p-3 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-white flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-blue-400" />
                          {supplier.name}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {supplier.country}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="text-white">{supplier.contact_person}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {supplier.email}
                        </div>
                        {supplier.phone && (
                          <div className="text-xs text-gray-400 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {supplier.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">{supplier.category}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-purple-300 border-purple-500">
                        {supplier.products_supplied}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {getRatingStars(supplier.rating || 0)}
                        <span className="text-xs text-gray-400 ml-1">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`text-white ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center text-gray-300">{supplier.payment_terms || "N/A"}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs text-red-400"
                          onClick={() => handleDelete(supplier)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSuppliers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron proveedores
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateSupplierModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
      <EditSupplierModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        supplier={selectedSupplier}
      />
      <DeleteSupplierModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        supplier={selectedSupplier}
      />
    </div>
  );
};
