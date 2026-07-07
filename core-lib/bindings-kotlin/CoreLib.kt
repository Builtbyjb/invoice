@file:Suppress("MemberVisibilityCanBePrivate", "unused", "RedundantVisibilityModifier")

package com.invoice.core_lib

import com.sun.jna.*

// =============================================================================
// Public API
// =============================================================================

public object CoreLib {
    public fun fetchClients(): List<Client> {
        val list = LIB.core_lib_fetch_clients()
        val result = list.ptr?.readClientArray(list.len.toInt())?.map { it.toClient() } ?: emptyList()
        LIB.core_lib_free_clients(list)
        return result
    }

    public fun fetchInvoices(): List<Invoice> {
        val list = LIB.core_lib_fetch_invoices()
        val result = list.ptr?.readInvoiceArray(list.len.toInt())?.map { it.toInvoice() } ?: emptyList()
        LIB.core_lib_free_invoices(list)
        return result
    }

    public fun fetchDashboard(): Dashboard {
        val ptr = LIB.core_lib_fetch_dashboard()
            ?: throw RuntimeException("core_lib_fetch_dashboard returned null")
        val d = CoreDashboard().apply { useMemory(ptr); read() }
        val result = d.toDashboard()
        LIB.core_lib_free_dashboard(ptr)
        return result
    }

    public fun fetchReferralData(): ReferralData {
        val ptr = LIB.core_lib_fetch_referral_data()
            ?: throw RuntimeException("core_lib_fetch_referral_data returned null")
        val r = CoreReferralData().apply { useMemory(ptr); read() }
        val result = r.toReferralData()
        LIB.core_lib_free_referral_data(ptr)
        return result
    }
}

public enum class InvoiceStatus {
    Draft, Pending, Paid, Overdue
}

public data class Client(
    val id: String,
    val organizationId: ULong,
    val name: String,
    val email: String,
    val phone: String,
    val address: String,
    val city: String,
    val country: String,
    val createdAt: String,
)

public data class InvoiceItem(
    val description: String,
    val quantity: UInt,
    val price: Double,
)

public data class Invoice(
    val id: String,
    val invoiceNumber: String,
    val clientId: String,
    val items: List<InvoiceItem>,
    val taxRate: Double,
    val discount: Double,
    val status: InvoiceStatus,
    val signature: String?,
    val issueDate: String,
    val dueDate: String,
    val currency: String,
    val notes: String,
    val createdAt: String,
)

public data class DashboardStats(
    val totalRevenue: Double,
    val paidCount: ULong,
    val pendingCount: ULong,
    val overdueCount: ULong,
    val currency: String,
)

public data class InvoiceStatusCount(
    val id: String,
    val status: String,
    val count: ULong,
)

public data class MonthlyRevenue(
    val month: String,
    val year: UShort,
    val currency: String,
    val amount: UInt,
)

public data class Dashboard(
    val dashboardStats: DashboardStats,
    val invoicesStatus: List<InvoiceStatusCount>,
    val monthlyRevenue: List<MonthlyRevenue>,
)

public data class ReferralData(
    val totalReferrals: ULong,
    val activeReferrals: ULong,
    val totalEarnings: Double,
    val payout: Double,
    val referralCode: String,
)

// =============================================================================
// FFI Layer
// =============================================================================

private val LIB: CoreLibFFI by lazy {
    try {
        System.loadLibrary("core_lib")
    } catch (_: UnsatisfiedLinkError) {
        // fallback for desktop JVM; Native.load will still attempt dlopen
    }
    Native.load("core_lib", CoreLibFFI::class.java)
}

private interface CoreLibFFI : Library {
    fun core_lib_fetch_clients(): CoreClientList
    fun core_lib_free_clients(list: CoreClientList)
    fun core_lib_fetch_invoices(): CoreInvoiceList
    fun core_lib_free_invoices(list: CoreInvoiceList)
    fun core_lib_fetch_dashboard(): Pointer?
    fun core_lib_free_dashboard(dashboard: Pointer?)
    fun core_lib_fetch_referral_data(): Pointer?
    fun core_lib_free_referral_data(referral: Pointer?)
}

// =============================================================================
// JNA Structures — C type mirrors
// =============================================================================

@Structure.FieldOrder("ptr", "len")
private open class CoreClientList : Structure(), Structure.ByValue {
    @JvmField var ptr: Pointer? = null
    @JvmField var len: Long = 0
}

@Structure.FieldOrder("id", "organization_id", "name", "email", "phone", "address", "city", "country", "created_at")
private open class CoreClient : Structure() {
    @JvmField var id: Pointer? = null
    @JvmField var organization_id: Long = 0
    @JvmField var name: Pointer? = null
    @JvmField var email: Pointer? = null
    @JvmField var phone: Pointer? = null
    @JvmField var address: Pointer? = null
    @JvmField var city: Pointer? = null
    @JvmField var country: Pointer? = null
    @JvmField var created_at: Pointer? = null

    fun toClient(): Client = Client(
        id = id?.getString(0) ?: "",
        organizationId = organization_id.toULong(),
        name = name?.getString(0) ?: "",
        email = email?.getString(0) ?: "",
        phone = phone?.getString(0) ?: "",
        address = address?.getString(0) ?: "",
        city = city?.getString(0) ?: "",
        country = country?.getString(0) ?: "",
        createdAt = created_at?.getString(0) ?: ""
    )
}

@Structure.FieldOrder("ptr", "len")
private open class CoreInvoiceItemList : Structure(), Structure.ByValue {
    @JvmField var ptr: Pointer? = null
    @JvmField var len: Long = 0
}

@Structure.FieldOrder("description", "quantity", "price")
private open class CoreInvoiceItem : Structure() {
    @JvmField var description: Pointer? = null
    @JvmField var quantity: Int = 0
    @JvmField var price: Double = 0.0

    fun toInvoiceItem(): InvoiceItem = InvoiceItem(
        description = description?.getString(0) ?: "",
        quantity = quantity.toUInt(),
        price = price
    )
}

@Structure.FieldOrder("ptr", "len")
private open class CoreInvoiceList : Structure(), Structure.ByValue {
    @JvmField var ptr: Pointer? = null
    @JvmField var len: Long = 0
}

@Structure.FieldOrder("id", "invoice_number", "client_id", "items", "tax_rate", "discount", "status", "signature", "issue_date", "due_date", "currency", "notes", "created_at")
private open class CoreInvoice : Structure() {
    @JvmField var id: Pointer? = null
    @JvmField var invoice_number: Pointer? = null
    @JvmField var client_id: Pointer? = null
    @JvmField var items: CoreInvoiceItemList = CoreInvoiceItemList()
    @JvmField var tax_rate: Double = 0.0
    @JvmField var discount: Double = 0.0
    @JvmField var status: Int = 0
    @JvmField var signature: Pointer? = null
    @JvmField var issue_date: Pointer? = null
    @JvmField var due_date: Pointer? = null
    @JvmField var currency: Pointer? = null
    @JvmField var notes: Pointer? = null
    @JvmField var created_at: Pointer? = null

    fun toInvoice(): Invoice = Invoice(
        id = id?.getString(0) ?: "",
        invoiceNumber = invoice_number?.getString(0) ?: "",
        clientId = client_id?.getString(0) ?: "",
        items = items.ptr?.readInvoiceItemArray(items.len.toInt())?.map { it.toInvoiceItem() } ?: emptyList(),
        taxRate = tax_rate,
        discount = discount,
        status = when (status) {
            0 -> InvoiceStatus.Draft
            1 -> InvoiceStatus.Pending
            2 -> InvoiceStatus.Paid
            3 -> InvoiceStatus.Overdue
            else -> InvoiceStatus.Draft
        },
        signature = signature?.getString(0),
        issueDate = issue_date?.getString(0) ?: "",
        dueDate = due_date?.getString(0) ?: "",
        currency = currency?.getString(0) ?: "",
        notes = notes?.getString(0) ?: "",
        createdAt = created_at?.getString(0) ?: ""
    )
}

@Structure.FieldOrder("total_revenue", "paid_count", "pending_count", "overdue_count", "currency")
private open class CoreDashboardStats : Structure(), Structure.ByValue {
    @JvmField var total_revenue: Double = 0.0
    @JvmField var paid_count: Long = 0
    @JvmField var pending_count: Long = 0
    @JvmField var overdue_count: Long = 0
    @JvmField var currency: Pointer? = null

    fun toDashboardStats(): DashboardStats = DashboardStats(
        totalRevenue = total_revenue,
        paidCount = paid_count.toULong(),
        pendingCount = pending_count.toULong(),
        overdueCount = overdue_count.toULong(),
        currency = currency?.getString(0) ?: ""
    )
}

@Structure.FieldOrder("ptr", "len")
private open class CoreInvoiceStatusCountList : Structure(), Structure.ByValue {
    @JvmField var ptr: Pointer? = null
    @JvmField var len: Long = 0
}

@Structure.FieldOrder("id", "status", "count")
private open class CoreInvoiceStatusCount : Structure() {
    @JvmField var id: Pointer? = null
    @JvmField var status: Pointer? = null
    @JvmField var count: Long = 0

    fun toInvoiceStatusCount(): InvoiceStatusCount = InvoiceStatusCount(
        id = id?.getString(0) ?: "",
        status = status?.getString(0) ?: "",
        count = count.toULong()
    )
}

@Structure.FieldOrder("ptr", "len")
private open class CoreMonthlyRevenueList : Structure(), Structure.ByValue {
    @JvmField var ptr: Pointer? = null
    @JvmField var len: Long = 0
}

@Structure.FieldOrder("month", "year", "currency", "amount")
private open class CoreMonthlyRevenue : Structure() {
    @JvmField var month: Pointer? = null
    @JvmField var year: Short = 0
    @JvmField var currency: Pointer? = null
    @JvmField var amount: Int = 0

    fun toMonthlyRevenue(): MonthlyRevenue = MonthlyRevenue(
        month = month?.getString(0) ?: "",
        year = year.toUShort(),
        currency = currency?.getString(0) ?: "",
        amount = amount.toUInt()
    )
}

@Structure.FieldOrder("dashboard_stats", "invoices_status", "monthly_revenue")
private open class CoreDashboard : Structure() {
    @JvmField var dashboard_stats: CoreDashboardStats = CoreDashboardStats()
    @JvmField var invoices_status: CoreInvoiceStatusCountList = CoreInvoiceStatusCountList()
    @JvmField var monthly_revenue: CoreMonthlyRevenueList = CoreMonthlyRevenueList()

    fun toDashboard(): Dashboard = Dashboard(
        dashboardStats = dashboard_stats.toDashboardStats(),
        invoicesStatus = invoices_status.ptr?.readInvoiceStatusCountArray(invoices_status.len.toInt())?.map { it.toInvoiceStatusCount() } ?: emptyList(),
        monthlyRevenue = monthly_revenue.ptr?.readMonthlyRevenueArray(monthly_revenue.len.toInt())?.map { it.toMonthlyRevenue() } ?: emptyList()
    )
}

@Structure.FieldOrder("total_referrals", "active_referrals", "total_earnings", "payout", "referral_code")
private open class CoreReferralData : Structure() {
    @JvmField var total_referrals: Long = 0
    @JvmField var active_referrals: Long = 0
    @JvmField var total_earnings: Double = 0.0
    @JvmField var payout: Double = 0.0
    @JvmField var referral_code: Pointer? = null

    fun toReferralData(): ReferralData = ReferralData(
        totalReferrals = total_referrals.toULong(),
        activeReferrals = active_referrals.toULong(),
        totalEarnings = total_earnings,
        payout = payout,
        referralCode = referral_code?.getString(0) ?: ""
    )
}

// =============================================================================
// Array helpers
// =============================================================================

private fun Pointer.readClientArray(len: Int): Array<CoreClient> {
    val size = CoreClient().size()
    return Array(len) { i ->
        CoreClient().apply {
            useMemory(this@readClientArray.share((i * size).toLong()))
            read()
        }
    }
}

private fun Pointer.readInvoiceItemArray(len: Int): Array<CoreInvoiceItem> {
    val size = CoreInvoiceItem().size()
    return Array(len) { i ->
        CoreInvoiceItem().apply {
            useMemory(this@readInvoiceItemArray.share((i * size).toLong()))
            read()
        }
    }
}

private fun Pointer.readInvoiceArray(len: Int): Array<CoreInvoice> {
    val size = CoreInvoice().size()
    return Array(len) { i ->
        CoreInvoice().apply {
            useMemory(this@readInvoiceArray.share((i * size).toLong()))
            read()
        }
    }
}

private fun Pointer.readInvoiceStatusCountArray(len: Int): Array<CoreInvoiceStatusCount> {
    val size = CoreInvoiceStatusCount().size()
    return Array(len) { i ->
        CoreInvoiceStatusCount().apply {
            useMemory(this@readInvoiceStatusCountArray.share((i * size).toLong()))
            read()
        }
    }
}

private fun Pointer.readMonthlyRevenueArray(len: Int): Array<CoreMonthlyRevenue> {
    val size = CoreMonthlyRevenue().size()
    return Array(len) { i ->
        CoreMonthlyRevenue().apply {
            useMemory(this@readMonthlyRevenueArray.share((i * size).toLong()))
            read()
        }
    }
}
