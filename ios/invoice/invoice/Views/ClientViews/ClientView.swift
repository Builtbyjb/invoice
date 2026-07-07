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

    @Environment(Router.self) var router
    @State private var showEditClient: Bool = false

    private var clientInvoices: [Invoice] {
        fetchInvoices().filter { $0.clientId == client.id }
    }

    var body: some View {
        ScrollView {
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
                        Text(client.name).font(.title3.bold())
                    }

                    Spacer()
                }

                Divider()

                VStack(alignment: .leading, spacing: 12) {
                    InfoRow(icon: "envelope.fill", label: "Email", value: client.email)
                    InfoRow(icon: "phone.fill", label: "Phone", value: client.phone)
                    InfoRow(icon: "house.fill", label: "Address", value: client.address)
                    InfoRow(icon: "building.2.fill", label: "City", value: client.city)
                    InfoRow(icon: "globe", label: "Country", value: client.country)
                }

                Spacer()

                Button {
                    // Handle Invoices viewing action here
                } label: {
                    Text("View Invoices")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity)
                        .background(Color.blue)
                        .cornerRadius(8)
                }
                .padding(.top, 10)
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
        }
        .padding()
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    if clients.first(where: { $0.id == client.id }) != nil {
                        showEditClient.toggle()
                    }
                } label: {
                    Image(systemName: "square.and.pencil")
                }
            }
        }
        .sheet(isPresented: $showEditClient) {
            if let liveClient = clients.first(where: { $0.id == client.id }) {
                NavigationStack {
                    router.switchToClientCreateView(mode: .edit(liveClient), clients: $clients)
                }
                .presentationDragIndicator(.visible)
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

#Preview {
    NavigationStack {
        ClientView(
            client: fetchClients()[0],
            clients: .constant(fetchClients()),
        )
    }.environment(Router.shared)
}
