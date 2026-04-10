export class LoyaltyAccount {
    constructor(
        public id: string,
        public customerId: string,
        public points: number = 0,
    ) { }

    // bonificación al registrarse
    initBonus(): void {
        this.points = 100;
    }

    //1 punto por cada $10, mínimo $100
    addPointsFromPurchase(totalAmount: number): void {
        if (totalAmount < 100) {
            throw new Error("Monto mínimo para acumular puntos es $100");
        }
        this.points += Math.floor(totalAmount / 10);
    }

    getBalance(): number {
        return this.points;
    }
}