"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriberSchema = exports.emailCampaignQuerySchema = exports.updateEmailCampaignSchema = exports.createEmailCampaignSchema = exports.updateEmailTemplateSchema = exports.createEmailTemplateSchema = void 0;
var zod_1 = require("zod");
exports.createEmailTemplateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    subject: zod_1.z.string().min(1, 'El asunto es requerido'),
    content: zod_1.z.string().min(1, 'El contenido es requerido'),
    type: zod_1.z.enum(['transactional', 'marketing']),
    variables: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateEmailTemplateSchema = exports.createEmailTemplateSchema.partial();
exports.createEmailCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es requerido'),
    subject: zod_1.z.string().min(1, 'El asunto es requerido'),
    content: zod_1.z.string().min(1, 'El contenido es requerido'),
    templateId: zod_1.z.number().int().positive().optional(),
    scheduledAt: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['draft', 'scheduled', 'sent', 'cancelled']).default('draft'),
    targetAudience: zod_1.z.enum(['all', 'subscribers', 'customers']).default('all'),
    filters: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.updateEmailCampaignSchema = exports.createEmailCampaignSchema.partial();
exports.emailCampaignQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('1'),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).default('10'),
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['draft', 'scheduled', 'sent', 'cancelled']).optional(),
    type: zod_1.z.enum(['transactional', 'marketing']).optional(),
    sortBy: zod_1.z.enum(['name', 'scheduledAt', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.subscriberSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    status: zod_1.z.enum(['active', 'inactive', 'unsubscribed']).default('active'),
});
