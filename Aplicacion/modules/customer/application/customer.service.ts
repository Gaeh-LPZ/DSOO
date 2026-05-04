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