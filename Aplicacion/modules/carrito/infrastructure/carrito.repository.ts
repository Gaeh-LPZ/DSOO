import { prisma } from "@/lib/prisma";
import { Cart } from "../domain/Carrito";
import { CartItem } from "../domain/CarritoItem";

export class CartRepository {

    async findByCustomerId(customerId: string): Promise<Cart | null> {
        const data = await prisma.cart.findFirst({
            where: {
                customerId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!data) return null;

        return new Cart(
            data.id,
            data.customerId,
            data.items.map(
                item =>
                    new CartItem(
                        item.id,
                        item.productId,
                        item.quantity,
                        item.price,
                        {
                            id: item.product.id,
                            name: item.product.name,
                            imageUrl: item.product.imageUrl
                        }
                    )
            )
        );
    }

    async create(customerId: string): Promise<Cart> {

        const data = await prisma.cart.create({
            data: {
                customerId
            }
        });

        return new Cart(
            data.id,
            data.customerId
        );
    }

    async save(cart: Cart): Promise<void> {
        // borrar items y recrearlos

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });

        await prisma.cartItem.createMany({
            data: cart.items.map(item => ({
                cartId: cart.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }))
        });
    }
}