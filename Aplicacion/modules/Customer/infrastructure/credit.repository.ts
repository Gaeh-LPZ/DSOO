import { prisma } from "@/lib/prisma";
import { CreditAccount } from "../domain/CreditAccount";
import { ICreditAccount } from "../interfaces/types";

export class CreditRepository {

    private mapToCreditAccount(data: ICreditAccount): CreditAccount {
        return new CreditAccount(
            data.id,
            data.customerId,
            data.balance,
            data.interest,
            data.dueDate,
        );
    }

    async findByCustomerId(customerId: string): Promise<CreditAccount> {
        const data = await prisma.creditAccount.findUnique({
            where: { customerId },
        });
        if (!data) throw new Error("Cuenta de crédito no encontrada");
        return this.mapToCreditAccount(data as ICreditAccount);
    }

    //Guardar parámetros actualizados
    async updateParams(credit: CreditAccount): Promise<void> {
        await prisma.creditAccount.update({
            where: { id: credit.id },
            data: {
                interest: credit.interest,
                dueDate: credit.dueDate,
            },
        });
    }

    // Guardar pago
    async updateBalance(credit: CreditAccount): Promise<void> {
        await prisma.creditAccount.update({
            where: { id: credit.id },
            data: { balance: credit.balance },
        });
    }
}