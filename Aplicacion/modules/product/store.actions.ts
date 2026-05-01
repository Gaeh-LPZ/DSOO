"use server"
import { StoreService } from "./application/store.service"
import { StoreRepository } from "./infrastructure/store.repository"
import { createStoreSchema, getStoreSchema } from "./store.schema"

const storeRepo = new StoreRepository()
const storeService = new StoreService(storeRepo)

export async function createStoreAction(data: any) {
    const parsed = createStoreSchema.parse(data)
    return storeService.createStore(parsed.name)
}

export async function listStoresAction() {
    return storeService.listStores()
}

export async function getStoreAction(data: any) {
    const parsed = getStoreSchema.parse(data)
    return storeService.getStore(parsed.id)
}