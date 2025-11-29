const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export interface GetReturnsResponse {
    returns: Return[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getReturns = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
} = {}): Promise<GetReturnsResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_URL}/returns?${queryParams.toString()}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las devoluciones');
    }

    const result = await response.json();
    return result.data;
};

export const getReturnById = async (id: number): Promise<Return> => {
    const response = await fetch(`${API_URL}/returns/${id}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener la devolución');
    }

    const result = await response.json();
    return result.data;
};

export const createReturn = async (data: {
    orderId: string;
    items: {
        productId: number;
        quantity: number;
        reason: string;
    }[];
    reason: string;
    notes?: string;
}) => {
    const response = await fetch(`${API_URL}/returns`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la devolución');
    }

    const result = await response.json();
    return result.data;
};

export const updateReturnStatus = async (id: number, status: string) => {
    const response = await fetch(`${API_URL}/returns/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el estado de la devolución');
    }

    const result = await response.json();
    return result.data;
};
