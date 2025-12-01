import { PrismaClient, ProductStatus, OrderStatus, PaymentStatus, InventoryMovementType, AddressType, CouponType, CouponAppliesTo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Fetch Admin User (assuming it exists from previous seed or manual creation)
    const admin = await prisma.user.findFirst({
        where: { role: 'admin' },
    });

    if (!admin) {
        console.error('❌ No admin user found. Please create an admin user first.');
        return;
    }

    console.log(`✅ Using Admin User: ${admin.email}`);

    // 2. Create Categories
    const categoriesData = [
        { name: 'Lencería', slug: 'lenceria', description: 'Ropa interior sensual y elegante' },
        { name: 'Juguetes', slug: 'juguetes', description: 'Juguetes para adultos' },
        { name: 'Accesorios', slug: 'accesorios', description: 'Accesorios complementarios' },
        { name: 'Bienestar', slug: 'bienestar', description: 'Aceites y lubricantes' },
    ];

    const categories: Record<string, any> = {};
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: { ...cat, status: 'active' },
        });
        categories[cat.slug] = category;
    }
    console.log('✅ Categories created');

    // 3. Create Suppliers
    const suppliersData = [
        { name: 'Proveedor Global S.A.', email: 'contacto@proveedorglobal.com', phone: '555-1001' },
        { name: 'Distribuidora Íntima', email: 'ventas@intima.com', phone: '555-1002' },
    ];

    const suppliers = [];
    for (const sup of suppliersData) {
        const supplier = await prisma.supplier.upsert({
            where: { name: sup.name },
            update: {},
            create: { ...sup, status: 'active' },
        });
        suppliers.push(supplier);
    }
    console.log('✅ Suppliers created');

    // 4. Create Warehouse
    const warehouse = await prisma.warehouse.upsert({
        where: { name: 'Almacén Central' },
        update: {},
        create: {
            name: 'Almacén Central',
            location: 'Ciudad de México',
            address: 'Av. Insurgentes Sur 123',
            status: 'active',
        },
    });
    console.log('✅ Warehouse created');

    // 5. Create Products
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

    const products = [];
    for (const prod of productsData) {
        const product = await prisma.product.upsert({
            where: { sku: prod.sku },
            update: {},
            create: {
                name: prod.name,
                sku: prod.sku,
                slug: prod.slug,
                description: prod.description,
                price: prod.price,
                costPrice: prod.costPrice,
                status: ProductStatus.active,
                categoryId: categories[prod.categorySlug].id,
                createdById: admin.id,
            },
        });
        products.push(product);

        // Create Inventory
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

        // Create Inventory Movement (Initial Stock)
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
    console.log('✅ Products and Inventory created');

    // 6. Create Customers
    const customersData = [
        { name: 'Ana García', email: 'ana@example.com', phone: '555-2001' },
        { name: 'Carlos López', email: 'carlos@example.com', phone: '555-2002' },
        { name: 'María Rodríguez', email: 'maria@example.com', phone: '555-2003' },
    ];

    const customers = [];
    for (const cust of customersData) {
        const customer = await prisma.customer.upsert({
            where: { email: cust.email },
            update: {},
            create: {
                name: cust.name,
                email: cust.email,
                phone: cust.phone,
                status: 'active',
            },
        });
        customers.push(customer);

        // Create Address
        await prisma.customerAddress.create({
            data: {
                customerId: customer.id,
                addressType: AddressType.shipping,
                addressLine1: 'Calle Falsa 123',
                city: 'Ciudad de México',
                state: 'CDMX',
                postalCode: '01000',
                country: 'México',
                isDefault: true,
            },
        });
    }
    console.log('✅ Customers created');

    // 7. Create Coupons
    const couponsData = [
        { code: 'BIENVENIDA10', type: CouponType.percentage, value: 10, status: 'active' },
        { code: 'VERANO20', type: CouponType.percentage, value: 20, status: 'expired' },
        { code: 'DESCUENTO50', type: CouponType.fixed, value: 50, status: 'active' },
    ];

    for (const coup of couponsData) {
        await prisma.coupon.upsert({
            where: { code: coup.code },
            update: {},
            create: {
                code: coup.code,
                type: coup.type,
                value: coup.value,
                status: coup.status as any,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                appliesTo: CouponAppliesTo.all,
                createdById: admin.id,
            },
        });
    }
    console.log('✅ Coupons created');

    // 8. Create Orders
    const orderStatuses = [OrderStatus.delivered, OrderStatus.shipped, OrderStatus.processing, OrderStatus.pending, OrderStatus.cancelled];

    for (let i = 0; i < 10; i++) {
        const customer = customers[i % customers.length];
        const status = orderStatuses[i % orderStatuses.length];
        const itemsCount = Math.floor(Math.random() * 3) + 1;

        // Select random products
        const orderItems = [];
        let subtotal = 0;

        for (let j = 0; j < itemsCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            const price = Number(product.price);
            const total = price * quantity;

            orderItems.push({
                productId: product.id,
                quantity,
                unitPrice: price,
                totalPrice: total,
            });
            subtotal += total;
        }

        const taxAmount = subtotal * 0.16;
        const shippingAmount = subtotal > 1000 ? 0 : 150;
        const totalAmount = subtotal + taxAmount + shippingAmount;

        await prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now()}-${i}`,
                customerId: customer.id,
                status: status,
                subtotal,
                taxAmount,
                shippingAmount,
                totalAmount,
                paymentStatus: status === OrderStatus.cancelled ? PaymentStatus.refunded : PaymentStatus.paid,
                items: {
                    create: orderItems,
                },
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in last 30 days
            },
        });
    }
    console.log('✅ Orders created');

    // 9. Create Returns (for the first order if delivered)
    const deliveredOrder = await prisma.order.findFirst({
        where: { status: OrderStatus.delivered },
        include: { items: true },
    });

    if (deliveredOrder && deliveredOrder.items.length > 0) {
        const itemToReturn = deliveredOrder.items[0];
        await prisma.return.create({
            data: {
                returnNumber: `RET-${deliveredOrder.orderNumber}`,
                orderId: deliveredOrder.id,
                customerId: deliveredOrder.customerId!,
                reason: 'Talla incorrecta',
                totalAmount: itemToReturn.totalPrice,
                status: 'pending',
                items: {
                    create: {
                        orderItemId: itemToReturn.id,
                        productId: itemToReturn.productId,
                        quantity: itemToReturn.quantity,
                        unitPrice: itemToReturn.unitPrice,
                        totalPrice: itemToReturn.totalPrice,
                        reason: 'Talla incorrecta',
                    },
                },
            },
        });
        console.log('✅ Return created');
    }

    console.log('🎉 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
