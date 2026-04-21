import {
    updateCreditParamsSchema,
    applyPaymentSchema,
    getAccountSummarySchema,
} from "./credit.schema";
import { CreditService } from "./application/credit.service";
import { CreditRepository } from "./infrastructure/credit.repository";

const creditRepo = new CreditRepository();
const creditService = new CreditService(creditRepo);

// Configurar parámetros
export async function updateCreditParamsAction(data: any) {
    const parsed = updateCreditParamsSchema.parse(data);
    return creditService.updateParams(parsed.customerId, parsed.interest, parsed.dueDate);
}

// Consultar estado de cuenta
export async function getAccountSummaryAction(data: any) {
    const parsed = getAccountSummarySchema.parse(data);
    return creditService.getAccountSummary(parsed.customerId);
}

// Registrar pago
export async function applyPaymentAction(data: any) {
    const parsed = applyPaymentSchema.parse(data);
    return creditService.applyPayment(parsed.customerId, parsed.amount);
}