"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReturnSchema = exports.orderQuerySchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
var zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    customerId: zod_1.z.number().int().positive(),
    shippingAddressId: zod_1.z.number().int().positive(),
    billingAddressId: zod_1.z.number().int().positive(),
    shippingMethodId: zod_1.z.number().int().positive(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().positive(),
        price: zod_1.z.number().positive(),
    })).min(1, 'La orden debe tener al menos un producto'),
    notes: zod_1.z.string().optional(),
    couponCode: zod_1.z.string().optional(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('10'),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
    customerId: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    dateFrom: zod_1.z.string().datetime().optional(),
    dateTo: zod_1.z.string().datetime().optional(),
    sortBy: zod_1.z.enum(['orderNumber', 'totalAmount', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.createReturnSchema = zod_1.z.object({
    orderId: zod_1.z.number().int().positive(),
    reason: zod_1.z.string().min(1, 'La razón es requerida'),
    items: zod_1.z.array(zod_1.z.object({
        orderItemId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().positive(),
        reason: zod_1.z.string().min(1, 'La razón es requerida'),
    })).min(1, 'La devolución debe tener al menos un producto'),
    notes: zod_1.z.string().optional(),
});
