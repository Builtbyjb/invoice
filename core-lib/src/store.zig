const std = @import("std");
const store_data = @import("store_data.zig");

const Data = struct {
    clients: []const store_data.JsonClient,
    invoices: []const store_data.JsonInvoice,
    dashboard: store_data.JsonDashboard,
    referral_data: store_data.JsonReferralData,
};

const data: Data = .{
    .clients = store_data.clients,
    .invoices = store_data.invoices,
    .dashboard = .{
        .dashboard_stats = store_data.dashboard_stats,
        .invoices_status = store_data.invoices_status,
        .monthly_revenue = store_data.monthly_revenue,
    },
    .referral_data = store_data.referral_data,
};

/// Returns the static dataset.
pub fn get() *const Data {
    return &data;
}
