//
//  TopBarButtons.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import SwiftUI

struct TopBarButtons: View {
    @Environment(AppRouter.self) var router
    @Environment(NotificationStore.self) var store
    
    var body: some View {
        ControlGroup {
            Button(action: {
                router.navigate(to: .help)
            }) {
                Image(systemName: "questionmark.circle")
            }
            
            Button(action: {
                router.navigate(to: .notification)
            }) {
                notificationBell
            }
            
            Button(action: {
                router.navigate(to: .settings)
            }) {
                Image(systemName: "gear")
            }
        }
    }
    
    private var notificationBell: some View {
        Image(systemName: "bell")
            .overlay(alignment: .topTrailing) {
                if store.hasUnreadNotifications {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 8, height: 8)
                        .offset(x: 4, y: -2)
                }
            }
    }
}

#Preview {
    @Previewable @State var router = AppRouter()
    @Previewable @State var store = NotificationStore.shared
    TopBarButtons()
        .environment(router)
        .environment(store)
}
