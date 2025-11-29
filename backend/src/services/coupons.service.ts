import { PrismaClient, CouponStatus, CouponType, CouponAppliesTo } from '@prisma/client';
import logger from '@utils/logger.js';

const prisma = new PrismaClient();

export class CouponsService {

    async getCoupons(params: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        type?: string;
    }) {
        try {
            const { page = 1, limit = 20, search, status, type } = params;
            const skip = (page - 1) * limit;

            const where: any = {
                AND: []
            };

            const andConditions = where.AND;

            // Search filter (by code or ID)
            if (search) {
                andConditions.push({
                    OR: [
                        { code: { contains: search, mode: 'insensitive' } },
                        { id: { equals: parseInt(search) || 0 } }
                    ]
                });
            }

            // Status filter
            if (status && status !== 'all') {
                if (Object.values(CouponStatus).includes(status as CouponStatus)) {
                    andConditions.push({ status: status as CouponStatus });
                }
            }

            // Type filter
            if (type && type !== 'all') {
                if (Object.values(CouponType).includes(type as CouponType)) {
                    andConditions.push({ type: type as CouponType });
                }
            }

            const coupons = await prisma.coupon.findMany({
                where,
                include: {
                    applicability: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const total = await prisma.coupon.count({ where });

            // Map to frontend expected format
            const mappedCoupons = coupons.map(coupon => ({
                id: coupon.id.toString(),
                code: coupon.code,
                name: coupon.code, // Using code as name for now
                type: coupon.type,
                value: Number(coupon.value),
                min_order: Number(coupon.minPurchase || 0),
                max_discount: null, // Not in schema
                status: coupon.status,
                usage_count: coupon.usedCount,
                usage_limit: coupon.maxUses || null,
                start_date: coupon.startDate.toISOString(),
                end_date: coupon.endDate.toISOString(),
                category: coupon.appliesTo === 'categories' ? 'Categorías' :
                    coupon.appliesTo === 'products' ? 'Productos' : 'Todos',
                created_at: coupon.createdAt.toISOString()
            }));

            return {
                coupons: mappedCoupons,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };

        } catch (error) {
            logger.error('Error getting coupons:', error);
            throw error;
        }
    }

    async getStats() {
        try {
            const total = await prisma.coupon.count();
            const active = await prisma.coupon.count({ where: { status: 'active' } });
            const inactive = await prisma.coupon.count({ where: { status: 'inactive' } });
            const expired = await prisma.coupon.count({ where: { status: 'expired' } });

            // Calculate total usage
            const coupons = await prisma.coupon.findMany({
                select: {
                    usedCount: true,
                    value: true,
                    type: true
                }
            });

            const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);

            // Estimate total savings (simplified calculation)
            const totalSavings = coupons.reduce((sum, c) => {
                const avgSaving = c.type === 'percentage' ? Number(c.value) : Number(c.value);
                return sum + (c.usedCount * avgSaving);
            }, 0);

            return {
                total,
                active,
                inactive,
                expired,
                totalUsage,
                totalSavings
            };
        } catch (error) {
            logger.error('Error getting coupon stats:', error);
            throw error;
        }
    }

    async createCoupon(data: {
        code: string;
        type: CouponType;
        value: number;
        minPurchase?: number;
        maxUses?: number;
        startDate: Date;
        endDate: Date;
        appliesTo: CouponAppliesTo;
        createdById?: number;
    }) {
        try {
            const coupon = await prisma.coupon.create({
                data: {
                    code: data.code,
                    type: data.type,
                    value: data.value,
                    minPurchase: data.minPurchase || 0,
                    maxUses: data.maxUses || 0,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    appliesTo: data.appliesTo,
                    createdById: data.createdById
                }
            });

            return coupon;
        } catch (error) {
            logger.error('Error creating coupon:', error);
            throw error;
        }
    }

    async updateCoupon(id: number, data: Partial<{
        code: string;
        type: CouponType;
        value: number;
        minPurchase: number;
        maxUses: number;
        startDate: Date;
        endDate: Date;
        status: CouponStatus;
        appliesTo: CouponAppliesTo;
    }>) {
        try {
            const coupon = await prisma.coupon.update({
                where: { id },
                data
            });

            return coupon;
        } catch (error) {
            logger.error('Error updating coupon:', error);
            throw error;
        }
    }

    async deleteCoupon(id: number) {
        try {
            await prisma.coupon.delete({
                where: { id }
            });

            return { success: true };
        } catch (error) {
            logger.error('Error deleting coupon:', error);
            throw error;
        }
    }
}
