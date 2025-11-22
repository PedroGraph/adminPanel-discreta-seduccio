"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidation = exports.createProductValidation = exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
var zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    sku: zod_1.z.string().min(1, "El SKU es requerido"),
    name: zod_1.z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    slug: zod_1.z.string().min(2, "El slug debe tener al menos 2 caracteres"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive("El precio debe ser positivo"),
    costPrice: zod_1.z
        .number()
        .positive("El precio de costo debe ser positivo")
        .optional(),
    status: zod_1.z.enum(["active", "inactive", "draft"]).default("draft"),
    categoryId: zod_1.z.number().int().positive().optional(),
    attributes: zod_1.z
        .object({
        create: zod_1.z.array(zod_1.z.object({
            attributeName: zod_1.z.string(),
            attributeValue: zod_1.z.string(),
        })),
    })
        .optional(),
    images: zod_1.z
        .object({
        create: zod_1.z.array(zod_1.z.object({
            imageUrl: zod_1.z.string().url("URL de imagen inválida"),
            isPrimary: zod_1.z.boolean().default(false),
            sortOrder: zod_1.z.number().int().default(0),
        })),
    })
        .optional(),
    category: zod_1.z
        .object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        status: zod_1.z.enum(["active", "inactive", "draft"]).default("draft"),
    })
        .optional(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().positive())
        .default("1"),
    limit: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().positive())
        .default("10"),
    search: zod_1.z.string().optional(),
    categoryId: zod_1.z
        .string()
        .transform(Number)
        .pipe(zod_1.z.number().int().positive())
        .optional(),
    status: zod_1.z.enum(["active", "inactive", "draft"]).optional(),
    sortBy: zod_1.z
        .enum(["name", "price", "createdAt", "updatedAt"])
        .default("createdAt"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
var createProductValidation = function (req, res, next) {
    try {
        exports.createProductSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: error.errors.map(function (err) { return ({
                    field: err.path.join("."),
                    message: err.message,
                }); }),
            });
        }
        next(error);
    }
};
exports.createProductValidation = createProductValidation;
var updateProductValidation = function (req, res, next) {
    try {
        exports.updateProductSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: error.errors.map(function (err) { return ({
                    field: err.path.join("."),
                    message: err.message,
                }); }),
            });
        }
        next(error);
    }
};
exports.updateProductValidation = updateProductValidation;
