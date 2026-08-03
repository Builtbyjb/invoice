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
        note: "Created a website. Almost done with the design. Waiting for client feedback.",
        createdAt: ISO8601Formatter.string(from: Date(timeIntervalSince1970: 1_704_067_200))
    )

    static let clients: [Client] = [
        client,
        Client(
            id: "demo-client-2",
            organizationId: 1,
            name: "Globex Inc",
            email: "accounts@globex.com",
            phone: "+1 555 5678",
            address: "456 Oak Ave",
            city: "Chicago",
            country: "US",
            note: "Done with the design. Ready to start development.",
            createdAt: ISO8601Formatter.string(from: Date(timeIntervalSince1970: 1_704_153_600))
        ),
        Client(
            id: "demo-client-3",
            organizationId: 1,
            name: "Soylent Corp",
            email: "hello@soylent.com",
            phone: "+1 555 9012",
            address: "789 Green St",
            city: "San Francisco",
            country: "US",
            note: "Project completed.",
            createdAt: ISO8601Formatter.string(from: Date(timeIntervalSince1970: 1_704_240_000))
        ),
        Client(
            id: "demo-client-4",
            organizationId: 1,
            name: "Initech",
            email: "finance@initech.com",
            phone: "+1 555 3456",
            address: "100 Corporate Blvd",
            city: "Austin",
            country: "US",
            note: "Project on hold. Need more resources.",
            createdAt: ISO8601Formatter.string(from: Date(timeIntervalSince1970: 1_704_326_400))
        ),
    ]

    static let invoice = Invoice(
        id: invoiceID,
        invoiceNumber: "INV-001",
        clientId: clientID,
        clientName: client.name,
        clientInfo: ClientInfo(
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city,
            Country: client.country
        ),
        items: [
            InvoiceItem(description: "Consulting", quantity: 10, unit: "hr", price: 150)
        ],
        taxRate: 10,
        discount: 0,
        status: .sent,
        signature: nil,
        issueDate: Date(timeIntervalSince1970: 1_704_067_200),
        dueDate: Date(timeIntervalSince1970: 1_706_745_600),
        currency: "USD",
        notes: "Demo invoice for preview and deep-link testing.",
        createdAt: Date(timeIntervalSince1970: 1_704_067_200)
    )

    static let notifications: [AppNotification] = {
        let base = Date(timeIntervalSince1970: 1_752_883_200)  // 2026-07-19 00:00:00 UTC
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
            ),
        ]
    }()

    private static let ISO8601Formatter: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]
        return formatter
    }()
}
