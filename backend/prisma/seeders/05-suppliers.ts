import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSuppliers(): Promise<void> {
  const suppliersData = [
    { name: 'Proveedor Global S.A.', email: 'contacto@proveedorglobal.com', phone: '555-1001' },
    { name: 'Distribuidora Íntima', email: 'ventas@intima.com', phone: '555-1002' },
  ];

  for (const sup of suppliersData) {
    await prisma.supplier.upsert({
      where: { name: sup.name },
      update: sup,
      create: { ...sup, status: 'active' },
    });
  }
  console.log('✅ Proveedores sembrados exitosamente');
}