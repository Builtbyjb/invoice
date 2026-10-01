//
//  PushNotificationManager.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import Observation
import SwiftUI
import UserNotifications

@MainActor
@Observable
final class PushNotificationManager {
    static let shared = PushNotificationManager()
    
    private init() {}
    
    /// Set by the AppDelegate when a push notification is tapped before the UI is ready.
    var pendingDeepLink: DeepLink?
    
    /// Requests authorization and, if granted, registers with APNs.
    func requestAuthorization() async {
        let center = UNUserNotificationCenter.current()
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        do {
            let granted = try await center.requestAuthorization(options: options)
            if granted {
                UIApplication.shared.registerForRemoteNotifications()
            }
        } catch {
            print("Push authorization request failed: \(error.localizedDescription)")
        }
    }
    
    /// Uploads the device token to the backend. Called by the AppDelegate.
    /// TODO: replace with POST /api/v1/devices { token, platform: "ios" }
    func registerDeviceToken(_ data: Data) {
        let token = data.map { String(format: "%02.2hhx", $0) }.joined()
        print("APNs device token: \(token)")
    }
    
    /// Parses the payload custom keys into a DeepLink.
    func parse(_ userInfo: [AnyHashable: Any]) -> DeepLink? {
        guard let type = userInfo["type"] as? String else { return nil }
        let targetId = userInfo["target_id"] as? String
        
        switch type {
        case "client":
            return targetId.map { .client(id: $0) }
        case "invoice":
            return targetId.map { .invoice(id: $0) }
        default:
            return nil
        }
    }
    
    /// Extracts the target kind for foreground notification injection.
    func notificationKind(for link: DeepLink) -> NotificationKind {
        switch link {
        case .client: return .client
        case .invoice: return .invoice
        }
    }
    
    func targetId(for link: DeepLink) -> String? {
        switch link {
        case .client(let id): return id
        case .invoice(let id): return id
        }
    }
}
