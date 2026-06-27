//
//  RevenueChartView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI
import Charts

struct RevenueChartView: View {
    let monthlyRevenue: [MonthlyRevenue]
    let isLoading: Bool

    @State private var selectedYear = "Lifetime"
    @State private var selectedCurrency = "All Currencies"

    private let currencies = ["All Currencies", "USD", "EUR", "GBP", "NGN"]

    private var availableYears: [String] {
        let years = Set(monthlyRevenue.map { "\($0.year)" }).sorted()
        return ["Lifetime"] + years
    }

    private var filteredData: [MonthlyRevenue] {
        let yearFiltered: [MonthlyRevenue]
        if selectedYear == "Lifetime" {
            yearFiltered = monthlyRevenue
        } else {
            yearFiltered = monthlyRevenue.filter { "\($0.year)" == selectedYear }
        }

        if selectedCurrency == "All Currencies" {
            return yearFiltered
        } else {
            return yearFiltered.filter { $0.currency == selectedCurrency }
        }
    }

    private var aggregatedData: [MonthlyRevenueAggregate] {
        let grouped = Dictionary(grouping: filteredData) { $0.month }
        return grouped.map { month, items in
            let total = items.reduce(0) { $0 + $1.amount }
            return MonthlyRevenueAggregate(month: month, amount: total)
        }.sorted { monthOrder($0.month) < monthOrder($1.month) }
    }

    private var currencyBreakdown: [MonthlyRevenue] {
        // For "All Currencies" we need to aggregate per month per currency
        filteredData
    }

    private func monthOrder(_ month: String) -> Int {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return months.firstIndex(of: month) ?? 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Title
            Text("Revenue")
                .font(.title3)
                .fontWeight(.semibold)

            // Dropdown row at the top
            HStack(spacing: 12) {
                // Year Picker
                Menu {
                    ForEach(availableYears, id: \.self) { year in
                        Button(year) {
                            selectedYear = year
                        }
                    }
                } label: {
                    HStack {
                        Text(selectedYear)
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Image(systemName: "chevron.down")
                            .font(.caption)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(.tertiarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }

                // Currency Picker
                Menu {
                    ForEach(currencies, id: \.self) { currency in
                        Button(currency) {
                            selectedCurrency = currency
                        }
                    }
                } label: {
                    HStack {
                        Text(selectedCurrency)
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Image(systemName: "chevron.down")
                            .font(.caption)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(.tertiarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }

                Spacer()
            }

            if isLoading {
                // Skeleton loading for chart
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.tertiarySystemBackground))
                    .frame(height: 220)
                    .shimmer(active: true)
            } else if filteredData.isEmpty {
                ContentUnavailableView("No Data", systemImage: "chart.bar")
                    .frame(height: 220)
            } else {
                Chart {
                    if selectedCurrency == "All Currencies" {
                        ForEach(aggregatedData) { item in
                            BarMark(
                                x: .value("Month", item.month),
                                y: .value("Amount", item.amount)
                            )
                            .foregroundStyle(.blue)
                            .cornerRadius(6)
                        }
                    } else {
                        ForEach(aggregatedData) { item in
                            BarMark(
                                x: .value("Month", item.month),
                                y: .value("Amount", item.amount)
                            )
                            .foregroundStyle(currencyColor(selectedCurrency))
                            .cornerRadius(6)
                        }
                    }
                }
                .chartXAxis {
                    AxisMarks(values: .automatic(desiredCount: 6))
                }
                .chartYAxis {
                    AxisMarks(position: .leading)
                }
                .frame(height: 220)

                // Legend
                HStack(spacing: 16) {
                    if selectedCurrency == "All Currencies" {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(.blue)
                                .frame(width: 8, height: 8)
                            Text("All Currencies")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    } else {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(currencyColor(selectedCurrency))
                                .frame(width: 8, height: 8)
                            Text(selectedCurrency)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    Spacer()
                }
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func currencyColor(_ currency: String) -> Color {
        switch currency {
        case "USD": return .blue
        case "EUR": return .green
        case "GBP": return .orange
        case "NGN": return .purple
        default: return .gray
        }
    }
}

// MARK: - Helper Model for Aggregated Data

struct MonthlyRevenueAggregate: Identifiable {
    let id = UUID()
    let month: String
    let amount: Double
}

#Preview {
    RevenueChartView(monthlyRevenue: MonthlyRevenue.placeholderData, isLoading: false)
        .padding()
}
