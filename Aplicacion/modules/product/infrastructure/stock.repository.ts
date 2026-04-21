import { prisma } from "@/lib/prisma";
import { Stock } from "../domain/Stock";

export class StockRepository {
    // Metodo para buscar Stock por tienda y producto
    async findByProductAndStore(productId: string, storeId: string): Promise<Stock | null> {

        const data = await prisma.stock.findUnique({
            where: {
                productId_storeId: { productId, storeId }
            }
        });

        if (!data) return null;

        return new Stock(
            data.id,
            data.productId,
            data.storeId,
            data.quantity,
            data.minQuantity
        );
    }

    //Metodo para crear Stock (Relacion tienda y producto)
    async create(stock: Stock): Promise<Stock> {
        const data = await prisma.stock.create({
            data: {
                id: stock.id,
                productId: stock.getProductId(),                    // Llamada a los metodos de la clase padre (Stock)
                storeId: stock.getStoreId(),
                quantity: stock.getQuantity(),
                minQuantity: stock.getMinQuantity()
            }
        })

        return new Stock(
            data.id,
            data.productId,
            data.storeId,
            data.quantity,
            data.minQuantity
        );
    }

    // Metodo que actualiza el stock
    async update(stock: Stock): Promise<Stock> {
        const data = await prisma.stock.update({
            where: {id: stock.id},
            data: {
                productId: stock.getProductId(),                    // Llamada a los metodos de la clase padre (Stock)
                storeId: stock.getStoreId(),
                quantity: stock.getQuantity(),
                minQuantity: stock.getMinQuantity()
            }
        })
        
        return new Stock(
            data.id,
            data.productId,
            data.storeId,
            data.quantity,
            data.minQuantity
        );
    }

    // Metodo que decrementa Stock Checando el historial de movimeintos
    async decreaseStockWithMovement(productId: string, storeId: string, cantidad: number) {
        return prisma.$transaction(async (tx: {                     // Tipado del tipo
                stock: {
                    findUnique: (arg0: { // tx asegura que todo este en la misma transacción
                        where: { productId_storeId: { productId: string; storeId: string; }; };
                    }) => any; update: (arg0: { where: { id: string; }; data: { quantity: number; }; }) => any;
                }; stockMovement: {
                    create: (arg0: { // Registra movimiento
                        data: { productId: string; storeId: string; quantity: number; type: string; };
                    }) => any;
                };
            }) => {

            const stockData = await tx.stock.findUnique({           // tx asegura que todo este en la misma transacción
                where: {
                    productId_storeId: { productId, storeId }
                }
            });

            if (!stockData) throw new Error("Stock no encontrado");

            const stock = new Stock(
                stockData.id,
                stockData.productId,
                stockData.storeId,
                stockData.quantity,
                stockData.minQuantity
            );

            stock.decrease(cantidad);

            const updatedStock = await tx.stock.update({
                where: { id: stock.id },
                data: { quantity: stock.getQuantity() }
            });

            await tx.stockMovement.create({                        // Registra movimiento
                data: {
                    productId,
                    storeId,
                    quantity: cantidad,
                    type: "OUT"
                }
            });

            return updatedStock;
        });
    }
}