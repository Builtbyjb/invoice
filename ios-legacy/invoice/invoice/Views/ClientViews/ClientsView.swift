//
//  ClientsView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct ClientsView: View {
    @Environment(AppCoordinator.self) var coordinator
    @State private var router: AppRouter
    @State private var clients: [Client]

    init(router: AppRouter, clients: [Client] = []) {
        _router = State(initialValue: router)
        _clients = State(initialValue: clients)
    }
    
    @State private var searchText: String = ""
    @State private var showSearchBar: Bool = false
    @State private var showCreateClient: Bool = false

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 12) {
                    if clients.isEmpty {
                        ContentUnavailableView(
                            "No Clients",
                            systemImage: "person.crop.circle.badge.xmark",
                            description: Text(
                                "Add your first client using the + button above."
                            )
                        )
                        .padding(.top, 40)
                    } else {
                        ForEach(clients) { client in
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
                router.switchToClientView(client: client)
            }
            .navigationDestination(for: AppRoute.self) { route in
                router.switchView(route: route)
            }
            .task {
                do {
                    let response = try await Client.fetchClients()
                    if let res = response.data {
                        clients = res
                    } else {
                        clients = []
                    }
                } catch {
                    print(error.localizedDescription)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button {
                        showCreateClient.toggle()
                    } label: {
                        Image(systemName: "plus")
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
            }
            .sheet(isPresented: $showCreateClient) {
                CreateClientView(mode: .create) { newClient in
                    clients.insert(newClient, at: 0)
                }
            }
            .safeAreaInset(edge: .bottom) {
                if showSearchBar {
                    SearchBarView(showSearchBar: $showSearchBar, searchText: $searchText, placeholder: "Search")
                }
            }
        }
        .environment(router)
        .environment(coordinator)
    }
}

#Preview {
    ClientsView(router: AppRouter(), clients: DemoData.clients)
        .environment(AppCoordinator())
        .withPreviewEnvironment()
}
