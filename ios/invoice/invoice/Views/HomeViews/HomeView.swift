//
//  HomeView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct HomeView: View {
    @State private var router = AppCoordinator().homeRouter
    @State private var stats: DashboardStats = DashboardStats(
        paidCount: 0,
        sentCount: 0,
        overdueCount: 0,
        draftCount: 0
    )
    
    @State private var isLoadingStats: Bool = false

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 24) {
                    // Stats Cards Section
                    StatsCardsView(stats: stats, isLoading: isLoadingStats).padding(.horizontal)

                    // Revenue Chart Section (fetches its own data)
                    RevenueChartView().padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Dashboard")
            .navigationDestination(for: AppRoute.self) { route in
                router.switchView(route: route)
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    TopBarButtons()
                }
            }
            .task {
                do {
                    isLoadingStats = true
                    stats = try await Dashboard.fetchDashboardStats()
                } catch {
                    print(error.localizedDescription)
                }
                isLoadingStats = false
            }
        }
        .environment(router)
    }
}

#Preview {
    HomeView()
}
