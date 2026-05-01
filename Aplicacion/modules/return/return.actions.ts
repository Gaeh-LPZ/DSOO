"use server"
import { requireRole } from "@/share/auth";
import { ReturnService } from "./application/return.service";
import { ReturnRepository } from "./infrastructure/return.repository";
import { approveReturnSchema, createReturnSchema, getReturnSchema } from "./return.schema";


const returnRepo = new ReturnRepository();
const returnService = new ReturnService(returnRepo);

export async function createReturnAction(data: any) {
    const parsed = createReturnSchema.parse(data);
    return returnService.createReturn(parsed.saleId, parsed.reason);
}

export async function approveReturnAction(data: any) {
    await requireRole("GERENTE")
    const parsed = approveReturnSchema.parse(data);
    return returnService.approveReturn(parsed.returnId, parsed.userId);
}

export async function getReturnAction(data: any) {
    const parsed = getReturnSchema.parse(data);
    return returnService.getReturn(parsed.returnId);
}

export async function getReturnWithDetailsAction(data: any) {
    const parsed = getReturnSchema.parse(data);
    return returnService.getReturnWithDetails(parsed.returnId);
}

