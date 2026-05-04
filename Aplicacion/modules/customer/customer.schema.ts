import { z } from "zod";

export const registerCustomerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

export const addPointsSchema = z.object({
    customerId: z.string().uuid(),
    totalAmount: z.number().min(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});