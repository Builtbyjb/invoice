//
//  invoiceApp.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-24.
//

import SwiftUI

@main
struct AcorpInvoiceApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    var body: some Scene {
        WindowGroup {
            MainView()
                .environment(AuthSession.shared)
                .environment(NotificationStore.shared)
                .environment(PushNotificationManager.shared)
        }
    }
}
