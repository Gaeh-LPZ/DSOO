import { Invoice } from "../domain/Invoice"
import { InvoiceRepository } from "../infrastructure/invoice.repository"

export class InvoiceService {
    constructor(private repo: InvoiceRepository) { }

    async generateInvoice(saleId: string): Promise<Invoice> {
        const xml = `<invoice><saleId>${saleId}</saleId></invoice>`
        const pdf = `invoices/${saleId}.pdf`  // ruta donde se guardaría (Modificar)
        const factura = new Invoice(
            crypto.randomUUID(),
            saleId,
            xml,pdf
        )

        return this.repo.create(factura)
    }
}