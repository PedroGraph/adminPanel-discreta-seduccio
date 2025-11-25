const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Product {
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
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  stock?: number;
  image?: string;
}

export interface NewProductPayload {
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock?: number;
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
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  totalInventoryValue: number;
  lowStockProducts: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    stats: ProductStats;
    pagination: Pagination;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

/**
 * Get all products with filters and pagination
 */
export const getAllProducts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  categoryName?: string;
  status?: string;
} = {}): Promise<GetProductsResponse['data']> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
  if (params.categoryName) queryParams.append('categoryName', params.categoryName);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los productos');
  }

  const result: GetProductsResponse = await response.json();
  return result.data;
};

/**
 * Get product stats
 */
export const getProductStats = async (): Promise<ProductStats> => {
  const response = await fetch(`${API_URL}/products/stats`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las estadísticas');
  }

  const result = await response.json();
  return result.data;
};

/**
 * Create a new product
 */
export const createProduct = async (productData: NewProductPayload): Promise<Product> => {
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
    throw new Error(error.message || 'No se pudo crear el producto');
  }

  const result: ProductResponse = await response.json();
  return result.data;
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  id: number,
  updates: Partial<NewProductPayload>
): Promise<Product> => {
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
    throw new Error(error.message || 'No se pudo actualizar el producto');
  }

  const result: ProductResponse = await response.json();
  return result.data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo eliminar el producto');
  }
};

/**
 * Get product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const response = await fetch(`${API_URL}/products?slug=${slug}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  const products = result.data?.products || result.data || [];
  return products.find((p: Product) => p.slug === slug) || null;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo obtener el producto');
  }

  const result: ProductResponse = await response.json();
  return result.data;
};
