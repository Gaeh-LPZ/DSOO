import { PurchaseItem } from "../domain/PurchaseItem";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseRepository } from "../infrastructure/purchase.repository";

export class PurchaseService {
    constructor(private repo: PurchaseRepository) {}

    // Caso de uso: Crear orden
    async createOrder(data: { supplierId: string, storeId: string, items: { productId: string, quantity: number, cost: number }[]}) {
        // Validar que tenga items
        if (data.items.length === 0 ){
            throw new Error("La orden debe tener al menos un item")
        }

        // Crear PurchaseOrder
        const order = new PurchaseOrder(
            crypto.randomUUID(),
            data.supplierId,
            data.storeId,
        );

        // Por cada item crear PurchaseItem y llamar order.addItem()
        for(const item of data.items){

            const purchaseItem = new PurchaseItem(
                item.productId,
                item.quantity,
                item.cost
            )

            order.addItem(purchaseItem)
        }
        
        // Persistir con repo.create()
        return this.repo.create(order)
    }

    // Caso de uso: Recibir orden
    async receiveOrder(orderId: string) {
        // Buscar la orden
        const orden = await this.repo.findById(orderId)
        if (!orden) throw new Error("Orden no existente")

        // Persistir con repo.receiveOrder()
        orden.recive()
        return this.repo.receiveOrder(orden)
    }

    // Caso de uso: Cancelar orden
    async cancelOrder(orderId: string) {
        const orden = await this.repo.findById(orderId)
        if (!orden) throw new Error ("Orden no encontrada")
        orden.cancel()
        return this.repo.cancel(orden)
    }
}