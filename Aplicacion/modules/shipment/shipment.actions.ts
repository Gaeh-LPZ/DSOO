import { ShipmentService } from "./application/shipment.service";
import { ShipmentRepository } from "./infrastructure/shipment.repository";
import { createShipmentSchema, deliverShipmentSchema, dispatchShipmentSchema } from "./shipment.schema";


const shipmentRepo = new ShipmentRepository();
const shipmentService = new ShipmentService(shipmentRepo);

export async function createOrderAction(data: any) {
    const parsed = createShipmentSchema.parse(data);
    return shipmentService.createShipment(parsed.saleId);
}

export async function receiveOrderAction(data: any) {
    const parsed = dispatchShipmentSchema.parse(data);
    return shipmentService.dispatchShipment(parsed.shipmentId, parsed.tracking);
}

export async function cancelOrderAction(data: any) {
   const parsed = deliverShipmentSchema.parse(data);
    return shipmentService.deliverShipment(parsed.shipmentId);
}