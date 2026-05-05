import { CustomerRepository } from "../infrastructure/customer.repository";
import { Customer } from "../domain/Customer";
import { LoyaltyAccount } from "../domain/LoyaltyAccount";
import { HashService } from "@/infrastructure/security/has.service";
import { JwtService } from "@/infrastructure/security/jwt.service";

export class CustomerService {
  constructor(
    private repo: CustomerRepository,
    private hashService: HashService,
    private jwtService: JwtService
  ) { }

  // Registrarse en programa de lealtad
  async register(data: { name: string; email: string; password: string; birthDate: Date }): Promise<void> {
    const hoy = new Date();
    let edad = hoy.getFullYear() - data.birthDate.getFullYear();
    const m = hoy.getMonth() - data.birthDate.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < data.birthDate.getDate())) edad--;

    if (edad < 18) throw new Error("El cliente debe ser mayor de 18 años.");

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error("El correo electrónico ya está registrado.");

    const hashedPassword = await this.hashService.hash(data.password);
    const customer = new Customer(crypto.randomUUID(), data.name, data.email, hashedPassword, null, data.birthDate, null);

    const cardNumber = LoyaltyAccount.generateCardNumber();
    const loyalty = new LoyaltyAccount(crypto.randomUUID(), customer.id, 0, cardNumber);
    loyalty.initBonus();

    await this.repo.create(customer, loyalty.points, loyalty.cardNumber);
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

  async updateCustomer(id: string, fields: { name?: string; email?: string; phone?: string; birthDate?: string; rfc?: string; }): Promise<Customer> {
    return await this.repo.update(id, {
      ...fields,
      birthDate: fields.birthDate ? new Date(fields.birthDate) : undefined,
    });
  }

  async getProfile(userId: string) {
    const customer = await this.repo.findById(userId);
    const loyalty = await this.repo.findLoyaltyByCustomerId(userId);

    return {
      nombre: customer.name,
      email: customer.email || "",
      telefono: customer.phone || "",
      fechaNacimiento: customer.birthDate ? customer.birthDate.toISOString().split('T')[0] : "",
      rfc: customer.rfc || "",
      puntos: loyalty.points,
      numeroTarjeta: loyalty.cardNumber,
    };
  }
}