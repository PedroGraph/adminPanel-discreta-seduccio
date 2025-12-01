import { PrismaClient, InventoryMovementType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedInventory(): Promise<void> {
  const warehouse = await prisma.warehouse.findUnique({ where: { name: 'Almacén Central' } });
  if (!warehouse) throw new Error('Warehouse not found');

  const products = await prisma.product.findMany();
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });

  for (const product of products) {
    await prisma.inventory.upsert({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 50,
        availableQuantity: 50,
        reservedQuantity: 0,
        thresholdQuantity: 5,
      },
    });

    // Create initial movement if not exists
    const existingMovement = await prisma.inventoryMovement.findFirst({
      where: {
        productId: product.id,
        warehouseId: warehouse.id,
        type: InventoryMovementType.incoming,
        notes: 'Stock inicial',
      },
    });

    if (!existingMovement && admin) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: 50,
          type: InventoryMovementType.incoming,
          notes: 'Stock inicial',
          performedById: admin.id,
        },
      });
    }
  }
  console.log('✅ Inventario sembrado exitosamente');
}