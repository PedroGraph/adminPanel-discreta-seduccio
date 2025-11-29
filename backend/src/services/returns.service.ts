import { PrismaClient, Prisma, ReviewStatus, RefundStatus } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

export class ReturnsService {

    async getReturns(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }) {
        try {
            const { page = 1, limit = 20, search, status } = params;
            const skip = (page - 1) * limit;

            const where: Prisma.ReturnWhereInput = {
                AND: []
            };

            const andConditions = where.AND as Prisma.ReturnWhereInput[];

            if (search) {
                andConditions.push({
                    OR: [
                        { returnNumber: { contains: search, mode: 'insensitive' } },
                        { customer: { name: { contains: search, mode: 'insensitive' } } },
                        { customer: { email: { contains: search, mode: 'insensitive' } } },
                        { order: { orderNumber: { contains: search, mode: 'insensitive' } } }
                    ]
                });
            }

            if (status && status !== 'all') {
                // Map frontend status to backend status
                const statusMap: Record<string, ReviewStatus> = {
                    'Pendiente': 'pending',
                    'Aprobado': 'published',
                    'Rechazado': 'rejected'
                };
                const backendStatus = statusMap[status] || status;

                if (Object.values(ReviewStatus).includes(backendStatus as ReviewStatus)) {
                    andConditions.push({ status: backendStatus as ReviewStatus });
                }
            }

            const returns = await prisma.return.findMany({
                where,
                include: {
                    customer: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    },
                    order: {
                        select: {
                            orderNumber: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const total = await prisma.return.count({ where });

            const mappedReturns = returns.map(r => ({
                id: r.id,
                return_number: r.returnNumber,
                order_id: r.order.orderNumber,
                customer: r.customer.name,
                status: this.mapStatusToFrontend(r.status),
                total_refund_amount: Number(r.refundAmount || 0),
                return_items: r.items.map(i => ({
                    id: i.id,
                    product_id: i.productId,
                    quantity: i.quantity,
                    unit_price: Number(i.unitPrice),
                    total_price: Number(i.totalPrice),
                    reason: i.reason,
                    product: {
                        name: i.product.name
                    }
                })),
                created_at: r.createdAt
            }));

            return {
                returns: mappedReturns,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };

        } catch (error) {
            logger.error('Error getting returns:', error);
            throw error;
        }
    }

    async getReturnById(id: number) {
        try {
            const returnItem = await prisma.return.findUnique({
                where: { id },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true
                        }
                    },
                    order: true
                }
            });

            if (!returnItem) {
                throw new Error('Return not found');
            }

            return {
                ...returnItem,
                status: this.mapStatusToFrontend(returnItem.status),
                totalAmount: Number(returnItem.totalAmount),
                refundAmount: Number(returnItem.refundAmount),
                items: returnItem.items.map(i => ({
                    ...i,
                    unitPrice: Number(i.unitPrice),
                    totalPrice: Number(i.totalPrice)
                }))
            };
        } catch (error) {
            logger.error('Error getting return by id:', error);
            throw error;
        }
    }

    async createReturn(data: {
        orderId: string; // Order Number or ID? Frontend sends orderId which seems to be orderNumber in mock data
        items: {
            productId: number;
            quantity: number;
            reason: string;
            condition?: string;
        }[];
        reason: string;
        notes?: string;
    }) {
        try {
            // Find order first
            const order = await prisma.order.findUnique({
                where: { orderNumber: data.orderId },
                include: { customer: true }
            });

            if (!order) {
                throw new Error('Order not found');
            }

            if (!order.customerId) {
                throw new Error('Order has no customer');
            }

            // Calculate totals
            let totalAmount = 0;
            const returnItemsData = [];

            for (const item of data.items) {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) continue;

                const unitPrice = Number(product.price);
                const totalPrice = unitPrice * item.quantity;
                totalAmount += totalPrice;

                // Find order item to link
                const orderItem = await prisma.orderItem.findFirst({
                    where: {
                        orderId: order.id,
                        productId: item.productId
                    }
                });

                if (!orderItem) {
                    throw new Error(`Product ${item.productId} not found in order`);
                }

                returnItemsData.push({
                    orderItemId: orderItem.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: new Prisma.Decimal(totalPrice),
                    reason: item.reason
                });
            }

            const returnNumber = `RET-${Date.now()}`; // Simple generation

            const newReturn = await prisma.return.create({
                data: {
                    orderId: order.id,
                    customerId: order.customerId,
                    returnNumber,
                    reason: data.reason,
                    totalAmount: new Prisma.Decimal(totalAmount),
                    refundAmount: new Prisma.Decimal(totalAmount), // Assuming full refund for now
                    status: 'pending', // ReviewStatus
                    refundStatus: 'pending',
                    notes: data.notes,
                    items: {
                        create: returnItemsData
                    }
                },
                include: {
                    items: true
                }
            });

            return newReturn;

        } catch (error) {
            logger.error('Error creating return:', error);
            throw error;
        }
    }

    async updateReturnStatus(id: number, status: string) {
        try {
            // Map frontend status to backend status
            const statusMap: Record<string, ReviewStatus> = {
                'Pendiente': 'pending',
                'Aprobado': 'published',
                'Rechazado': 'rejected'
            };
            const backendStatus = statusMap[status] || status;

            if (!Object.values(ReviewStatus).includes(backendStatus as ReviewStatus)) {
                throw new Error('Invalid status');
            }

            const updatedReturn = await prisma.return.update({
                where: { id },
                data: {
                    status: backendStatus as ReviewStatus,
                    // Also update refundStatus if approved
                    refundStatus: backendStatus === 'published' ? 'processed' :
                        backendStatus === 'rejected' ? 'rejected' : 'pending'
                }
            });

            return updatedReturn;
        } catch (error) {
            logger.error('Error updating return status:', error);
            throw error;
        }
    }

    private mapStatusToFrontend(status: ReviewStatus): string {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'published': return 'Aprobado';
            case 'rejected': return 'Rechazado';
            default: return status;
        }
    }
}
