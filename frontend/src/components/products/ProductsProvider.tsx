import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as ProductsService from "@/services/products.service";

// Re-export types from service for convenience
export type Product = ProductsService.Product;
export type NewProductPayload = ProductsService.NewProductPayload;
export type ProductStats = ProductsService.ProductStats;
export type Pagination = ProductsService.Pagination;

interface ProductsContextType {
  products: Product[];
  filteredProducts: Product[];
  stats: ProductStats | null;
  pagination: Pagination | null;
  isLoading: boolean;
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  addProduct: (product: NewProductPayload) => Promise<void>;
  updateProduct: (id: number, updates: Partial<NewProductPayload>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stats only once on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ProductsService.getAllProducts({ page: 1, limit: 1 });
        setStats(data.stats || null);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch products when page or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: 20,
        };

        if (searchTerm) params.search = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;

        if (categoryFilter !== 'all') {
          if (!isNaN(Number(categoryFilter))) {
            params.categoryId = Number(categoryFilter);
          } else {
            params.categoryName = categoryFilter;
          }
        }

        const data = await ProductsService.getAllProducts(params);
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  // Products are already filtered by the backend
  const filteredProducts = products;

  const addProduct = async (productData: NewProductPayload) => {
    try {
      const newProduct = await ProductsService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: number, updates: Partial<NewProductPayload>) => {
    try {
      const updatedProduct = await ProductsService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await ProductsService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      // Check local state first
      const product = products.find(p => p.slug === slug);
      if (product) return product;

      // Fetch from API if not found locally
      return await ProductsService.getProductBySlug(slug);
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return null;
    }
  };

  return (
    <ProductsContext.Provider value={{
      products,
      filteredProducts,
      stats,
      pagination,
      isLoading,
      searchTerm,
      categoryFilter,
      statusFilter,
      currentPage,
      setSearchTerm,
      setCategoryFilter,
      setStatusFilter,
      setCurrentPage,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductBySlug,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
