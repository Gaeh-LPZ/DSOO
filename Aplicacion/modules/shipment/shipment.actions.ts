"use server"
import { ShipmentService } from "./application/shipment.service";
import { ShipmentRepository } from "./infrastructure/shipment.repository";
import { createShipmentSchema, deliverShipmentSchema, dispatchShipmentSchema } from "./shipment.schema";

const shipmentRepo = new ShipmentRepository();
const shipmentService = new ShipmentService(shipmentRepo);

export async function createShipmentAction(data: any) {
    const parsed = createShipmentSchema.parse(data);
    return shipmentService.createShipment(parsed.saleId);
}

export async function dispatchShipmentAction(data: any) {
    try {
        const parsed = dispatchShipmentSchema.parse(data);
        await shipmentService.dispatchShipment(parsed.shipmentId, parsed.tracking);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deliverShipmentAction(data: any) {
    try {
        const parsed = deliverShipmentSchema.parse(data);
        await shipmentService.deliverShipment(parsed.shipmentId);
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getShipmentByIdAction(shipmentId: string) {
    try {
        const envio = await shipmentService.getShipment(shipmentId);
        return {
            success: true,
            data: {
                id: envio.id,
                saleId: envio.saleId,
                status: envio.status,
                tracking: envio.tracking ?? null,
            },
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getAllShipmentsAction() {
    try {
        const envios = await shipmentRepo.findAll();
        const plain = envios.map(e => ({
            id: e.id,
            saleId: e.saleId,
            status: e.status,
            tracking: e.tracking ?? null,
        }));
        return { success: true, data: plain };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getShipmentBySaleIdAction(saleId: string) {
    try {
        const envio = await shipmentRepo.findBySaleId(saleId);
        if (!envio) return { success: true, data: null };
        return {
            success: true,
            data: {
                id: envio.id,
                saleId: envio.saleId,
                status: envio.status,
                tracking: envio.tracking ?? null,
            },
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}