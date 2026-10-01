//
//  StatsCardsView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct StatsCardsView: View {
    let stats: DashboardStats
    let isLoading: Bool
    @State private var selectedCurrency: String?

    private let columns = [
        GridItem(.flexible()),
        GridItem(.flexible()),
    ]

    var body: some View {
        if isLoading {
            DefaultLoadingView()
                .frame(minHeight: 120)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 16))
        } else {
            LazyVGrid(columns: columns, spacing: 16) {
                StatCard(
                    title: "Paid Invoices",
                    value: "\(stats.paidCount)",
                    icon: "checkmark.circle.fill",
                    iconColor: .green
                )

                StatCard(
                    title: "Overdue Invoices",
                    value: "\(stats.overdueCount)",
                    icon: "exclamationmark.triangle.fill",
                    iconColor: .red
                )
                
                StatCard(
                    title: "Sent Invoices",
                    value: "\(stats.sentCount)",
                    icon: "checkmark.circle",
                    iconColor: .orange
                )

            StatCard(
                title: "Draft Invoices",
                value: "\(stats.draftCount)",
                icon: "doc.text",
                iconColor: .red
            )
            }
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
    }
}

#Preview {
    let sampleStats = DashboardStats(
        paidCount: 12,
        sentCount: 4,
        overdueCount: 2,
        draftCount: 8,
    )

    VStack {
        StatsCardsView(
            stats: sampleStats,
            isLoading: true
        ).padding()

        StatsCardsView(
            stats: sampleStats,
            isLoading: false
        ).padding()
    }
}
