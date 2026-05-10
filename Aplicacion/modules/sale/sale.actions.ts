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
import { CustomerService } from "../customer/application/customer.service"
import { CustomerRepository } from "../customer/infrastructure/customer.repository"
import { HashService } from "@/infrastructure/security/has.service"
import { JwtService } from "@/infrastructure/security/jwt.service"

const saleRepo = new SaleRepository()
const stockRepo = new StockRepository()
const productRepo = new ProductRepository()
const customerRepo = new CustomerRepository()
const hashService = new HashService()
const jwtService = new JwtService()
const customerService = new CustomerService(customerRepo, hashService, jwtService)
const saleService = new SaleService(saleRepo, stockRepo, productRepo, customerService)

export async function createSaleAction(data: any) {
    await requireRole("CAJERO")
    const parsed = createSaleSchema.parse(data)
    return saleService.createSale(parsed)
}

export async function paySaleAction(data: any) {
    //await requireRole("CAJERO")
    const parsed = paySaleSchema.parse(data)
    await saleService.paySale(parsed.saleId, parsed.amount, parsed.method)
    return { success: true }
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
        const ventas = await saleService.findSalesByCustomerId(customerId)
        const data = ventas.map(s => ({
            id: s.id,
            total: s.total,
            status: s.status,
            createdAt: s.createdAt.toISOString(),  // Date → string
            items: s.items.map(i => ({
                id: i.id,
                productId: i.productId,
                name: i.product.name,
                imageUrl: i.product.imageUrl ?? null,
                quantity: i.quantity,
                price: i.price,
            })),
            shipment: s.shipment ? {
                status: s.shipment.status,
                tracking: s.shipment.tracking,
            } : null,
        }))

        return { success: true, data }
    } catch (e: any) {
        return { success: false, error: e.message ?? "Error al cargar pedidos" }
    }
}

export async function getSaleWithItemsAction(saleId: string) {
    try {
        const venta = await saleService.findById(saleId)
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

    await clearCartAction()
    return sale.id
}

export async function getSaleSummaryAction(saleId: string) {
    try {
        const venta = await saleService.findById(saleId);
        if (!venta) return { success: false, message: "Venta no encontrada" };
        const itemsRaiz = venta.getItems();

        const itemsConNombre = await Promise.all(
            itemsRaiz.map(async (item) => {
                const producto = await productRepo.findById(item.getProductId());
                return {
                    nombre: producto?.name || "Producto desconocido",
                    cantidad: item.getQuantity(),
                    precio: item.getPrice(),
                    subtotal: item.getSubtotal()
                };
            })
        );
        const pagos = (venta as any).payments?.map((p: any) => ({
            metodo: p.method,
            monto: p.amount
        })) || [];

        return {
            success: true,
            data: {
                id: venta.id,
                total: venta.getTotal(),
                productos: itemsConNombre,
                pagos: pagos
            }
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}