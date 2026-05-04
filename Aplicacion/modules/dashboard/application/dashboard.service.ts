import { SaleRepository } from "@/modules/sale/infrastructure/sale.repository";

export class DashboardService {
    constructor(
        private saleRepo: SaleRepository,
    ) {}

    async getTopProducts(storeId: string, limit: number = 10) {
        return this.saleRepo.findTopProducts(storeId, limit)
    }

    async getTotalSales(storeId: string, startDate: Date, endDate: Date) {
        return this.saleRepo.getTotalSales(storeId, startDate, endDate)
    }
}