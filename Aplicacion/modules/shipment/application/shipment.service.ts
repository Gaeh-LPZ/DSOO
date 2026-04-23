import { Shipment } from "../domain/Shipment";
import { ShipmentRepository } from "../infrastructure/shipment.repository";

export class ShipmentService {
    constructor(private repo: ShipmentRepository) { }

    async createShipment(saleId: string): Promise<Shipment> {
        const envio = new Shipment(
            crypto.randomUUID(),
            saleId
        )

        return this.repo.create(envio)
    }

    async dispatchShipment(shipmentId: string, tracking?: string): Promise<void> {
        const envio = await this.repo.findById(shipmentId)
        if (!envio) throw new Error("Envio no existente")
        if (tracking != null) {
            envio.setTracking(tracking)
        }
        envio.dispatch()
        return this.repo.dispatch(envio)
    }

    async deliverShipment(shipmentId: string): Promise<void> {
        const envio = await this.repo.findById(shipmentId)
        if (!envio) throw new Error("Envio no existente")

        envio.deliver()
        return this.repo.deliver(envio)

    }

    async getShipment(shipmentId: string): Promise<Shipment> {
        const envio = await this.repo.findById(shipmentId)
        if (!envio) throw new Error("Envio no existente")

        return envio

    }
}