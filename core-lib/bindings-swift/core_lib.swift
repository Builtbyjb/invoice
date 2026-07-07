import Foundation

#if canImport(core_libFFI)
import core_libFFI
#endif

public struct Client: Equatable, Hashable {
    public var id: String
    public var organizationId: UInt64
    public var name: String
    public var email: String
    public var phone: String
    public var address: String
    public var city: String
    public var country: String
    public var createdAt: String

    public init(id: String, organizationId: UInt64, name: String, email: String, phone: String, address: String, city: String, country: String, createdAt: String) {
        self.id = id
        self.organizationId = organizationId
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
        self.city = city
        self.country = country
        self.createdAt = createdAt
    }
}

#if compiler(>=6)
extension Client: Sendable {}
#endif

public struct InvoiceItem: Equatable, Hashable {
    public var description: String
    public var quantity: UInt32
    public var price: Double

    public init(description: String, quantity: UInt32, price: Double) {
        self.description = description
        self.quantity = quantity
        self.price = price
    }
}

#if compiler(>=6)
extension InvoiceItem: Sendable {}
#endif

public enum InvoiceStatus: Equatable, Hashable {
    case draft
    case pending
    case paid
    case overdue

    init(core: CoreInvoiceStatus) {
        switch core {
        case CoreInvoiceStatusDraft:
            self = .draft
        case CoreInvoiceStatusPending:
            self = .pending
        case CoreInvoiceStatusPaid:
            self = .paid
        case CoreInvoiceStatusOverdue:
            self = .overdue
        default:
            self = .draft
        }
    }
}

#if compiler(>=6)
extension InvoiceStatus: Sendable {}
#endif

public struct Invoice: Equatable, Hashable {
    public var id: String
    public var invoiceNumber: String
    public var clientId: String
    public var items: [InvoiceItem]
    public var taxRate: Double
    public var discount: Double
    public var status: InvoiceStatus
    public var signature: String?
    public var issueDate: String
    public var dueDate: String
    public var currency: String
    public var notes: String
    public var createdAt: String

    public init(id: String, invoiceNumber: String, clientId: String, items: [InvoiceItem], taxRate: Double, discount: Double, status: InvoiceStatus, signature: String?, issueDate: String, dueDate: String, currency: String, notes: String, createdAt: String) {
        self.id = id
        self.invoiceNumber = invoiceNumber
        self.clientId = clientId
        self.items = items
        self.taxRate = taxRate
        self.discount = discount
        self.status = status
        self.signature = signature
        self.issueDate = issueDate
        self.dueDate = dueDate
        self.currency = currency
        self.notes = notes
        self.createdAt = createdAt
    }
}

#if compiler(>=6)
extension Invoice: Sendable {}
#endif

public struct DashboardStats: Equatable, Hashable {
    public var totalRevenue: Double
    public var paidCount: UInt64
    public var pendingCount: UInt64
    public var overdueCount: UInt64
    public var currency: String

    public init(totalRevenue: Double, paidCount: UInt64, pendingCount: UInt64, overdueCount: UInt64, currency: String) {
        self.totalRevenue = totalRevenue
        self.paidCount = paidCount
        self.pendingCount = pendingCount
        self.overdueCount = overdueCount
        self.currency = currency
    }
}

#if compiler(>=6)
extension DashboardStats: Sendable {}
#endif

public struct InvoiceStatusCount: Equatable, Hashable {
    public var id: String
    public var status: String
    public var count: UInt64

    public init(id: String, status: String, count: UInt64) {
        self.id = id
        self.status = status
        self.count = count
    }
}

#if compiler(>=6)
extension InvoiceStatusCount: Sendable {}
#endif

public struct MonthlyRevenue: Equatable, Hashable {
    public var month: String
    public var year: UInt16
    public var currency: String
    public var amount: UInt32

    public init(month: String, year: UInt16, currency: String, amount: UInt32) {
        self.month = month
        self.year = year
        self.currency = currency
        self.amount = amount
    }
}

#if compiler(>=6)
extension MonthlyRevenue: Sendable {}
#endif

public struct Dashboard: Equatable, Hashable {
    public var dashboardStats: DashboardStats
    public var invoicesStatus: [InvoiceStatusCount]
    public var monthlyRevenue: [MonthlyRevenue]

    public init(dashboardStats: DashboardStats, invoicesStatus: [InvoiceStatusCount], monthlyRevenue: [MonthlyRevenue]) {
        self.dashboardStats = dashboardStats
        self.invoicesStatus = invoicesStatus
        self.monthlyRevenue = monthlyRevenue
    }
}

#if compiler(>=6)
extension Dashboard: Sendable {}
#endif

public struct ReferralData: Equatable, Hashable {
    public var totalReferrals: UInt64
    public var activeReferrals: UInt64
    public var totalEarnings: Double
    public var payout: Double
    public var referralCode: String

    public init(totalReferrals: UInt64, activeReferrals: UInt64, totalEarnings: Double, payout: Double, referralCode: String) {
        self.totalReferrals = totalReferrals
        self.activeReferrals = activeReferrals
        self.totalEarnings = totalEarnings
        self.payout = payout
        self.referralCode = referralCode
    }
}

#if compiler(>=6)
extension ReferralData: Sendable {}
#endif

public func fetchClients() -> [Client] {
    let list = core_lib_fetch_clients()
    defer { core_lib_free_clients(list) }
    guard list.len > 0 else { return [] }
    var result: [Client] = []
    result.reserveCapacity(list.len)
    for i in 0..<list.len {
        let c = list.ptr[i]
        result.append(Client(
            id: String(cString: c.id),
            organizationId: c.organization_id,
            name: String(cString: c.name),
            email: String(cString: c.email),
            phone: String(cString: c.phone),
            address: String(cString: c.address),
            city: String(cString: c.city),
            country: String(cString: c.country),
            createdAt: String(cString: c.created_at)
        ))
    }
    return result
}

public func fetchInvoices() -> [Invoice] {
    let list = core_lib_fetch_invoices()
    defer { core_lib_free_invoices(list) }
    guard list.len > 0 else { return [] }
    var result: [Invoice] = []
    result.reserveCapacity(list.len)
    for i in 0..<list.len {
        let inv = list.ptr[i]
        var items: [InvoiceItem] = []
        let itemList = inv.items
        if itemList.len > 0 {
            items.reserveCapacity(itemList.len)
            for j in 0..<itemList.len {
                let it = itemList.ptr[j]
                items.append(InvoiceItem(
                    description: String(cString: it.description),
                    quantity: it.quantity,
                    price: it.price
                ))
            }
        }
        result.append(Invoice(
            id: String(cString: inv.id),
            invoiceNumber: String(cString: inv.invoice_number),
            clientId: String(cString: inv.client_id),
            items: items,
            taxRate: inv.tax_rate,
            discount: inv.discount,
            status: InvoiceStatus(core: inv.status),
            signature: inv.signature.map { String(cString: $0) },
            issueDate: String(cString: inv.issue_date),
            dueDate: String(cString: inv.due_date),
            currency: String(cString: inv.currency),
            notes: String(cString: inv.notes),
            createdAt: String(cString: inv.created_at)
        ))
    }
    return result
}

public func fetchDashboard() -> Dashboard {
    guard let d = core_lib_fetch_dashboard() else {
        return Dashboard(dashboardStats: DashboardStats(totalRevenue: 0, paidCount: 0, pendingCount: 0, overdueCount: 0, currency: ""), invoicesStatus: [], monthlyRevenue: [])
    }
    defer { core_lib_free_dashboard(d) }
    let stats = d.pointee.dashboard_stats
    var statusCounts: [InvoiceStatusCount] = []
    let statusList = d.pointee.invoices_status
    if statusList.len > 0 {
        statusCounts.reserveCapacity(statusList.len)
        for i in 0..<statusList.len {
            let sc = statusList.ptr[i]
            statusCounts.append(InvoiceStatusCount(
                id: String(cString: sc.id),
                status: String(cString: sc.status),
                count: sc.count
            ))
        }
    }
    var monthlyRevenues: [MonthlyRevenue] = []
    let revenueList = d.pointee.monthly_revenue
    if revenueList.len > 0 {
        monthlyRevenues.reserveCapacity(revenueList.len)
        for i in 0..<revenueList.len {
            let mr = revenueList.ptr[i]
            monthlyRevenues.append(MonthlyRevenue(
                month: String(cString: mr.month),
                year: mr.year,
                currency: String(cString: mr.currency),
                amount: mr.amount
            ))
        }
    }
    return Dashboard(
        dashboardStats: DashboardStats(
            totalRevenue: stats.total_revenue,
            paidCount: stats.paid_count,
            pendingCount: stats.pending_count,
            overdueCount: stats.overdue_count,
            currency: String(cString: stats.currency)
        ),
        invoicesStatus: statusCounts,
        monthlyRevenue: monthlyRevenues
    )
}

public func fetchReferralData() -> ReferralData {
    guard let r = core_lib_fetch_referral_data() else {
        return ReferralData(totalReferrals: 0, activeReferrals: 0, totalEarnings: 0, payout: 0, referralCode: "")
    }
    defer { core_lib_free_referral_data(r) }
    return ReferralData(
        totalReferrals: r.pointee.total_referrals,
        activeReferrals: r.pointee.active_referrals,
        totalEarnings: r.pointee.total_earnings,
        payout: r.pointee.payout,
        referralCode: String(cString: r.pointee.referral_code)
    )
}
