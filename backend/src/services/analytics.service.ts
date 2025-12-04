import { PrismaClient } from '@prisma/client';
import { startOfMonth, subMonths, endOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getAnalytics() {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const [
      revenueStats,
      ordersStats,
      productsStats,
      monthlySales,
      topProducts,
      customersStats
    ] = await Promise.all([
      this.getRevenueStats(currentMonthStart, lastMonthStart, lastMonthEnd),
      this.getOrdersStats(currentMonthStart, lastMonthStart, lastMonthEnd),
      this.getProductsStats(currentMonthStart, lastMonthStart, lastMonthEnd),
      this.getMonthlySales(),
      this.getTopProducts(),
      this.getCustomersStats()
    ]);

    return {
      statsCards: {
        revenue: revenueStats,
        orders: ordersStats,
        customers: customersStats,
        productsSold: productsStats
      },
      charts: {
        monthlySales,
        topProducts
      }
    };
  }

  private async getRevenueStats(
    currentMonthStart: Date,
    lastMonthStart: Date,
    lastMonthEnd: Date
  ) {
    const currentRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: currentMonthStart },
        status: { notIn: ['cancelled', 'refunded'] }
      },
      _sum: { totalAmount: true }
    });

    const lastRevenue = await prisma.order.aggregate({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        status: { notIn: ['cancelled', 'refunded'] }
      },
      _sum: { totalAmount: true }
    });

    const currentTotal = Number(currentRevenue._sum.totalAmount || 0);
    const lastTotal = Number(lastRevenue._sum.totalAmount || 0);

    const percentage = lastTotal === 0
      ? (currentTotal > 0 ? 100 : 0)
      : ((currentTotal - lastTotal) / lastTotal) * 100;

    return {
      total: currentTotal,
      percentage: Number(percentage.toFixed(2)),
      comparedToLastMonth: true
    };
  }

  private async getOrdersStats(
    currentMonthStart: Date,
    lastMonthStart: Date,
    lastMonthEnd: Date
  ) {
    const currentOrders = await prisma.order.count({
      where: {
        createdAt: { gte: currentMonthStart },
        status: { notIn: ['cancelled'] }
      }
    });

    const lastOrders = await prisma.order.count({
      where: {
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
        status: { notIn: ['cancelled'] }
      }
    });

    const percentage = lastOrders === 0
      ? (currentOrders > 0 ? 100 : 0)
      : ((currentOrders - lastOrders) / lastOrders) * 100;

    return {
      total: currentOrders,
      percentage: Number(percentage.toFixed(2)),
      comparedToLastMonth: true
    };
  }

  private async getProductsStats(
    currentMonthStart: Date,
    lastMonthStart: Date,
    lastMonthEnd: Date
  ) {
    const currentProducts = await prisma.orderItem.aggregate({
      where: {
        order: {
          createdAt: { gte: currentMonthStart },
          status: { notIn: ['cancelled'] }
        }
      },
      _sum: { quantity: true }
    });

    const lastProducts = await prisma.orderItem.aggregate({
      where: {
        order: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: { notIn: ['cancelled'] }
        }
      },
      _sum: { quantity: true }
    });

    const currentTotal = Number(currentProducts._sum.quantity || 0);
    const lastTotal = Number(lastProducts._sum.quantity || 0);

    const percentage = lastTotal === 0
      ? (currentTotal > 0 ? 100 : 0)
      : ((currentTotal - lastTotal) / lastTotal) * 100;

    return {
      total: currentTotal,
      percentage: Number(percentage.toFixed(2)),
      comparedToLastMonth: true
    };
  }

  private async getMonthlySales() {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5); // 6 meses incluyendo el actual
    const startDate = startOfMonth(sixMonthsAgo);
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { notIn: ['cancelled', 'refunded'] }
      },
      select: {
        createdAt: true,
        totalAmount: true
      }
    });

    const monthlyData = new Map<string, number>();

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, 'MMM', { locale: es });
      monthlyData.set(monthKey, 0);
    }

    orders.forEach(order => {
      const monthKey = format(order.createdAt, 'MMM', { locale: es });
      const currentValue = monthlyData.get(monthKey) || 0;
      monthlyData.set(monthKey, currentValue + Number(order.totalAmount));
    });

    return Array.from(monthlyData.entries()).map(([month, sales]) => ({
      month,
      sales: Number(sales.toFixed(2))
    }));
  }

  private async getTopProducts() {
    const topProductsData = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5, // Top 5 productos
    });

    const productsWithDetails = await Promise.all(
      topProductsData.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });

        return {
          name: product?.name || 'Producto desconocido',
          quantity: item._sum.quantity || 0
        };
      })
    );

    const totalQuantity = productsWithDetails.reduce(
      (sum, product) => sum + product.quantity,
      0
    );
    return productsWithDetails.map(product => ({
      name: product.name,
      quantity: product.quantity,
      percentage: totalQuantity > 0
        ? Number(((product.quantity / totalQuantity) * 100).toFixed(2))
        : 0
    }));
  }

  private async getCustomersStats() {
    const totalCustomers = await prisma.customer.count();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomersLast30Days = await prisma.customer.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const percentageNewCustomers = totalCustomers > 0
      ? Number(((newCustomersLast30Days / totalCustomers) * 100).toFixed(2))
      : 0;

    return {
      totalCustomers,
      newCustomersLast30Days,
      percentageNewCustomers,
    };
  }

  async getWeeklyConversionRate() {
    return {
      message: 'Tasa de conversión semanal - Próximamente'
    };
  }
}
