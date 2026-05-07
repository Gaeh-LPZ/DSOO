interface CartProduct {
    id: string;
    name: string;
    imageUrl: string | null;
}

export class CartItem {
    constructor(
        public id: string,
        public productId: string,
        public quantity: number,
        public price: number,
        public product: CartProduct
    ) {}

    increaseQuantity(amount: number = 1): void {
        this.quantity += amount;
    }

    decreaseQuantity(amount: number = 1): void {
        this.quantity -= amount;

        if (this.quantity < 1) {
            throw new Error( "La cantidad no puede ser menor a 1");
        }
    }

    subtotal(): number {
        return this.quantity * this.price;
    }
}