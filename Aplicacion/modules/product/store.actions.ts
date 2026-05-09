"use server"
import { requireRole } from "@/share/auth"
import { StoreService } from "./application/store.service"
import { StoreRepository } from "./infrastructure/store.repository"
import { createStoreSchema, getStoreReportSchema, getStoreSchema } from "./store.schema"

const storeRepo = new StoreRepository()
const storeService = new StoreService(storeRepo)

export async function createStoreAction(data: any) {
    const parsed = createStoreSchema.parse(data)
    return storeService.createStore(parsed.name)
}

export async function listStoresAction() {
    await requireRole(["ADMIN"])
    return storeService.listStores()
}

export async function getStoreAction(data: any) {
    const parsed = getStoreSchema.parse(data)
    return storeService.getStore(parsed.id)
}

export async function getStoreReportAction(data: any) {
    await requireRole("ADMIN")
    const parsed = getStoreReportSchema.parse(data)
    return storeService.getStoreReport(parsed.startDate, parsed.endDate)
}