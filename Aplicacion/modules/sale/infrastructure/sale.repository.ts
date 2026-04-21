import { prisma } from "@/lib/prisma";
import { Sale } from "../domain/Sale";
import { SaleItem } from "../domain/SaleItem";
import { Payment } from "../domain/Payment";
import { Prisma } from "@prisma/client";

export class SaleRepository {
    private toDomain(data: any): Sale {
        return new Sale(
            data.id,
            data.userId,
            data.storeId,
            data.customerId,
            data.items.map((i: any) =>
                new SaleItem(i.productId, i.quantity, i.price)
            ),
            data.payments.map((p: any) =>
                new Payment(
                    p.id,
                    p.saleId,
                    p.amount,
                    p.method
                )
            ),
            data.status
        );
    }

    async create(sale: Sale): Promise<Sale> {
        const data = await prisma.sale.create({
            data: {
                id: sale.id,
                userId: sale.userId,
                storeId: sale.storeId,
                customerId: sale.customerId,
                status: sale.getStatus(),

                items: {
                    create: sale.getItems().map(item => ({
                        productId: item.getProductId(),
                        quantity: item.getQuantity(),
                        price: item.getPrice()
                    }))
                }
            },
            include: {
                items: true,
                payments: true
            }
        });

        return this.toDomain(data);
    }

    async addPayment(saleId: string, payment: Payment): Promise<Sale> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            // Traer venta actual 
            const saleData = await tx.sale.findUnique({
                where: { id: saleId },
                include: {
                    items: true,
                    payments: true
                }
            });

            if (!saleData) {
                throw new Error("Venta no existe");
            }

            const previousStatus = saleData.status;

            // Convertir a dominio
            const sale = this.toDomain(saleData);

            // Aplicar lógica de negocio
            sale.addPayment(payment);

            const newStatus = sale.getStatus();

            // Detectar transición (CLAVE)
            const wasConfirmed =
                previousStatus === "PAID" ||
                previousStatus === "CREDIT";

            const isNowConfirmed =
                newStatus === "PAID" ||
                newStatus === "CREDIT";

            // Descontar stock SOLO UNA VEZ
            if (!wasConfirmed && isNowConfirmed) {
                for (const item of sale.getItems()) {
                    const result = await tx.stock.updateMany({
                        where: {
                            productId: item.getProductId(),
                            storeId: sale.storeId,
                            quantity: {
                                gte: item.getQuantity() // Evitar negativos
                            }
                        },
                        data: {
                            quantity: {
                                decrement: item.getQuantity()
                            }
                        }
                    });

                    if (result.count === 0) {
                        throw new Error("Stock insuficiente al confirmar venta");
                    }
                }
            }

            // Guardar pago y estado
            const updated = await tx.sale.update({
                where: { id: saleId },
                data: {
                    payments: {
                        create: {
                            id: payment.id,
                            saleId: saleId,
                            amount: payment.amount,
                            method: payment.method
                        }
                    },
                    status: newStatus
                },
                include: {
                    items: true,
                    payments: true
                }
            });

            return this.toDomain(updated);
        });
    }

    async findById(id: string): Promise<Sale | null> {
        const data = await prisma.sale.findUnique({
            where: { id },
            include: {
                items: true,
                payments: true
            }
        });

        if (!data) return null;

        return this.toDomain(data);
    }
}