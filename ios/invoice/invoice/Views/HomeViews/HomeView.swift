//
//  HomeView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

// MARK: - Data Models

struct DashboardStats {
    let totalRevenue: Double
    let paidCount: Int
    let pendingCount: Int
    let overdueCount: Int
    let currency: String
}

struct MonthlyRevenue: Identifiable {
    let id = UUID()
    let month: String
    let year: Int
    let currency: String
    let amount: Double
}

struct InvoiceStatusCount: Identifiable {
    let id = UUID()
    let status: String
    let count: Int
}

// MARK: - Placeholder Data

extension DashboardStats {
    static let placeholder = DashboardStats(
        totalRevenue: 125000.00,
        paidCount: 48,
        pendingCount: 12,
        overdueCount: 5,
        currency: "USD"
    )
}

extension MonthlyRevenue {
    static let placeholderData: [MonthlyRevenue] = [
        // 2026 Data
        MonthlyRevenue(
            month: "Jan",
            year: 2026,
            currency: "USD",
            amount: 12000
        ),
        MonthlyRevenue(month: "Jan", year: 2026, currency: "EUR", amount: 8500),
        MonthlyRevenue(month: "Jan", year: 2026, currency: "GBP", amount: 6200),
        MonthlyRevenue(
            month: "Jan",
            year: 2026,
            currency: "NGN",
            amount: 150000
        ),

        MonthlyRevenue(
            month: "Feb",
            year: 2026,
            currency: "USD",
            amount: 15000
        ),
        MonthlyRevenue(month: "Feb", year: 2026, currency: "EUR", amount: 9200),
        MonthlyRevenue(month: "Feb", year: 2026, currency: "GBP", amount: 7100),
        MonthlyRevenue(
            month: "Feb",
            year: 2026,
            currency: "NGN",
            amount: 175000
        ),

        MonthlyRevenue(
            month: "Mar",
            year: 2026,
            currency: "USD",
            amount: 18000
        ),
        MonthlyRevenue(
            month: "Mar",
            year: 2026,
            currency: "EUR",
            amount: 11000
        ),
        MonthlyRevenue(month: "Mar", year: 2026, currency: "GBP", amount: 8000),
        MonthlyRevenue(
            month: "Mar",
            year: 2026,
            currency: "NGN",
            amount: 200000
        ),

        MonthlyRevenue(
            month: "Apr",
            year: 2026,
            currency: "USD",
            amount: 22000
        ),
        MonthlyRevenue(
            month: "Apr",
            year: 2026,
            currency: "EUR",
            amount: 13500
        ),
        MonthlyRevenue(month: "Apr", year: 2026, currency: "GBP", amount: 9500),
        MonthlyRevenue(
            month: "Apr",
            year: 2026,
            currency: "NGN",
            amount: 225000
        ),

        MonthlyRevenue(
            month: "May",
            year: 2026,
            currency: "USD",
            amount: 19500
        ),
        MonthlyRevenue(
            month: "May",
            year: 2026,
            currency: "EUR",
            amount: 12000
        ),
        MonthlyRevenue(month: "May", year: 2026, currency: "GBP", amount: 8700),
        MonthlyRevenue(
            month: "May",
            year: 2026,
            currency: "NGN",
            amount: 210000
        ),

        MonthlyRevenue(
            month: "Jun",
            year: 2026,
            currency: "USD",
            amount: 25000
        ),
        MonthlyRevenue(
            month: "Jun",
            year: 2026,
            currency: "EUR",
            amount: 15500
        ),
        MonthlyRevenue(
            month: "Jun",
            year: 2026,
            currency: "GBP",
            amount: 11000
        ),
        MonthlyRevenue(
            month: "Jun",
            year: 2026,
            currency: "NGN",
            amount: 250000
        ),

        // 2025 Data
        MonthlyRevenue(
            month: "Jan",
            year: 2025,
            currency: "USD",
            amount: 10000
        ),
        MonthlyRevenue(month: "Jan", year: 2025, currency: "EUR", amount: 7200),
        MonthlyRevenue(month: "Jan", year: 2025, currency: "GBP", amount: 5400),
        MonthlyRevenue(
            month: "Jan",
            year: 2025,
            currency: "NGN",
            amount: 130000
        ),

        MonthlyRevenue(
            month: "Feb",
            year: 2025,
            currency: "USD",
            amount: 11500
        ),
        MonthlyRevenue(month: "Feb", year: 2025, currency: "EUR", amount: 8000),
        MonthlyRevenue(month: "Feb", year: 2025, currency: "GBP", amount: 6000),
        MonthlyRevenue(
            month: "Feb",
            year: 2025,
            currency: "NGN",
            amount: 145000
        ),

        MonthlyRevenue(
            month: "Mar",
            year: 2025,
            currency: "USD",
            amount: 13000
        ),
        MonthlyRevenue(month: "Mar", year: 2025, currency: "EUR", amount: 8800),
        MonthlyRevenue(month: "Mar", year: 2025, currency: "GBP", amount: 6700),
        MonthlyRevenue(
            month: "Mar",
            year: 2025,
            currency: "NGN",
            amount: 160000
        ),

        MonthlyRevenue(
            month: "Apr",
            year: 2025,
            currency: "USD",
            amount: 14500
        ),
        MonthlyRevenue(month: "Apr", year: 2025, currency: "EUR", amount: 9500),
        MonthlyRevenue(month: "Apr", year: 2025, currency: "GBP", amount: 7200),
        MonthlyRevenue(
            month: "Apr",
            year: 2025,
            currency: "NGN",
            amount: 175000
        ),

        MonthlyRevenue(
            month: "May",
            year: 2025,
            currency: "USD",
            amount: 16000
        ),
        MonthlyRevenue(
            month: "May",
            year: 2025,
            currency: "EUR",
            amount: 10200
        ),
        MonthlyRevenue(month: "May", year: 2025, currency: "GBP", amount: 7800),
        MonthlyRevenue(
            month: "May",
            year: 2025,
            currency: "NGN",
            amount: 190000
        ),

        MonthlyRevenue(
            month: "Jun",
            year: 2025,
            currency: "USD",
            amount: 17500
        ),
        MonthlyRevenue(
            month: "Jun",
            year: 2025,
            currency: "EUR",
            amount: 11000
        ),
        MonthlyRevenue(month: "Jun", year: 2025, currency: "GBP", amount: 8300),
        MonthlyRevenue(
            month: "Jun",
            year: 2025,
            currency: "NGN",
            amount: 200000
        ),
    ]
}

extension InvoiceStatusCount {
    static let placeholderData: [InvoiceStatusCount] = [
        InvoiceStatusCount(status: "Paid", count: 48),
        InvoiceStatusCount(status: "Sent", count: 25),
        InvoiceStatusCount(status: "Draft", count: 15),
        InvoiceStatusCount(status: "Overdue", count: 5),
    ]
}

// MARK: - Shimmer Effect Modifier

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

// MARK: - Home View

struct HomeView: View {
    @State private var router = Router.shared
    @State private var isLoading = true
    @State private var stats = DashboardStats.placeholder
    @State private var monthlyRevenue = MonthlyRevenue.placeholderData
    @State private var statusCounts = InvoiceStatusCount.placeholderData

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 24) {
                    // Stats Cards Section
                    StatsCardsView(stats: stats, isLoading: isLoading)
                        .padding(.horizontal)

                    // Revenue Chart Section
                    RevenueChartView(
                        monthlyRevenue: monthlyRevenue,
                        isLoading: isLoading
                    )
                    .padding(.horizontal)

                    // Status Chart Section
                    StatusChartView(
                        statusCounts: statusCounts,
                        isLoading: isLoading
                    )
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .navigationTitle("Dashboard")
            .navigationDestination(for: Route.self) { route in
                router.switchView(route: route)
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
