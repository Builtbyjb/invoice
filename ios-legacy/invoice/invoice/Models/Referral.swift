//
//  Referral.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//

struct Referral: Codable {
    public var totalReferrals: UInt64
    public var activeReferrals: UInt64
    public var totalEarnings: Double
    public var payout: Double
    public var referralCode: String
    
    static func fetchReferralData() async throws -> Referral {
        return try await APIClient.shared.request(
            path: "/api/v1/referral/details",
            method: "GET",
            requiresAuth: true
        )
    }
}
