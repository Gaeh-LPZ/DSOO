import { CreditRepository } from "../infrastructure/credit.repository";

export class CreditService {
    constructor(private repo: CreditRepository) { }

    // Configurar parámetros de crédito
    async updateParams(
        customerId: string,
        interest: number,
        dueDate: Date
    ): Promise<void> {
        const credit = await this.repo.findByCustomerId(customerId);
        credit.updateInterest(interest);  
        credit.updateDueDate(dueDate);    
        await this.repo.updateParams(credit);
    }

    // Consultar estado de cuenta
    async getAccountSummary(customerId: string) {
        const credit = await this.repo.findByCustomerId(customerId);
        return credit.getAccountSummary();
    }

    // Registrar pago
    async applyPayment(customerId: string, amount: number): Promise<void> {
        const credit = await this.repo.findByCustomerId(customerId);
        credit.applyPayment(amount);      
        await this.repo.updateBalance(credit);
    }
}