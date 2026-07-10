//
//  Types.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//
import Foundation

struct DashboardStats: Codable, Equatable, Hashable {
    public var totalRevenue: Double
    public var paidCount: UInt64
    public var pendingCount: UInt64
    public var overdueCount: UInt64
    public var currency: String
}

struct InvoiceStatusCount: Equatable, Hashable, Identifiable {
    public var id: UUID = UUID()
    public var status: InvoiceStatus
    public var count: UInt64
}

struct MonthlyRevenue: Equatable, Hashable {
    public var month: String
    public var year: UInt16
    public var currency: String
    public var amount: UInt32
}

struct Dashboard {
    public var stats: DashboardStats
    public var invoicesStatus: [InvoiceStatusCount]
    public var monthlyRevenues: [MonthlyRevenue]

    static func fetchDashboardData() async throws -> Dashboard {
        return Dashboard(
            stats: .init(totalRevenue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0, currency: "N/A"),
            invoicesStatus: [],
            monthlyRevenues: []
        )
    }
}
