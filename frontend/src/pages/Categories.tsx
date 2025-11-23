
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Package
} from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CreateCategoryModal } from "@/components/categories/CreateCategoryModal";
import { EditCategoryModal } from "@/components/categories/EditCategoryModal";
import { DeleteCategoryModal } from "@/components/categories/DeleteCategoryModal";

export const Categories = () => {
  const { categories, loading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const buildCategoryTree = (categories: any[], parentId: string | null = null, level: number = 0): any[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        level,
        children: buildCategoryTree(categories, cat.id, level + 1)
      }));
  };

  const flattenCategories = (categoryTree: any[]): any[] => {
    const result: any[] = [];
    const traverse = (cats: any[]) => {
      cats.forEach(cat => {
        result.push(cat);
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children);
        }
      });
    };
    traverse(categoryTree);
    return result;
  };

  const categoryTree = buildCategoryTree(categories);
  const allCategories = flattenCategories(categoryTree);
  
  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    return status === 'Activa' ? 'bg-green-600' : 'bg-gray-600';
  };

  const getIndentation = (level: number) => {
    return `pl-${level * 6}`;
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Cargando categorías...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
        <p className="text-gray-400">Organiza tus productos en categorías y subcategorías</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gray-700 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Total Categorías</CardTitle>
            <FolderTree className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{allCategories.length}</div>
            <p className="text-xs text-blue-400">Activas e inactivas</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Categorías Activas</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {allCategories.filter(c => c.status === 'Activa').length}
            </div>
            <p className="text-xs text-green-400">Visibles en la tienda</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Productos Total</CardTitle>
            <Package className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {allCategories.reduce((sum, cat) => sum + (cat.products_count || 0), 0)}
            </div>
            <p className="text-xs text-purple-400">En todas las categorías</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-700 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="bg-gray-700 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Lista de Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-3 text-gray-300">Nombre</th>
                  <th className="text-left p-3 text-gray-300">Descripción</th>
                  <th className="text-center p-3 text-gray-300">Productos</th>
                  <th className="text-center p-3 text-gray-300">Estado</th>
                  <th className="text-center p-3 text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-3">
                      <div className={`${getIndentation(category.level)}`}>
                        <div className="flex items-center">
                          {category.level > 0 && (
                            <span className="text-gray-500 mr-2">└─</span>
                          )}
                          <span className="font-medium text-white">{category.name}</span>
                          {category.level === 0 && (
                            <FolderTree className="h-4 w-4 ml-2 text-blue-400" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">/{category.slug}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-300">{category.description}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-purple-300 border-purple-500">
                        {category.products_count || 0}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`text-white ${getStatusColor(category.status)}`}>
                        {category.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs text-red-400"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No se encontraron categorías
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateCategoryModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
      <EditCategoryModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal}
        category={selectedCategory}
      />
      <DeleteCategoryModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal}
        category={selectedCategory}
      />
    </div>
  );
};
