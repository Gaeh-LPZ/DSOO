import { z } from "zod";

export const createReturnSchema = z.object({
    saleId: z.string().uuid(),  
    reason: z.string().min(4)  
})

export const approveReturnSchema = z.object({
    returnId: z.string(),
    userId: z.string()

})

export const getReturnSchema = z.object({
    returnId: z.string()
})