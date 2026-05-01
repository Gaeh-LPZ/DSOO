"use server"
import { requireRole } from "@/share/auth"
import { NotificationService } from "./application/notification.service"
import { NotificationRepository } from "./infrastructure/notification.repository"
import { dismissNotificationSchema, notifyLowStockSchema } from "./notification.schema"

const notificationRepo = new NotificationRepository()
const notificationService = new NotificationService(notificationRepo)

export async function notifyLowStockAction(data: any) {
    const parsed = notifyLowStockSchema.parse(data)
    return notificationService.notifyLowStock(parsed.productId, parsed.storeId,parsed.message)
}

export async function getNotificationsAction() {
    const payload = await requireRole("GERENTE")
    return notificationService.getNotifications(payload.userId)
}

export async function dismissNotificationAction(data: any) {
    await requireRole("GERENTE")
    const parsed = dismissNotificationSchema.parse(data)
    return notificationService.dismissNotification(parsed.id)
}

