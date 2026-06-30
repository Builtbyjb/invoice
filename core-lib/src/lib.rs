use crate::utill::types::client::Client;
use crate::utill::types::dashboard::Dashboard;
use crate::utill::types::invoice::Invoice;
use crate::utill::types::referral::ReferralData;

uniffi::include_scaffolding!("lib");
mod store;
mod utill;

pub fn say_hello() -> String {
    "Hello from rust".to_string()
}

pub fn fetch_dashboard() -> Dashboard {
    let dashboard = store::dashboard::get_dashboard_data();
    dashboard
}

pub fn fetch_clients() -> Vec<Client> {
    let clients = store::clients::get_clients();
    clients
}

pub fn fetch_invoices() -> Vec<Invoice> {
    let invoices = store::invoice::get_invoices();
    invoices
}

pub fn fetch_referral_data() -> ReferralData {
    let referral_data = store::referral::get_referral_data();
    referral_data
}
