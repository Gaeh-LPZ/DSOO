'use server'
import { cookies } from "next/headers";
import { verifyToken } from "./tokens";
import { prisma } from "@/lib/prisma";


export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) return null;

    // Solo traemos los campos necesarios para no sobrecargar la red
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        sales: true
      }
    });

    return user;
  } catch (error) {
    return null; // Si el token es basura o expiró, simplemente no hay usuario
  }
}