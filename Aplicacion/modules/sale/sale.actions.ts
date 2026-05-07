"use server"
import { SaleService } from "./application/sale.service"
import { SaleRepository } from "./infrastructure/sale.repository"
import { StockRepository } from "@/modules/product/infrastructure/stock.repository"
import { ProductRepository } from "@/modules/product/infrastructure/product.repository"
import { createSaleSchema, paySaleSchema, getSaleSchema } from "./sale.schema"
import { getTopProductsSchema, getTotalSalesSchema } from "./sale.schema"
import { requireRole } from "@/share/auth"

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
    await requireRole("CAJERO")
    const parsed = paySaleSchema.parse(data)
    return saleService.paySale(parsed.saleId, parsed.amount, parsed.method)
}

export async function getSaleAction(data: any) {
    const parsed = getSaleSchema.parse(data)
    return saleService.findById(parsed.saleId)
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
    }}

export async function getTopProductsAction(data: any) {
    const parsed = getTopProductsSchema.parse(data)
    return saleService.getTopProducts(parsed.storeId, parsed.limit)
}

export async function getTotalSalesAction(data: any) {
    const parsed = getTotalSalesSchema.parse(data)
    return saleService.getTotalSales(parsed.storeId, parsed.startDate, parsed.endDate)
}