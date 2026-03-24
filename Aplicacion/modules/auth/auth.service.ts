import bcrypt from "bcrypt"
import { RegisterInput, LoginInput } from "./auth.schema"

import { prisma } from "@/lib/prisma";

export async function registerUser(data: RegisterInput) {
    const { name, email, password } = data

    // Verificar si existe
    const existing = await prisma.user.findUnique({
        where: { email },
    })

    if (existing) {
        throw new Error("Usuario existente")
    }

    // Hash
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    return user
}


export async function loginUser(data: LoginInput) {
    const { email, password } = data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) throw new Error("No existe Usuario")

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) throw new Error("Incorrecta la contrasena")

    return user
}

export const AuthService = {
    // Obtener todos los usuarios incluyendo sus nombres de roles
    async findAllUsers() {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                // Relación UserRole[]
                roles: {
                    select: {
                        role: {
                            select: { name: true }
                        }
                    }
                },
                // El conteo de ventas
                _count: {
                    select: { sales: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    // Agregar un nuevo rol a un usuario
    async addRoleToUser(userId: string, roleId: string) {
        return await prisma.userRole.create({
            data: {
                userId: userId,
                roleId: roleId
            }
        });
    },

    // Buscar un usuario específico con sus roles
    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                roles: {
                    include: { role: true }
                }
            }
        });
    },

    async toggleAdminStatus(userId: string) {
        //Buscamos el ID del rol "ADMIN"
        const adminRole = await prisma.role.findUnique({
            where: { name: "ADMIN" }
        });

        if (!adminRole) throw new Error("El rol 'ADMIN' no existe en la base de datos");

        //Verificamos si el usuario ya tiene ese rol asignado
        const existingRole = await prisma.userRole.findUnique({
            where: {
                userId_roleId: {
                    userId: userId,
                    roleId: adminRole.id
                }
            }
        });

        if (existingRole) {
            // Si ya lo tiene -> se lo quitamos
            return await prisma.userRole.delete({
                where: {
                    userId_roleId: {
                        userId: userId,
                        roleId: adminRole.id
                    }
                }
            });
        } else {
            // Si no lo tiene, se lo agregamos
            return await prisma.userRole.create({
                data: {
                    userId: userId,
                    roleId: adminRole.id
                }
            });
        }
    }
};

