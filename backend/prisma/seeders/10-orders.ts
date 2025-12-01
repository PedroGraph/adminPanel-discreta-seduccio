import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrders(): Promise<void> {
    const customers = await prisma.customer.findMany();
    const products = await prisma.product.findMany();

    if (customers.length === 0 || products.length === 0) {
        console.log('⚠️ No hay clientes o productos para crear órdenes');
        return;
    }

    const orderStatuses = [OrderStatus.delivered, OrderStatus.shipped, OrderStatus.processing, OrderStatus.pending, OrderStatus.cancelled];

    for (let i = 0; i < 10; i++) {
        const customer = customers[i % customers.length];
        const status = orderStatuses[i % orderStatuses.length];
        const itemsCount = Math.floor(Math.random() * 3) + 1;

        // Check if order already exists
        const orderNumber = `ORD-${Date.now()}-${i}`;
        const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
        if (existingOrder) continue;

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

        const order = await prisma.order.create({
            data: {
                orderNumber,
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
            include: { items: true },
        });

        // Create return for the first delivered order
        if (status === OrderStatus.delivered && i === 0 && order.items.length > 0) {
            const itemToReturn = order.items[0];
            await prisma.return.create({
                data: {
                    returnNumber: `RET-${order.orderNumber}`,
                    orderId: order.id,
                    customerId: customer.id,
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
            console.log('✅ Devolución creada para orden entregada');
        }
    }
    console.log('✅ Órdenes sembradas exitosamente');
}
