"use server"
import { registerCustomerSchema, addPointsSchema, loginSchema } from "./customer.schema";
import { CustomerService } from "./application/customer.service";
import { CustomerRepository } from "./infrastructure/customer.repository";
import { cookies } from "next/headers";
import { HashService } from "@/infrastructure/security/has.service";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { registrarNuevoCliente } from './application/customer.service';
import { prisma } from "@/lib/prisma";

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

export async function actionRegistrarCliente(formData: FormData) {
  const nombreCompleto = formData.get('nombre') as string;
  const correoElectronico = formData.get('correo') as string;
  const telefono = formData.get('telefono') as string;
  const rfc = formData.get('rfc') as string;
  const fechaNacimientoStr = formData.get('fechaNacimiento') as string;
  const password = formData.get('password') as string; // <-- NUEVO

  if (!nombreCompleto || !correoElectronico || !fechaNacimientoStr || !password) {
    return { success: false, message: "Faltan campos obligatorios." };
  }

  const datos = {
    nombreCompleto,
    correoElectronico,
    telefono,
    rfc,
    fechaNacimiento: new Date(fechaNacimientoStr),
    password // <-- NUEVO
  };

  const resultado = await registrarNuevoCliente(datos);
  return resultado;
}

export async function actionObtenerPerfil(emailUsuario: string) {
  try {
    const cliente = await prisma.customer.findFirst({
      where: { email: emailUsuario },
      // ¡ESTO ES LO QUE HACE LA MAGIA PARA TRAER LOS PUNTOS!
      include: { 
        loyalty: true 
      }
    });
    return cliente;
  } catch (error) {
    console.error(error);
    return null;
  }
}