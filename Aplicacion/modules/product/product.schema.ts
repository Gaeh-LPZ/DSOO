import { z } from "zod"

export const createProductSchema = z.object({
    name: z.string().min(2),
    sku: z.string().min(1),
    price: z.number().positive(),
    cost: z.number().positive(),
    imageUrl: z.string().url().optional()
})

export const updateProductSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).optional(),
    price: z.number().positive().optional(),
    cost: z.number().positive().optional(),
    imageUrl: z.string().url().optional()
})

export const deactivateProductSchema = z.object({
    id: z.string().uuid(),
})

export const listProductsSchema = z.object({
    cantidad: z.number().int().positive().default(20),
})