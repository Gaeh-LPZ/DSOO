import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email().endsWith("@luxury.com", {
        message: "Solo se aceptan correos @luxury.com"
    }),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});