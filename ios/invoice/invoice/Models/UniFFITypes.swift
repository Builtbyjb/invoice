import SwiftUI

extension Client: Identifiable {}
extension Invoice: Identifiable {}
extension InvoiceStatusCount: Identifiable {}
extension InvoiceStatus: CaseIterable, Identifiable {
    public static var allCases: [InvoiceStatus] { [.draft, .pending, .paid, .overdue] }
    public var id: String { rawValue }

    public var rawValue: String {
        switch self {
        case .draft: return "Draft"
        case .pending: return "Pending"
        case .paid: return "Paid"
        case .overdue: return "Overdue"
        }
    }
}

struct CGPointWrapper {
    let point: CGPoint
    init(_ point: CGPoint) { self.point = point }
}

struct Stroke {
    let points: [CGPointWrapper]
}

struct InvoiceLineItem: Identifiable {
    let id = UUID()
    var description: String
    var quantity: Double
    var unit: String
    var price: Double

    var total: Double {
        quantity * price
    }
}

extension Invoice {
    var formattedInvoiceNumber: String {
        invoiceNumber
    }

    var client: Client {
        get {
            // Return a placeholder since we don't have a global client registry
            Client(
                id: clientId,
                organizationId: 0,
                name: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                country: "",
                createdAt: ""
            )
        }
        set {
            clientId = newValue.id
        }
    }

    var issueDateValue: Date {
        get { Self.dateFormatter.date(from: issueDate) ?? Date() }
        set { issueDate = Self.dateFormatter.string(from: newValue) }
    }

    var dueDateValue: Date {
        get { Self.dateFormatter.date(from: dueDate) ?? Date() }
        set { dueDate = Self.dateFormatter.string(from: newValue) }
    }

    var lineItems: [InvoiceLineItem] {
        get {
            items.map {
                InvoiceLineItem(
                    description: $0.description,
                    quantity: Double($0.quantity),
                    unit: "ea",
                    price: $0.price
                )
            }
        }
        set {
            items = newValue.map {
                InvoiceItem(
                    description: $0.description,
                    quantity: UInt32($0.quantity),
                    price: $0.price
                )
            }
        }
    }

    var discountPercent: Double {
        get { discount }
        set { discount = newValue }
    }

    var taxPercent: Double {
        get { taxRate }
        set { taxRate = newValue }
    }

    var signatureStrokes: [Stroke] {
        get { [] }
        set { /* no-op */ }
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

    init(
        client: Client,
        status: InvoiceStatus,
        issueDate: Date,
        dueDate: Date,
        lineItems: [InvoiceLineItem],
        discountPercent: Double,
        taxPercent: Double,
        signatureStrokes: [Stroke],
        notes: String
    ) {
        self.init(
            id: UUID().uuidString,
            invoiceNumber: "INV-\(UUID().uuidString.prefix(6).uppercased())",
            clientId: client.id,
            items: lineItems.map {
                InvoiceItem(
                    description: $0.description,
                    quantity: UInt32($0.quantity),
                    price: $0.price
                )
            },
            taxRate: taxPercent,
            discount: discountPercent,
            status: status,
            signature: nil,
            issueDate: Self.dateFormatter.string(from: issueDate),
            dueDate: Self.dateFormatter.string(from: dueDate),
            currency: "USD",
            notes: notes,
            createdAt: Self.dateFormatter.string(from: Date())
        )
    }

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter
    }()
}

