//
//  ClientView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct ClientView: View {
    let client: Client
    @Binding var clients: [Client]
    let onNavigate: (any Hashable) -> Void
    
    private var clientInvoices: [Invoice] {
        MockData.invoices.filter { $0.client.id == client.id }
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // MARK: - Info Card
                infoCard
                
                // MARK: - Invoices Section
                invoicesSection
            }
            .padding()
        }
        .navigationTitle(client.name)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    if let liveClient = clients.first(where: { $0.id == client.id }) {
                        onNavigate(ClientFormRoute.edit(liveClient))
                    }
                } label: {
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 17, weight: .semibold))
                }
            }
        }
    }
    
    private var infoCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.15))
                        .frame(width: 56, height: 56)
                    Text(String(client.name.prefix(1)))
                        .font(.system(size: 24, weight: .semibold))
                        .foregroundColor(.blue)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(client.name)
                        .font(.title3.bold())
                    Text(client.displayLocation)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Divider()
            
            VStack(alignment: .leading, spacing: 12) {
                InfoRow(icon: "person.fill", label: "Name", value: client.name)
                InfoRow(icon: "envelope.fill", label: "Email", value: client.email)
                InfoRow(icon: "phone.fill", label: "Phone", value: client.phone)
                InfoRow(icon: "house.fill", label: "Address", value: client.address)
                InfoRow(icon: "building.2.fill", label: "City", value: client.city)
                InfoRow(icon: "globe", label: "Country", value: client.country)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
    }
    
    private var invoicesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Invoices")
                    .font(.title3.bold())
                
                Spacer()
                
                Button {
                    if let liveClient = clients.first(where: { $0.id == client.id }) {
                        onNavigate(InvoiceFormRoute.create(liveClient))
                    }
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.system(size: 22))
                        .foregroundColor(.blue)
                }
            }
            
            if clientInvoices.isEmpty {
                ContentUnavailableView(
                    "No Invoices",
                    systemImage: "doc.text",
                    description: Text("This client has no invoices yet.")
                )
                .frame(maxWidth: .infinity)
                .padding(.vertical, 20)
            } else {
                VStack(spacing: 10) {
                    ForEach(clientInvoices) { invoice in
                        Button {
                            onNavigate(invoice)
                        } label: {
                            InvoiceMiniCard(invoice: invoice)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
    }
}

struct InfoRow: View {
    let icon: String
    let label: String
    let value: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 24, height: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(value.isEmpty ? "—" : value)
                    .font(.subheadline)
                    .foregroundColor(.primary)
            }
        }
    }
}

struct InvoiceMiniCard: View {
    let invoice: Invoice
    
    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(invoice.formattedInvoiceNumber)
                    .font(.subheadline.weight(.semibold))
                
                HStack(spacing: 6) {
                    StatusBadge(status: invoice.status)
                    
                    Text("Due \(invoice.dueDate, style: .date)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            Text("\(invoice.grandTotal, format: .currency(code: "USD"))")
                .font(.subheadline.weight(.bold))
                .foregroundColor(.primary)
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }
}

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
        case .sent: return .blue
        case .paid: return .green
        case .overdue: return .red
        }
    }
}

#Preview {
    NavigationStack {
        ClientView(
            client: MockData.clients[0],
            clients: .constant(MockData.clients),
            onNavigate: { _ in }
        )
    }
}
