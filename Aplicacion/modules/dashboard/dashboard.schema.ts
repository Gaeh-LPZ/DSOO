import { z } from "zod"

export const getTopProductsSchema = z.object({
    storeId: z.string().uuid(),
    limit: z.number().int().positive().default(10)
})

export const getTotalSalesSchema = z.object({
    storeId: z.string().uuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
})