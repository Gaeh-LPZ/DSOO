import { z } from "zod"

export const notifyLowStockSchema = z.object({
    productId: z.string().uuid(),
    storeId: z.string().uuid(),
    message: z.string().min(10),
})

export const dismissNotificationSchema = z.object({
    id: z.string().uuid(),
})
