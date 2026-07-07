//
//  StatusBadge.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-30.
//

import SwiftUI

struct StatusBadge: View {
    let status: InvoiceStatus

    var body: some View {
        Text(status.rawValue)
            .font(.caption.weight(.medium))
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .background(statusColor.opacity(0.12))
            .foregroundColor(statusColor)
            .cornerRadius(6)
    }

    var statusColor: Color {
        switch status {
        case .draft: return .gray
        case .pending: return .blue
        case .paid: return .green
        case .overdue: return .red
        }
    }
}
