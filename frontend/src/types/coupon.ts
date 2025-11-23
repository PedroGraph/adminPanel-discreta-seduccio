
export interface Coupon {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  min_order: number | null;
  max_discount: number | null;
  usage_count: number | null;
  usage_limit: number | null;
  status: 'active' | 'inactive' | 'expired';
  start_date: string;
  end_date: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouponStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  totalUsage: number;
  totalSavings: number;
}
