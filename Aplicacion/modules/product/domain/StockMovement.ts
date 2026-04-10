export class StockMovement {
    constructor(
        public id: string,
        public productId: string,
        public storeId: string,
        public quantity: number,
        public type: "IN" | "OUT",
        public reason?: string,
        public createdAt: Date = new Date()
    ) {
        if (quantity <= 0) throw new Error("Cantidad inválida");
    }

    // Metodo el cual dice que esta "Modificando Stock"
    static createIn(productId: string, storeId: string, quantity: number, reason?: string) {
        return new StockMovement(
            crypto.randomUUID(),
            productId,
            storeId,
            quantity,
            "IN",
            reason
        );
    }

    // Metodo el cual dice que esta "Termnino de Modificar Stock"
    static createOut(productId: string, storeId: string, quantity: number, reason?: string) {
        return new StockMovement(
            crypto.randomUUID(),
            productId,
            storeId,
            quantity,
            "OUT",
            reason
        );
    }
}