const std = @import("std");
const types = @import("types.zig");
const store = @import("store.zig");
const store_data = @import("store_data.zig");

const allocator = std.heap.smp_allocator;

fn allocString(s: []const u8) std.mem.Allocator.Error![*:0]u8 {
    const buf = try allocator.allocSentinel(u8, s.len, 0);
    @memcpy(buf, s);
    return buf.ptr;
}

fn freeString(ptr: ?[*:0]const u8) void {
    if (ptr) |p| {
        const slice = std.mem.span(p);
        allocator.free(@constCast(slice));
    }
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

fn clientFromJson(src: store_data.JsonClient) std.mem.Allocator.Error!types.Client {
    return .{
        .id = try allocString(src.id),
        .organization_id = src.organization_id,
        .name = try allocString(src.name),
        .email = try allocString(src.email),
        .phone = try allocString(src.phone),
        .address = try allocString(src.address),
        .city = try allocString(src.city),
        .country = try allocString(src.country),
        .created_at = try allocString(src.created_at),
    };
}

fn freeClientFields(c: types.Client) void {
    freeString(c.id);
    freeString(c.name);
    freeString(c.email);
    freeString(c.phone);
    freeString(c.address);
    freeString(c.city);
    freeString(c.country);
    freeString(c.created_at);
}

fn fetchClientsImpl() !types.ClientList {
    const data = store.get();
    var list: std.ArrayList(types.Client) = .empty;
    errdefer {
        for (list.items) |c| freeClientFields(c);
        list.deinit(allocator);
    }
    try list.ensureTotalCapacity(allocator, data.clients.len);
    for (data.clients) |src| {
        list.appendAssumeCapacity(try clientFromJson(src));
    }
    const slice = try list.toOwnedSlice(allocator);
    return .{ .ptr = slice.ptr, .len = slice.len };
}

export fn core_lib_fetch_clients() callconv(.c) types.ClientList {
    return fetchClientsImpl() catch .{ .ptr = null, .len = 0 };
}

export fn core_lib_free_clients(list: types.ClientList) void {
    const ptr = list.ptr orelse return;
    const slice = ptr[0..list.len];
    for (slice) |c| {
        freeClientFields(c);
    }
    allocator.free(@constCast(slice));
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

fn invoiceItemFromJson(src: store_data.JsonInvoiceItem) std.mem.Allocator.Error!types.InvoiceItem {
    return .{
        .description = try allocString(src.description),
        .quantity = src.quantity,
        .price = src.price,
    };
}

fn freeInvoiceItemFields(item: types.InvoiceItem) void {
    freeString(item.description);
}

fn allocInvoiceItemList(src: []const store_data.JsonInvoiceItem) !types.InvoiceItemList {
    var list: std.ArrayList(types.InvoiceItem) = .empty;
    errdefer {
        for (list.items) |item| freeInvoiceItemFields(item);
        list.deinit(allocator);
    }
    try list.ensureTotalCapacity(allocator, src.len);
    for (src) |s| {
        list.appendAssumeCapacity(try invoiceItemFromJson(s));
    }
    const slice = try list.toOwnedSlice(allocator);
    return .{ .ptr = slice.ptr, .len = slice.len };
}

fn freeInvoiceItemList(list: types.InvoiceItemList) void {
    const ptr = list.ptr orelse return;
    const slice = ptr[0..list.len];
    for (slice) |item| {
        freeInvoiceItemFields(item);
    }
    allocator.free(@constCast(slice));
}

fn invoiceStatusFromData(s: store_data.InvoiceStatus) types.InvoiceStatus {
    return switch (s) {
        .Draft => .Draft,
        .Pending => .Pending,
        .Paid => .Paid,
        .Overdue => .Overdue,
    };
}

fn invoiceFromJson(src: store_data.JsonInvoice) std.mem.Allocator.Error!types.Invoice {
    const items = try allocInvoiceItemList(src.items);
    errdefer freeInvoiceItemList(items);
    return .{
        .id = try allocString(src.id),
        .invoice_number = try allocString(src.invoice_number),
        .client_id = try allocString(src.client_id),
        .items = items,
        .tax_rate = src.tax_rate,
        .discount = src.discount,
        .status = invoiceStatusFromData(src.status),
        .signature = if (src.signature) |s| try allocString(s) else null,
        .issue_date = try allocString(src.issue_date),
        .due_date = try allocString(src.due_date),
        .currency = try allocString(src.currency),
        .notes = try allocString(src.notes),
        .created_at = try allocString(src.created_at),
    };
}

fn freeInvoiceFields(inv: types.Invoice) void {
    freeString(inv.id);
    freeString(inv.invoice_number);
    freeString(inv.client_id);
    freeInvoiceItemList(inv.items);
    freeString(inv.signature);
    freeString(inv.issue_date);
    freeString(inv.due_date);
    freeString(inv.currency);
    freeString(inv.notes);
    freeString(inv.created_at);
}

fn fetchInvoicesImpl() !types.InvoiceList {
    const data = store.get();
    var list: std.ArrayList(types.Invoice) = .empty;
    errdefer {
        for (list.items) |inv| freeInvoiceFields(inv);
        list.deinit(allocator);
    }
    try list.ensureTotalCapacity(allocator, data.invoices.len);
    for (data.invoices) |src| {
        list.appendAssumeCapacity(try invoiceFromJson(src));
    }
    const slice = try list.toOwnedSlice(allocator);
    return .{ .ptr = slice.ptr, .len = slice.len };
}

export fn core_lib_fetch_invoices() callconv(.c) types.InvoiceList {
    return fetchInvoicesImpl() catch .{ .ptr = null, .len = 0 };
}

export fn core_lib_free_invoices(list: types.InvoiceList) void {
    const ptr = list.ptr orelse return;
    const slice = ptr[0..list.len];
    for (slice) |inv| {
        freeInvoiceFields(inv);
    }
    allocator.free(@constCast(slice));
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

fn invoiceStatusCountFromJson(src: store_data.JsonInvoiceStatusCount) std.mem.Allocator.Error!types.InvoiceStatusCount {
    return .{
        .id = try allocString(src.id),
        .status = try allocString(src.status),
        .count = src.count,
    };
}

fn freeInvoiceStatusCountFields(isc: types.InvoiceStatusCount) void {
    freeString(isc.id);
    freeString(isc.status);
}

fn allocInvoiceStatusCountList(src: []const store_data.JsonInvoiceStatusCount) !types.InvoiceStatusCountList {
    var list: std.ArrayList(types.InvoiceStatusCount) = .empty;
    errdefer {
        for (list.items) |isc| freeInvoiceStatusCountFields(isc);
        list.deinit(allocator);
    }
    try list.ensureTotalCapacity(allocator, src.len);
    for (src) |s| {
        list.appendAssumeCapacity(try invoiceStatusCountFromJson(s));
    }
    const slice = try list.toOwnedSlice(allocator);
    return .{ .ptr = slice.ptr, .len = slice.len };
}

fn freeInvoiceStatusCountList(list: types.InvoiceStatusCountList) void {
    const ptr = list.ptr orelse return;
    const slice = ptr[0..list.len];
    for (slice) |isc| {
        freeInvoiceStatusCountFields(isc);
    }
    allocator.free(@constCast(slice));
}

fn monthlyRevenueFromJson(src: store_data.JsonMonthlyRevenue) std.mem.Allocator.Error!types.MonthlyRevenue {
    return .{
        .month = try allocString(src.month),
        .year = src.year,
        .currency = try allocString(src.currency),
        .amount = src.amount,
    };
}

fn freeMonthlyRevenueFields(mr: types.MonthlyRevenue) void {
    freeString(mr.month);
    freeString(mr.currency);
}

fn allocMonthlyRevenueList(src: []const store_data.JsonMonthlyRevenue) !types.MonthlyRevenueList {
    var list: std.ArrayList(types.MonthlyRevenue) = .empty;
    errdefer {
        for (list.items) |mr| freeMonthlyRevenueFields(mr);
        list.deinit(allocator);
    }
    try list.ensureTotalCapacity(allocator, src.len);
    for (src) |s| {
        list.appendAssumeCapacity(try monthlyRevenueFromJson(s));
    }
    const slice = try list.toOwnedSlice(allocator);
    return .{ .ptr = slice.ptr, .len = slice.len };
}

fn freeMonthlyRevenueList(list: types.MonthlyRevenueList) void {
    const ptr = list.ptr orelse return;
    const slice = ptr[0..list.len];
    for (slice) |mr| {
        freeMonthlyRevenueFields(mr);
    }
    allocator.free(@constCast(slice));
}

fn fetchDashboardImpl() !*types.Dashboard {
    const data = store.get();
    const dashboard = try allocator.create(types.Dashboard);
    errdefer allocator.destroy(dashboard);

    const invoices_status = try allocInvoiceStatusCountList(data.dashboard.invoices_status);
    errdefer freeInvoiceStatusCountList(invoices_status);

    const monthly_revenue = try allocMonthlyRevenueList(data.dashboard.monthly_revenue);
    errdefer freeMonthlyRevenueList(monthly_revenue);

    dashboard.* = .{
        .dashboard_stats = .{
            .total_revenue = data.dashboard.dashboard_stats.total_revenue,
            .paid_count = data.dashboard.dashboard_stats.paid_count,
            .pending_count = data.dashboard.dashboard_stats.pending_count,
            .overdue_count = data.dashboard.dashboard_stats.overdue_count,
            .currency = try allocString(data.dashboard.dashboard_stats.currency),
        },
        .invoices_status = invoices_status,
        .monthly_revenue = monthly_revenue,
    };
    return dashboard;
}

export fn core_lib_fetch_dashboard() callconv(.c) ?*types.Dashboard {
    return fetchDashboardImpl() catch null;
}

export fn core_lib_free_dashboard(dashboard: ?*types.Dashboard) void {
    const d = dashboard orelse return;
    freeString(d.dashboard_stats.currency);
    freeInvoiceStatusCountList(d.invoices_status);
    freeMonthlyRevenueList(d.monthly_revenue);
    allocator.destroy(d);
}

// ---------------------------------------------------------------------------
// Referral
// ---------------------------------------------------------------------------

fn fetchReferralDataImpl() !*types.ReferralData {
    const data = store.get();
    const referral = try allocator.create(types.ReferralData);
    errdefer allocator.destroy(referral);
    referral.* = .{
        .total_referrals = data.referral_data.total_referrals,
        .active_referrals = data.referral_data.active_referrals,
        .total_earnings = data.referral_data.total_earnings,
        .payout = data.referral_data.payout,
        .referral_code = try allocString(data.referral_data.referral_code),
    };
    return referral;
}

export fn core_lib_fetch_referral_data() callconv(.c) ?*types.ReferralData {
    return fetchReferralDataImpl() catch null;
}

export fn core_lib_free_referral_data(referral: ?*types.ReferralData) void {
    const r = referral orelse return;
    freeString(r.referral_code);
    allocator.destroy(r);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test "fetch and free clients" {
    const list = core_lib_fetch_clients();
    try std.testing.expectEqual(@as(usize, 30), list.len);
    core_lib_free_clients(list);
}

test "fetch and free invoices" {
    const list = core_lib_fetch_invoices();
    try std.testing.expectEqual(@as(usize, 30), list.len);
    core_lib_free_invoices(list);
}

test "fetch and free dashboard" {
    const d = core_lib_fetch_dashboard();
    try std.testing.expect(d != null);
    try std.testing.expectEqual(@as(usize, 4), d.?.invoices_status.len);
    try std.testing.expect(d.?.monthly_revenue.len > 0);
    core_lib_free_dashboard(d);
}

test "fetch and free referral data" {
    const r = core_lib_fetch_referral_data();
    try std.testing.expect(r != null);
    core_lib_free_referral_data(r);
}
