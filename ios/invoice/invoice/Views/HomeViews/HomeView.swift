//
//  HomeView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ShimmerModifier: ViewModifier {
    let active: Bool
    @State private var phase: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .redacted(reason: active ? .placeholder : [])
            .overlay(
                GeometryReader { geo in
                    if active {
                        Rectangle()
                            .fill(
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        .white.opacity(0),
                                        .white.opacity(0.6),
                                        .white.opacity(0),
                                    ]),
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(
                                width: geo.size.width * 2,
                                height: geo.size.height
                            )
                            .offset(
                                x: -geo.size.width + phase * geo.size.width * 2
                            )
                            .onAppear {
                                withAnimation(
                                    .linear(duration: 1.5).repeatForever(
                                        autoreverses: false
                                    )
                                ) {
                                    phase = 1
                                }
                            }
                            .allowsHitTesting(false)
                    }
                }
                .mask(content)
            )
    }
}

extension View {
    func shimmer(active: Bool) -> some View {
        modifier(ShimmerModifier(active: active))
    }
}

struct HomeView: View {
    @State private var router = Router.shared
    @State private var isLoading = true
    @State private var dStats: Dashboard = .init(
        stats: .init(totalRevenue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0, currency: "N/A"),
        invoicesStatus: [],
        monthlyRevenues: []
    )

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 24) {
                    // Stats Cards Section
                    StatsCardsView(stats: dStats.stats ,isLoading: isLoading).padding(.horizontal)

                    // Revenue Chart Section
                    RevenueChartView(monthlyRevenue: dStats.monthlyRevenues, isLoading: isLoading).padding(.horizontal)

                    // Status Chart Section
                    StatusChartView(statusCounts: dStats.invoicesStatus, isLoading: isLoading).padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Dashboard")
            .navigationDestination(for: Route.self) { route in
                router.switchView(route: route)
            }
            .task {
                do {
                    dStats = try await Dashboard.fetchDashboardData()
                } catch {
                    print(error)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    ControlGroup {
                        Button(action: {
                            router.navigate(to: .help)
                        }) {
                            Image(systemName: "questionmark.circle")
                        }
                        Button(action: {
                            router.navigate(to: .notification)
                        }) {
                            Image(systemName: "bell")
                        }
                        Button(action: {
                            router.navigate(to: .settings)

                        }) {
                            Image(systemName: "gear")
                        }
                    }
                }

            }
            .task {
                // Simulate loading delay to show skeleton shimmer
                try? await Task.sleep(for: .seconds(2))
                isLoading = false
            }
        }
    }
}

#Preview {
    HomeView()
}
