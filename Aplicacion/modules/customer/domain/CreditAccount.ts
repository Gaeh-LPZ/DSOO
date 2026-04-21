export class CreditAccount {
    constructor(
        public id: string,
        public customerId: string,
        public balance: number,
        public interest: number,
        public dueDate: Date,
    ) { }

    // Configurar parámetros de crédito
    updateInterest(newInterest: number): void {
        if (newInterest <= 0) {
            throw new Error("La tasa de interés debe ser mayor a 0");
        }
        if (newInterest > 100) {
            throw new Error("La tasa de interés no puede exceder el límite legal");
        }
        this.interest = newInterest;
    }

    updateDueDate(newDueDate: Date): void {
        if (newDueDate <= new Date()) {
            throw new Error("La fecha límite debe ser futura");
        }
        this.dueDate = newDueDate;
    }

    // Consultar estado de cuenta
    getAccountSummary() {
        const minimumPayment = this.balance * 0.15;
        const interestAmount = this.balance * (this.interest / 100);
        return {
            balance: this.balance,
            interest: interestAmount,
            minimumPayment,
            dueDate: this.dueDate,
            isOverdue: new Date() > this.dueDate,
        };
    }

    // Registrar pago
    applyPayment(amount: number): void {
        if (amount <= 0) {
            throw new Error("El monto debe ser mayor a 0");
        }
        this.balance -= amount; // permite abonos a favor
    }
}