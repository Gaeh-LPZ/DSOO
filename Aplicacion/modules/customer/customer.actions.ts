"use server"
import { registerCustomerSchema, addPointsSchema, loginSchema } from "./customer.schema";
import { CustomerService } from "./application/customer.service";
import { CustomerRepository } from "./infrastructure/customer.repository";
import { cookies } from "next/headers";
import { HashService } from "@/infrastructure/security/has.service";
import { JwtService } from "@/infrastructure/security/jwt.service";

const customerRepo = new CustomerRepository();
const hashService = new HashService();
const jwtService = new JwtService();
const customerService = new CustomerService(customerRepo, hashService, jwtService);

export async function registerCustomerAction(data: any) {
    const parsed = registerCustomerSchema.parse(data);
    return customerService.register(parsed);
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