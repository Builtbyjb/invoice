//
//  Invoice.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import Foundation

enum InvoiceStatus: String, Codable, CaseIterable, Identifiable {
    case draft = "Draft"
    case sent = "Sent"
    case paid = "Paid"
    case overdue = "Overdue"
    
    var id: String { rawValue }
    
    var colorName: String {
        switch self {
        case .draft: return "gray"
        case .sent: return "blue"
        case .paid: return "green"
        case .overdue: return "red"
        }
    }
}

struct Stroke: Codable, Hashable {
    var points: [CGPointWrapper]
}

struct CGPointWrapper: Codable, Hashable {
    var x: CGFloat
    var y: CGFloat
    
    init(_ point: CGPoint) {
        self.x = point.x
        self.y = point.y
    }
    
    var point: CGPoint {
        CGPoint(x: x, y: y)
    }
}

struct Invoice: Identifiable, Hashable, Codable {
    let id: UUID
    var client: Client
    var status: InvoiceStatus
    var issueDate: Date
    var dueDate: Date
    var lineItems: [InvoiceLineItem]
    var discountPercent: Double
    var taxPercent: Double
    var signatureStrokes: [Stroke]
    var notes: String
    
    init(
        id: UUID = UUID(),
        client: Client,
        status: InvoiceStatus = .draft,
        issueDate: Date = Date(),
        dueDate: Date = Date().addingTimeInterval(7 * 24 * 60 * 60),
        lineItems: [InvoiceLineItem] = [],
        discountPercent: Double = 0,
        taxPercent: Double = 0,
        signatureStrokes: [Stroke] = [],
        notes: String = ""
    ) {
        self.id = id
        self.client = client
        self.status = status
        self.issueDate = issueDate
        self.dueDate = dueDate
        self.lineItems = lineItems
        self.discountPercent = discountPercent
        self.taxPercent = taxPercent
        self.signatureStrokes = signatureStrokes
        self.notes = notes
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
    
    var formattedInvoiceNumber: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd"
        let datePart = formatter.string(from: issueDate)
        let idPart = String(id.uuidString.prefix(4).uppercased())
        return "INV-\(datePart)-\(idPart)"
    }
}
