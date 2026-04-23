import { Return } from "../domain/Return";
import { ReturnRepository } from "../infrastructure/return.repository";

export class ReturnService {
    constructor(private repo: ReturnRepository) { }

    async createReturn(saleId: string, reason: string): Promise<Return> {
        const devolucion = new Return(
            crypto.randomUUID(),
            saleId,
            reason
        )

        return this.repo.create(devolucion)
    }

    async approveReturn(returnId: string, userId: string): Promise<void> {
        const devolucion = await this.repo.findById(returnId)
        if (!devolucion) throw new Error("Devolucion no encontrada")


        devolucion.approve(userId)
        return this.repo.approve(devolucion)


    }

    async getReturn(returnId: string): Promise<Return> {
        const devolucion = await this.repo.findById(returnId)
        if (!devolucion) throw new Error("Devolucion no existente")

        return devolucion

    }

    async getReturnWithDetails(returnId: string) {
        const data = await this.repo.findByIdWithDetails(returnId)
        if (!data) throw new Error("Devolucion no existente")
        return data
    }
}