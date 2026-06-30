#[derive(Debug, Clone)]
pub struct MonthlyRevenue {
    pub month: &'static str,
    pub year: u16,
    pub currency: &'static str,
    pub amount: u32,
}

pub struct DashboardStats {
    pub total_revenue: f64,
    pub paid_count: u64,
    pub pending_count: u64,
    pub overdue_count: u64,
    pub currency: &'static str,
}

pub struct InvoiceStatusCount {
    pub id: &'static str,
    pub status: &'static str,
    pub count: u64,
}

pub struct Dashboard {
    pub dashboard_stats: DashboardStats,
    pub invoices_status: Vec<InvoiceStatusCount>,
    pub monthly_revenue: Vec<MonthlyRevenue>,
}
