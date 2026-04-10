import { CustomerRepository } from "../infrastructure/customer.repository";
import { Customer } from "../domain/Customer";
import { LoyaltyAccount } from "../domain/LoyaltyAccount";

export class CustomerService {
    constructor(private repo: CustomerRepository) { }

    // Registrarse en programa de lealtad
    async register(data: { name: string; email: string }): Promise<Customer> {
        const existing = await this.repo.findByEmail(data.email);
        if (existing) throw new Error("El correo ya está registrado");

        const customer = new Customer(crypto.randomUUID(), data.name, data.email);
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
}