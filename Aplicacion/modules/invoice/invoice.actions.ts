"use server"
import { InvoiceService } from "./application/invoice.service";
import { InvoiceRepository } from "./infrastructure/invoice.repository";
import { generateInvoiceSchema } from "./invoice.schema";

const invoiceRepo = new InvoiceRepository();
const invoiceService = new InvoiceService(invoiceRepo);

export async function generateInvoiceAction(data: any) {
    const parsed = generateInvoiceSchema.parse(data);
    return invoiceService.generateInvoice(parsed.saleId);
}
