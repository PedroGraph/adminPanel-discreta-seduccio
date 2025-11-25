const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth?: number;
  ordersGrowth?: number;
  customersGrowth?: number;
  productsGrowth?: number;
  recentOrders?: any[];
  topProducts?: any[];
  salesByCategory?: any[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las estadísticas del dashboard');
  }

  const result: DashboardResponse = await response.json();
  return result.data;
};

/**
 * Get dashboard analytics
 */
export const getDashboardAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.period) queryParams.append('period', params.period);

  const response = await fetch(`${API_URL}/dashboard/analytics?${queryParams.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener los análisis');
  }

  const result = await response.json();
  return result.data;
};
