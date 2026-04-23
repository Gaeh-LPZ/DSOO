import { Shipment } from "../domain/Shipment";
import { prisma } from "@/lib/prisma";

export class ShipmentRepository {
    private toDomain(data: any): Shipment {
        return new Shipment(
            data.id,
            data.saleId,
            data.status,
            data.tracking
        )
    }

    async create(shipment: Shipment): Promise<Shipment> {
        const data = await prisma.shipment.create({
            data: {
                id: shipment.id,
                saleId: shipment.saleId,
                status: shipment.getStatus(),
                tracking: shipment.tracking
            }
        })
        return this.toDomain(data)
    }

    async dispatch(shipment: Shipment): Promise<void> {
        await prisma.shipment.update({
            where: { id: shipment.id },
            data: { 
                status: shipment.getStatus(),
                tracking: shipment.getTracking()
            }
        })
    }

    async deliver(shipment: Shipment): Promise<void> {
        await prisma.shipment.update({
            where: { id: shipment.id },
            data: { status: shipment.getStatus() }
        })
    }

    async findById(id: string): Promise<Shipment | null> {
        const data = await prisma.shipment.findUnique({
            where: { id }
        })

        if (!data) return null;

        return this.toDomain(data)
    }
}