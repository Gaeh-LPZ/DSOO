import { NextRequest, NextResponse } from "next/server"
import { JwtService } from "@/infrastructure/security/jwt.service"

const jwtService = new JwtService()

// Rutas que NO necesitan token
const publicRoutes = ["/login", "/registro"]

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    // Si es ruta pública, dejar pasar
    if (publicRoutes.includes(path)) {
        return NextResponse.next()
    }

    // Verificar token
    const token = request.cookies.get("token")?.value

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
        await jwtService.verify(token)
        return NextResponse.next()  // token válido, dejar pasar
    } catch {
        return NextResponse.redirect(new URL("/login", request.url))  // token inválido
    }
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api).*)"]
}