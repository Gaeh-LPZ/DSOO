"use server"
import { requireRole } from "@/share/auth"
import { SaleRepository } from "../sale/infrastructure/sale.repository"
import { DashboardService } from "./application/dashboard.service"
import { getTopProductsSchema, getTotalSalesSchema } from "./dashboard.schema"
import { PrismaClient } from "@prisma/client"

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

export async function getSalesByDepartmentAction() {
  const prisma = new PrismaClient();
  // Traemos todos los items de venta con su producto para saber la categoría
  const salesItems = await prisma.saleItem.findMany({
    include: { product: true }
  });

  // Agrupamos y sumamos en JS para mayor flexibilidad
  const grouping = salesItems.reduce((acc: any, item) => {
    const cat = item.product.category;
    const amount = item.price * item.quantity;
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += amount;
    return acc;
  }, {});

  // Convertimos a formato para la gráfica
  const colors: any = { "Electrónica": "bg-blue-500", "Luxury Wear": "bg-emerald-500", "Hogar": "bg-amber-500" };
  
  return Object.entries(grouping).map(([name, sales]: any) => ({
    name,
    sales,
    color: colors[name] || "bg-slate-500",
    // Calculamos el ancho relativo (esto es opcional pero se ve pro)
    width: `w-[${Math.min(Math.round((sales / 150000) * 100), 100)}%]`
  }));
}