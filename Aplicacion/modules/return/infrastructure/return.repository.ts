import { Prisma } from "@prisma/client"
import { Return } from "../domain/Return"
import { prisma } from "@/lib/prisma"

export class ReturnRepository {
    private toDomain(data: any): Return {
        return new Return(
            data.id,
            data.saleId,
            data.reason,
            data.approvedBy
        )
    }

    async create(ret: Return): Promise<Return> {
        const data = await prisma.return.create({
            data: {
                id: ret.id,
                saleId: ret.saleId,
                reason: ret.reason,
                approvedBy: ret.approvedBy
            }
        })

        return this.toDomain(data)
    }

    async findById(id: string): Promise<Return | null> {
        const data = await prisma.return.findUnique({
            where: { id }
        })

        if (!data) return null;

        return this.toDomain(data);
    }


    async approve(ret: Return): Promise<void> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            // Actualizar approvedBy en BD
            await tx.return.update({
                where: { id: ret.id },
                data: { approvedBy: ret.approvedBy }
            })

            // Buscar la venta para obtener items y storeId
            const sale = await tx.sale.findUnique({
                where: { id: ret.saleId },
                include: { items: true }
            })

            if (!sale) throw new Error("Venta no encontrada")

            // Por cada item de la venta, aumentar stock
            for (const item of sale.items) {
                await tx.stock.updateMany({
                    where: {
                        productId: item.productId,
                        storeId: sale.storeId
                    },
                    data: {
                        quantity: { increment: item.quantity }
                    }
                })
            }
        })
    }


    async findByIdWithDetails(id: string) {
        const data = await prisma.return.findUnique({
            where: { id },
            include: {
                sale: {
                    include: { items: true }
                }
            }
        })
        return data
    }
}