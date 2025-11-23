import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductStatsService {
  async getProductStats() {
    try {
      const totalProducts = await prisma.product.count();

      const activeProducts = await prisma.product.count({
        where: { status: 'active' }
      });

      const productsWithInventory = await prisma.product.findMany({
        select: {
          price: true,
          inventory: {
            select: {
              availableQuantity: true
            }
          }
        }
      });

      const totalInventoryValue = productsWithInventory.reduce((sum, product) => {
        if (!product.inventory || product.inventory.length === 0) {
          return sum;
        }
        const totalQuantity = product.inventory.reduce((qty, inv) => qty + inv.availableQuantity, 0);
        const productValue = Number(product.price) * totalQuantity;
        return sum + productValue;
      }, 0);

      const lowStockProducts = await prisma.product.count({
        where: {
          inventory: {
            some: {
              availableQuantity: {
                lt: 20
              }
            }
          }
        }
      });

      return {
        totalProducts,
        activeProducts,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        lowStockProducts
      };
    } catch (error) {
      throw error;
    }
  }
}
