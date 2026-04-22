import { z } from "zod";

export const createOrderSchema = z.object({
    supplierId: z.string(),
    storeId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        cost: z.number().positive()
    }))
})

export const receiveOrderSchema = z.object({
    orderId: z.string()
})

export const cancelOrderSchema = z.object({
    orderId: z.string()
})