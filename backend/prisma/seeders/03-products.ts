import { PrismaClient } from '@prisma/client';
import { ProductData } from 'prisma/interfaces/schema.js';

const prisma = new PrismaClient();

export async function seedProducts(): Promise<void> {
  const products: ProductData[] = [
    // ROPA (5 productos)
    {
      sku: 'PROD001',
      name: 'Blusa de Seda Blanca',
      slug: 'blusa-seda-blanca',
      description: 'Elegante blusa de seda 100% natural, perfecta para ocasiones formales',
      price: 89.99,
      costPrice: 45.00,
      status: 'active',
      categoryId: 1,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Blanco' },
          { attributeName: 'Talla', attributeValue: 'XS,S,M,L,XL' },
          { attributeName: 'Material', attributeValue: 'Seda 100%' },
          { attributeName: 'Cuidado', attributeValue: 'Lavar a mano' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD002',
      name: 'Jeans Skinny Azul',
      slug: 'jeans-skinny-azul',
      description: 'Jeans de corte ajustado con elasticidad para mayor comodidad',
      price: 79.99,
      costPrice: 35.00,
      status: 'active',
      categoryId: 1,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Azul Oscuro' },
          { attributeName: 'Talla', attributeValue: '26,28,30,32,34' },
          { attributeName: 'Material', attributeValue: 'Denim 98% Algodón, 2% Elastano' },
          { attributeName: 'Corte', attributeValue: 'Skinny' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906d47ac7', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD003',
      name: 'Vestido Floral Verano',
      slug: 'vestido-floral-verano',
      description: 'Vestido ligero con estampado floral, ideal para días cálidos',
      price: 65.99,
      costPrice: 28.00,
      status: 'active',
      categoryId: 1,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Multicolor' },
          { attributeName: 'Talla', attributeValue: 'S,M,L' },
          { attributeName: 'Material', attributeValue: 'Rayón' },
          { attributeName: 'Estilo', attributeValue: 'Casual' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD004',
      name: 'Chaqueta de Cuero Negro',
      slug: 'chaqueta-cuero-negro',
      description: 'Chaqueta de cuero genuino estilo motociclista',
      price: 249.99,
      costPrice: 120.00,
      status: 'active',
      categoryId: 1,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Negro' },
          { attributeName: 'Talla', attributeValue: 'S,M,L,XL' },
          { attributeName: 'Material', attributeValue: 'Cuero Genuino' },
          { attributeName: 'Forro', attributeValue: 'Poliéster' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD005',
      name: 'Suéter de Lana Gris',
      slug: 'sueter-lana-gris',
      description: 'Suéter tejido de lana merino, suave y cálido',
      price: 95.99,
      costPrice: 48.00,
      status: 'active',
      categoryId: 1,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Gris' },
          { attributeName: 'Talla', attributeValue: 'S,M,L,XL' },
          { attributeName: 'Material', attributeValue: 'Lana Merino 80%, Acrílico 20%' },
          { attributeName: 'Cuello', attributeValue: 'Redondo' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105', isPrimary: false, sortOrder: 2 },
        ],
      },
    },

    // CALZADO (5 productos)
    {
      sku: 'PROD006',
      name: 'Zapatillas Deportivas Running',
      slug: 'zapatillas-deportivas-running',
      description: 'Zapatillas con amortiguación avanzada para running',
      price: 129.99,
      costPrice: 60.00,
      status: 'active',
      categoryId: 2,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Negro/Blanco' },
          { attributeName: 'Talla', attributeValue: '36,37,38,39,40,41,42' },
          { attributeName: 'Material', attributeValue: 'Mesh Transpirable' },
          { attributeName: 'Uso', attributeValue: 'Running' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD007',
      name: 'Botines de Tacón Cuero',
      slug: 'botines-tacon-cuero',
      description: 'Botines de tacón medio en cuero genuino',
      price: 149.99,
      costPrice: 70.00,
      status: 'active',
      categoryId: 2,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Marrón' },
          { attributeName: 'Talla', attributeValue: '35,36,37,38,39,40' },
          { attributeName: 'Material', attributeValue: 'Cuero Genuino' },
          { attributeName: 'Altura Tacón', attributeValue: '6 cm' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD008',
      name: 'Sandalias Planas Verano',
      slug: 'sandalias-planas-verano',
      description: 'Sandalias cómodas con tiras ajustables',
      price: 45.99,
      costPrice: 20.00,
      status: 'active',
      categoryId: 2,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Natural' },
          { attributeName: 'Talla', attributeValue: '35,36,37,38,39,40,41' },
          { attributeName: 'Material', attributeValue: 'Cuero Sintético' },
          { attributeName: 'Suela', attributeValue: 'Goma' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1626703744028-817c2d919e7f', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD009',
      name: 'Botas Altas Negras',
      slug: 'botas-altas-negras',
      description: 'Botas hasta la rodilla, elegantes y versátiles',
      price: 189.99,
      costPrice: 90.00,
      status: 'active',
      categoryId: 2,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Negro' },
          { attributeName: 'Talla', attributeValue: '36,37,38,39,40' },
          { attributeName: 'Material', attributeValue: 'Cuero Sintético Premium' },
          { attributeName: 'Altura', attributeValue: 'Hasta Rodilla' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD010',
      name: 'Zapatillas Blancas Casual',
      slug: 'zapatillas-blancas-casual',
      description: 'Zapatillas urbanas de cuero blanco',
      price: 95.99,
      costPrice: 45.00,
      status: 'active',
      categoryId: 2,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Blanco' },
          { attributeName: 'Talla', attributeValue: '36,37,38,39,40,41,42' },
          { attributeName: 'Material', attributeValue: 'Cuero Sintético' },
          { attributeName: 'Estilo', attributeValue: 'Urbano' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb', isPrimary: false, sortOrder: 2 },
        ],
      },
    },

    // ACCESORIOS (5 productos)
    {
      sku: 'PROD011',
      name: 'Bolso de Mano Cuero',
      slug: 'bolso-mano-cuero',
      description: 'Bolso elegante de cuero genuino con asa',
      price: 189.99,
      costPrice: 90.00,
      status: 'active',
      categoryId: 3,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Negro' },
          { attributeName: 'Material', attributeValue: 'Cuero Genuino' },
          { attributeName: 'Dimensiones', attributeValue: '30x20x10 cm' },
          { attributeName: 'Compartimentos', attributeValue: '3' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD012',
      name: 'Gafas de Sol Aviador',
      slug: 'gafas-sol-aviador',
      description: 'Gafas estilo aviador con protección UV400',
      price: 79.99,
      costPrice: 35.00,
      status: 'active',
      categoryId: 3,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Dorado/Negro' },
          { attributeName: 'Material Marco', attributeValue: 'Metal' },
          { attributeName: 'Protección UV', attributeValue: 'UV400' },
          { attributeName: 'Estilo', attributeValue: 'Aviador' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD013',
      name: 'Reloj Minimalista',
      slug: 'reloj-minimalista',
      description: 'Reloj de pulsera con diseño minimalista',
      price: 159.99,
      costPrice: 75.00,
      status: 'active',
      categoryId: 3,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Plateado' },
          { attributeName: 'Material Correa', attributeValue: 'Acero Inoxidable' },
          { attributeName: 'Movimiento', attributeValue: 'Cuarzo' },
          { attributeName: 'Resistencia Agua', attributeValue: '3 ATM' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD014',
      name: 'Bufanda de Lana',
      slug: 'bufanda-lana',
      description: 'Bufanda tejida en lana suave',
      price: 45.99,
      costPrice: 20.00,
      status: 'active',
      categoryId: 3,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Gris Claro' },
          { attributeName: 'Material', attributeValue: 'Lana 100%' },
          { attributeName: 'Dimensiones', attributeValue: '180x30 cm' },
          { attributeName: 'Cuidado', attributeValue: 'Lavar a mano' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
    {
      sku: 'PROD015',
      name: 'Cinturón de Cuero Trenzado',
      slug: 'cinturon-cuero-trenzado',
      description: 'Cinturón de cuero genuino con diseño trenzado',
      price: 55.99,
      costPrice: 25.00,
      status: 'active',
      categoryId: 3,
      attributes: {
        create: [
          { attributeName: 'Color', attributeValue: 'Marrón' },
          { attributeName: 'Material', attributeValue: 'Cuero Genuino' },
          { attributeName: 'Ancho', attributeValue: '3.5 cm' },
          { attributeName: 'Tallas', attributeValue: 'S,M,L,XL' },
        ],
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583c1', isPrimary: true, sortOrder: 1 },
          { imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', isPrimary: false, sortOrder: 2 },
        ],
      },
    },
  ];

  for (const product of products) {
    const { attributes, images, ...productData } = product;

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...productData,
        attributes: {
          deleteMany: {},
          create: attributes.create,
        },
        images: {
          deleteMany: {},
          create: images.create,
        },
      },
      create: {
        ...productData,
        attributes: attributes,
        images: images,
      },
    });
  }

  console.log('✅ 15 productos sembrados exitosamente');
}