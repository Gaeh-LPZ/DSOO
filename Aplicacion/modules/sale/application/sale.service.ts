import { StockRepository } from "@/modules/product/infrastructure/stock.repository";
import { Sale } from "../domain/Sale";
import { SaleItem } from "../domain/SaleItem";
import { ProductRepository } from "@/modules/product/infrastructure/product.repository";
import { SaleRepository } from "../infrastructure/sale.repository";
import { Payment, PaymentMethod } from "../domain/Payment";
import { CustomerService } from "@/modules/customer/application/customer.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
        private productRepo: ProductRepository,
        private customerService: CustomerService
    ) { }

    // Caso de Uso: Crear Venta
    async createSale(data: { userId: string; storeId: string; customerId?: string; items: { productId: string; quantity: number }[]}) {
        if (data.items.length === 0) throw new Error("La venta debe tener al menos un item")

        let storeId = data.storeId

        // Si es venta online, buscar tienda con stock suficiente
        if (storeId === process.env.STORE_ONLINE_ID) {
            storeId = await this.findStoreWithStock(data.items)
        }

        const sale = new Sale(
            crypto.randomUUID(),
            data.userId,
            storeId,        // ← ya es la tienda real con stock
            data.customerId ?? null,
        )

        for (const item of data.items) {
            const product = await this.productRepo.findById(item.productId)
            if (!product) throw new Error("Producto no existe")

            const stock = await this.stockRepo.findByProductAndStore(item.productId, storeId)
            if (!stock || stock.getQuantity() < item.quantity) {
                throw new Error(`Stock insuficiente para ${product.name}`)
            }

            sale.addItem(new SaleItem(product.id, item.quantity, product.getPrice()))
        }

        return this.repo.create(sale)
    }

    // Encuentra la primera tienda que tenga stock de TODOS los productos
    private async findStoreWithStock( items: { productId: string; quantity: number }[]): Promise<string> {
        // Obtener todas las tiendas excepto la online
        const stores = await this.stockRepo.findAllStores()
        const realStores = stores.filter(s => s.id !== process.env.STORE_ONLINE_ID)

        for (const store of realStores) {
            let hasAll = true

            for (const item of items) {
                const stock = await this.stockRepo.findByProductAndStore(
                    item.productId,
                    store.id
                )
                if (!stock || stock.getQuantity() < item.quantity) {
                    hasAll = false
                    break
                }
            }

            if (hasAll) return store.id
        }

        throw new Error("No hay tienda con stock suficiente para completar el pedido")
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
        const result = await this.repo.addPayment(saleId, payment);

        const customerId = (sale as any).customerId || (sale as any).getCustomerId?.();

        if (customerId) {
            try {
                const total = (sale as any).total || (sale as any).getTotal?.();
                await this.customerService.addPointsFromSale(customerId, total);
                console.log(`Puntos de lealtad aplicados exitosamente al cliente ${customerId}`);
            } catch (error: any) {
                console.log(`No se acumularon puntos: ${error.message}`);
            }
        }

        return result;
    }

    async findById(saleId: string) {
        const sale = await this.repo.findById(saleId)
        if (!sale) throw new Error("Venta no encontrada")
        return sale
    }

    async getTopProducts(storeId: string, limit: number = 5) {
        return this.repo.findTopProducts(storeId, limit)
    }

    async getTotalSales(storeId: string, startDate: Date, endDate: Date) {
        return this.repo.getTotalSales(storeId, startDate, endDate)
    }

    async createStripePaymentIntent(saleId: string) {
        const sale = await this.repo.findById(saleId);
        if (!sale) throw new Error("Venta no existe");

        if (sale.getStatus() !== "PENDING") {
            throw new Error("La venta ya no está pendiente");
        }

        const amount = sale.getPendingAmount();
        if (amount <= 0) {
            throw new Error("No hay monto pendiente");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: "mxn",
            metadata: {
                saleId: sale.id
            }
        });

        return paymentIntent.client_secret;
    }

    async findSalesByCustomerId(saleId: string) {
        const sales = await this.repo.findByCustomerId(saleId)
        return sales
    }
}