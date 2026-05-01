"use server"
import { NotificationService } from "../notification/application/notification.service"
import { NotificationRepository } from "../notification/infrastructure/notification.repository"
import { StockService } from "./application/stock.service"
import { StockRepository } from "./infrastructure/stock.repository"
import { increaseStockSchema, decreaseStockSchema, getStockSchema } from "./stock.schema"

const stockRepo = new StockRepository()
const notiRepo = new NotificationRepository()
const notiServ = new NotificationService(notiRepo)
const stockService = new StockService(stockRepo, notiServ)

export async function increaseStockAction(data: any) {
    const parsed = increaseStockSchema.parse(data)
    return stockService.increaseStock(parsed.productId, parsed.storeId, parsed.cantidad)
}

export async function decreaseStockAction(data: any) {
    const parsed = decreaseStockSchema.parse(data)
    return stockService.decreaseStock(parsed.productId, parsed.storeId, parsed.cantidad)
}

export async function getStockAction(data: any) {
    const parsed = getStockSchema.parse(data)
    return stockService.getStock(parsed.productId, parsed.storeId)
}