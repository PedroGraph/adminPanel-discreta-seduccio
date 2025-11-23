import { PrismaClient } from '@prisma/client';
import { startOfMonth, subMonths, endOfMonth, startOfDay, subDays } from 'date-fns';

const prisma = new PrismaClient();

export class DashboardService {
  async getDashboardStats() {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // 1. Stats Cards (Ventas y Ordenes)
    // Ventas del mes actual
    const currentMonthSales = await prisma.order.aggregate({
      where: {
        createdAt: { gte: currentMonthStart },
        status: { not: 'cancelled' }
      },
      _sum: { totalAmount: true }
    });
    const totalSales = Number(currentMonthSales._sum.totalAmount || 0);

    // Ventas del mes anterior
    const lastMonthSales = await prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        status: { not: 'cancelled' }
      },
      _sum: { totalAmount: true }
    });
    const prevTotalSales = Number(lastMonthSales._sum.totalAmount || 0);

    // Porcentaje de ventas
    const salesPercentage = prevTotalSales === 0 ? 100 : ((totalSales - prevTotalSales) / prevTotalSales) * 100;

    // Ordenes del mes actual
    const currentMonthOrders = await prisma.order.count({
      where: {
        createdAt: { gte: currentMonthStart },
        status: { not: 'cancelled' }
      }
    });

    // Ordenes del mes anterior
    const lastMonthOrders = await prisma.order.count({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        status: { not: 'cancelled' }
      }
    });

    // Porcentaje de ordenes
    const ordersPercentage = lastMonthOrders === 0 ? 100 : ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;

    // 2. Graphs (Últimos 6 meses)
    const sixMonthsAgo = subMonths(now, 6);
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'Mon') as name,
        SUM(total_amount) as sales,
        COUNT(id) as orders
      FROM "Order"
      WHERE created_at >= ${sixMonthsAgo} AND status != 'cancelled'
      GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    // 3. Products Info
    // Top 20 productos más vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 20,
    });

    const topProductsDetails = await Promise.all(topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true, price: true }
      });
      return {
        name: product?.name,
        sales: item._sum.quantity,
        price: product?.price
      };
    }));

    // Productos con poco stock
    const lowStockProducts = await prisma.inventory.findMany({
      where: {
        availableQuantity: {
          lte: prisma.inventory.fields.thresholdQuantity
        }
      },
      include: {
        product: {
          select: { name: true }
        }
      },
      take: 20
    });

    const formattedLowStock = lowStockProducts.map(inv => ({
      name: inv.product.name,
      stock: inv.availableQuantity,
      threshold: inv.thresholdQuantity
    }));

    // 4. Recent Orders (Últimas 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true, email: true }
        }
      }
    });

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer?.name || 'Guest',
      amount: order.totalAmount,
      status: order.status,
      date: order.createdAt
    }));

    return {
      stats_cards: {
        sales: {
          total: totalSales,
          percentage: Number(salesPercentage.toFixed(2))
        },
        orders: {
          total: currentMonthOrders,
          percentage: Number(ordersPercentage.toFixed(2))
        }
      },
      graphs: monthlyStats,
      products: {
        top_selling: topProductsDetails,
        low_stock: formattedLowStock
      },
      recent_orders: formattedRecentOrders
    };
  }
}