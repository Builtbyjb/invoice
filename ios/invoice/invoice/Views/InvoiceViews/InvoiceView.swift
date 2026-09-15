//
//  InvoiceView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import QuickLook
import SwiftUI
import UIKit

struct InvoiceView: View {
    @Environment(AppRouter.self) var router
    let invoice: Invoice

    @State private var showPDFPreview: Bool = false
    @State private var showPDFShare: Bool = false
    @State private var pdfTempURL: URL?

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                clientInfoCard
                metaInfoCard
                lineItemsCard
                summaryCard
                if !invoice.notes.isEmpty {
                    notesCard
                }
                if !invoice.signatureStrokes.isEmpty {
                    signatureCard
                }
            }
            .padding()
        }
        .navigationTitle(invoice.invoiceNumber)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    generatePDF(preview: true)
                } label: {
                    Image(systemName: "eye.circle")
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    generatePDF(preview: false)
                } label: {
                    Image(systemName: "square.and.arrow.down")
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    router.path.append(InvoiceFormMode.edit(invoice))
                } label: {
                    Image(systemName: "square.and.pencil")
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    print("Delete invoice")
                } label: {
                    Image(systemName: "trash")
                }
                .foregroundColor(.red)
            }
        }
        .sheet(isPresented: $showPDFPreview) {
            if let url = pdfTempURL {
                PDFPreviewView(url: url)
            }
        }
        .sheet(isPresented: $showPDFShare) {
            if let url = pdfTempURL {
                ShareSheet(activityItems: [url])
            }
        }
    }

    private var clientInfoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Billed To")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)

            VStack(alignment: .leading, spacing: 2) {

                Text(invoice.clientName)
                    .font(.headline)

                Text(invoice.clientInfo.email)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(invoice.clientInfo.address)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(invoice.clientInfo.city)
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(invoice.clientInfo.country)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private var metaInfoCard: some View {
        HStack(spacing: 2) {
            MetaItem(label: "Status", value: invoice.status.rawValue, valueColor: statusColor)
            Divider()
            MetaItem(label: "Currency", value: invoice.currency)
            Divider()
            MetaItem(label: "Issue Date", value: invoice.issueDate.formatted(date: .abbreviated, time: .omitted))
            Divider()
            MetaItem(label: "Due Date", value: invoice.dueDate.formatted(date: .abbreviated, time: .omitted))
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private var statusColor: Color {
        switch invoice.status {
        case .draft: return .gray
        case .sent: return .blue
        case .paid: return .green
        case .overdue: return .red
        }
    }

    private var lineItemsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Items")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(invoice.items, id: \.self) { item in
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Description")
                            .font(.caption.weight(.semibold))
                            .foregroundColor(.secondary)

                        Text(item.description)

                        HStack {
                            HStack {
                                Text("Quantity:")
                                    .font(.caption.weight(.semibold))
                                    .foregroundColor(.secondary)

                                Text("\(item.quantity, specifier: "%.1f") \(item.unit)")
                            }

                            HStack {
                                Text("Price:")
                                    .font(.caption.weight(.semibold))
                                    .foregroundColor(.secondary)

                                Text(item.price, format: .currency(code: invoice.currency).presentation(.narrow))
                            }

                        }

                        VStack(alignment: .leading) {
                            HStack {
                                Text("Total:")
                                    .font(.caption.weight(.semibold))
                                    .foregroundColor(.secondary)

                                Text(item.total, format: .currency(code: invoice.currency).presentation(.narrow))
                            }

                        }

                        if item != invoice.items.last {
                            Divider()
                        }
                    }
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private var summaryCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Summary")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)

            VStack(spacing: 8) {
                SummaryRow(label: "Subtotal", value: invoice.subtotal, currency: invoice.currency)
                if invoice.discountPercent > 0 {
                    let discountText = String(format: "%.1f", invoice.discountPercent)
                    SummaryRow(
                        label: "Discount (\(discountText)%)",
                        value: -invoice.discountAmount,
                        currency: invoice.currency
                    )
                }
                if invoice.taxPercent > 0 {
                    let taxText = String(format: "%.1f", invoice.taxPercent)
                    SummaryRow(label: "Tax (\(taxText)%)", value: invoice.taxAmount, currency: invoice.currency)
                }
                Divider()
                SummaryRow(label: "Grand Total", value: invoice.grandTotal, currency: invoice.currency, isTotal: true)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private var notesCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Notes")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)

            Text(invoice.notes)
                .font(.subheadline)
                .foregroundColor(.primary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private var signatureCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Signature")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)

            SignatureCanvas(strokes: .constant(invoice.signatureStrokes), readOnly: true, canvasHeight: 120)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }

    private func generatePDF(preview: Bool) {
        guard let data = InvoicePDFGenerator.generatePDF(for: invoice) else { return }

        let tempDir = FileManager.default.temporaryDirectory
        let url = tempDir.appendingPathComponent("\(invoice.clientName)-\(invoice.invoiceNumber).pdf")

        do {
            try data.write(to: url)
            pdfTempURL = url
            if preview {
                showPDFPreview = true
            } else {
                showPDFShare = true
            }
        } catch {
            print("Failed to write PDF: \(error)")
        }
    }
}

struct MetaItem: View {
    let label: String
    let value: String
    var valueColor: Color = .primary

    var body: some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
            Text(value)
                .font(.caption)
                .foregroundColor(valueColor)
        }
        .frame(maxWidth: .infinity)
    }
}

struct SummaryRow: View {
    let label: String
    let value: Double
    let currency: String
    var valueColor: Color = .primary
    var isTotal: Bool = false

    var body: some View {
        HStack {
            Text(label)
                .font(isTotal ? .headline : .subheadline)
            Spacer()
            Text(value, format: .currency(code: currency).presentation(.narrow))
                .font(isTotal ? .headline.weight(.bold) : .subheadline)
                .foregroundColor(valueColor)
        }
    }
}

struct PDFPreviewView: UIViewControllerRepresentable {
    let url: URL

    func makeUIViewController(context: Context) -> QLPreviewController {
        let controller = QLPreviewController()
        controller.dataSource = context.coordinator
        return controller
    }

    func updateUIViewController(_ uiViewController: QLPreviewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(url: url)
    }

    class Coordinator: NSObject, QLPreviewControllerDataSource {
        let url: URL

        init(url: URL) {
            self.url = url
        }

        func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
            1
        }

        func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
            url as QLPreviewItem
        }
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]
    let applicationActivities: [UIActivity]? = nil

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: applicationActivities)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    NavigationStack {
        InvoiceView(
            invoice: Invoice(
                id: "1",
                invoiceNumber: "INV-001",
                clientID: "c1",
                clientName: "Acme Corp",
                clientInfo: ClientInfo(
                    email: "acme@example.com",
                    phone: "+1 647 555 1212",
                    address: "123 Yonge eglinton centre",
                    city: "Toronto",
                    country: "Canada"
                ),
                items: [
                    InvoiceItem(
                        id: UUID(),
                        description: "Some not so long description",
                        quantity: 2,
                        unit: "ea",
                        price: 49000.99
                    ),
                    InvoiceItem(
                        id: UUID(),
                        description: "Short description",
                        quantity: 2,
                        unit: "ea",
                        price: 499.99
                    ),
                    InvoiceItem(
                        id: UUID(),
                        description:
                            "Very very very very very very very very very very very very very very very long description",
                        quantity: 2,
                        unit: "ea",
                        price: 4900000.99
                    ),
                ],
                taxRate: 10,
                discount: 5,
                status: .sent,
                signature: nil,
                issueDate: Date(),
                dueDate: Date(),
                currency: "USD",
                notes: "Net 14",
                createdAt: Date()
            ),
        )
    }.environment(AppRouter())
}
