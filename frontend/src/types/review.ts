
export interface Review {
  id: string;
  customer_name: string;
  customer_email: string;
  product_name: string;
  rating: number;
  title: string;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
}
