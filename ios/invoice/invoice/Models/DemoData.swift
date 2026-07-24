//
//  DemoData.swift
//  invoice
//
//  Created by OpenCode on 2026-07-22.
//

import Foundation

enum DemoData {
    static let clientID = "demo-client-1"
    static let invoiceID = "demo-invoice-1"
    
    static let client = Client(
        id: clientID,
        organizationId: 1,
        name: "Acme Corp",
        email: "billing@acme.com",
        phone: "+1 555 1234",
        address: "123 Main St",
        city: "New York",
        country: "US",
        createdAt: ISO8601Formatter.string(from: Date(timeIntervalSince1970: 1704067200))
    )
    
    static let invoice = Invoice(
        id: invoiceID,
        invoiceNumber: "INV-001",
        clientId: clientID,
        clientName: client.name,
        items: [
            InvoiceItem(description: "Consulting", quantity: 10, unit: "hr", price: 150)
        ],
        taxRate: 10,
        discount: 0,
        status: .sent,
        signature: nil,
        issueDate: Date(timeIntervalSince1970: 1704067200),
        dueDate: Date(timeIntervalSince1970: 1706745600),
        currency: "USD",
        notes: "Demo invoice for preview and deep-link testing.",
        createdAt: Date(timeIntervalSince1970: 1704067200)
    )
    
    static let notifications: [AppNotification] = {
        let base = Date(timeIntervalSince1970: 1752883200) // 2026-07-19 00:00:00 UTC
        return [
            AppNotification(
                id: "notif-1",
                title: "New invoice paid",
                body: "Invoice INV-001 has been marked as paid.",
                kind: .invoice,
                targetId: invoiceID,
                isRead: false,
                createdAt: base.addingTimeInterval(-3600)
            ),
            AppNotification(
                id: "notif-2",
                title: "Client updated",
                body: "Acme Corp's profile was updated.",
                kind: .client,
                targetId: clientID,
                isRead: false,
                createdAt: base.addingTimeInterval(-7200)
            ),
            AppNotification(
                id: "notif-3",
                title: "Welcome",
                body: "Thanks for using Acorp Invoice.",
                kind: .system,
                targetId: nil,
                isRead: true,
                createdAt: base.addingTimeInterval(-86400)
            )
        ]
    }()
    
    private static let ISO8601Formatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        return formatter
    }()
}
