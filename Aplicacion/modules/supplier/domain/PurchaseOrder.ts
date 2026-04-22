import { PurchaseItem } from "./PurchaseItem"

export enum PurchaseStatus {
    PENDING = "PENDING",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED"
}

export class PurchaseOrder {
    constructor(
        public id: string,
        public supplierId: string,
        public storeId: string,
        public status: PurchaseStatus = PurchaseStatus.PENDING,
        public items: PurchaseItem[] = []
    ){}

    getStatus(): string {
        return this.status
    }

    getSupplierId(): string {
        return this.supplierId
    }

    getItems(): PurchaseItem[]{
        return this.items
    }

    cancel() {
        if(this.status === "RECEIVED") {
            throw new Error("No se puede cancelar (RECIBIDO)")
        }
        this.status = PurchaseStatus.CANCELLED
    }

    addItem(item: PurchaseItem) {
        if (this.status != "PENDING"){
            throw new Error("No se puede modificar una orden en estado Pendiente")
        }

        const existing = this.items.find(
            i => i.getProductId() === item.getProductId()
        );

        if (existing){
            existing.increaseQuantity(item.getQuantity())
            return;
        }

        this.items.push(item)
    }

    recive() {
        if(this.status === "CANCELLED") {
            throw new Error ("No se puede poner pedido que ya esta CANCELADO")
        }
        this.status = PurchaseStatus.RECEIVED
    }
}