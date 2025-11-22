"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = exports.loginValidation = exports.updateUserSchema = exports.registerSchema = exports.loginSchema = void 0;
var zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: zod_1.z.enum(['admin', 'manager', 'employee']).default('employee'),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    email: zod_1.z.string().email('Email inválido').optional(),
    role: zod_1.z.enum(['admin', 'manager', 'employee']).optional(),
    status: zod_1.z.enum(['active', 'inactive']).optional(),
});
var loginValidation = function (req, res, next) {
    try {
        exports.loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Datos inválidos',
                details: error.errors.map(function (err) { return ({
                    field: err.path.join('.'),
                    message: err.message
                }); })
            });
        }
        next(error);
    }
};
exports.loginValidation = loginValidation;
var registerValidation = function (req, res, next) {
    try {
        exports.registerSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                error: 'Datos inválidos',
                details: error.errors.map(function (err) { return ({
                    field: err.path.join('.'),
                    message: err.message
                }); })
            });
        }
        next(error);
    }
};
exports.registerValidation = registerValidation;
