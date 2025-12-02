import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories(): Promise<void> {
  const categoriesData = [
    { name: 'Ropa', slug: 'ropa', description: 'Prendas de vestir para toda ocasión' },
    { name: 'Calzado', slug: 'calzado', description: 'Zapatos, botas y zapatillas' },
    { name: 'Accesorios', slug: 'accesorios', description: 'Complementos y accesorios de moda' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, status: 'active' },
    });
  }
  console.log('✅ Categorías sembradas exitosamente');
}