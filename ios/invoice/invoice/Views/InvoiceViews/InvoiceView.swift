//
//  InvoiceView.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import SwiftUI
import QuickLook
import UIKit

struct InvoiceView: View {
    let invoice: Invoice
    @Binding var invoices: [Invoice]
    let clients: [Client]
    let onNavigate: (any Hashable) -> Void
    
    @State private var showPDFPreview: Bool = false
    @State private var showPDFShare: Bool = false
    @State private var pdfTempURL: URL?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                headerActions
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
        .navigationTitle(invoice.formattedInvoiceNumber)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    onNavigate(InvoiceFormRoute.edit(invoice))
                } label: {
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 17, weight: .semibold))
                }
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
    
    // MARK: - Header Actions
    
    private var headerActions: some View {
        HStack(spacing: 12) {
            Button {
                generatePDF(preview: true)
            } label: {
                Image(systemName: "eye.fill")
                    .font(.system(size: 20))
                    .frame(width: 44, height: 44)
                    .background(Color.blue.opacity(0.1))
                    .foregroundColor(.blue)
                    .cornerRadius(10)
            }
            
            Button {
                generatePDF(preview: false)
            } label: {
                Image(systemName: "square.and.arrow.down.fill")
                    .font(.system(size: 20))
                    .frame(width: 44, height: 44)
                    .background(Color.green.opacity(0.1))
                    .foregroundColor(.green)
                    .cornerRadius(10)
            }
            
            Spacer()
        }
    }
    
    // MARK: - Client Info
    
    private var clientInfoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Billed To")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)
            
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.15))
                        .frame(width: 40, height: 40)
                    Text(String(invoice.client.name.prefix(1)))
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.blue)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(invoice.client.name)
                        .font(.headline)
                    Text(invoice.client.email)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }
    
    // MARK: - Meta Info
    
    private var metaInfoCard: some View {
        HStack(spacing: 0) {
            MetaItem(label: "Status", value: invoice.status.rawValue, valueColor: statusColor)
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
    
    // MARK: - Line Items
    
    private var lineItemsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Items")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)
            
            VStack(spacing: 0) {
                HStack {
                    Text("Description")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text("Qty")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.secondary)
                        .frame(width: 50, alignment: .center)
                    Text("Price")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.secondary)
                        .frame(width: 70, alignment: .trailing)
                    Text("Total")
                        .font(.caption.weight(.semibold))
                        .foregroundColor(.secondary)
                        .frame(width: 70, alignment: .trailing)
                }
                .padding(.bottom, 8)
                
                Divider()
                
                ForEach(invoice.lineItems) { item in
                    HStack {
                        Text(item.description)
                            .font(.subheadline)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        Text("\(item.quantity, specifier: "%.1f") \(item.unit)")
                            .font(.caption)
                            .frame(width: 50, alignment: .center)
                        Text(item.price, format: .currency(code: "USD"))
                            .font(.subheadline)
                            .frame(width: 70, alignment: .trailing)
                        Text(item.total, format: .currency(code: "USD"))
                            .font(.subheadline.weight(.medium))
                            .frame(width: 70, alignment: .trailing)
                    }
                    .padding(.vertical, 8)
                    
                    if item.id != invoice.lineItems.last?.id {
                        Divider()
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }
    
    // MARK: - Summary
    
    private var summaryCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Summary")
                .font(.caption.weight(.semibold))
                .foregroundColor(.secondary)
                .textCase(.uppercase)
            
            VStack(spacing: 8) {
                SummaryRow(label: "Subtotal", value: invoice.subtotal)
                if invoice.discountPercent > 0 {
                    let discountText = String(format: "%.1f", invoice.discountPercent)
                    SummaryRow(label: "Discount (\(discountText)%)", value: -invoice.discountAmount, valueColor: .green)
                }
                if invoice.taxPercent > 0 {
                    let taxText = String(format: "%.1f", invoice.taxPercent)
                    SummaryRow(label: "Tax (\(taxText)%)", value: invoice.taxAmount, valueColor: .orange)
                }
                Divider()
                SummaryRow(label: "Grand Total", value: invoice.grandTotal, isTotal: true)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 2)
    }
    
    // MARK: - Notes
    
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
    
    // MARK: - Signature
    
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
    
    // MARK: - PDF Generation
    
    private func generatePDF(preview: Bool) {
        guard let data = InvoicePDFGenerator.generatePDF(for: invoice) else { return }
        
        let tempDir = FileManager.default.temporaryDirectory
        let url = tempDir.appendingPathComponent("\(invoice.formattedInvoiceNumber).pdf")
        
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

// MARK: - Helper Views

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
                .font(.subheadline.weight(.medium))
                .foregroundColor(valueColor)
        }
        .frame(maxWidth: .infinity)
    }
}

struct SummaryRow: View {
    let label: String
    let value: Double
    var valueColor: Color = .primary
    var isTotal: Bool = false
    
    var body: some View {
        HStack {
            Text(label)
                .font(isTotal ? .headline : .subheadline)
            Spacer()
            Text(value, format: .currency(code: "USD"))
                .font(isTotal ? .headline.weight(.bold) : .subheadline)
                .foregroundColor(valueColor)
        }
    }
}

// MARK: - PDF Preview (QLPreviewController)

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

// MARK: - Share Sheet

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
            invoice: MockData.invoices[0],
            invoices: .constant(MockData.invoices),
            clients: MockData.clients,
            onNavigate: { _ in }
        )
    }
}
