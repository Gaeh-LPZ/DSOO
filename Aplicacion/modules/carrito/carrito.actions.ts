"use server";

import { getSession } from "@/share/auth";
import { ProductRepository } from "../product/infrastructure/product.repository";
import { CartService } from "./application/carrito.service";
import { addToCartSchema, clearCartSchema, removeCartItemSchema, updateCartItemQuantitySchema} from "./carrito.schema";
import { CartRepository } from "./infrastructure/carrito.repository";

const cartRepo = new CartRepository();
const prodRepo = new ProductRepository();
const cartService = new CartService(cartRepo, prodRepo);

export async function addToCartAction(data: any) {
    const session = await getSession();
    if (!session) { throw new Error("No autorizado");}

    const parsed = addToCartSchema.parse(data);
    return cartService.addItem( session.userId, parsed.productId);
}

export async function getCartAction() {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    return cartService.getCartDTO(session.userId);
}

export async function removeCartItemAction(data: any) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const parsed = removeCartItemSchema.parse(data);
    return cartService.removeItem( session.userId, parsed.productId);
}

export async function updateCartItemQuantityAction(data: any) {
    const session = await getSession();
    if (!session) throw new Error("No autorizado");

    const parsed = updateCartItemQuantitySchema.parse(data);
    return cartService.updateQuantity( session.userId, parsed.productId, parsed.quantity);
}

export async function CarByCustomerId(data: any){
    const session = await getSession();
    if (!session) throw new Error("No autorizado");
    return cartService.cartCustomerId(session.userId);
}

export async function clearCartAction() {
    const session = await getSession()
    if (!session) throw new Error("No autorizado")
    return cartService.clearCart(session.userId)
}