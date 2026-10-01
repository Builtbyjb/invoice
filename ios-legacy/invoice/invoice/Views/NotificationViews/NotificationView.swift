//
//  NotificationView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct NotificationView: View {
    @Environment(NotificationStore.self) var store
    @Environment(AppCoordinator.self) var coordinator
    
    var body: some View {
        List(store.notifications) { notification in
            Button {
                Task {
                    await store.markRead(notification)
                    await handleTap(notification)
                }
            } label: {
                NotificationRow(notification: notification)
            }
            .buttonStyle(.plain)
        }
        .listStyle(.plain)
        .navigationTitle("Notifications")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    Task { await store.markAllRead() }
                } label: {
                    Text("Mark All Read")
                }
                .disabled(!store.hasUnreadNotifications)
            }
        }
        .toolbar(.hidden, for: .tabBar)
        .task {
            await store.refresh()
        }
    }
    
    private func handleTap(_ notification: AppNotification) async {
        guard let targetId = notification.targetId else { return }
        switch notification.kind {
        case .client:
            await coordinator.handle(.client(id: targetId))
        case .invoice:
            await coordinator.handle(.invoice(id: targetId))
        case .system:
            break
        }
    }
}

private struct NotificationRow: View {
    let notification: AppNotification
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: iconName)
                .font(.title3)
                .foregroundStyle(.secondary)
                .frame(width: 36, height: 36)
                .background(Color(.tertiarySystemBackground))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 4) {
                Text(notification.title)
                    .font(.subheadline.weight(.semibold))
                Text(notification.body)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
                Text(notification.createdAt, style: .relative)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            
            Spacer()
            
            if !notification.isRead {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 8, height: 8)
            }
        }
        .padding(.vertical, 4)
    }
    
    private var iconName: String {
        switch notification.kind {
        case .client:
            return "person.fill"
        case .invoice:
            return "doc.text.fill"
        case .system:
            return "bell.fill"
        }
    }
}

#Preview {
    @Previewable @State var store = NotificationStore.shared
    @Previewable @State var coordinator = AppCoordinator()
    NavigationStack {
        NotificationView()
            .environment(store)
            .environment(coordinator)
    }
}
