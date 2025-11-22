"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = exports.loginValidation = void 0;
var express_validator_1 = require("express-validator");
var validateRequest_js_1 = require("@middleware/validateRequest.js");
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('El email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    validateRequest_js_1.validateRequest
];
exports.registerValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('El email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/\d/)
        .withMessage('La contraseña debe contener al menos un número')
        .matches(/[a-z]/)
        .withMessage('La contraseña debe contener al menos una letra minúscula')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula'),
    (0, express_validator_1.body)('role')
        .isIn(['admin', 'manager', 'employee'])
        .withMessage('El rol debe ser admin, manager o employee'),
    validateRequest_js_1.validateRequest
];
