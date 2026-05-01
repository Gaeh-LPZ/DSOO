import { prisma } from "@/lib/prisma";
import { StockNotification } from "@/modules/notification/domain/Notification";

export class NotificationRepository {
    constructor(){}

    private toDomain(data: any): StockNotification {
    return new StockNotification(
        data.id,
        data.userId,
        data.storeId,
        data.productId,
        data.message
    )
}

    async create(notification: StockNotification): Promise<void> {
        const data = await prisma.notification.create({
            data: {
                id: notification.id,
                userId: notification.userId,
                storeId: notification.storeId,
                productId: notification.productId,
                message: notification.message
            }
        })
    }

    async delete(id: string): Promise<void>{
        await prisma.notification.delete({
            where: {
                id: id
            }
            
        })
    }

    async findByUserId(userId: string): Promise<StockNotification[]>{
        const data = await prisma.notification.findMany({
            where: {userId: userId},
        })
        return data.map(d => this.toDomain(d)) 
    }

    async findManagerByStore(storeId: string): Promise<string | null> {
    const manager = await prisma.user.findFirst({
        where: {
            storeId: storeId,
            roles: {
                some: {
                    role: { name: "GERENTE" }
                }
            }
        }
    })
    return manager?.id ?? null
}
}


