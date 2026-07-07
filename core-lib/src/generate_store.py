import json
import os

# Read JSON
json_path = os.path.join(os.path.dirname(__file__), "data.json")
with open(json_path, "r") as f:
    data = json.load(f)

lines = []
lines.append("// Auto-generated from data.json. Do not edit manually.")
lines.append("")
lines.append("pub const InvoiceStatus = enum { Draft, Pending, Paid, Overdue };")
lines.append("")
lines.append("pub const JsonClient = struct { id: []const u8, organization_id: u64, name: []const u8, email: []const u8, phone: []const u8, address: []const u8, city: []const u8, country: []const u8, created_at: []const u8 };")
lines.append("pub const JsonInvoiceItem = struct { description: []const u8, quantity: u32, price: f64 };")
lines.append("pub const JsonInvoice = struct { id: []const u8, invoice_number: []const u8, client_id: []const u8, items: []const JsonInvoiceItem, tax_rate: f64, discount: f64, status: InvoiceStatus, signature: ?[]const u8, issue_date: []const u8, due_date: []const u8, currency: []const u8, notes: []const u8, created_at: []const u8 };")
lines.append("pub const JsonDashboardStats = struct { total_revenue: f64, paid_count: u64, pending_count: u64, overdue_count: u64, currency: []const u8 };")
lines.append("pub const JsonInvoiceStatusCount = struct { id: []const u8, status: []const u8, count: u64 };")
lines.append("pub const JsonMonthlyRevenue = struct { month: []const u8, year: u16, currency: []const u8, amount: u32 };")
lines.append("pub const JsonDashboard = struct { dashboard_stats: JsonDashboardStats, invoices_status: []const JsonInvoiceStatusCount, monthly_revenue: []const JsonMonthlyRevenue };")
lines.append("pub const JsonReferralData = struct { total_referrals: u64, active_referrals: u64, total_earnings: f64, payout: f64, referral_code: []const u8 };")
lines.append("")

# Clients
lines.append("pub const clients = &[_]JsonClient{")
for c in data["clients"]:
    lines.append(f'    .{{ .id = "{c["id"]}", .organization_id = {c["organization_id"]}, .name = "{c["name"]}", .email = "{c["email"]}", .phone = "{c["phone"]}", .address = "{c["address"]}", .city = "{c["city"]}", .country = "{c["country"]}", .created_at = "{c["created_at"]}" }},')
lines.append("};")
lines.append("")

# Invoices
lines.append("pub const invoices = &[_]JsonInvoice{")
for inv in data["invoices"]:
    items_lines = []
    for it in inv["items"]:
        items_lines.append(f'            .{{ .description = "{it["description"]}", .quantity = {it["quantity"]}, .price = {it["price"]} }},')
    items_str = "\n".join(items_lines)
    sig = "null" if inv["signature"] is None else f'"{inv["signature"]}"'
    lines.append(f'''    .{{
        .id = "{inv["id"]}",
        .invoice_number = "{inv["invoice_number"]}",
        .client_id = "{inv["client_id"]}",
        .items = &[_]JsonInvoiceItem{{
{items_str}
        }},
        .tax_rate = {inv["tax_rate"]},
        .discount = {inv["discount"]},
        .status = .{inv["status"]},
        .signature = {sig},
        .issue_date = "{inv["issue_date"]}",
        .due_date = "{inv["due_date"]}",
        .currency = "{inv["currency"]}",
        .notes = "{inv["notes"]}",
        .created_at = "{inv["created_at"]}"
    }},''')
lines.append("};")
lines.append("")

# Dashboard
lines.append("pub const dashboard_stats = JsonDashboardStats{")
ds = data["dashboard"]["dashboard_stats"]
lines.append(f'    .total_revenue = {ds["total_revenue"]},')
lines.append(f'    .paid_count = {ds["paid_count"]},')
lines.append(f'    .pending_count = {ds["pending_count"]},')
lines.append(f'    .overdue_count = {ds["overdue_count"]},')
lines.append(f'    .currency = "{ds["currency"]}"')
lines.append("};")
lines.append("")

lines.append("pub const invoices_status = &[_]JsonInvoiceStatusCount{")
for sc in data["dashboard"]["invoices_status"]:
    lines.append(f'    .{{ .id = "{sc["id"]}", .status = "{sc["status"]}", .count = {sc["count"]} }},')
lines.append("};")
lines.append("")

lines.append("pub const monthly_revenue = &[_]JsonMonthlyRevenue{")
for mr in data["dashboard"]["monthly_revenue"]:
    lines.append(f'    .{{ .month = "{mr["month"]}", .year = {mr["year"]}, .currency = "{mr["currency"]}", .amount = {mr["amount"]} }},')
lines.append("};")
lines.append("")

# Referral
lines.append("pub const referral_data = JsonReferralData{")
rd = data["referral_data"]
lines.append(f'    .total_referrals = {rd["total_referrals"]},')
lines.append(f'    .active_referrals = {rd["active_referrals"]},')
lines.append(f'    .total_earnings = {rd["total_earnings"]},')
lines.append(f'    .payout = {rd["payout"]},')
lines.append(f'    .referral_code = "{rd["referral_code"]}"')
lines.append("};")
lines.append("")

output = "\n".join(lines)
out_path = os.path.join(os.path.dirname(__file__), "store_data.zig")
with open(out_path, "w") as f:
    f.write(output)
print(f"Generated {out_path}")
