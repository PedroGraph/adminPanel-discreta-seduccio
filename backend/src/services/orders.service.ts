import { PrismaClient, Prisma, OrderStatus } from '@prisma/client';
import logger from '@utils/logger.js';

const prisma = new PrismaClient();

export class OrdersService {

    async getOrders(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        date?: string;
    }) {
        try {
            const { page = 1, limit = 20, search, status, date } = params;
            const skip = (page - 1) * limit;

            const where: Prisma.OrderWhereInput = {
                AND: []
            };

            const andConditions = where.AND as Prisma.OrderWhereInput[];

            // Search filter
            if (search) {
                andConditions.push({
                    OR: [
                        { orderNumber: { contains: search, mode: 'insensitive' } },
                        { customer: { name: { contains: search, mode: 'insensitive' } } },
                        { customer: { email: { contains: search, mode: 'insensitive' } } }
                    ]
                });
            }

            // Status filter
            if (status && status !== 'all') {
                // Ensure status is a valid OrderStatus
                if (Object.values(OrderStatus).includes(status as OrderStatus)) {
                    andConditions.push({ status: status as OrderStatus });
                }
            }

            // Date filter
            if (date && date !== 'all') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (date === 'today') {
                    andConditions.push({
                        createdAt: {
                            gte: today
                        }
                    });
                } else if (date === 'week') {
                    const lastWeek = new Date(today);
                    lastWeek.setDate(lastWeek.getDate() - 7);
                    andConditions.push({
                        createdAt: {
                            gte: lastWeek
                        }
                    });
                } else if (date === 'month') {
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(lastMonth.getMonth() - 1);
                    andConditions.push({
                        createdAt: {
                            gte: lastMonth
                        }
                    });
                }
            }

            const orders = await prisma.order.findMany({
                where,
                include: {
                    customer: {
                        select: {
                            name: true,
                            email: true,
                            phone: true
                        }
                    },
                    items: true,
                    shippingAddress: true,
                    shipments: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const total = await prisma.order.count({ where });

            const mappedOrders = orders.map(order => {
                const address = order.shippingAddress
                    ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                    : 'No address';

                const trackingNumber = order.shipments?.[0]?.trackingNumber || null;

                return {
                    id: order.id,
                    order_number: order.orderNumber,
                    customer_name: order.customer?.name || 'Guest',
                    customer_email: order.customer?.email,
                    phone: order.customer?.phone,
                    total_amount: Number(order.totalAmount),
                    status: order.status,
                    created_at: order.createdAt,
                    items_count: order.items.length,
                    address,
                    payment_method: order.paymentMethod,
                    tracking_number: trackingNumber
                };
            });

            return {
                orders: mappedOrders,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };

        } catch (error) {
            logger.error('Error getting orders:', error);
            throw error;
        }
    }

    async getOrderById(id: number) {
        try {
            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true
                        }
                    },
                    shippingAddress: true,
                    shipments: true
                }
            });

            if (!order) {
                throw new Error('Order not found');
            }

            return {
                ...order,
                totalAmount: Number(order.totalAmount),
                items: order.items.map(item => ({
                    ...item,
                    unitPrice: Number(item.unitPrice),
                    totalPrice: Number(item.totalPrice),
                    product: {
                        ...item.product,
                        price: Number(item.product.price)
                    }
                }))
            };
        } catch (error) {
            logger.error('Error getting order by id:', error);
            throw error;
        }
    }

    async getStats() {
        try {
            const total = await prisma.order.count();
            const pending = await prisma.order.count({ where: { status: 'pending' } });
            const completed = await prisma.order.count({ where: { status: 'delivered' } });
            const cancelled = await prisma.order.count({ where: { status: 'cancelled' } });

            return {
                total,
                pending,
                completed,
                cancelled
            };
        } catch (error) {
            logger.error('Error getting order stats:', error);
            throw error;
        }
    }
}
