"use server"
import { registerSchema, loginSchema } from "./user.schema";
import { UserService } from "./application/user.service";
import { UserRepository } from "./infrastructure/user.repository";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { HashService } from "@/infrastructure/security/has.service";
import { cookies } from "next/headers";

const userRepo = new UserRepository();
const hashService = new HashService();
const jwtService = new JwtService();
const userService = new UserService(userRepo, hashService, jwtService);

export async function registerAction(data: any) {
  const parsed = registerSchema.parse(data);
  return userService.register(parsed);
}

export async function loginAction(data: any) {
    const parsed = loginSchema.parse(data)
    const result = await userService.login(parsed.email, parsed.password)
    
    ;(await
    // Guardar token en cookie httpOnly
    cookies()).set("token", result.token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 10 // 10 horas
    })
}

