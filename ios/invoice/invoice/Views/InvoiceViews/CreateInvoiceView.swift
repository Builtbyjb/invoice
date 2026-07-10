//
//  CreateInvoiceView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct CreateInvoiceView: View {
    let mode: InvoiceFormRoute
    let clients: [Client]
    @Binding var invoices: [Invoice]
    @Environment(Router.self) var router

    @State private var selectedClient: Client?
    @State private var status: InvoiceStatus = .draft
    @State private var issueDate: Date = Date()
    @State private var dueDate: Date = Date().addingTimeInterval(7 * 24 * 60 * 60)
    @State private var lineItems: [InvoiceItem] = []
    @State private var discountPercent: Double = 0
    @State private var taxPercent: Double = 0
    @State private var signatureStrokes: [Stroke] = []
    @State private var notes: String = ""
    @State private var isSaving: Bool = false

    init(mode: InvoiceFormRoute, clients: [Client], invoices: Binding<[Invoice]>) {
        self.mode = mode
        self.clients = clients
        self._invoices = invoices

        switch mode {
        case .create(let client):
            if let client = client {
                _selectedClient = State(initialValue: client)
            }
        case .edit(let invoice):
            _selectedClient = State(initialValue: clients.first(where: { $0.id == invoice.clientId }))
            _status = State(initialValue: invoice.status)
            _issueDate = State(initialValue: invoice.issueDate)
            _dueDate = State(initialValue: invoice.dueDate)
            _lineItems = State(initialValue: invoice.lineItems)
            _discountPercent = State(initialValue: invoice.discountPercent)
            _taxPercent = State(initialValue: invoice.taxPercent)
            _signatureStrokes = State(initialValue: invoice.signatureStrokes)
            _notes = State(initialValue: invoice.notes)
        }
    }

    var subtotal: Double {
        lineItems.reduce(0) { $0 + $1.total }
    }

    var discountAmount: Double {
        subtotal * (discountPercent / 100)
    }

    var taxAmount: Double {
        (subtotal - discountAmount) * (taxPercent / 100)
    }

    var grandTotal: Double {
        subtotal - discountAmount + taxAmount
    }

    var isFormValid: Bool {
        selectedClient != nil && !lineItems.isEmpty
    }

    var title: String {
        switch mode {
        case .create: return "New Invoice"
        case .edit: return "Edit Invoice"
        }
    }

    var body: some View {
        Form {
            infoSection
            lineItemsSection
            summarySection
            signatureSection
            notesSection
        }
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button {
                    router.pop()
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 17, weight: .semibold))
                }
            }
            ToolbarItem(placement: .confirmationAction) {
                Button {
                    save()
                } label: {
                    if isSaving {
                        ProgressView()
                    } else {
                        Image(systemName: "checkmark")
                            .font(.system(size: 17, weight: .semibold))
                    }
                }
                .disabled(!isFormValid || isSaving)
            }
        }
    }

    private var infoSection: some View {
        Section("Invoice Information") {
            if selectedClient == nil {
                Picker("Client", selection: $selectedClient) {
                    Text("Select a client").tag(nil as Client?)
                    ForEach(clients) { client in
                        Text(client.name).tag(client as Client?)
                    }
                }
            } else {
                HStack {
                    Text("Client")
                        .foregroundColor(.secondary)
                    Spacer()
                    Text(selectedClient?.name ?? "")
                        .fontWeight(.medium)
                }
            }

            Picker("Status", selection: $status) {
                ForEach(InvoiceStatus.allCases, id: \.self) { status in
                    Text(status.rawValue.capitalized).tag(status)
                }
            }

            DatePicker("Issue Date", selection: $issueDate, displayedComponents: .date)
            DatePicker("Due Date", selection: $dueDate, displayedComponents: .date)
        }
    }

    private var lineItemsSection: some View {
        Section {
            ForEach($lineItems) { $item in
                VStack(alignment: .leading, spacing: 8) {
                    TextField("Description", text: $item.description)

                    HStack(spacing: 12) {
                        HStack(spacing: 4) {
                            Text("Qty")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            TextField("0", value: $item.quantity, format: .number)
                                .keyboardType(.decimalPad)
                                .multilineTextAlignment(.trailing)
                        }
                        .frame(maxWidth: .infinity)

                        HStack(spacing: 4) {
                            Text("Unit")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            TextField(
                                "ea",
                                text: Binding(
                                    get: { item.unit ?? "" },
                                    set: { item.unit = $0.isEmpty ? nil : $0 }
                                )
                            )
                            .multilineTextAlignment(.trailing)
                        }
                        .frame(maxWidth: .infinity)

                        HStack(spacing: 4) {
                            Text("Price")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            TextField("0.00", value: $item.price, format: .currency(code: "USD"))
                                .keyboardType(.decimalPad)
                                .multilineTextAlignment(.trailing)
                        }
                        .frame(maxWidth: .infinity)
                    }

                    HStack {
                        Spacer()
                        Text("Total: \(item.total, format: .currency(code: "USD"))")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.vertical, 4)
            }
            .onDelete { indexSet in
                lineItems.remove(atOffsets: indexSet)
            }

            Button {
                lineItems.append(InvoiceItem(id: UUID(), description: "", quantity: 1, unit: "ea", price: 0))
            } label: {
                HStack {
                    Image(systemName: "plus.circle")
                    Text("Item")
                }
            }
        } header: {
            Text("Line Items")
        }
    }

    private var summarySection: some View {
        Section {
            HStack {
                Text("Subtotal")
                    .foregroundColor(.secondary)
                Spacer()
                Text(subtotal, format: .currency(code: "USD"))
                    .fontWeight(.medium)
            }

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Discount")
                        .foregroundColor(.secondary)
                    TextField("0", value: $discountPercent, format: .number)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                Spacer()
                Text(discountAmount, format: .currency(code: "USD"))
                    .fontWeight(.medium)
                    .foregroundColor(.green)
            }

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tax")
                        .foregroundColor(.secondary)
                    TextField("0", value: $taxPercent, format: .number)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                }
                Spacer()
                Text(taxAmount, format: .currency(code: "USD"))
                    .fontWeight(.medium)
                    .foregroundColor(.orange)
            }

            HStack {
                Text("Grand Total")
                    .font(.headline)
                Spacer()
                Text(grandTotal, format: .currency(code: "USD"))
                    .font(.headline)
            }
        } header: {
            Text("Summary")
        }
    }

    private var signatureSection: some View {
        Section("Signature") {
            SignatureCanvas(strokes: $signatureStrokes, readOnly: false, canvasHeight: 140)

            if !signatureStrokes.isEmpty {
                Button {
                    signatureStrokes = []
                } label: {
                    HStack {
                        Image(systemName: "eraser")
                        Text("Clear")
                    }
                }
                .foregroundColor(.red)
            }
        }
    }

    private var notesSection: some View {
        Section("Notes") {
            TextEditor(text: $notes)
                .frame(minHeight: 80)
        }
    }

    private func save() {
        guard let client = selectedClient else { return }
        isSaving = true

        DispatchQueue.main.asyncAfter(
            deadline: .now() + 0.5,
            execute: DispatchWorkItem {
                switch mode {
                case .create:
                    var newInvoice = Invoice(
                        id: UUID().uuidString,
                        invoiceNumber: "",
                        clientId: client.id,
                        clientName: client.name,
                        items: lineItems,
                        taxRate: taxPercent,
                        discount: discountPercent,
                        status: status,
                        signature: nil,
                        issueDate: issueDate,
                        dueDate: dueDate,
                        currency: "USD",
                        notes: notes,
                        createdAt: Date()
                    )
                    newInvoice.signatureStrokes = signatureStrokes
                    invoices.append(newInvoice)
                case .edit(let existing):
                    if let index = invoices.firstIndex(where: { $0.id == existing.id }) {
                        invoices[index].clientId = client.id
                        invoices[index].clientName = client.name
                        invoices[index].status = status
                        invoices[index].issueDate = issueDate
                        invoices[index].dueDate = dueDate
                        invoices[index].lineItems = lineItems
                        invoices[index].discountPercent = discountPercent
                        invoices[index].taxPercent = taxPercent
                        invoices[index].signatureStrokes = signatureStrokes
                        invoices[index].notes = notes
                    }
                }
                isSaving = false
                router.pop()
            }
        )
    }
}

#Preview {
    NavigationStack {
        CreateInvoiceView(
            mode: .create(
                Client(
                    id: "preview-client",
                    organizationId: 1,
                    name: "Preview Client",
                    email: "preview@example.com",
                    phone: "555-0000",
                    address: "123 Preview St",
                    city: "Preview City",
                    country: "Previewland",
                    createdAt: "2026-07-10"
                )
            ),
            clients: [],
            invoices: .constant([])
        )
    }
}
