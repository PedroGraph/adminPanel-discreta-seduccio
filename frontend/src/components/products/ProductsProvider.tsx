import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Product = {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  costPrice: number | null;
  status: 'active' | 'inactive' | 'draft';
  categoryId: number | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
  // Optional properties that may come from backend joins or frontend
  category?: { id: number; name: string; slug: string; description: string | null; status: string; parentId: number | null; createdAt: string; updatedAt: string } | null;
  stock?: number;
  image?: string;
};

type NewProductPayload = {
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  costPrice?: number;
  status: 'active' | 'inactive' | 'draft';
  categoryId?: number;
  category?: {
    name: string;
    slug: string;
    description?: string;
    status?: 'active' | 'inactive' | 'draft';
  };
  attributes?: {
    create: Array<{
      attributeName: string;
      attributeValue: string;
    }>;
  };
  images?: {
    create: Array<{
      imageUrl: string;
      isPrimary: boolean;
      sortOrder?: number;
    }>;
  };
};

type ProductStats = {
  totalProducts: number;
  activeProducts: number;
  totalInventoryValue: number;
  lowStockProducts: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

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

const API_URL = 'http://localhost:3000/api';

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
        const response = await fetch(`${API_URL}/products?page=1&limit=1`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.data.stats || null);
        }
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
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20',
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
        });

        if (categoryFilter !== 'all') {
          if (!isNaN(Number(categoryFilter))) {
            queryParams.append('categoryId', categoryFilter);
          } else {
            queryParams.append('categoryName', categoryFilter);
          }
        }

        const response = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data.products || []);
          setPagination(data.data.pagination || null);
        } else {
          console.error("Error fetching products:", response.statusText);
          setProducts([]);
          setPagination(null);
        }
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
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "No se pudo crear el producto.");
      }

      const result = await response.json();
      setProducts(prev => [...prev, result.data]);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id: number, updates: Partial<NewProductPayload>) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "No se pudo actualizar el producto.");
      }

      const result = await response.json();
      setProducts(prev => prev.map(p => p.id === id ? result.data : p));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto.");
      }

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const product = products.find(p => p.slug === slug);
      if (product) return product;

      const response = await fetch(`${API_URL}/products?slug=${slug}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.find((p: Product) => p.slug === slug) || null;
      }
      return null;
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
