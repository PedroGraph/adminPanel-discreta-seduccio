import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedWarehouses(): Promise<void> {
  const warehouse = await prisma.warehouse.upsert({
    where: { name: 'Almacén Central' },
    update: {},
    create: {
      name: 'Almacén Central',
      location: 'Ciudad de México',
      address: 'Av. Insurgentes Sur 123',
      status: 'active',
      contactPerson: 'Juan Pérez',
      contactEmail: 'almacen@discretaseduccion.com',
      contactPhone: '555-9999',
    },
  });
  console.log('✅ Almacenes sembrados exitosamente');
}