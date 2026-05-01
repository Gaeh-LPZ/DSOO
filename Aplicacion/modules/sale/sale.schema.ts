import { z } from "zod"

export const createSaleSchema = z.object({
    userId: z.string().uuid(),
    storeId: z.string().uuid(),
    customerId: z.string().uuid().optional(),
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })).min(1),
})

export const paySaleSchema = z.object({
    saleId: z.string().uuid(),
    amount: z.number().positive(),
    method: z.enum(["CASH", "CARD", "CREDIT"]),
})

export const getSaleSchema = z.object({
    saleId: z.string().uuid(),
})