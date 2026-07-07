/// C-compatible types shared by the core library FFI.
/// All strings are null-terminated and owned by the returned response.
/// Callers must use the matching `core_lib_free_*` function to release memory.

pub const InvoiceStatus = enum(c_int) {
    Draft,
    Pending,
    Paid,
    Overdue,
};

pub const Client = extern struct {
    id: [*:0]const u8,
    organization_id: u64,
    name: [*:0]const u8,
    email: [*:0]const u8,
    phone: [*:0]const u8,
    address: [*:0]const u8,
    city: [*:0]const u8,
    country: [*:0]const u8,
    created_at: [*:0]const u8,
};

pub const ClientList = extern struct {
    ptr: ?[*]const Client,
    len: usize,
};

pub const InvoiceItem = extern struct {
    description: [*:0]const u8,
    quantity: u32,
    price: f64,
};

pub const InvoiceItemList = extern struct {
    ptr: ?[*]const InvoiceItem,
    len: usize,
};

pub const Invoice = extern struct {
    id: [*:0]const u8,
    invoice_number: [*:0]const u8,
    client_id: [*:0]const u8,
    items: InvoiceItemList,
    tax_rate: f64,
    discount: f64,
    status: InvoiceStatus,
    signature: ?[*:0]const u8,
    issue_date: [*:0]const u8,
    due_date: [*:0]const u8,
    currency: [*:0]const u8,
    notes: [*:0]const u8,
    created_at: [*:0]const u8,
};

pub const InvoiceList = extern struct {
    ptr: ?[*]const Invoice,
    len: usize,
};

pub const DashboardStats = extern struct {
    total_revenue: f64,
    paid_count: u64,
    pending_count: u64,
    overdue_count: u64,
    currency: [*:0]const u8,
};

pub const InvoiceStatusCount = extern struct {
    id: [*:0]const u8,
    status: [*:0]const u8,
    count: u64,
};

pub const InvoiceStatusCountList = extern struct {
    ptr: ?[*]const InvoiceStatusCount,
    len: usize,
};

pub const MonthlyRevenue = extern struct {
    month: [*:0]const u8,
    year: u16,
    currency: [*:0]const u8,
    amount: u32,
};

pub const MonthlyRevenueList = extern struct {
    ptr: ?[*]const MonthlyRevenue,
    len: usize,
};

pub const Dashboard = extern struct {
    dashboard_stats: DashboardStats,
    invoices_status: InvoiceStatusCountList,
    monthly_revenue: MonthlyRevenueList,
};

pub const ReferralData = extern struct {
    total_referrals: u64,
    active_referrals: u64,
    total_earnings: f64,
    payout: f64,
    referral_code: [*:0]const u8,
};
