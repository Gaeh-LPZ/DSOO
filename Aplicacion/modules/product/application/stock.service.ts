import { Stock } from "../domain/Stock"
import { StockRepository } from "../infrastructure/stock.repository";

export class StockService {
    constructor(private repo: StockRepository) { }

    // Caso de uso: Incrementar Stock
    async increaseStock(productId: string, storeId: string, cantidad: number) {
        if (cantidad <= 0) throw new Error("Cantidad inválida");

        const stock = await this.repo.findByProductAndStore(productId, storeId);        // Busaca por Id de producto y la tienda

        if (!stock) {                                                                   // Si ve que no exite stock con esa relacion crea uno
            const newStock = new Stock(
                crypto.randomUUID(),
                productId,
                storeId,
                cantidad
            );
            return this.repo.create(newStock)
        }

        stock.increase(cantidad);                                                       // LLama a metodo y verifica cantidad

        return this.repo.update(stock);
    }

    // Caso de uso: Dsiminuir Stock
    async decreaseStock(productId: string, storeId: string, cantidad: number) {
        if (cantidad <= 0) throw new Error("Cantidad inválida");                        // Verifica la cantidad (Modelo de negocio)

        return this.repo.decreaseStockWithMovement(productId, storeId, cantidad);       // Decrementa checando ultimos movimientos
    }

    // Caso de uso: Traer stock
    async getStock(productId: string, storeId: string) {
        return this.repo.findByProductAndStore(productId, storeId);                     // Busca por Id de prodcuto y store y devuelve stock
    }
}