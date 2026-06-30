pub struct Client {
    pub id: String,
    pub organization_id: u64,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub address: String,
    pub city: String,
    pub country: String,
    pub created_at: String, // ISO 8601 datetime, e.g. "2026-06-29T12:00:00Z"
}
