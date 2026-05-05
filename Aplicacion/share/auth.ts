import { cookies } from "next/headers"
import { JwtService } from "@/infrastructure/security/jwt.service"

const jwtService = new JwtService()

export async function requireRole(role: string) {
    const token = (await cookies()).get("token")?.value
    if (!token) throw new Error("No autenticado")

    const payload = await jwtService.verify(token) as { roles: string[], userId: string }

    if (!payload.roles.includes(role)) {
        throw new Error("Sin permisos")
    }

    return payload
}

export async function getSession() {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const payload = await jwtService.verify(token);
        return payload as { userId: string };
    } catch (error) {
        console.error("Token inválido o expirado");
        return null;
    }
}