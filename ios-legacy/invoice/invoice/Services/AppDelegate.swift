//
//  AppDelegate.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import UIKit
import UserNotifications

@MainActor
final class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }
    
    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        PushNotificationManager.shared.registerDeviceToken(deviceToken)
    }
    
    func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: any Error
    ) {
        print("Failed to register for remote notifications: \(error.localizedDescription)")
    }
    
    // MARK: - UNUserNotificationCenterDelegate
    
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        let userInfo = notification.request.content.userInfo
        let content = notification.request.content
        
        if let link = PushNotificationManager.shared.parse(userInfo) {
            NotificationStore.shared.injectForegroundNotification(
                title: content.title,
                body: content.body,
                kind: PushNotificationManager.shared.notificationKind(for: link),
                targetId: PushNotificationManager.shared.targetId(for: link)
            )
        } else {
            Task { await NotificationStore.shared.refresh() }
        }
        
        completionHandler([.banner, .sound, .list, .badge])
    }
    
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        let userInfo = response.notification.request.content.userInfo
        
        if let link = PushNotificationManager.shared.parse(userInfo) {
            PushNotificationManager.shared.pendingDeepLink = link
        }
        
        Task { await NotificationStore.shared.refresh() }
        completionHandler()
    }
}
