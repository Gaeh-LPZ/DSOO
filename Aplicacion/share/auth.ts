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