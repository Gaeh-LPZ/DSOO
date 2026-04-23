import { prisma } from "@/lib/prisma"
import { Invoice } from "../domain/Invoice"

export class InvoiceRepository {
    private toDomain(data: any): Invoice {
        return new Invoice(
            data.id,
            data.saleId,
            data.xml,
            data.pdf
        )
    }

    async create(invoice: Invoice): Promise<Invoice> {
        const data = await prisma.invoice.create({
            data: {
                id: invoice.id,
                saleId: invoice.saleId,
                xml: invoice.xml,
                pdf: invoice.pdf
            }
        })
        return this.toDomain(data)
    }
}

