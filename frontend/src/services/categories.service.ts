const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'inactive';
  parentId: number | null;
  productCount?: number;
  parent?: Category | null;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  parentId?: number | null;
  status?: 'active' | 'inactive';
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: number | null;
  status?: 'active' | 'inactive';
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: Category[];
    total: number;
    activeCount: number;
    totalProducts: number;
  };
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
  message?: string;
}

/**
 * Get all categories
 */
export const getAllCategories = async (params: {
  search?: string;
  status?: string;
} = {}): Promise<CategoriesResponse['data']> => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_URL}/categories?${queryParams.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las categorías');
  }

  const result: CategoriesResponse = await response.json();
  return result.data;
};

/**
 * Create a new category
 */
export const createCategory = async (categoryData: CreateCategoryPayload): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo crear la categoría');
  }

  const result: CategoryResponse = await response.json();
  return result.data;
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: number, updates: UpdateCategoryPayload): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo actualizar la categoría');
  }

  const result: CategoryResponse = await response.json();
  return result.data;
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'No se pudo eliminar la categoría');
  }
};
