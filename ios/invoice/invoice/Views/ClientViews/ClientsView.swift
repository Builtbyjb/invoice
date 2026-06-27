//
//  ClientsView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

enum ClientFormRoute: Hashable {
    case create
    case edit(Client)
}

struct ClientsView: View {
    @State private var path = NavigationPath()
    @State private var clients: [Client] = MockData.clients
    @State private var invoices: [Invoice] = MockData.invoices
    @State private var searchText: String = ""
    
    var filteredClients: [Client] {
        if searchText.isEmpty { return clients }
        return clients.filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            $0.email.localizedCaseInsensitiveContains(searchText) ||
            $0.city.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    var body: some View {
        NavigationStack(path: $path) {
            ScrollView {
                VStack(spacing: 12) {
                    if filteredClients.isEmpty {
                        ContentUnavailableView(
                            "No Clients",
                            systemImage: "person.crop.circle.badge.xmark",
                            description: Text("Add your first client using the + button above.")
                        )
                        .padding(.top, 40)
                    } else {
                        ForEach(filteredClients) { client in
                            NavigationLink(value: client) {
                                ClientCard(client: client)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
            }
        }
        .navigationTitle("Clients")
        .navigationDestination(for: Client.self) { client in
            ClientView(
                client: client,
                clients: $clients,
                onNavigate: { path.append($0) }
            )
        }
        .navigationDestination(for: ClientFormRoute.self) { route in
            CreateClientView(mode: route, clients: $clients) {
                path.removeLast()
            }
        }
        .navigationDestination(for: Invoice.self) { invoice in
            InvoiceView(
                invoice: invoice,
                invoices: $invoices,
                clients: clients,
                onNavigate: { path.append($0) }
            )
        }
        .navigationDestination(for: InvoiceFormRoute.self) { route in
            CreateInvoiceView(mode: route, clients: clients, invoices: $invoices) {
                path.removeLast()
            }
        }
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button {
                    path.append(ClientFormRoute.create)
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title2)
                }
            }
        }
        .searchable(text: $searchText, prompt: "Search clients")
    }
}

struct ClientCard: View {
    let client: Client
    
    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.15))
                    .frame(width: 48, height: 48)
                Text(String(client.name.prefix(1)))
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.blue)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(client.name)
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Text(client.displayContact)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                
                Text(client.displayLocation)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
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

#Preview {
    ClientsView()
}
