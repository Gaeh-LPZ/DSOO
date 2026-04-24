"use server"
import { PurchaseService } from "./application/purchase.service";
import { PurchaseRepository } from "./infrastructure/purchase.repository";
import { cancelOrderSchema, createOrderSchema, receiveOrderSchema } from "./purchase.schema";

const purchaseRepo = new PurchaseRepository();
const purchaseService = new PurchaseService(purchaseRepo);

export async function createOrderAction(data: any) {
    const parsed = createOrderSchema.parse(data);
    return purchaseService.createOrder(parsed);
}

export async function receiveOrderAction(data: any) {
    const parsed = receiveOrderSchema.parse(data);
    return purchaseService.receiveOrder(parsed.orderId);
}

export async function cancelOrderAction(data: any) {
   const parsed = cancelOrderSchema.parse(data);
    return purchaseService.cancelOrder(parsed.orderId);
}