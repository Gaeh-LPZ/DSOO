"use server"
import { SaleService } from "./application/sale.service"
import { SaleRepository } from "./infrastructure/sale.repository"
import { StockRepository } from "@/modules/product/infrastructure/stock.repository"
import { ProductRepository } from "@/modules/product/infrastructure/product.repository"
import { createSaleSchema, paySaleSchema, getSaleSchema } from "./sale.schema"
import { getTopProductsSchema, getTotalSalesSchema } from "./sale.schema"
import { getSession, requireRole } from "@/share/auth"
import { CarByCustomerId, clearCartAction } from "../carrito/carrito.actions"
import { getSystemUserIdAction } from "../user/user.actions"

const saleRepo = new SaleRepository()
const stockRepo = new StockRepository()
const productRepo = new ProductRepository()
const saleService = new SaleService(saleRepo, stockRepo, productRepo)

export async function createSaleAction(data: any) {
    await requireRole("CAJERO")
    const parsed = createSaleSchema.parse(data)
    return saleService.createSale(parsed)
}

export async function paySaleAction(data: any) {
    //await requireRole("CAJERO")
    const parsed = paySaleSchema.parse(data)
    return saleService.paySale(parsed.saleId, parsed.amount, parsed.method)
}

export async function getSaleAction(data: any) {
    const parsed = getSaleSchema.parse(data)
    const sale = await saleService.findById(parsed.saleId)

    return {
        id: sale.id,
        status: sale.getStatus(),
        total: sale.getTotal(),
    }
}

export async function getSalesByCustomerAction(customerId: string) {
    try {
        const ventas = await saleRepo.findByCustomerId(customerId)
        return { success: true, data: ventas }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getSaleWithItemsAction(saleId: string) {
    try {
        const venta = await saleRepo.findById(saleId)
        if (!venta) return { success: false, message: "Venta no encontrada" }
        return {
            success: true,
            data: {
                id: venta.id,
                status: venta.getStatus(),
                total: venta.getTotal(),
                items: venta.getItems().map(i => ({
                    productId: i.getProductId(),
                    quantity: i.getQuantity(),
                    price: i.getPrice(),
                    subtotal: i.getSubtotal()
                }))
            }
        }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}

export async function getTopProductsAction(data: any) {
    const parsed = getTopProductsSchema.parse(data)
    return saleService.getTopProducts(parsed.storeId, parsed.limit)
}

export async function getTotalSalesAction(data: any) {
    const parsed = getTotalSalesSchema.parse(data)
    return saleService.getTotalSales(parsed.storeId, parsed.startDate, parsed.endDate)
}

export async function createStripePaymentIntentAction(data: any) {
    const parsed = getSaleSchema.parse(data)
    return saleService.createStripePaymentIntent(parsed.saleId)
}

export async function createSaleFromCartAction() {
    const session = await getSession()
    if (!session) throw new Error("No autorizado")

    const cart = await CarByCustomerId(session.userId)
    if (!cart || cart.items.length === 0) {
        throw new Error("El carrito está vacío")
    }

    const systemUserId = await getSystemUserIdAction()  // Ventas Online

    const items = cart.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
    }))

    const sale = await saleService.createSale({
        userId: systemUserId,
        storeId: process.env.STORE_ONLINE_ID!,
        customerId: session.userId,
        items,
    })

    await clearCartAction({ cartId: cart.id })
    return sale.id
}