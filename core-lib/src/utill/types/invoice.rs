pub enum InvoiceStatus {
    Draft,
    Pending,
    Paid,
    Overdue,
}

pub struct InvoiceItem {
    pub description: String,
    pub quantity: u32,
    pub price: f64,
}

pub struct Invoice {
    pub id: String,
    pub invoice_number: String,
    pub client_id: String,
    pub items: Vec<InvoiceItem>,
    pub tax_rate: f64,
    pub discount: f64,
    pub status: InvoiceStatus,
    pub signature: Option<String>,
    pub issue_date: String,
    pub due_date: String,
    pub currency: String,
    pub notes: String,
    pub created_at: String,
}
