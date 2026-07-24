//
//  Invoice.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-07-10.
//

import SwiftUI

public enum InvoiceStatus: String, Equatable, Hashable, CaseIterable, Codable {
    case draft
    case sent
    case paid
    case overdue
}

struct CGPointWrapper: Codable {
    let point: CGPoint
    init(_ point: CGPoint) { self.point = point }
    
    enum CodingKeys: String, CodingKey {
        case x
        case y
    }
    
    init(from decoder: any Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let x = try container.decode(Double.self, forKey: .x)
        let y = try container.decode(Double.self, forKey: .y)
        self.init(CGPoint(x: x, y: y))
    }
    
    func encode(to encoder: any Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(point.x, forKey: .x)
        try container.encode(point.y, forKey: .y)
    }
}

struct Stroke: Codable {
    let points: [CGPointWrapper]
}

struct InvoiceItem: Equatable, Hashable, Codable {
    var description: String
    var quantity: Double
    var unit: String? = nil
    var price: Double

    var total: Double {
        quantity * price
    }
}

struct Invoice: Equatable, Hashable, Identifiable, Codable {
    public var id: String
    public var invoiceNumber: String
    public var clientId: String
    public var clientName: String
    public var items: [InvoiceItem]
    public var taxRate: Double
    public var discount: Double
    public var status: InvoiceStatus
    public var signature: String?
    public var issueDate: Date
    public var dueDate: Date
    public var currency: String
    public var notes: String
    public var createdAt: Date

    var discountPercent: Double {
        get { discount }
        set { discount = newValue }
    }

    var taxPercent: Double {
        get { taxRate }
        set { taxRate = newValue }
    }

    var signatureStrokes: [Stroke] {
        get {
            guard let signatureData = signature?.data(using: .utf8) else { return [] }
            do {
                return try JSONDecoder().decode([Stroke].self, from: signatureData)
            } catch {
                return []
            }
        }
        set {
            do {
                let data = try JSONEncoder().encode(newValue)
                signature = String(data: data, encoding: .utf8)
            } catch {
                signature = nil
            }
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

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter
    }()

    static func fetchInvoices() async throws -> [Invoice] {
        return try await APIClient.shared.request(
            path: "/api/v1/invoices",
            method: "GET",
            requiresAuth: true
        )
    }

    static func fetchClientInvoices(clientId: String) async throws -> [Invoice] {
        return try await APIClient.shared.request(
            path: "/api/v1/clients/\(clientId)/invoices",
            method: "GET",
            requiresAuth: true
        )
    }

    static func create(
        clientId: String,
        status: InvoiceStatus,
        issueDate: Date,
        dueDate: Date,
        items: [InvoiceItem],
        taxRate: Double,
        discount: Double,
        currency: String,
        notes: String,
        signature: String?
    ) async throws -> Invoice {
        let body = InvoiceRequest(
            clientId: clientId,
            status: status,
            issueDate: issueDate,
            dueDate: dueDate,
            items: items,
            taxRate: taxRate,
            discount: discount,
            currency: currency,
            notes: notes,
            signature: signature
        )
        return try await APIClient.shared.request(
            path: "/api/v1/invoices",
            method: "POST",
            body: body,
            requiresAuth: true
        )
    }

    static func update(
        id: String,
        clientId: String,
        status: InvoiceStatus,
        issueDate: Date,
        dueDate: Date,
        items: [InvoiceItem],
        taxRate: Double,
        discount: Double,
        currency: String,
        notes: String,
        signature: String?
    ) async throws -> Invoice {
        let body = InvoiceRequest(
            clientId: clientId,
            status: status,
            issueDate: issueDate,
            dueDate: dueDate,
            items: items,
            taxRate: taxRate,
            discount: discount,
            currency: currency,
            notes: notes,
            signature: signature
        )
        return try await APIClient.shared.request(
            path: "/api/v1/invoices/\(id)",
            method: "PUT",
            body: body,
            requiresAuth: true
        )
    }
    
    static func fetch(id: String) async throws -> Invoice {
        #if DEBUG
        if DemoData.invoice.id == id { return DemoData.invoice }
        #endif
        return try await APIClient.shared.request(
            path: "/api/v1/invoices/\(id)",
            method: "GET",
            requiresAuth: true
        )
    }
}

private struct InvoiceRequest: Codable {
    let clientId: String
    let status: InvoiceStatus
    let issueDate: Date
    let dueDate: Date
    let items: [InvoiceItem]
    let taxRate: Double
    let discount: Double
    let currency: String
    let notes: String
    let signature: String?
}
