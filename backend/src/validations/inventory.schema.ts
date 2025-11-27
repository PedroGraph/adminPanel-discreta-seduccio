import { z } from 'zod';

export const createInventorySchema = z.object({
  productId: z.number().int().positive(),
  warehouseId: z.number().int().positive(),
  quantity: z.number().int().min(0),
  availableQuantity: z.number().int().min(0).default(0),
  reservedQuantity: z.number().int().min(0).default(0),
  thresholdQuantity: z.number().int().min(0).optional(),
  location: z.string().optional(),
});

export const updateInventorySchema = createInventorySchema.partial();

export const inventoryMovementSchema = z.object({
  productId: z.number().int().positive(),
  type: z.enum(['entrada', 'salida', 'ajuste', 'incoming', 'outgoing', 'adjustment', 'transfer']),
  quantity: z.number().int().positive(),
  reason: z.string().optional(),
  cost: z.number().optional(),
});

export const inventoryQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive()).default('10'),
  search: z.string().optional(),
  warehouseId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  productId: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  lowStock: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['productName', 'quantity', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});