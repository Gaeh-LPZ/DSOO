import { registerSchema, loginSchema } from "./user.schema";
import { UserService } from "./application/user.service";
import { UserRepository } from "./infrastructure/user.repository";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { HashService } from "@/infrastructure/security/has.service";

const userRepo = new UserRepository();
const hashService = new HashService();
const jwtService = new JwtService();
const userService = new UserService(userRepo, hashService, jwtService);

export async function registerAction(data: any) {
  const parsed = registerSchema.parse(data);
  return userService.register(parsed);
}

export async function loginAction(data: any) {
  const parsed = loginSchema.parse(data);
  return userService.login(parsed.email, parsed.password);
}

