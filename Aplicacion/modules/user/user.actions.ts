"use server"
import { registerSchema, loginSchema } from "./user.schema";
import { UserService } from "./application/user.service";
import { UserRepository } from "./infrastructure/user.repository";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { HashService } from "@/infrastructure/security/has.service";
import { cookies } from "next/headers";
import { requireRole } from "@/share/auth";

const userRepo = new UserRepository();
const hashService = new HashService();
const jwtService = new JwtService();
const userService = new UserService(userRepo, hashService, jwtService);

export async function registerAction(data: any) {
    const parsed = registerSchema.parse(data);
    await userService.register(parsed);
}

export async function loginAction(data: any) {
    const parsed = loginSchema.parse(data)
    const result = await userService.login(parsed.email, parsed.password)

        ; (await
            // Guardar token en cookie httpOnly
            cookies()).set("token", result.token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 10 // 10 horas
            })
    return { role: result.role }
}

export async function listUsersAction() {
    await requireRole("GERENTE")
    return userService.listUsers()
}

export async function getRolesAction() {
    await requireRole(["ADMIN"])
    const roles = await userService.getRoles();

    return roles.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "Sin descripción",
        permission: r.permission.map((p: any) => p.name),
    }));
}

export async function createRoleAction(data: { name: string; description: string; permissions: string[] }) {
    await requireRole(["ADMIN"])
    return userService.createRole(data);
}

export async function getPermissionsAction() {
    await requireRole(["ADMIN"])
    const perms = await userService.getPermissions();
    return perms.map(p => ({ id: p.id, name: p.name }));
}

export async function getSystemUserIdAction(): Promise<string> {
    return userService.getSystemUserId()
}
