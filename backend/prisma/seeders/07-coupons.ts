import { PrismaClient, CouponType, CouponAppliesTo } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCoupons(): Promise<void> {
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!admin) throw new Error('Admin user not found');

  const couponsData = [
    { code: 'BIENVENIDA10', type: CouponType.percentage, value: 10, status: 'active' },
    { code: 'VERANO20', type: CouponType.percentage, value: 20, status: 'expired' },
    { code: 'DESCUENTO50', type: CouponType.fixed, value: 50, status: 'active' },
  ];

  for (const coup of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: {},
      create: {
        code: coup.code,
        type: coup.type,
        value: coup.value,
        status: coup.status as any,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        appliesTo: CouponAppliesTo.all,
        createdById: admin.id,
      },
    });
  }
  console.log('✅ Cupones sembrados exitosamente');
}
