import { CartItem } from "./CarritoItem";

export class Cart {

    constructor(
        public id: string,
        public customerId: string | null,
        public items: CartItem[] = []
    ) {}

    addItem(item: CartItem): void {

        const existingItem = this.items.find(
            i => i.productId === item.productId
        );

        // si ya existe aumenta cantidad
        if (existingItem) {
            existingItem.increaseQuantity(item.quantity);
            return;
        }

        this.items.push(item);
    }

    removeItem(productId: string): void {

        this.items = this.items.filter(
            item => item.productId !== productId
        );
    }

    total(): number {

        return this.items.reduce(
            (acc, item) => acc + item.subtotal(),
            0
        );
    }

    clear(): void {
        this.items = [];
    }
}