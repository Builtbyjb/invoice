//
//  ContentView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ContentView: View {
    @State private var coordinator = AppCoordinator()
    @Environment(NotificationStore.self) private var store
    @Environment(PushNotificationManager.self) private var pushManager
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        TabView(selection: $coordinator.selectedTab) {
            HomeView()
                .tag(AppTab.home)
                .tabItem {
                    Label {
                        Text("Home")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: coordinator.selectedTab == .home ? "house.fill" : "house"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            ClientsView(router: coordinator.clientsRouter)
                .tag(AppTab.clients)
                .tabItem {
                    Label {
                        Text("Clients")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: coordinator.selectedTab == .clients ? "person.fill" : "person"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            InvoicesView(router: coordinator.invoicesRouter)
                .tag(AppTab.invoices)
                .tabItem {
                    Label {
                        Text("Invoices")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: coordinator.selectedTab == .invoices ? "doc.text.fill" : "doc.text"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
            ReferralView(router: coordinator.referralRouter)
                .tag(AppTab.referral)
                .tabItem {
                    Label {
                        Text("Referral")
                    } icon: {
                        Image(
                            uiImage: UIImage(
                                systemName: coordinator.selectedTab == .referral ? "gift.fill" : "gift"
                            )!
                        )
                        .renderingMode(.template)
                    }
                }
        }
        .environment(coordinator)
        .task {
            await pushManager.requestAuthorization()
            await store.refresh()
            if let link = pushManager.pendingDeepLink {
                pushManager.pendingDeepLink = nil
                await coordinator.handle(link)
            }
        }
        .onChange(of: pushManager.pendingDeepLink) { _, newValue in
            guard let link = newValue else { return }
            pushManager.pendingDeepLink = nil
            Task { await coordinator.handle(link) }
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .active {
                Task { await store.refresh() }
            }
        }
    }
}

#Preview {
    ContentView()
        .environment(NotificationStore.shared)
        .environment(PushNotificationManager.shared)
}
