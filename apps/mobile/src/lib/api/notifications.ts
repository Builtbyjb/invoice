import { demoNotifications } from "../demo-data";
import type { AppNotification } from "../../schemas/notification";

export async function listNotifications(): Promise<AppNotification[]> {
    // TODO: switch to real endpoint when backend is ready
    // return apiRequest({
    //   path: '/api/v1/notifications',
    //   method: 'GET',
    //   schema: appNotificationListSchema,
    //   requiresAuth: true,
    // });
    return demoNotifications.map((n) => ({ ...n, createdAt: new Date(n.createdAt) }));
}

export async function markNotificationRead(id: string): Promise<void> {
    // TODO: PATCH /api/v1/notifications/{id}/read
    void id;
}

export async function markAllNotificationsRead(): Promise<void> {
    // TODO: POST /api/v1/notifications/read-all
}
