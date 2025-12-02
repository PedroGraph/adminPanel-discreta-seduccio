import { PrismaClient, InventoryMovementType } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedInventory(): Promise<void> {
  const warehouses = await prisma.warehouse.findMany();
  const products = await prisma.product.findMany();
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });

  if (warehouses.length === 0) {
    console.log('⚠️ No hay almacenes para crear inventario');
    return;
  }

  // Distribuir productos entre almacenes
  for (const product of products) {
    // Cada producto estará en 1-2 almacenes aleatorios
    const numWarehouses = Math.floor(Math.random() * 2) + 1;
    const shuffledWarehouses = warehouses.sort(() => 0.5 - Math.random());
    const selectedWarehouses = shuffledWarehouses.slice(0, numWarehouses);

    for (const warehouse of selectedWarehouses) {
      // Cantidades variables según el almacén
      const baseQuantity = Math.floor(Math.random() * 100) + 20; // 20-120 unidades
      const reserved = Math.floor(Math.random() * 10); // 0-10 reservadas
      const available = baseQuantity - reserved;

      await prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: product.id,
            warehouseId: warehouse.id,
          },
        },
        update: {
          quantity: baseQuantity,
          availableQuantity: available,
          reservedQuantity: reserved,
        },
        create: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: baseQuantity,
          availableQuantity: available,
          reservedQuantity: reserved,
          thresholdQuantity: 10,
        },
      });

      // Crear movimiento inicial si no existe
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
            quantity: baseQuantity,
            type: InventoryMovementType.incoming,
            notes: 'Stock inicial',
            performedById: admin.id,
            createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Últimos 60 días
          },
        });
      }
    }
  }

  // Crear algunos movimientos adicionales de ejemplo
  if (admin && products.length > 0 && warehouses.length > 0) {
    const movementTypes = [
      { type: InventoryMovementType.outgoing, notes: 'Venta procesada' },
      { type: InventoryMovementType.adjustment, notes: 'Ajuste de inventario' },
      { type: InventoryMovementType.incoming, notes: 'Reabastecimiento' },
    ];

    for (let i = 0; i < 15; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const warehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
      const movement = movementTypes[Math.floor(Math.random() * movementTypes.length)];
      const quantity = Math.floor(Math.random() * 20) + 1;

      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: movement.type === InventoryMovementType.outgoing ? -quantity : quantity,
          type: movement.type,
          notes: movement.notes,
          performedById: admin.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
        },
      });
    }
  }

  console.log('✅ Inventario sembrado exitosamente');
}