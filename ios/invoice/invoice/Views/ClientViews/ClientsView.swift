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
    @State var router = Router.shared
    @State private var clients: [Client] = MockData.clients
    @State private var invoices: [Invoice] = MockData.invoices
    @State private var searchText: String = ""
    @State private var showSearchBar: Bool = false

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
            .navigationDestination(for: Route.self) { route in
                router.switchView(route: route)
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button(action: {
                        router.navigate(to: .createClient)
                    }) {
                        Image(systemName: "plus")
                    }
                    Button {
                        showSearchBar.toggle()
                    } label: {
                        Image(systemName: "magnifyingglass")
                    }
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    ControlGroup {
                        Button(action: {
                            router.navigate(to: .help)
                        }) {
                            Image(systemName: "questionmark.circle")
                        }
                        Button(action: {
                            router.navigate(to: .notification)
                        }) {
                            Image(systemName: "bell")
                        }
                        Button(action: {
                            router.navigate(to: .settings)

                        }) {
                            Image(systemName: "gear")
                        }
                    }
                }

            }.safeAreaInset(edge: .bottom) {
                if showSearchBar {
                    SearchBarView(showSearchBar: $showSearchBar, searchText: $searchText, placeholder: "Search clients")
                }
            }
        }
    }
}

#Preview {
    ClientsView()
}
