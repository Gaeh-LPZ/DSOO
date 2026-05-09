// store.schema.ts
import { z } from "zod"

export const createStoreSchema = z.object({
    name: z.string().min(2),
})

export const getStoreSchema = z.object({
    id: z.string().uuid(),
})

export const getStoreReportSchema = z.object({
    startDate: z.coerce.date(),  // coerce convierte string "2024-01-01" a Date
    endDate:   z.coerce.date(),
})