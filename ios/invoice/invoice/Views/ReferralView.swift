//
//  ReferralView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ReferralView: View {
    @State private var copied = false

    private let referralCode = "INVOICE123"

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // MARK: - Section 1: Stats
                VStack(spacing: 16) {
                    StatCard(
                        title: "Total Referrals",
                        value: "12",
                        icon: "person.2.fill",
                        iconColor: .blue,
                        isLoading: false
                    )
                    StatCard(
                        title: "Active Referrals",
                        value: "8",
                        icon: "person.fill.checkmark",
                        iconColor: .green,
                        isLoading: false
                    )
                    StatCard(
                        title: "Total Earnings",
                        value: "$120.00",
                        icon: "dollarsign.circle.fill",
                        iconColor: .orange,
                        isLoading: false
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
                Text(referralCode)
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
            }

            Text("Users that sign up with the referral code get one extra month free trial.")
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
                    description: "Share your referral link with your friends to earn rewards when they subscribe."
                )

                Divider()

                stepView(
                    number: "2",
                    title: "Your Friend Subscribes",
                    description: "Your friend creates an account, and purchases a subscription."
                )

                Divider()

                stepView(
                    number: "3",
                    title: "Earn Rewards",
                    description: "You get 5% of each friend's subscription amount for as long as they are subscribed."
                )
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func stepView(number: String, title: String, description: String) -> some View {
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
        UIPasteboard.general.string = referralCode
        copied = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            copied = false
        }
    }
}

#Preview {
    ReferralView()
}
