// store.schema.ts
import { z } from "zod"

export const createStoreSchema = z.object({
    name: z.string().min(2),
})

export const getStoreSchema = z.object({
    id: z.string().uuid(),
})