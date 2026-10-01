//
//  Types.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//
import Foundation

struct DashboardStats: Codable, Equatable, Hashable {
    public var paidCount: UInt64
    public var sentCount: UInt64
    public var overdueCount: UInt64
    public var draftCount: UInt64
}

struct InvoiceStatusCount: Codable, Equatable, Hashable {
    public var status: InvoiceStatus
    public var count: UInt64
}

struct MonthlyRevenue: Codable, Equatable, Hashable {
    public var month: String
    public var amount: Double
}

struct Dashboard: Codable, Equatable, Hashable {
    public var stats: DashboardStats
    public var monthlyRevenues: [MonthlyRevenue]

    static func fetchDashboardStats() async throws -> DashboardStats {
        return try await APIClient.shared.request(
            path: "/api/v1/user/dashboard/stats",
            method: "GET",
            requiresAuth: true
        )
    }

    static func fetchMonthlyRevenue(year: String?, currency: String) async throws -> [MonthlyRevenue] {
        var queryItems: [URLQueryItem] = [URLQueryItem(name: "currency", value: currency)]

        if let year = year, !year.isEmpty {
            queryItems.append(URLQueryItem(name: "year", value: year))
        }

        return try await APIClient.shared.request(
            path: "/api/v1/user/dashboard/revenues",
            queryItems: queryItems,
            method: "GET",
            requiresAuth: true
        )
    }
}
