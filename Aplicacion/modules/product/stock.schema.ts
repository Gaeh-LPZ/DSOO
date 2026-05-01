import { z } from "zod"

export const increaseStockSchema = z.object({
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
    cantidad: z.number().int().positive(),
})

export const decreaseStockSchema = z.object({
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
    cantidad: z.number().int().positive(),
})

export const getStockSchema = z.object({
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
})