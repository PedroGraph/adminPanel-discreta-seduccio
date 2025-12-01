import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories(): Promise<void> {
  const categoriesData = [
    { name: 'Lencería', slug: 'lenceria', description: 'Ropa interior sensual y elegante' },
    { name: 'Juguetes', slug: 'juguetes', description: 'Juguetes para adultos' },
    { name: 'Accesorios', slug: 'accesorios', description: 'Accesorios complementarios' },
    { name: 'Bienestar', slug: 'bienestar', description: 'Aceites y lubricantes' },
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