//
//  InvoicesView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct InvoicesView: View {
    @Environment(AppCoordinator.self) private var coordinator

    @State private var router: AppRouter
    @State private var invoices: [Invoice]

    init(router: AppRouter, invoices: [Invoice] = []) {
        _router = State(initialValue: router)
        _invoices = State(initialValue: invoices)
    }

    @State private var selectedClient: Client? = nil
    @State private var searchText: String = ""
    @State private var searchToken: SearchToken? = nil
    @State private var showSearchBar: Bool = false

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 12) {
                    if invoices.isEmpty {
                        ContentUnavailableView(
                            "No Invoices",
                            systemImage: "doc.text.magnifyingglass",
                            description: Text(
                                "Create your first invoice using the + button."
                            )
                        )
                        .padding(.top, 40)
                    } else {
                        ForEach(invoices) { invoice in
                            NavigationLink(value: invoice) {
                                InvoiceListCard(invoice: invoice)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
            }
            .navigationTitle("Invoices")
            .navigationDestination(for: AppRoute.self) { route in
                router.switchView(route: route)
            }
            .navigationDestination(for: Invoice.self) { invoice in
                InvoiceView(invoice: invoice)
            }
            .navigationDestination(for: InvoiceFormMode.self) { route in
                CreateInvoiceView(mode: route)
            }
            .navigationDestination(for: ClientFormMode.self) { route in
                CreateClientView(mode: route) { savedClient in selectedClient = savedClient }
            }
            .task {
                do {
                    let response = try await Invoice.fetchInvoices()
                    if let res = response.data {
                        invoices = res
                    } else {
                        invoices = []
                    }

                } catch {
                    print(error)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button {
                        router.path.append(InvoiceFormMode.create)
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
            .safeAreaInset(edge: .bottom) {
                if showSearchBar {
                    SearchBarView<[Invoice]>(
                        showSearchBar: $showSearchBar,
                        searchText: $searchText,
                        placeholder: "Search",
                        token: $searchToken,
                    ) { result in invoices = result }
                }
            }
            .onAppear {
                if let pending = coordinator.pendingInvoiceSearchToken {
                    searchToken = pending
                    showSearchBar = true
                    coordinator.pendingInvoiceSearchToken = nil
                }
            }
        }.environment(router)
    }
}

struct InvoiceListCard: View {
    let invoice: Invoice

    var body: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text(invoice.invoiceNumber)
                    .font(.subheadline)

                Text(invoice.clientName)
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                VStack(alignment: .leading, spacing: 6) {
                    Text("\(invoice.grandTotal, format: .currency(code: invoice.currency).presentation(.narrow))")
                        .font(.headline)

                    Text("Due \(invoice.dueDate, style: .date)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                StatusBadge(status: invoice.status)
            }

            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.black.opacity(0.05), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

#Preview {
    InvoicesView(router: AppRouter(), invoices: [])
        .environment(AppCoordinator())
        .withPreviewEnvironment()
}
