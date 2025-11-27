import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import * as CategoryService from "@/services/categories.service";

// Re-export types
export type Category = CategoryService.Category;

export interface CategoryStats {
  total: number;
  activeCount: number;
  totalProducts: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    total: 0,
    activeCount: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getAllCategories();
      setCategories(data.categories);
      setStats({
        total: data.total,
        activeCount: data.activeCount,
        totalProducts: data.totalProducts
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CategoryService.CreateCategoryPayload) => {
    try {
      await CategoryService.createCategory(categoryData);
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
      fetchCategories();
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCategory = async (id: number, updates: CategoryService.UpdateCategoryPayload) => {
    try {
      await CategoryService.updateCategory(id, updates);
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
      fetchCategories();
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await CategoryService.deleteCategory(id);
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
      fetchCategories();
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar la categoría",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    stats,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
  };
};
