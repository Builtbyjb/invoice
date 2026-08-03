//
//  ClientView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct ClientView: View {
    @Environment(AppRouter.self) var router
    @Environment(AppCoordinator.self) var coordinator
    @State var client: Client

    @State private var showEditClient: Bool = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    ZStack {
                        Circle()
                            .fill(Color.blue.opacity(0.15))
                            .frame(width: 42, height: 42)
                        Text(String(client.name.prefix(1)))
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.blue)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(client.name).font(.title3.bold())
                    }

                    Spacer()
                }

                Divider()

                VStack(alignment: .leading, spacing: 12) {
                    InfoRow(icon: "envelope", label: "Email", value: client.email)
                    InfoRow(icon: "phone", label: "Phone", value: client.phone)
                    InfoRow(icon: "house", label: "Address", value: client.address)
                    InfoRow(icon: "building.2", label: "City", value: client.city)
                    InfoRow(icon: "globe", label: "Country", value: client.country)
                    InfoRow(icon: "text.document", label: "Notes", value: client.note ?? "")
                }
            }
            .padding()
        }
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                ControlGroup {
                    Button {
                        coordinator.pendingInvoiceSearchToken = SearchToken(
                            tag: "client",
                            value: client.id,
                            label: client.name
                        )
                        coordinator.selectedTab = .invoices
                    } label: {
                        Image(systemName: "document.badge.ellipsis")
                    }
                    
                    Button {
                        showEditClient.toggle()
                    } label: {
                        Image(systemName: "square.and.pencil")
                    }
                    
                    Button {
                        Task {
                            do {
                                let _ = try await Client.delete(id: client.id)
                                router.pop()
                            } catch {
                                print(error.localizedDescription)
                            }
                        }
                    } label: {
                        Image(systemName: "trash").foregroundColor(.red)
                    }


                }
            }
        }
        .sheet(isPresented: $showEditClient) {
            CreateClientView(mode: .edit(client)) { updatedClient in
                client = updatedClient
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
                note: "",
                createdAt: "now"
            ),
        )
    }.environment(AppRouter())
    .environment(AppCoordinator())
}
