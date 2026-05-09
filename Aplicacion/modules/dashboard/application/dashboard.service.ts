import { SaleRepository } from "@/modules/sale/infrastructure/sale.repository";
import { DashboardRepository } from "../infrastructure/dashboard.repository";

export class DashboardService {
    constructor(
        private saleRepo: SaleRepository,
        private repo: DashboardRepository
    ) { }

    async getTopProducts(storeId: string, limit: number = 10) {
        return this.saleRepo.findTopProducts(storeId, limit)
    }

    async getTotalSales(storeId: string, startDate: Date, endDate: Date) {
        return this.saleRepo.getTotalSales(storeId, startDate, endDate)
    }

    async getGlobalStats() {
        const [users, stores, roles] = await Promise.all([
            this.repo.getUsersCount(),
            this.repo.getStoresCount(),
            this.repo.getRolesCount(),
        ]);
        return { users, stores, roles };
    }

    async getRecentUsers(limit = 5) {
        const data = await this.repo.getRecentUsers(limit);
        return data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.roles.length > 0 ? u.roles[0].role.name : "Sin rol",
            status: u.isActive ? "Activo" : "Inactivo"
        }));
    }

    async getSalesByDepartment() {
        const salesItems = await this.repo.getSaleItems();

        const grouping = salesItems.reduce((acc: Record<string, number>, item) => {
            const cat = item.product.category;
            const amount = item.price * item.quantity;
            acc[cat] = (acc[cat] ?? 0) + amount;
            return acc;
        }, {});

        return Object.entries(grouping).map(([name, sales]) => ({
            name,
            sales,
        }));
    }
}