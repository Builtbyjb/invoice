//
//  CreateInvoiceView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI

struct CreateInvoiceView: View {
    @Environment(AppRouter.self) var router
    let mode: InvoiceFormMode
    @State private var client: Client?

    @State private var status: InvoiceStatus = .draft
    @State private var issueDate: Date = Date()
    @State private var dueDate: Date = Date()
    @State private var items: [InvoiceItem] = []
    @State private var discountPercent: Double = 0
    @State private var taxPercent: Double = 0
    @State private var signatureStrokes: [Stroke] = []
    @State private var notes: String = ""
    @State private var isSaving: Bool = false
    @State private var showCreateClient: Bool = false

    init(mode: InvoiceFormMode, client: Client? = nil) {
        self.mode = mode
        self.client = client

        switch mode {
        case .create:
            break
        case .edit(let invoice):
            _client = State(initialValue: client)
            _status = State(initialValue: invoice.status)
            _issueDate = State(initialValue: invoice.issueDate)
            _dueDate = State(initialValue: invoice.dueDate)
            _items = State(initialValue: invoice.items)
            _discountPercent = State(initialValue: invoice.discountPercent)
            _taxPercent = State(initialValue: invoice.taxPercent)
            _signatureStrokes = State(initialValue: invoice.signatureStrokes)
            _notes = State(initialValue: invoice.notes)
        }
    }

    var subtotal: Double {
        items.reduce(0) { $0 + $1.total }
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

    var isFormValid: Bool { client != nil && !items.isEmpty }

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
        .sheet(isPresented: $showCreateClient) {
            CreateClientView(mode: .create) { newClient in
                client = newClient
            }
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
            HStack {
                Text("Client")
                Text("*")
                    .foregroundColor(.red)
                Button {
                    showCreateClient = true
                } label: {
                    Image(systemName: "plus.circle")
                }
                .buttonStyle(.borderless)

                Spacer()

                SearchDropdownView(
                    selection: $client,
                    placeholder: "Search for a client",
                    titleKeyPath: \.name,
                    subtitleKeyPath: \.email
                ) { query in
                    let response = try await Client.search(query: query)
                    if let res = response.data {
                        return res
                    } else { return [] }
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
            ForEach($items) { $item in
                VStack(alignment: .leading, spacing: 12) {

                    TextField("Description", text: $item.description)

                    HStack(spacing: 4) {
                        Text("Quantity:")
                            .foregroundColor(.secondary)

                        TextField("0", value: $item.quantity, format: .number)
                            .keyboardType(.decimalPad)
                    }

                    HStack(spacing: 4) {
                        Text("Unit:")
                            .foregroundColor(.secondary)
                        TextField(
                            "",
                            text: Binding(
                                get: { item.unit ?? "" },
                                set: { item.unit = $0.isEmpty ? nil : $0 }
                            )
                        )
                    }

                    HStack(spacing: 4) {
                        Text("Price:")
                            .foregroundColor(.secondary)
                        
                        TextField("0.00", value: $item.price, format: .currency(code: "USD"))
                            .keyboardType(.decimalPad)
                    }
                }

                HStack {
                    Text("Total: \(item.total, format: .currency(code: "USD"))")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    Spacer()
                    Button {
                        if let index = items.firstIndex(where: { $0.id == item.id }) {
                            items.remove(at: index)
                        }
                    } label: {
                        Image(systemName: "trash").foregroundColor(.red)
                    }
                    .buttonStyle(.borderless)
                }
            }
            .onDelete { indexSet in
                items.remove(atOffsets: indexSet)
            }

            Button {
                items.append(InvoiceItem(description: "", quantity: 1, unit: "", price: 0))
            } label: {
                HStack {
                    Image(systemName: "plus.circle")
                    Text("Item")
                }
            }
        } header: {
            HStack(spacing: 4) {
                Text("Line Items")
                Text("*")
                    .foregroundColor(.red)
            }
        }
    }

    private var summarySection: some View {
        Section {
            HStack {
                Text("Subtotal")
                    .foregroundColor(.secondary)
                Spacer()
                Text(subtotal, format: .currency(code: "USD"))
            }

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Discount")
                        .foregroundColor(.secondary)
                    TextField("0", value: $discountPercent, format: .number)
                        .keyboardType(.decimalPad)
                }
                Spacer()
                Text(discountAmount, format: .currency(code: "USD"))
            }

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Tax")
                        .foregroundColor(.secondary)
                    TextField("0", value: $taxPercent, format: .number)
                        .keyboardType(.decimalPad)
                }
                Spacer()
                Text(taxAmount, format: .currency(code: "USD"))
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
        guard let client = client else { return }
        isSaving = true

        Task {
            do {
                let signature: String? = {
                    guard !signatureStrokes.isEmpty else { return nil }
                    do {
                        let data = try JSONEncoder().encode(signatureStrokes)
                        return String(data: data, encoding: .utf8)
                    } catch {
                        return nil
                    }
                }()

                switch mode {
                case .create:
                    let newInvoice = try await Invoice.create(
                        clientId: client.id,
                        status: status,
                        issueDate: issueDate,
                        dueDate: dueDate,
                        items: items,
                        taxRate: taxPercent,
                        discount: discountPercent,
                        currency: "USD",
                        notes: notes,
                        signature: signature
                    )
                    await MainActor.run {
                        //                        invoices.append(newInvoice)
                    }
                case .edit(let existing):
                    let updatedInvoice = try await Invoice.update(
                        id: existing.id,
                        clientId: client.id,
                        status: status,
                        issueDate: issueDate,
                        dueDate: dueDate,
                        items: items,
                        taxRate: taxPercent,
                        discount: discountPercent,
                        currency: "USD",
                        notes: notes,
                        signature: signature
                    )
                    await MainActor.run {
                        //                        if let index = invoices.firstIndex(where: { $0.id == existing.id }) {
                        //                            invoices[index] = updatedInvoice
                        //                        }
                    }
                }
                await MainActor.run {
                    isSaving = false
                    router.pop()
                }
            } catch {
                await MainActor.run {
                    isSaving = false
                }
                print("Failed to save invoice: \(error)")
            }
        }
    }
}

#Preview {
    NavigationStack {
        CreateInvoiceView(mode: .create)
            .environment(AppRouter())
    }
}
