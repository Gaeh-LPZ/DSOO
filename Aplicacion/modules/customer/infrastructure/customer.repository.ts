import { prisma } from "@/lib/prisma";
import { Customer } from "../domain/Customer";
import { LoyaltyAccount } from "../domain/LoyaltyAccount";
import { ICustomerWithLoyalty } from "../interfaces/types";

export class CustomerRepository {

    private readonly includeLoyalty = {
        loyalty: true,
    } as const;

    private mapToCustomer(data: ICustomerWithLoyalty): Customer {
        return new Customer(data.id, data.name, data.email);
    }

    async create(customer: Customer, initialPoints: number): Promise<Customer> {
        const data = await prisma.customer.create({
            data: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                loyalty: {
                    create: {
                        id: crypto.randomUUID(),
                        points: initialPoints,
                    },
                },
            },
            include: this.includeLoyalty,
        });
        return this.mapToCustomer(data as ICustomerWithLoyalty);
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const data = await prisma.customer.findFirst({
            where: { email },
            include: this.includeLoyalty,
        });
        if (!data) return null;
        return this.mapToCustomer(data as ICustomerWithLoyalty);
    }

    async findById(id: string): Promise<Customer> {
        const data = await prisma.customer.findUnique({
            where: { id },
            include: this.includeLoyalty,
        });
        if (!data) throw new Error("Cliente no encontrado");
        return this.mapToCustomer(data as ICustomerWithLoyalty);
    }

    async findLoyaltyByCustomerId(customerId: string): Promise<LoyaltyAccount> {
        const data = await prisma.loyaltyAccount.findUnique({
            where: { customerId },
        });
        if (!data) throw new Error("Cuenta de lealtad no encontrada");
        return new LoyaltyAccount(data.id, data.customerId, data.points);
    }

    async updatePoints(loyalty: LoyaltyAccount): Promise<void> {
        await prisma.loyaltyAccount.update({
            where: { id: loyalty.id },
            data: { points: loyalty.points },
        });
    }
}