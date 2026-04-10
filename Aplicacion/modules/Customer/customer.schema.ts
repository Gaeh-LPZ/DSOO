import { z } from "zod";

export const registerCustomerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
});

export const addPointsSchema = z.object({
    customerId: z.string().uuid(),
    totalAmount: z.number().min(100),
});