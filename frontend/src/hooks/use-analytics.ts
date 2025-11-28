import { useQuery } from '@tanstack/react-query';
import { getAnalytics, getConversionRate, AnalyticsData } from '../services/analytics.service';

export const useAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
  });
};

export const useConversionRate = () => {
  return useQuery({
    queryKey: ['conversion-rate'],
    queryFn: getConversionRate,
    staleTime: 5 * 60 * 1000,
  });
};
