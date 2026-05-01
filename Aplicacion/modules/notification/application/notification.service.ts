import { StockNotification } from "../domain/Notification";
import { NotificationRepository } from "../infrastructure/notification.repository";

export class NotificationService {
    constructor(
        private repo: NotificationRepository
    ) { }

    async notifyLowStock(productId: string, storeId: string, message: string): Promise<void> {
        const user = await this.repo.findManagerByStore(storeId);
        if (!user) throw new Error("No hay gerente de Tienda")

        const alert = new StockNotification(
            crypto.randomUUID(),
            user,
            storeId,
            productId,
            message
        )

        return this.repo.create(alert);
    }

    async getNotifications(userId: string): Promise<StockNotification[]> {
        return this.repo.findByUserId(userId)
    }

    async dismissNotification(id: string): Promise<void> {
        await this.repo.delete(id)
    }

}