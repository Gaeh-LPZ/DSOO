import { CartRepository } from "../infrastructure/carrito.repository";
import { ProductRepository } from "@/modules/product/infrastructure/product.repository";
import { CartItem } from "../domain/CarritoItem";

export class CartService {
    constructor(
        private cartRepository: CartRepository,
        private productRepository: ProductRepository
    ) { }

    async addItem(customerId: string, productId: string): Promise<void> {
        let cart = await this.cartRepository.findByCustomerId(customerId);

        // si no existe carrito lo crea
        if (!cart)  cart = await this.cartRepository.create(customerId);

        const product = await this.productRepository.findById(productId);
        if (!product) throw new Error("Producto no encontrado");

        const item = new CartItem(crypto.randomUUID(), product.id, 1, product.price, { id: product.id, name: product.name, imageUrl: product.imageUrl});

        cart.addItem(item);
        await this.cartRepository.save(cart);
    }

    async removeItem(customerId: string, productId: string): Promise<void> {
        const cart = await this.cartRepository.findByCustomerId(customerId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.removeItem(productId);
        await this.cartRepository.save(cart);
    }

    async getCartDTO(customerId: string) {
        const cart = await this.cartRepository.findByCustomerId(customerId);
        if (!cart)return null;
        
        return {
            id: cart.id,
            items: cart.items.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.product.name,
                imageUrl: item.product.imageUrl,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal()
            })),

            total: cart.total()
        };
    }

    async updateQuantity(customerId: string, productId: string, quantity: number): Promise<void> {
        const cart = await this.cartRepository.findByCustomerId(customerId);
        if (!cart) throw new Error("Carrito no encontrado");

        const item = cart.items.find(item => item.productId === productId);
        if (!item) throw new Error("Producto no encontrado en carrito");

        item.quantity = quantity;
        await this.cartRepository.save(cart);
    }
}