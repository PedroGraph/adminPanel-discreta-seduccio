const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Coupon {
    id: string;
    code: string;
    name: string;
    type: string;
    value: number;
    min_order: number;
    max_discount: number | null;
    status: string;
    usage_count: number;
    usage_limit: number | null;
    start_date: string;
    end_date: string;
    category: string;
    created_at: string;
}

export interface CouponStats {
    total: number;
    active: number;
    inactive: number;
    expired: number;
    totalUsage: number;
    totalSavings: number;
}

export interface GetCouponsResponse {
    coupons: Coupon[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getCoupons = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
} = {}): Promise<GetCouponsResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.type && params.type !== 'all') queryParams.append('type', params.type);

    const response = await fetch(`${API_URL}/coupons?${queryParams.toString()}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener los cupones');
    }

    const result = await response.json();
    return result.data;
};

export const getCouponsStats = async (): Promise<CouponStats> => {
    const response = await fetch(`${API_URL}/coupons/stats`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener las estadísticas');
    }

    const result = await response.json();
    return result.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el cupón');
    }
};
