export class PurchaseItem {
    constructor(
        public productId: string,
        private quantity: number,
        private cost: number,
    ){
        if(!productId) throw Error('Producto invalido')
        if(cost <= 0) throw new Error("Costo invalido")
        if(quantity <= 0) throw new Error("Cantidad inválida")
    }

    getProductId(): string {
        return this.productId
    }

    getQuantity(): number {
        return this.quantity
    }

    getSubtotal(): number {
        return this.quantity * this.cost
    }

    getCost(): number{
        return this.cost
    }

    increaseQuantity(qty: number) {
        if (qty <= 0) {
            throw new Error("Cantidad Invalida")
        }
        this.quantity += qty
    }
}