import { z } from "zod";

export const generateInvoiceSchema = z.object({
    saleId: z.string(),    
})

