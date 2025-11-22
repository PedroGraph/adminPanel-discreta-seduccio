"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponQuerySchema = exports.updateCouponSchema = exports.createCouponSchema = void 0;
var zod_1 = require("zod");
exports.createCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1, 'El código es requerido'),
    type: zod_1.z.enum(['percentage', 'fixed']),
    value: zod_1.z.number().positive('El valor debe ser positivo'),
    minPurchaseAmount: zod_1.z.number().positive('El monto mínimo de compra debe ser positivo').optional(),
    maxDiscountAmount: zod_1.z.number().positive('El monto máximo de descuento debe ser positivo').optional(),
    startsAt: zod_1.z.string().datetime(),
    expiresAt: zod_1.z.string().datetime(),
    usageLimit: zod_1.z.number().int().positive().optional(),
    usageLimitPerUser: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'expired']).default('active'),
    appliesTo: zod_1.z.enum(['all', 'categories', 'products']).default('all'),
    applicableIds: zod_1.z.array(zod_1.z.number().int().positive()).optional(),
});
exports.updateCouponSchema = exports.createCouponSchema.partial();
exports.couponQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('10'),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'expired']).optional(),
    type: zod_1.z.enum(['percentage', 'fixed']).optional(),
    sortBy: zod_1.z.enum(['code', 'value', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
