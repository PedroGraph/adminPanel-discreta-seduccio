const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface InventoryProduct {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  cost: number;
  sell_price: number;
  supplier: string | null;
  category: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  id: number;
  product_id: number;
  product_name: string;
  movement_type: string;
  quantity: number;
  reason: string;
  reference_id: string | null;
  created_by: string;
  created_at: string;
}

export interface InventoryStats {
  totalValue: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface GetInventoryResponse {
  success: boolean;
  data: {
    products: InventoryProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getInventory = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}): Promise<GetInventoryResponse['data']> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);

  const response = await fetch(`${API_URL}/inventory?${queryParams.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el inventario');
  }

  const result = await response.json();
  return result.data;
};

export const getMovements = async (limit: number = 20): Promise<InventoryMovement[]> => {
  const response = await fetch(`${API_URL}/inventory/movements?limit=${limit}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los movimientos');
  }

  const result = await response.json();
  return result.data;
};

export const createMovement = async (data: {
  productId: number;
  type: string;
  quantity: number;
  reason: string;
  cost?: number;
}) => {
  const response = await fetch(`${API_URL}/inventory/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el movimiento');
  }

  const result = await response.json();
  return result.data;
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  const response = await fetch(`${API_URL}/inventory/stats`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las estadísticas');
  }

  const result = await response.json();
  return result.data;
};
