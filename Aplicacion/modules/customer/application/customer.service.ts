import { CustomerRepository } from "../infrastructure/customer.repository";
import { Customer } from "../domain/Customer";
import { LoyaltyAccount } from "../domain/LoyaltyAccount";
import { HashService } from "@/infrastructure/security/has.service";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export class CustomerService {
    constructor(
        private repo: CustomerRepository,
        private hashService: HashService,
        private jwtService: JwtService
    ) { }

    // Registrarse en programa de lealtad
    async register(data: { name: string; email: string, password: string }): Promise<Customer> {
        const existing = await this.repo.findByEmail(data.email);
        if (existing) throw new Error("El correo ya está registrado");

        const hashedPassword = await this.hashService.hash(data.password);

        const customer = new Customer(crypto.randomUUID(), data.name, data.email, hashedPassword);
        const loyalty = new LoyaltyAccount(crypto.randomUUID(), customer.id);
        loyalty.initBonus(); // 100 puntos iniciales 

        return this.repo.create(customer, loyalty.points);
    }

    // Acumular puntos por compra
    async addPointsFromSale(customerId: string, totalAmount: number): Promise<void> {
        const loyalty = await this.repo.findLoyaltyByCustomerId(customerId);
        loyalty.addPointsFromPurchase(totalAmount);
        await this.repo.updatePoints(loyalty);
    }

    async login(email: string, password: string): Promise<{ token: string }> {
        const user = await this.repo.findByEmail(email);                                      // Busca usuario. NOTA: EL repo devuelve una entidad de dominio User

        if (!user) throw new Error("Credenciales inválidas");

        await user.authenticate(password, this.hashService);                                 // Delegar la validación de contraseña al DOMINIO (User.ts)

        const token = await this.jwtService.sign({                                           // Generar JWT con el id y los roles del usuario
            userId: user.id
        });

        return { token };
    }
}

export const registrarNuevoCliente = async (datosCliente: {
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  rfc?: string;
  fechaNacimiento: Date;
  password: string; // <-- NUEVO
}) => {
  try {
    // 1. Validar la regla de negocio: Edad mínima 18 años
    const hoy = new Date();
    let edad = hoy.getFullYear() - datosCliente.fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - datosCliente.fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < datosCliente.fechaNacimiento.getDate())) {
      edad--;
    }
    if (edad < 18) {
      return { success: false, message: "El cliente debe ser mayor de 18 años." };
    }

    // 2. Verificar duplicados
    const clienteExistente = await prisma.customer.findFirst({
      where: { email: datosCliente.correoElectronico }
    });

    if (clienteExistente) {
      return { success: false, message: "El correo electrónico ya está registrado." };
    }

    // Encriptamos la contraseña real que ingresó el usuario
    const hashedPassword = bcrypt.hashSync(datosCliente.password, 10);

    // 3. Generar número de tarjeta
    const numeroTarjeta = 'LT-' + Math.random().toString(36).substring(2, 11).toUpperCase();

    // 4. Persistencia en base de datos con Transacción
    const nuevoCliente = await prisma.$transaction(async (tx) => {
      const cliente = await tx.customer.create({
        data: {
          name: datosCliente.nombreCompleto,
          email: datosCliente.correoElectronico,
          password: hashedPassword, // <-- USAMOS LA CONTRASEÑA ENCRIPTADA
          loyalty: { 
            create: {
              points: 100 
            }
          }
        }
      });
      return cliente;
    });

    console.log(`[SIMULACIÓN] Enviando correo de bienvenida a: ${datosCliente.correoElectronico}`);

    return { success: true, message: "Registro exitoso", data: nuevoCliente };

  } catch (error) {
    console.error("Error en registrarNuevoCliente:", error);
    return { success: false, message: "Error interno al registrar el cliente." };
  }
};