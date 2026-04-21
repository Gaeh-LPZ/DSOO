export class SaleItem {
    constructor(
        public productId: string,
        private quantity: number,
        private price: number,

    ) {
        if (!productId) throw new Error("Producto inválido");
        if (quantity <= 0) throw new Error("Cantidad inválida");
        if (price < 0) throw new Error("Precio inválido");
    }

    getProductId(): string {
        return this.productId;
    }

    getPrice(): number {
        return this.price;
    }

    getSubtotal(): number {
        return this.quantity * this.price
    }

    getQuantity(): number {
        return this.quantity
    }

    increaseQuantity(qty: number) {
        if (qty <= 0) {
            throw new Error("Cantidad Invalida")
        }
        this.quantity += qty
    }

    getAllSale() {
        return {
            productId: this.productId,
            quantity: this.quantity,
            price: this.price
        };
    }
}   