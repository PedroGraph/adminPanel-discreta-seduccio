import { PrismaClient, Prisma, InventoryMovementType } from '@prisma/client';
import logger from '@utils/logger.js';

const prisma = new PrismaClient();

export class InventoryService {
  
  async getInventory(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  }) {
    try {
      const { page = 1, limit = 20, search, status } = params;
      const skip = (page - 1) * limit;

      // Base query for products
      const where: Prisma.ProductWhereInput = {
        AND: []
      };
      
      const andConditions = where.AND as Prisma.ProductWhereInput[];

      // Search filter
      if (search) {
        andConditions.push({
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
          ]
        });
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          inventory: true,
          category: true
        },
        orderBy: { name: 'asc' }
      });

      let processedProducts = products.map(product => {
        const totalStock = product.inventory.reduce((sum, inv) => sum + inv.availableQuantity, 0);
        const minStock = product.inventory.reduce((sum, inv) => sum + (inv.thresholdQuantity || 0), 0);
        // Use costPrice if available, otherwise use price as fallback
        const cost = Number(product.costPrice || product.price || 0);
        
        let stockStatus = 'in_stock';
        if (totalStock === 0) stockStatus = 'out_of_stock';
        else if (totalStock <= minStock) stockStatus = 'low_stock';

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          current_stock: totalStock,
          min_stock: minStock,
          max_stock: 100, 
          cost: cost,
          sell_price: Number(product.price),
          supplier: 'Unknown', 
          category: product.category?.name || 'Uncategorized',
          status: stockStatus,
          created_at: product.createdAt,
          updated_at: product.updatedAt
        };
      });

     
      if (status && status !== 'all') {
        processedProducts = processedProducts.filter(p => p.status === status);
      }

      const total = processedProducts.length;
      const paginatedProducts = processedProducts.slice(skip, skip + limit);

      return {
        products: paginatedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {
      logger.error('Error getting inventory:', error);
      throw error;
    }
  }

  async getMovements(limit: number = 20) {
    try {
      const movements = await prisma.inventoryMovement.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { name: true, sku: true }
          },
          performedBy: {
            select: { name: true }
          }
        }
      });

      return movements.map(m => ({
        id: m.id,
        product_id: m.productId,
        product_name: m.product.name,
        movement_type: m.type === 'incoming' ? 'entrada' : m.type === 'outgoing' ? 'salida' : 'ajuste',
        quantity: m.quantity,
        reason: m.notes || '',
        reference_id: m.referenceId,
        created_by: m.performedBy?.name || 'System',
        created_at: m.createdAt
      }));
    } catch (error) {
      logger.error('Error getting movements:', error);
      throw error;
    }
  }

  async createMovement(data: {
    productId: number;
    type: 'entrada' | 'salida' | 'ajuste';
    quantity: number;
    reason?: string;
    cost?: number;
  }) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { productId, type, quantity, reason } = data;

        let dbType: InventoryMovementType;
        if (type === 'entrada') dbType = 'incoming';
        else if (type === 'salida') dbType = 'outgoing';
        else dbType = 'adjustment';

        const warehouse = await tx.warehouse.findFirst({
            where: { name: 'Almacén Principal' }
        });

        if (!warehouse) throw new Error('Almacén Principal no encontrado');

        // Create movement record
        const movement = await tx.inventoryMovement.create({
          data: {
            productId,
            warehouseId: warehouse.id,
            quantity,
            type: dbType,
            notes: reason,
          }
        });

        const inventory = await tx.inventory.findUnique({
          where: {
            productId_warehouseId: {
              productId,
              warehouseId: warehouse.id
            }
          }
        });

        if (!inventory) {
            if (dbType === 'outgoing' && quantity > 0) {
                throw new Error('No hay inventario para este producto');
            }
            await tx.inventory.create({
                data: {
                    productId,
                    warehouseId: warehouse.id,
                    quantity: quantity,
                    availableQuantity: quantity
                }
            });
        } else {
            let newQuantity = inventory.quantity;
            if (dbType === 'incoming') {
                newQuantity += quantity;
            } else if (dbType === 'outgoing') {
                newQuantity -= quantity;
                if (newQuantity < 0) throw new Error('Stock insuficiente');
            } else {
                newQuantity += quantity; 
            }

            await tx.inventory.update({
                where: { id: inventory.id },
                data: {
                    quantity: newQuantity,
                    availableQuantity: newQuantity
                }
            });
        }

        return movement;
      });
    } catch (error) {
      logger.error('Error creating movement:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const products = await prisma.product.findMany({
        include: {
            inventory: true
        }
      });

      let totalValue = 0;
      let inStock = 0;
      let lowStock = 0;
      let outOfStock = 0;

      products.forEach(p => {
        const stock = p.inventory.reduce((sum, i) => sum + i.availableQuantity, 0);
        const min = p.inventory.reduce((sum, i) => sum + (i.thresholdQuantity || 0), 0);
        // Use costPrice if available, otherwise use price as fallback
        const cost = Number(p.costPrice || p.price || 0);

        totalValue += stock * cost;

        if (stock === 0) outOfStock++;
        else if (stock <= min) lowStock++;
        else inStock++;
      });

      return {
        totalValue,
        inStock,
        lowStock,
        outOfStock
      };
    } catch (error) {
      logger.error('Error getting stats:', error);
      throw error;
    }
  }
}
