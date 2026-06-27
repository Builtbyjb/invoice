//
//  StatusChartView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI
import Charts

struct StatusChartView: View {
    let statusCounts: [InvoiceStatusCount]
    let isLoading: Bool

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "Paid": return .green
        case "Sent": return .blue
        case "Draft": return .gray
        case "Overdue": return .red
        default: return .orange
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Invoice Status")
                .font(.title3)
                .fontWeight(.semibold)

            if isLoading {
                // Skeleton loading for chart
                HStack(spacing: 20) {
                    Circle()
                        .fill(Color(.secondarySystemBackground))
                        .frame(width: 180, height: 180)
                        .shimmer(active: true)

                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(0..<4) { _ in
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(Color(.secondarySystemBackground))
                                    .frame(width: 10, height: 10)
                                RoundedRectangle(cornerRadius: 4)
                                    .fill(Color(.secondarySystemBackground))
                                    .frame(width: 80, height: 12)
                            }
                        }
                    }
                    .shimmer(active: true)

                    Spacer()
                }
                .frame(height: 200)
            } else if statusCounts.isEmpty {
                ContentUnavailableView("No Data", systemImage: "chart.pie")
                    .frame(height: 200)
            } else {
                HStack(spacing: 20) {
                    // Pie Chart
                    Chart(statusCounts) { item in
                        SectorMark(
                            angle: .value("Count", item.count),
                            innerRadius: .ratio(0.5),
                            angularInset: 2
                        )
                        .foregroundStyle(statusColor(item.status))
                        .cornerRadius(4)
                    }
                    .frame(width: 180, height: 180)
                    .chartBackground { chartProxy in
                        GeometryReader { geometry in
                            if let anchor = chartProxy.plotFrame {
                                let frame = geometry[anchor]
                                let total = statusCounts.reduce(0) { $0 + $1.count }
                                VStack {
                                    Text("\(total)")
                                        .font(.title2)
                                        .fontWeight(.bold)
                                    Text("Total")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                .position(x: frame.midX, y: frame.midY)
                            }
                        }
                    }

                    // Custom Legend
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(statusCounts) { item in
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(statusColor(item.status))
                                    .frame(width: 10, height: 10)

                                Text(item.status)
                                    .font(.subheadline)

                                Spacer()

                                Text("\(item.count)")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .frame(height: 200)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

#Preview {
    StatusChartView(statusCounts: InvoiceStatusCount.placeholderData, isLoading: false)
        .padding()
}
