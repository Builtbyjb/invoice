//
//  InvoicesView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-26.
//

import SwiftUI

struct InvoicesView: View {
    @State private var router: AppRouter
    
    init(router: AppRouter) {
        _router = State(initialValue: router)
    }
    
    @State private var invoices: [Invoice] = []
    @State private var clients: [Client] = []
    @State private var showClientPicker: Bool = false
    @State private var selectedClientForInvoice: Client? = nil
    @State private var searchText: String = ""
    @State private var showSearchBar: Bool = false

    var filteredInvoices: [Invoice] {
        if searchText.isEmpty { return invoices }
        return invoices.filter {
            $0.invoiceNumber.localizedCaseInsensitiveContains(searchText)
                || $0.clientName.localizedCaseInsensitiveContains(searchText)
                || $0.status.rawValue.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack(path: $router.path) {
            ScrollView {
                VStack(spacing: 12) {
                    if filteredInvoices.isEmpty {
                        ContentUnavailableView(
                            "No Invoices",
                            systemImage: "doc.text.magnifyingglass",
                            description: Text(
                                "Create your first invoice using the + button."
                            )
                        )
                        .padding(.top, 40)
                    } else {
                        ForEach(filteredInvoices) { invoice in
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
                InvoiceView(invoice: invoice, invoices: $invoices, clients: clients)
            }
            .navigationDestination(for: InvoiceFormRoute.self) { route in
                CreateInvoiceView(mode: route, clients: clients, invoices: $invoices)
            }
            .navigationDestination(for: ClientFormRoute.self) { route in
                CreateClientView(mode: route, clients: $clients)
            }
            .task {
                do {
                    invoices = try await Invoice.fetchInvoices()
                } catch {
                    print(error)
                }
            }
            .toolbar {
                ToolbarItemGroup(placement: .topBarLeading) {
                    Button {
                        if clients.isEmpty {
                            router.path.append(ClientFormRoute.create)
                        } else {
                            selectedClientForInvoice = clients.first
                            showClientPicker = true
                        }
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
                    SearchBarView(
                        showSearchBar: $showSearchBar,
                        searchText: $searchText,
                        placeholder: "Search"
                    )
                }
            }
            .sheet(isPresented: $showClientPicker) {
                ClientPickerSheet(
                    clients: clients,
                    selectedClient: $selectedClientForInvoice,
                    onContinue: {
                        showClientPicker = false
                        if let client = selectedClientForInvoice {
                            router.path.append(InvoiceFormRoute.create(client))
                        }
                    },
                    onCreateClient: {
                        showClientPicker = false
                        router.path.append(ClientFormRoute.create)
                    }
                )
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
                    Text("\(invoice.grandTotal, format: .currency(code: "USD"))")
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

struct ClientPickerSheet: View {
    let clients: [Client]
    @Binding var selectedClient: Client?
    let onContinue: () -> Void
    let onCreateClient: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Select Client") {
                    Picker("Client", selection: $selectedClient) {
                        ForEach(clients) { client in
                            Text(client.name).tag(client as Client?)
                        }
                    }
                    .pickerStyle(.inline)
                }

                Section {
                    Button {
                        onContinue()
                    } label: {
                        Image(systemName: "checkmark")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                    }
                    .disabled(selectedClient == nil)
                }

                Section {
                    Button {
                        onCreateClient()
                    } label: {
                        HStack {
                            Image(systemName: "person.badge.plus")
                            Text("New Client")
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .navigationTitle("New Invoice")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 17, weight: .semibold))
                    }
                }
            }
        }
    }
}

#Preview {
    InvoicesView(router: AppRouter())
        .withPreviewEnvironment()
}
