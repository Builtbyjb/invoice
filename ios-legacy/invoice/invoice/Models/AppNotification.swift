//
//  AppNotification.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import Foundation

enum NotificationKind: String, Codable, Hashable {
    case client
    case invoice
    case system
}

struct AppNotification: Identifiable, Codable, Hashable {
    var id: String
    var title: String
    var body: String
    var kind: NotificationKind
    var targetId: String?
    var isRead: Bool
    var createdAt: Date
    
    static func fetchNotifications() async throws -> [AppNotification] {
        // TODO: switch to real endpoint when backend is ready
        // return try await APIClient.shared.request(
        //     path: "/api/v1/notifications",
        //     method: .GET,
        //     requiresAuth: true
        // )
        return DemoData.notifications
    }
    
    static func markRead(id: String) async throws {
        // TODO: PATCH /api/v1/notifications/{id}/read
        _ = id
    }
    
    static func markAllRead() async throws {
        // TODO: POST /api/v1/notifications/read-all
    }
}
