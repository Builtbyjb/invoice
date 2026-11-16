import { z } from 'zod';

import { isoDate } from './common';

export const NOTIFICATION_KINDS = ['client', 'invoice', 'system'] as const;
export const notificationKindSchema = z.enum(NOTIFICATION_KINDS);
export type NotificationKind = z.infer<typeof notificationKindSchema>;

export const appNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  kind: notificationKindSchema,
  targetId: z.string().nullish(),
  isRead: z.boolean(),
  createdAt: isoDate,
});
export type AppNotification = z.output<typeof appNotificationSchema>;

export const appNotificationListSchema = z.array(appNotificationSchema);
