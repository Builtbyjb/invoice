//
//  StatsCardsView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct StatsCardsView: View {
    let dStats: Dashboard = fetchDashboard()
    let isLoading: Bool

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]

    var body: some View {
        LazyVGrid(columns: columns, spacing: 16) {
            StatCard(
                title: "Total Revenue",
                value: formatCurrency(dStats.dashboardStats.totalRevenue, currency: dStats.dashboardStats.currency),
                icon: "dollarsign.circle.fill",
                iconColor: .blue,
                isLoading: isLoading
            )

            StatCard(
                title: "Paid Invoices",
                value: "\(dStats.dashboardStats.paidCount)",
                icon: "checkmark.circle.fill",
                iconColor: .green,
                isLoading: isLoading
            )

            StatCard(
                title: "Pending Invoices",
                value: "\(dStats.dashboardStats.pendingCount)",
                icon: "clock.fill",
                iconColor: .orange,
                isLoading: isLoading
            )

            StatCard(
                title: "Overdue Invoices",
                value: "\(dStats.dashboardStats.overdueCount)",
                icon: "exclamationmark.triangle.fill",
                iconColor: .red,
                isLoading: isLoading
            )
        }
    }

    private func formatCurrency(_ value: Double, currency: String) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let iconColor: Color
    let isLoading: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundStyle(iconColor)
                    .frame(width: 40, height: 40)
                    .background(iconColor.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 10))

                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(value)
                    .font(.title2)
                    .fontWeight(.bold)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Text(title)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shimmer(active: isLoading)
    }
}

#Preview {
    VStack {
        StatsCardsView(isLoading: true).padding()

        StatsCardsView(isLoading: false).padding()
    }
}
