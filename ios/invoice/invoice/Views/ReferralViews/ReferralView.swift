//
//  ReferralView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ReferralView: View {
    @State private var router: AppRouter
    
    init(router: AppRouter) {
        _router = State(initialValue: router)
    }
    
    @State private var copied = false
    @State private var referral: Referral? = nil
    @State private var isLoading = true

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 20) {
                    // MARK: - Section 1: Stats
                    VStack(spacing: 16) {
                        StatCard(
                            title: "Total Referrals",
                            value: formattedUInt(referral?.totalReferrals),
                            icon: "person.2.fill",
                            iconColor: .blue
                        )
                        StatCard(
                            title: "Active Referrals",
                            value: formattedUInt(referral?.activeReferrals),
                            icon: "person.fill.checkmark",
                            iconColor: .green
                        )
                        StatCard(
                            title: "Total Earnings",
                            value: formattedCurrency(referral?.totalEarnings),
                            icon: "dollarsign.circle.fill",
                            iconColor: .orange
                        )
                        payoutCard
                    }

                    // MARK: - Section 2: Referral Code
                    referralCodeCard

                    // MARK: - Section 3: How It Works
                    howItWorksCard
                }
                .padding()
            }
            .navigationTitle("Referral")
            .navigationDestination(for: AppRoute.self) { route in
                router.switchView(route: route)
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    TopBarButtons()
                }
            }
            .task {
                do {
                    referral = try await Referral.fetchReferralData()
                } catch {
                    print("Failed to load referral data: \(error)")
                }
                isLoading = false
            }
        }.environment(router)
    }

    private func formattedUInt(_ value: UInt64?) -> String {
        guard let value else { return "0" }
        return String(value)
    }

    private func formattedCurrency(_ value: Double?) -> String {
        guard let value else { return "$0.00" }
        return String(format: "%.2f", value)
    }

    // MARK: - Payout Card
    private var payoutCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "creditcard.fill")
                    .font(.title2)
                    .foregroundStyle(.purple)
                    .frame(width: 40, height: 40)
                    .background(Color.purple.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 10))

                Spacer()
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Payout")
                    .font(.title2)
                    .fontWeight(.bold)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Text("Manage your earnings")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            if !isLoading, let referral {
                Text(formattedCurrency(referral.payout))
                    .font(.title3)
                    .fontWeight(.semibold)
            }

            VStack(spacing: 8) {
                Button(action: {}) {
                    Text("Claim")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }

                Button(action: {}) {
                    Text("Setup Payment Method")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundStyle(.primary)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(Color(.tertiarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Referral Code Card
    private var referralCodeCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Your Referral Code")
                .font(.title3)
                .fontWeight(.semibold)

            HStack {
                Text(referral?.referralCode ?? "—")
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)

                Spacer()

                Button(action: copyToClipboard) {
                    HStack(spacing: 4) {
                        Image(systemName: copied ? "checkmark" : "doc.on.doc")
                        Text(copied ? "Copied" : "Copy")
                    }
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.blue)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.blue.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .disabled(referral == nil)
            }

            Text(
                "Users that sign up with the referral code get one extra month free trial."
            )
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - How It Works Card
    private var howItWorksCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("How It Works")
                .font(.title3)
                .fontWeight(.semibold)

            VStack(alignment: .leading, spacing: 16) {
                stepView(
                    number: "1",
                    title: "Share Your Referral Link",
                    description:
                        "Share your referral link with your friends to earn rewards when they subscribe."
                )

                Divider()

                stepView(
                    number: "2",
                    title: "Your Friend Subscribes",
                    description:
                        "Your friend creates an account, and purchases a subscription."
                )

                Divider()

                stepView(
                    number: "3",
                    title: "Earn Rewards",
                    description:
                        "You get 5% of each friend's subscription amount for as long as they are subscribed."
                )
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func stepView(number: String, title: String, description: String)
        -> some View
    {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(number). \(title)")
                .font(.subheadline)
                .fontWeight(.semibold)

            Text(description)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }

    private func copyToClipboard() {
        guard let code = referral?.referralCode else { return }
        UIPasteboard.general.string = code
        copied = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            copied = false
        }
    }
}

#Preview {
    ReferralView(router: AppRouter())
}
