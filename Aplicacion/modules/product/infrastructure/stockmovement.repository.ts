import { prisma } from "@/lib/prisma";
import { StockMovement } from "../domain/StockMovement";

export class StockMovementRepository {
    // Metodo que crear el historial de movimiento del stock
    async create(movement: StockMovement) {
        return prisma.stockMovement.create({
            data: {
                id: movement.id,
                productId: movement.productId,
                storeId: movement.storeId,
                quantity: movement.quantity,
                type: movement.type,
                reason: movement.reason,
                createdAt: movement.createdAt
            }
        });
    }
}