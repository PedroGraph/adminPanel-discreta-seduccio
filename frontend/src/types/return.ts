export interface ReturnItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  reason: string;
  product?: {
    name: string;
  };
}

export interface Return {
  id: number;
  return_number: string;
  order_id: string; // Order number
  customer: string; // Customer name
  status: string;
  total_refund_amount: number;
  return_items: ReturnItem[];
  created_at: string;
}
