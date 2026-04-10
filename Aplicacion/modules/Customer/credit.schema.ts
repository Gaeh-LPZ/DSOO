import { z } from "zod";

export const updateCreditParamsSchema = z.object({
    customerId: z.string().uuid(),
    interest: z.number().positive(),
    dueDate: z.coerce.date(),
});

export const applyPaymentSchema = z.object({
    customerId: z.string().uuid(),
    amount: z.number().positive(),
});

export const getAccountSummarySchema = z.object({
    customerId: z.string().uuid(),
});