import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().uuid(),
});

export const removeCartItemSchema = z.object({
    productId: z.string().uuid(),
});

export const updateCartItemQuantitySchema =
z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
});