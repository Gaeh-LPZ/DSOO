"use server"
import { requireRole } from "@/share/auth"
import { SaleRepository } from "../sale/infrastructure/sale.repository"
import { DashboardService } from "./application/dashboard.service"
import { getTopProductsSchema, getTotalSalesSchema } from "./dashboard.schema"
import { DashboardRepository } from "./infrastructure/dashboard.repository"

const saleRepo = new SaleRepository()
const dashRepo = new DashboardRepository()
const dashboardService = new DashboardService(saleRepo, dashRepo)

export async function getTopProductsAction(data: any) {
  await requireRole(["CAJERO", "ADMIN"])
  const parsed = getTopProductsSchema.parse(data)
  return dashboardService.getTopProducts(parsed.storeId, parsed.limit)
}

export async function getTotalSalesAction(data: any) {
  await requireRole(["CAJERO", "ADMIN"])
  const parsed = getTotalSalesSchema.parse(data)
  return dashboardService.getTotalSales(parsed.storeId, parsed.startDate, parsed.endDate)
}

export async function getGlobalStatsAction() {
  await requireRole(["ADMIN"])
  return dashboardService.getGlobalStats();
}

export async function getRecentUsersAction(limit = 5) {
  await requireRole(["ADMIN"])
  return dashboardService.getRecentUsers(limit);
}

export async function getSalesByDepartmentAction() {
  await requireRole(["ADMIN", "CAJERO"])
  return dashboardService.getSalesByDepartment();
}