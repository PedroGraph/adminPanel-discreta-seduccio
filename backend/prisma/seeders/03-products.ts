import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts(): Promise<void> {
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!admin) throw new Error('Admin user not found');

  const categories = await prisma.category.findMany();
  const catMap = categories.reduce((acc, cat) => ({ ...acc, [cat.slug]: cat.id }), {} as Record<string, number>);

  const productsData = [
    {
      name: 'Conjunto de Encaje Rojo',
      sku: 'LEN-001',
      slug: 'conjunto-encaje-rojo',
      price: 599.00,
      costPrice: 250.00,
      categorySlug: 'lenceria',
      description: 'Hermoso conjunto de lencería roja con encaje floral.',
    },
    {
      name: 'Body Negro Transparente',
      sku: 'LEN-002',
      slug: 'body-negro-transparente',
      price: 450.00,
      costPrice: 180.00,
      categorySlug: 'lenceria',
      description: 'Body negro con transparencias y diseño moderno.',
    },
    {
      name: 'Vibrador Clásico',
      sku: 'TOY-001',
      slug: 'vibrador-clasico',
      price: 899.00,
      costPrice: 400.00,
      categorySlug: 'juguetes',
      description: 'Vibrador clásico multispeed resistente al agua.',
    },
    {
      name: 'Anillo Vibrador',
      sku: 'TOY-002',
      slug: 'anillo-vibrador',
      price: 299.00,
      costPrice: 100.00,
      categorySlug: 'juguetes',
      description: 'Anillo vibrador para parejas.',
    },
    {
      name: 'Aceite de Masaje Vainilla',
      sku: 'WEL-001',
      slug: 'aceite-masaje-vainilla',
      price: 199.00,
      costPrice: 80.00,
      categorySlug: 'bienestar',
      description: 'Aceite comestible sabor vainilla para masajes.',
    },
    {
      name: 'Esposas de Peluche',
      sku: 'ACC-001',
      slug: 'esposas-peluche',
      price: 150.00,
      costPrice: 50.00,
      categorySlug: 'accesorios',
      description: 'Esposas suaves con recubrimiento de peluche.',
    },
  ];

  for (const prod of productsData) {
    if (!catMap[prod.categorySlug]) continue;

    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        costPrice: prod.costPrice,
        categoryId: catMap[prod.categorySlug],
      },
      create: {
        name: prod.name,
        sku: prod.sku,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        costPrice: prod.costPrice,
        status: ProductStatus.active,
        categoryId: catMap[prod.categorySlug],
        createdById: admin.id,
      },
    });
  }
  console.log('✅ Productos sembrados exitosamente');
}