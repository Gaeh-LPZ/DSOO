import { z } from "zod";

export const registerCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  birthDate: z.coerce.date(),
});

export const addPointsSchema = z.object({
  customerId: z.string().uuid(),
  totalAmount: z.number().min(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().optional(), 
  rfc: z.string().optional(),
});