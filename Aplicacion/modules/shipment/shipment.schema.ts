import { z } from "zod";

export const createShipmentSchema = z.object({
    saleId: z.string().uuid(),    
})

export const dispatchShipmentSchema = z.object({
    shipmentId: z.string(),
    tracking: z.string().optional()

})

export const deliverShipmentSchema = z.object({
    shipmentId: z.string()
})