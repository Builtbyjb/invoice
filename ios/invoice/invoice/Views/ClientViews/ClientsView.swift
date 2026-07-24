//
//  ClientsView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ClientsView: View {
    @State private var router: AppRouter
    
    init(router: AppRouter) {
        _router = State(initialValue: router)
    }
    
    @State private var clients: [Client] = []
//    @State private var invoices: [Invoice] = []
    @State private var searchText: String = ""
    @State private var showSearchBar: Bool = false
    @State private var showCreateClient: Bool = false

    var filteredClients: [Client] {
        if searchText.isEmpty { return clients }
        return clients.filter {
            $0.name.localizedCaseInsensitiveContains(searchText)
                || $0.email.localizedCaseInsensitiveContains(searchText)
                || $0.city.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 12) {
                    if filteredClients.isEmpty {
                        ContentUnavailableView(
                            "No Clients",
                            systemImage: "person.crop.circle.badge.xmark",
                            description: Text(
                                "Add your first client using the + button above."
                            )
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
            .navigationTitle("Clients")
            .navigationDestination(for: Client.self) { client in
                router.switchToClientView(client: client, clients: $clients)
            }
            .navigationDestination(for: AppRoute.self) { route in
                router.switchView(route: route)
            }
            .task {
                do {
                    let response = try await Client.fetchClients()
                    clients = response.clients
                } catch {
                    print(error)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button {
                        showCreateClient.toggle()
                    } label: {
                        Image(systemName: "plus")
                    }
                    .sheet(isPresented: $showCreateClient) {
                        NavigationStack {
                            router.switchToClientCreateView(mode: .create, clients: $clients)
                        }
                        .presentationDragIndicator(.visible)
                    }
                    Button {
                        showSearchBar.toggle()
                    } label: {
                        Image(systemName: "magnifyingglass")
                    }
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    TopBarButtons()
                }
            }.safeAreaInset(edge: .bottom) {
                if showSearchBar {
                    SearchBarView(showSearchBar: $showSearchBar, searchText: $searchText, placeholder: "Search")
                }
            }
        }.environment(router)
    }
}

#Preview {
    ClientsView(router: AppRouter())
        .withPreviewEnvironment()
}
