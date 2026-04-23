export class Return {
    constructor(
        public id: string,
        public saleId: string,
        public reason: string,
        public approvedBy: string | null = null,
    ) {
        if (!reason || reason.trim().length < 3) {
            throw new Error("La razón de devolución es requerida")
        }
    }

    getSaleId(): string {
        return this.saleId
    }

    getReason(): string {
        return this.reason
    }

    // Aprobar devolución
    approve(userId: string): void {
        if (this.isApproved()) {
            throw new Error("La devolución ya fue aprobada")
        }


        this.approvedBy = userId;
    }

    isApproved(): boolean {
        if (this.approvedBy != null) {
            return true
        }
        return false
    }
}