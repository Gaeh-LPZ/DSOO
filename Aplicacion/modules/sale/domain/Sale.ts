import { Payment, PaymentMethod } from "./Payment";
import { SaleItem } from "./SaleItem";

export enum SaleStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    CREDIT = "CREDIT"
}

export class Sale {
    constructor(
        public id: string,
        public userId: string,
        public storeId: string,
        public customerId: string | null,
        private items: SaleItem[] = [],
        private payments: Payment[] = [],
        private status: SaleStatus = SaleStatus.PENDING,
    ) { }

    addItem(item: SaleItem) {
        if (this.status !== "PENDING") {
            throw new Error("No se puede modificar una venta que no está pendiente");
        }

        const existing = this.items.find(
            i => i.getProductId() === item.getProductId()
        );

        if (existing) {
            existing.increaseQuantity(item.getQuantity());
            return;
        }

        this.items.push(item);
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + item.getSubtotal();
        }, 0)
    }

    addPayment(payment: Payment) {

        if (this.status === SaleStatus.CANCELLED) {
            throw new Error("No puedes pagar una venta cancelada");
        }

        if (payment.method === PaymentMethod.CREDIT) {

            if (this.payments.length > 0) {
                throw new Error("No puedes mezclar crédito con otros pagos");
            }

            this.payments.push(payment);
            this.status = SaleStatus.CREDIT;
            return;
        }

        /// Abono
        if (this.status === SaleStatus.CREDIT) {

            this.payments.push(payment);

            if (this.getPaidAmount() >= this.getTotal()) {
                this.status = SaleStatus.PAID;
            }

            return;
        }

        //Sino un flujo normal
        const total = this.getTotal();
        const paid = this.getPaidAmount();

        if (paid + payment.amount > total) {
            throw new Error("Pago excede el total");
        }

        this.payments.push(payment);

        if (this.getPaidAmount() === total) {
            this.status = SaleStatus.PAID;
        }
    }

        getPaidAmount(): number {
            return this.payments.reduce((sum, p) => sum + p.amount, 0);
        }

        getPendingAmount(): number {
            return this.getTotal() - this.getPaidAmount();
        }

        markAsPaid() {
            if (this.getPendingAmount() > 0) {
                throw new Error("No puedes marcar como pagada si falta dinero");
            }

            this.status = SaleStatus.PAID;
        }

        cancel() {
            if (this.status === "PAID") {
                throw new Error("No se puede cancelar (Pagado)")
            }

            this.status = SaleStatus.CANCELLED;
        }

        getItems(): SaleItem[] {
            return this.items;
        }

        getPayments(): Payment[] {
            return this.payments;
        }

        getStatus(): SaleStatus {
            return this.status;
        }
    }