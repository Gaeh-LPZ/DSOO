import { z } from "zod"

export const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
})

export type RegisterInput = z.infer<typeof RegisterSchema>


export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})

export type LoginInput = z.infer<typeof LoginSchema>