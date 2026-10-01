//
//  NotificationStore.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import Observation
import SwiftUI
import UserNotifications

@MainActor
@Observable
final class NotificationStore {
    static let shared = NotificationStore()
    
    private(set) var notifications: [AppNotification] = []
    
    var unreadCount: Int {
        notifications.filter { !$0.isRead }.count
    }
    
    var hasUnreadNotifications: Bool {
        unreadCount > 0
    }
    
    private init() {}
    
    func refresh() async {
        do {
            notifications = try await AppNotification.fetchNotifications()
            await updateAppBadge()
        } catch {
            print("Failed to refresh notifications: \(error.localizedDescription)")
        }
    }
    
    func markRead(_ notification: AppNotification) async {
        guard let index = notifications.firstIndex(where: { $0.id == notification.id }), !notifications[index].isRead else {
            return
        }
        notifications[index].isRead = true
        do {
            try await AppNotification.markRead(id: notification.id)
            await updateAppBadge()
        } catch {
            print("Failed to mark notification read: \(error.localizedDescription)")
        }
    }
    
    func markAllRead() async {
        for index in notifications.indices where !notifications[index].isRead {
            notifications[index].isRead = true
        }
        do {
            try await AppNotification.markAllRead()
            await updateAppBadge()
        } catch {
            print("Failed to mark all notifications read: \(error.localizedDescription)")
        }
    }
    
    /// Call when a remote notification arrives in the foreground to immediately surface it.
    func injectForegroundNotification(title: String, body: String, kind: NotificationKind, targetId: String?) {
        let notification = AppNotification(
            id: UUID().uuidString,
            title: title,
            body: body,
            kind: kind,
            targetId: targetId,
            isRead: false,
            createdAt: Date()
        )
        notifications.insert(notification, at: 0)
        Task { await updateAppBadge() }
    }
    
    private func updateAppBadge() async {
        if #available(iOS 16.0, *) {
            let center = UNUserNotificationCenter.current()
            try? await center.setBadgeCount(unreadCount)
        }
    }
}
