//
//  RevenueChartView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI
import Charts

struct RevenueChartView: View {
    @State private var monthlyRevenue: [MonthlyRevenue] = []
    @State private var isLoading: Bool = true

    @State private var selectedYear: String
    @State private var selectedCurrency: String

    private let baseCurrencies = ["USD", "EUR", "GBP", "NGN"]

    init() {
        _selectedYear = State(initialValue: "Lifetime")
        _selectedCurrency = State(initialValue: TokenStore.shared.preferredCurrency ?? "USD")
    }

    fileprivate init(
        monthlyRevenue: [MonthlyRevenue],
        selectedYear: String,
        selectedCurrency: String
    ) {
        _monthlyRevenue = State(initialValue: monthlyRevenue)
        _isLoading = State(initialValue: false)
        _selectedYear = State(initialValue: selectedYear)
        _selectedCurrency = State(initialValue: selectedCurrency)
    }

    private var availableYears: [String] {
        let currentYear = Calendar.current.component(.year, from: Date())
        let years = (0..<6).map { String(currentYear - $0) }
        return ["Lifetime"] + years
    }

    private var availableCurrencies: [String] {
        if baseCurrencies.contains(selectedCurrency) {
            return baseCurrencies
        }
        return baseCurrencies + [selectedCurrency]
    }

    var body: some View {
        mainContent
            .padding()
            .background(Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .task(id: selectedYear + selectedCurrency) {
                await fetchRevenue()
            }
    }

    @ViewBuilder
    private var mainContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            RevenueChartHeaderView(
                selectedYear: $selectedYear,
                selectedCurrency: $selectedCurrency,
                availableYears: availableYears,
                availableCurrencies: availableCurrencies
            )

            RevenueChartContentView(
                data: monthlyRevenue,
                currency: selectedCurrency,
                isLoading: isLoading
            )
        }
    }

    private func fetchRevenue() async {
        isLoading = true
        do {
            let year = selectedYear == "Lifetime" ? nil : selectedYear
            monthlyRevenue = try await Dashboard.fetchMonthlyRevenue(
                year: year,
                currency: selectedCurrency
            )
        } catch {
            print(error.localizedDescription)
        }
        isLoading = false
    }
}

struct RevenueChartHeaderView: View {
    @Binding var selectedYear: String
    @Binding var selectedCurrency: String

    let availableYears: [String]
    let availableCurrencies: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Revenue")
                .font(.title3)
                .fontWeight(.semibold)

            HStack(spacing: 12) {
                DropdownPicker(
                    selection: $selectedYear,
                    options: availableYears
                )

                DropdownPicker(
                    selection: $selectedCurrency,
                    options: availableCurrencies
                )

                Spacer()
            }
        }
    }
}

struct DropdownPicker: View {
    @Binding var selection: String
    let options: [String]

    var body: some View {
        Menu {
            ForEach(options, id: \.self) { option in
                Button(option) {
                    selection = option
                }
            }
        } label: {
            HStack {
                Text(selection)
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
    }
}

struct RevenueChartContentView: View {
    let data: [MonthlyRevenue]
    let currency: String
    let isLoading: Bool

    private var sortedData: [MonthlyRevenue] {
        data.sorted { monthOrder($0.month) < monthOrder($1.month) }
    }

    var body: some View {
        content
    }

    @ViewBuilder
    private var content: some View {
        if isLoading {
            RevenueChartSkeletonView()
        } else if sortedData.isEmpty {
            RevenueChartEmptyView()
        } else {
            RevenueBarChartView(data: sortedData, currency: currency)
        }
    }
}

struct RevenueChartSkeletonView: View {
    var body: some View {
        DefaultLoadingView()
            .frame(height: 220)
            .background(Color(.tertiarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

struct RevenueChartEmptyView: View {
    var body: some View {
        ContentUnavailableView("No Data", systemImage: "chart.bar")
            .frame(height: 220)
    }
}

struct RevenueBarChartView: View {
    let data: [MonthlyRevenue]
    let currency: String

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            chart
            legend
        }
    }

    @ViewBuilder
    private var chart: some View {
        Chart {
            ForEach(data, id: \.month) { item in
                BarMark(
                    x: .value("Month", item.month),
                    y: .value("Amount", item.amount)
                )
                .foregroundStyle(currencyColor(currency))
                .cornerRadius(6)
            }
        }
        .chartXAxis {
            AxisMarks(values: .automatic(desiredCount: 6))
        }
        .chartYAxis {
            AxisMarks(position: .leading)
        }
        .frame(height: 220)
    }

    @ViewBuilder
    private var legend: some View {
        HStack(spacing: 16) {
            HStack(spacing: 6) {
                Circle()
                    .fill(currencyColor(currency))
                    .frame(width: 8, height: 8)
                Text(currency)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
        }
    }
}

private func monthOrder(_ month: String) -> Int {
    switch month {
    case "Jan": return 1
    case "Feb": return 2
    case "Mar": return 3
    case "Apr": return 4
    case "May": return 5
    case "Jun": return 6
    case "Jul": return 7
    case "Aug": return 8
    case "Sep": return 9
    case "Oct": return 10
    case "Nov": return 11
    case "Dec": return 12
    default: return 0
    }
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



#Preview {
     let sampleMonthlyRevenue: [MonthlyRevenue] = [
        MonthlyRevenue(month: "Jan", amount: 5200),
        MonthlyRevenue(month: "Feb", amount: 7100),
        MonthlyRevenue(month: "Mar", amount: 4800),
        MonthlyRevenue(month: "Apr", amount: 8200),
        MonthlyRevenue(month: "May", amount: 6900),
        MonthlyRevenue(month: "Jun", amount: 9100),
        MonthlyRevenue(month: "Jul", amount: 7600),
        MonthlyRevenue(month: "Aug", amount: 8500),
        MonthlyRevenue(month: "Sep", amount: 6300),
        MonthlyRevenue(month: "Oct", amount: 9400),
        MonthlyRevenue(month: "Nov", amount: 5800),
        MonthlyRevenue(month: "Dec", amount: 10100)
    ]
    
    RevenueChartView(
        monthlyRevenue: sampleMonthlyRevenue,
        selectedYear: "Lifetime",
        selectedCurrency: "USD"
    )
    .padding()
}
