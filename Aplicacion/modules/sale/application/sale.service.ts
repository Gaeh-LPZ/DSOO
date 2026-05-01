import { StockRepository } from "@/modules/product/infrastructure/stock.repository";
import { Sale } from "../domain/Sale";
import { SaleItem } from "../domain/SaleItem";
import { ProductRepository } from "@/modules/product/infrastructure/product.repository";
import { SaleRepository } from "../infrastructure/sale.repository";
import { Payment, PaymentMethod } from "../domain/Payment";

export function parsePaymentMethod(method: string): PaymentMethod {
    const normalized = method.trim().toUpperCase();

    if (!Object.values(PaymentMethod).includes(normalized as PaymentMethod)) {
        throw new Error(`Método de pago inválido: ${method}`);
    }

    return normalized as PaymentMethod;
}

export class SaleService {
    constructor(
        private repo: SaleRepository,
        private stockRepo: StockRepository,
        private productRepo: ProductRepository

    ) { }

    // Caso de Uso: Crear Venta
    async createSale(data: { userId: string; storeId: string; customerId?: string; items: { productId: string; quantity: number }[]; }) {

        if (data.items.length === 0) {
            throw new Error("La venta debe tener al menos un item");
        }

        const sale = new Sale(
            crypto.randomUUID(),
            data.userId,
            data.storeId,
            data.customerId ?? null,
        );

        for (const item of data.items) {
            const product = await this.productRepo.findById(item.productId);
            if (!product) throw new Error("Producto no existe");

            const stock = await this.stockRepo.findByProductAndStore(
                item.productId,
                data.storeId
            );

            if (!stock || stock.getQuantity() < item.quantity) {
                throw new Error("Stock insuficiente");
            }

            const saleItem = new SaleItem(
                product.id,
                item.quantity,
                product.getPrice()
            );

            sale.addItem(saleItem);
        }

        return this.repo.create(sale);
    }

    // Caso de Uso: Pagar Venta
    async paySale(saleId: string, amount: number, method: string) {
        const sale = await this.repo.findById(saleId);
        if (!sale) throw new Error("Venta no existe");

        const parsedMethod = parsePaymentMethod(method);

        const payment = new Payment(
            crypto.randomUUID(),
            saleId,
            amount,
            parsedMethod
        );

        sale.addPayment(payment);

        return this.repo.addPayment(saleId, payment);
    }

    async findById(saleId: string) {
        const sale = await this.repo.findById(saleId)
        if (!sale) throw new Error("Venta no encontrada")
        return sale
    }

}


