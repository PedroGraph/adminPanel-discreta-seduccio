const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces para las estadísticas
export interface StatsCard {
  total: number;
  percentage: number;
  comparedToLastMonth: boolean;
}

export interface MonthlySale {
  month: string;
  sales: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  percentage: number;
}

export interface AnalyticsData {
  statsCards: {
    revenue: StatsCard;
    orders: StatsCard;
    newCustomers: StatsCard;
    customers?: any; // Legacy support
    productsSold: StatsCard;
  };
  charts: {
    monthlySales: MonthlySale[];
    topProducts: TopProduct[];
  };
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await fetch(`${API_URL}/analytics`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las estadísticas de analytics');
  }

  const result: AnalyticsResponse = await response.json();
  return result.data;
};

export const getConversionRate = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/analytics/conversion-rate`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener la tasa de conversión');
  }

  const result = await response.json();
  return result.data;
};
