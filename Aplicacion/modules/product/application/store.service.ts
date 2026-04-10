import { Store } from "../domain/Store";
import { StoreRepository } from "../infrastructure/store.repository";

export class StoreService {
    constructor(private repo: StoreRepository) { }

    // Caso de uso: Crear Tienda
    async createStore(name: string): Promise<Store> {
        if (!name) throw new Error("Nombre requerido");             // Espera nombre sino marca error

        return this.repo.create(name);
    }

    // Caso de uso: Listar Tiendas
    async listStores(): Promise<Store[]> {
        return this.repo.findAll();                                 // Manda a buscar todas
    }

    // Caso de uso: ObtenerTienda
    async getStore(id: string): Promise<Store> {
        const store = await this.repo.findById(id);                 // Manda a buscar por Id
        if (!store) throw new Error("Tienda no encontrada");        // Sino hay marca error

        return store;
    }
}