"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryQuerySchema = exports.inventoryMovementSchema = exports.updateInventorySchema = exports.createInventorySchema = void 0;
var zod_1 = require("zod");
exports.createInventorySchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
    warehouseId: zod_1.z.number().int().positive(),
    quantity: zod_1.z.number().int().min(0),
    availableQuantity: zod_1.z.number().int().min(0).default(0),
    reservedQuantity: zod_1.z.number().int().min(0).default(0),
    thresholdQuantity: zod_1.z.number().int().min(0).optional(),
    location: zod_1.z.string().optional(),
});
exports.updateInventorySchema = exports.createInventorySchema.partial();
exports.inventoryMovementSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
    warehouseId: zod_1.z.number().int().positive(),
    quantity: zod_1.z.number().int(),
    type: zod_1.z.enum(['incoming', 'outgoing', 'adjustment', 'transfer']),
    referenceType: zod_1.z.string().optional(),
    referenceId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.inventoryQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('10'),
    search: zod_1.z.string().optional(),
    warehouseId: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    productId: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    lowStock: zod_1.z.enum(['true', 'false']).optional(),
    sortBy: zod_1.z.enum(['productName', 'quantity', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
