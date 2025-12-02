import { PrismaClient, CouponType, CouponAppliesTo, CouponStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCoupons(): Promise<void> {
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) throw new Error('Admin user not found');

    const now = new Date();
    const couponsData = [
        {
            code: 'BIENVENIDA15',
            type: CouponType.percentage,
            value: 15,
            minPurchase: 500,
            maxUses: 100,
            usedCount: 23,
            startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Hace 30 días
            endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // En 60 días
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'VERANO2024',
            type: CouponType.percentage,
            value: 25,
            minPurchase: 1000,
            maxUses: 200,
            usedCount: 187,
            startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Expiró hace 5 días
            status: CouponStatus.expired,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'ENVIOGRATIS',
            type: CouponType.fixed,
            value: 150,
            minPurchase: 800,
            maxUses: 500,
            usedCount: 342,
            startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'BLACKFRIDAY',
            type: CouponType.percentage,
            value: 40,
            minPurchase: 1500,
            maxUses: 300,
            usedCount: 298,
            startDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
            status: CouponStatus.expired,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'PRIMERCOMPRA',
            type: CouponType.fixed,
            value: 200,
            minPurchase: 600,
            maxUses: 1000,
            usedCount: 456,
            startDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'VIP20',
            type: CouponType.percentage,
            value: 20,
            minPurchase: 2000,
            maxUses: 50,
            usedCount: 12,
            startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'FLASH50',
            type: CouponType.fixed,
            value: 50,
            minPurchase: 300,
            maxUses: 100,
            usedCount: 89,
            startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
        {
            code: 'INVIERNO30',
            type: CouponType.percentage,
            value: 30,
            minPurchase: 1200,
            maxUses: 150,
            usedCount: 67,
            startDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
            status: CouponStatus.active,
            appliesTo: CouponAppliesTo.all,
        },
    ];

    for (const coupon of couponsData) {
        await prisma.coupon.upsert({
            where: { code: coupon.code },
            update: {},
            create: {
                ...coupon,
                createdById: admin.id,
            },
        });
    }
    console.log('✅ Cupones sembrados exitosamente');
}
