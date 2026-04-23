export enum ShipmentStatus {
    PENDING = "PENDING",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED"
}

export class Shipment {
    constructor(
        public id: string,
        public saleId: string,
        public status: ShipmentStatus = ShipmentStatus.PENDING,
        public tracking: string | null = null
    ) { }

    getStatus(): string {
        return this.status
    }

    // Marcar como en tránsito
    dispatch() {
        if (this.status !== "PENDING") {
            throw new Error("Solo se puede entrgar un envio pendiente")
        }
        this.status = ShipmentStatus.IN_TRANSIT
    }

    // Marcar como entregado
    deliver() {
        if (this.status !== "IN_TRANSIT") {
            throw new Error("SOlo se entrega producto que esten en transito")
        }
        this.status = ShipmentStatus.DELIVERED
    }

    // Asignar número de rastreo
    setTracking(tracking: string) {
        // ¿qué validación necesita?
        if (this.status === "DELIVERED") {
            throw new Error("Paquete ya entregado")
        }
        this.tracking = tracking
    }

    getTracking(): string | null {
        return this.tracking
    }
}