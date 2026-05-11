"use server"
import { registerCustomerSchema, addPointsSchema, loginSchema, updateCustomerSchema, updatePasswordSchema } from "./customer.schema";
import { CustomerService } from "./application/customer.service";
import { CustomerRepository } from "./infrastructure/customer.repository";
import { cookies } from "next/headers";
import { HashService } from "@/infrastructure/security/has.service";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { revalidatePath } from "next/cache";
import { getSession } from "@/share/auth";

const customerRepo = new CustomerRepository();
const hashService = new HashService();
const jwtService = new JwtService();
const customerService = new CustomerService(customerRepo, hashService, jwtService);

export async function registerCustomerAction(data: any) {
    try {
        const parsed = registerCustomerSchema.parse(data);
        await customerService.register(parsed);
        return { success: true, message: "Registro exitoso." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al registrarse." };
    }
}

export async function updatePasswordAction(data: any) {
    const parsed = updatePasswordSchema.parse(data);
    return customerService.updatePassword(parsed.customerId, parsed.password, parsed.newpassword);
}

export async function addPointsAction(data: any) {
    const parsed = addPointsSchema.parse(data);
    return customerService.addPointsFromSale(parsed.customerId, parsed.totalAmount);
}

export async function loginCustomerAction(data: any) {
    const parsed = loginSchema.parse(data)
    const result = await customerService.login(parsed.email, parsed.password)

        ; (await
            // Guardar token en cookie httpOnly
            cookies()).set("token", result.token, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 10 // 10 horas
            })
}

export async function updateCustomerAction(formData: any) {
    try {
        const session = await getSession();
        if (!session) return { success: false, message: "No autorizado." };

        const parsed = updateCustomerSchema.parse(formData);

        await customerService.updateCustomer(session.userId, parsed);

        revalidatePath("/perfil");
        return { success: true, message: "Perfil actualizado." };
    } catch (error: any) {
        return { success: false, message: error.message || "Error al actualizar." };
    }
}

export async function getCustomerProfileAction() {
    const session = await getSession();
    if (!session) return { error: "No autorizado" };

    try {
        const data = await customerService.getProfile(session.userId);
        return { success: true, data };
    } catch (e) {
        return { error: "Error al obtener perfil" };
    }
}