import { prisma } from "@/lib/prisma";

export class DashboardRepository {

    async getUsersCount(): Promise<number> {
        return prisma.user.count();
    }

    async getStoresCount(): Promise<number> {
        return prisma.store.count();
    }

    async getRolesCount(): Promise<number> {
        return prisma.role.count();
    }

    async getRecentUsers(limit: number) {
        return prisma.user.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                roles: { include: { role: true } }
            }
        });
    }

    async getSaleItems() {
        return prisma.saleItem.findMany({
            include: { product: true }
        });
    }
}