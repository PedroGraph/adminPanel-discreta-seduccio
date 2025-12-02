import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOrders(): Promise<void> {
    const customers = await prisma.customer.findMany({ include: { addresses: true } });
    const products = await prisma.product.findMany();
    const coupons = await prisma.coupon.findMany({ where: { status: 'active' } });

    if (customers.length === 0 || products.length === 0) {
        console.log('⚠️ No hay clientes o productos para crear órdenes');
        return;
    }

    const orderStatuses = [
        OrderStatus.delivered,
        OrderStatus.delivered,
        OrderStatus.delivered,
        OrderStatus.shipped,
        OrderStatus.shipped,
        OrderStatus.processing,
        OrderStatus.processing,
        OrderStatus.pending,
        OrderStatus.cancelled,
    ];

    const paymentMethods = ['Tarjeta de Crédito', 'Tarjeta de Débito', 'PayPal', 'Transferencia', 'Efectivo'];

    // Crear 30 órdenes
    for (let i = 0; i < 30; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        const itemsCount = Math.floor(Math.random() * 4) + 1; // 1-4 items
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Fecha aleatoria en los últimos 90 días
        const daysAgo = Math.floor(Math.random() * 90);
        const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        const orderNumber = `ORD-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`;

        const existingOrder = await prisma.order.findUnique({ where: { orderNumber } });
        if (existingOrder) continue;

        // Seleccionar productos aleatorios
        const orderItems = [];
        let subtotal = 0;
        const selectedProducts = new Set();

        for (let j = 0; j < itemsCount; j++) {
            let product;
            do {
                product = products[Math.floor(Math.random() * products.length)];
            } while (selectedProducts.has(product.id));

            selectedProducts.add(product.id);
            const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
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

        // Aplicar cupón aleatoriamente (30% de probabilidad)
        let discountAmount = 0;
        let selectedCoupon = null;
        if (Math.random() < 0.3 && coupons.length > 0) {
            selectedCoupon = coupons[Math.floor(Math.random() * coupons.length)];
            if (subtotal >= Number(selectedCoupon.minPurchase || 0)) {
                if (selectedCoupon.type === 'percentage') {
                    discountAmount = subtotal * (Number(selectedCoupon.value) / 100);
                } else {
                    discountAmount = Number(selectedCoupon.value);
                }
            }
        }

        const taxAmount = (subtotal - discountAmount) * 0.16; // IVA 16%
        const shippingAmount = subtotal > 1000 ? 0 : 150; // Envío gratis sobre $1000
        const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;

        // Determinar estado de pago
        let paymentStatus: PaymentStatus;
        if (status === OrderStatus.cancelled) {
            paymentStatus = PaymentStatus.refunded;
        } else if (status === OrderStatus.pending) {
            paymentStatus = PaymentStatus.pending;
        } else {
            paymentStatus = PaymentStatus.paid;
        }

        // Obtener dirección del cliente
        const shippingAddress = customer.addresses.find(a => a.addressType === 'shipping') || customer.addresses[0];
        const billingAddress = customer.addresses.find(a => a.addressType === 'billing') || shippingAddress;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                customerId: customer.id,
                status,
                subtotal,
                taxAmount,
                shippingAmount,
                discountAmount,
                totalAmount,
                paymentStatus,
                paymentMethod,
                couponId: selectedCoupon?.id,
                shippingAddressId: shippingAddress?.id,
                billingAddressId: billingAddress?.id,
                items: {
                    create: orderItems,
                },
                createdAt: orderDate,
                updatedAt: orderDate,
            },
            include: { items: true },
        });

        // Crear devoluciones para algunas órdenes entregadas (10% de probabilidad)
        if (status === OrderStatus.delivered && Math.random() < 0.1 && order.items.length > 0) {
            const itemToReturn = order.items[Math.floor(Math.random() * order.items.length)];
            const returnQuantity = Math.floor(Math.random() * itemToReturn.quantity) + 1;
            const returnAmount = Number(itemToReturn.unitPrice) * returnQuantity;

            const returnDate = new Date(orderDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000); // 0-14 días después
            const returnNumber = `RET-${returnDate.getFullYear()}${String(returnDate.getMonth() + 1).padStart(2, '0')}${String(returnDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(4, '0')}`;

            const reasons = [
                'Talla incorrecta',
                'Color no coincide con la imagen',
                'Producto defectuoso',
                'No cumple expectativas',
                'Llegó dañado',
            ];

            await prisma.return.create({
                data: {
                    returnNumber,
                    orderId: order.id,
                    customerId: customer.id,
                    reason: reasons[Math.floor(Math.random() * reasons.length)],
                    totalAmount: returnAmount,
                    refundAmount: returnAmount,
                    refundMethod: paymentMethod,
                    status: Math.random() < 0.7 ? 'published' : 'pending', // 70% procesadas
                    refundStatus: Math.random() < 0.7 ? 'processed' : 'pending',
                    items: {
                        create: {
                            orderItemId: itemToReturn.id,
                            productId: itemToReturn.productId,
                            quantity: returnQuantity,
                            unitPrice: itemToReturn.unitPrice,
                            totalPrice: returnAmount,
                            reason: reasons[Math.floor(Math.random() * reasons.length)],
                        },
                    },
                    createdAt: returnDate,
                },
            });
        }
    }

    console.log('✅ Órdenes sembradas exitosamente');
}
