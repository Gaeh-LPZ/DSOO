"use server"
import { SaleService } from "./application/sale.service"
import { SaleRepository } from "./infrastructure/sale.repository"
import { StockRepository } from "@/modules/product/infrastructure/stock.repository"
import { ProductRepository } from "@/modules/product/infrastructure/product.repository"
import { createSaleSchema, paySaleSchema, getSaleSchema } from "./sale.schema"
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