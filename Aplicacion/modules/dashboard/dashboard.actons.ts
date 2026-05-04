"use server"
import { requireRole } from "@/share/auth"
import { SaleRepository } from "../sale/infrastructure/sale.repository"
import { DashboardService } from "./application/dashboard.service"
import { getTopProductsSchema, getTotalSalesSchema } from "./dashboard.schema"

const saleRepo = new SaleRepository()
const dashboardService = new DashboardService (saleRepo)

export async function getTopProductsAction(data: any) {
    await requireRole("CAJERO")
    const parsed = getTopProductsSchema.parse(data)
    return dashboardService.getTopProducts(parsed.storeId, parsed.limit)
}

export async function getTotalSalesAction(data: any) {
    await requireRole("CAJERO")
    const parsed = getTotalSalesSchema.parse(data)
    return dashboardService.getTotalSales(parsed.storeId, parsed.startDate, parsed.endDate)
}

