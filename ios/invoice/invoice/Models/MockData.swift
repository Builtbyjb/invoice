//
//  MockData.swift
//  invoice
//
//  Created by Ajibola Awotide on 2026-06-27.
//

import Foundation

struct MockData {
    static let clients: [Client] = [
        Client(
            id: UUID(),
            name: "Acme Corporation",
            email: "billing@acme.com",
            phone: "+1 (555) 123-4567",
            address: "123 Innovation Drive",
            city: "San Francisco",
            country: "USA"
        ),
        Client(
            id: UUID(),
            name: "Globex Industries",
            email: "accounts@globex.co",
            phone: "+44 20 7946 0958",
            address: "45 Threadneedle Street",
            city: "London",
            country: "UK"
        ),
        Client(
            id: UUID(),
            name: "Soylent Corp",
            email: "finance@soylent.green",
            phone: "+1 (555) 987-6543",
            address: "88 Green Way",
            city: "New York",
            country: "USA"
        ),
        Client(
            id: UUID(),
            name: "Initech LLC",
            email: "payables@initech.dev",
            phone: "+1 (555) 246-8135",
            address: "99 Cubicle Lane",
            city: "Austin",
            country: "USA"
        ),
        Client(
            id: UUID(),
            name: "Umbrella Pharma",
            email: "billing@umbrella.biz",
            phone: "+81 3 1234 5678",
            address: "7 Raccoon City Blvd",
            city: "Tokyo",
            country: "Japan"
        )
    ]
    
    static let invoices: [Invoice] = [
        Invoice(
            id: UUID(),
            client: clients[0],
            status: .paid,
            issueDate: Date().addingTimeInterval(-30 * 24 * 60 * 60),
            dueDate: Date().addingTimeInterval(-23 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "Website Design", quantity: 1, unit: "project", price: 5000),
                InvoiceLineItem(description: "UI/UX Consulting", quantity: 10, unit: "hours", price: 150),
                InvoiceLineItem(description: "Hosting Setup", quantity: 1, unit: "service", price: 250)
            ],
            discountPercent: 5,
            taxPercent: 8,
            notes: "Thank you for your business!"
        ),
        Invoice(
            id: UUID(),
            client: clients[0],
            status: .sent,
            issueDate: Date().addingTimeInterval(-5 * 24 * 60 * 60),
            dueDate: Date().addingTimeInterval(2 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "Mobile App Development", quantity: 1, unit: "project", price: 12000),
                InvoiceLineItem(description: "API Integration", quantity: 3, unit: "endpoints", price: 800)
            ],
            discountPercent: 0,
            taxPercent: 8,
            notes: "Net 7 payment terms."
        ),
        Invoice(
            id: UUID(),
            client: clients[1],
            status: .overdue,
            issueDate: Date().addingTimeInterval(-45 * 24 * 60 * 60),
            dueDate: Date().addingTimeInterval(-38 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "Quarterly Audit", quantity: 1, unit: "service", price: 3500),
                InvoiceLineItem(description: "Compliance Review", quantity: 5, unit: "hours", price: 200)
            ],
            discountPercent: 10,
            taxPercent: 20,
            notes: "Overdue — please remit payment immediately."
        ),
        Invoice(
            id: UUID(),
            client: clients[2],
            status: .draft,
            issueDate: Date(),
            dueDate: Date().addingTimeInterval(14 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "Product Photography", quantity: 20, unit: "photos", price: 75),
                InvoiceLineItem(description: "Retouching", quantity: 20, unit: "photos", price: 25)
            ],
            discountPercent: 0,
            taxPercent: 0,
            notes: "Draft — awaiting final approval."
        ),
        Invoice(
            id: UUID(),
            client: clients[3],
            status: .paid,
            issueDate: Date().addingTimeInterval(-60 * 24 * 60 * 60),
            dueDate: Date().addingTimeInterval(-53 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "TPS Report Automation", quantity: 1, unit: "project", price: 8000),
                InvoiceLineItem(description: "Training Session", quantity: 4, unit: "hours", price: 175)
            ],
            discountPercent: 0,
            taxPercent: 6.25,
            notes: "Paid in full."
        ),
        Invoice(
            id: UUID(),
            client: clients[4],
            status: .sent,
            issueDate: Date().addingTimeInterval(-10 * 24 * 60 * 60),
            dueDate: Date().addingTimeInterval(4 * 24 * 60 * 60),
            lineItems: [
                InvoiceLineItem(description: "Clinical Trial Data Analysis", quantity: 1, unit: "study", price: 25000),
                InvoiceLineItem(description: "Lab Equipment Calibration", quantity: 2, unit: "units", price: 1200)
            ],
            discountPercent: 15,
            taxPercent: 10,
            notes: "Please include PO number 998877."
        )
    ]
}
