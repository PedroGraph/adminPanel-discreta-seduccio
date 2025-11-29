const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email?: string;
    phone?: string;
    total_amount: number;
    status: string;
    created_at: string;
    items_count: number;
    address?: string;
    payment_method?: string;
    tracking_number?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
        name: string;
        price: number;
    };
}

export interface OrdersStats {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
}

export interface GetOrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getOrders = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    date?: string;
} = {}): Promise<GetOrdersResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.date) queryParams.append('date', params.date);

    const response = await fetch(`${API_URL}/orders?${queryParams.toString()}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las órdenes');
    }

    const result = await response.json();
    return result.data;
};

export const getOrdersStats = async (): Promise<OrdersStats> => {
    const response = await fetch(`${API_URL}/orders/stats`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las estadísticas');
    }

    const result = await response.json();
    return result.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener la orden');
    }

    const result = await response.json();
    return result.data;
};
