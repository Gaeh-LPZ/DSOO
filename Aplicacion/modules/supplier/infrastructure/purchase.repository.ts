import { prisma } from "@/lib/prisma";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseItem } from "../domain/PurchaseItem";
import { Prisma } from "@prisma/client";

export class PurchaseRepository {
    private toDomain(data: any): PurchaseOrder {
        return new PurchaseOrder(
            data.id,
            data.supplierId,
            data.status,
            data.storeId,
            data.items.map((i: any) =>
                new PurchaseItem(i.productId, i.quantity, i.cost))
        )
    }

    async create(purchase: PurchaseOrder): Promise<PurchaseOrder> {
        const data = await prisma.purchaseOrder.create({
            data: {
                id: purchase.id,
                supplierId: purchase.supplierId,
                status: purchase.getStatus(),
                storeId: purchase.storeId,

                items: {
                    create: purchase.getItems().map(item => ({
                        productId: item.getProductId(),
                        quantity: item.getQuantity(),
                        cost: item.getCost()
                    }))
                }
            },
            include: { items: true }

        })
        return this.toDomain(data);
    }

    async cancel(order: PurchaseOrder): Promise<void> {
        await prisma.purchaseOrder.update({
            where: { id: order.id },
            data: { status: order.getStatus() }
        })
    }

    async findById(id: string): Promise<PurchaseOrder | null> {
        const data = await prisma.purchaseOrder.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!data) return null;

        return this.toDomain(data);
    }

    async receiveOrder(order: PurchaseOrder): Promise<void> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            // Actualizar estado a RECEIVED
            await tx.purchaseOrder.update({
                where: { id: order.id },
                data: { status: order.getStatus() }
            })

            // Por cada item, incrementar stock en la tienda
            for (const item of order.getItems()) {
                const result = await tx.stock.updateMany({
                    where: {
                        productId: item.getProductId(),
                        storeId: order.storeId
                    },
                    data: {
                        quantity: {
                            increment: item.getQuantity()
                        }
                    }
                })

                if (result.count === 0) {
                    throw new Error(`Stock no registrado para producto ${item.getProductId()} en tienda ${order.storeId}`)
                }
            }



        })
    }

}