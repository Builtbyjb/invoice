//
//  ClientView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct ClientView: View {
    @Environment(AppRouter.self) var router
    let client: Client
    @Binding var clients: [Client]

    @State private var showEditClient: Bool = false
    @State private var clientInvoices: [Invoice] = []

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
        .task {
            do {
                clientInvoices = try await Invoice.fetchClientInvoices(clientId: client.id)
            } catch {
                print(error)
            }
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
            client: Client(
                id: "1",
                organizationId: 1,
                name: "Client",
                email: "client@example.com",
                phone: "+1 234 567 8900",
                address: "",
                city: "Toronto",
                country: "Canada",
                createdAt: "now"
            ),
            clients: .constant([
                Client(
                    id: "3",
                    organizationId: 2,
                    name: "Client2",
                    email: "client2@example.com",
                    phone: "+1 234 567 8900",
                    address: "",
                    city: "Toronto",
                    country: "Canada",
                    createdAt: "now"
                )
            ])
        )
    }.environment(AppRouter())
}
