"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQuerySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
var zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    slug: zod_1.z.string().min(2, 'El slug debe tener al menos 2 caracteres'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive']).default('active'),
    parentId: zod_1.z.number().int().positive().optional(),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
exports.categoryQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('10'),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive']).optional(),
    parentId: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    sortBy: zod_1.z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
