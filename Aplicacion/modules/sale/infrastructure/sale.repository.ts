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
                total: sale.getTotal(),
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

    async findTopProducts(storeId: string, limit: number = 5) {
        const result = await prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    storeId: storeId,
                    status: { in: ['PAID', 'CREDIT'] }
                }
            },
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: limit
        })
    
        // Traer nombre de cada producto
        const withNames = await Promise.all(
            result.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true }
                })
                return {
                    productId: item.productId,
                    name: product?.name ?? item.productId,
                    quantity: item._sum.quantity ?? 0
                }
            })
        )
    
        return withNames
    }

    async getTotalSales(storeId: string, startDate: Date, endDate: Date) {
        const result = await prisma.sale.aggregate({
            where: {
                storeId: storeId,
                status: { in: ['PAID', 'CREDIT'] },
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                total: true
            }
        })
        return result._sum.total ?? 0
    }
    async findByCustomerId(customerId: string): Promise<Sale[]> {
        const data = await prisma.sale.findMany({
            where: { customerId },
            include: { items: true, payments: true },
            orderBy: { createdAt: 'desc' }
        })
        return data.map((d: any) => this.toDomain(d))
    }
}