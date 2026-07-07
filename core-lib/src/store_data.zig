// Auto-generated from data.json. Do not edit manually.

pub const InvoiceStatus = enum { Draft, Pending, Paid, Overdue };

pub const JsonClient = struct { id: []const u8, organization_id: u64, name: []const u8, email: []const u8, phone: []const u8, address: []const u8, city: []const u8, country: []const u8, created_at: []const u8 };
pub const JsonInvoiceItem = struct { description: []const u8, quantity: u32, price: f64 };
pub const JsonInvoice = struct { id: []const u8, invoice_number: []const u8, client_id: []const u8, items: []const JsonInvoiceItem, tax_rate: f64, discount: f64, status: InvoiceStatus, signature: ?[]const u8, issue_date: []const u8, due_date: []const u8, currency: []const u8, notes: []const u8, created_at: []const u8 };
pub const JsonDashboardStats = struct { total_revenue: f64, paid_count: u64, pending_count: u64, overdue_count: u64, currency: []const u8 };
pub const JsonInvoiceStatusCount = struct { id: []const u8, status: []const u8, count: u64 };
pub const JsonMonthlyRevenue = struct { month: []const u8, year: u16, currency: []const u8, amount: u32 };
pub const JsonDashboard = struct { dashboard_stats: JsonDashboardStats, invoices_status: []const JsonInvoiceStatusCount, monthly_revenue: []const JsonMonthlyRevenue };
pub const JsonReferralData = struct { total_referrals: u64, active_referrals: u64, total_earnings: f64, payout: f64, referral_code: []const u8 };

pub const clients = &[_]JsonClient{
    .{ .id = "client_001", .organization_id = 1, .name = "Acme Corp", .email = "contact@acme.com", .phone = "+1-416-555-1001", .address = "100 King St W", .city = "Toronto", .country = "Canada", .created_at = "2026-01-01T09:00:00Z" },
    .{ .id = "client_002", .organization_id = 1, .name = "Northwind Traders", .email = "hello@northwind.ca", .phone = "+1-416-555-1002", .address = "220 Bay St", .city = "Toronto", .country = "Canada", .created_at = "2026-01-02T09:00:00Z" },
    .{ .id = "client_003", .organization_id = 1, .name = "Globex Inc.", .email = "info@globex.com", .phone = "+1-416-555-1003", .address = "15 Front St E", .city = "Toronto", .country = "Canada", .created_at = "2026-01-03T09:00:00Z" },
    .{ .id = "client_004", .organization_id = 1, .name = "Initech", .email = "support@initech.com", .phone = "+1-416-555-1004", .address = "45 Adelaide St", .city = "Toronto", .country = "Canada", .created_at = "2026-01-04T09:00:00Z" },
    .{ .id = "client_005", .organization_id = 1, .name = "Umbrella Group", .email = "sales@umbrella.com", .phone = "+1-416-555-1005", .address = "88 Queen St", .city = "Toronto", .country = "Canada", .created_at = "2026-01-05T09:00:00Z" },
    .{ .id = "client_006", .organization_id = 1, .name = "Wayne Enterprises", .email = "contact@wayne.com", .phone = "+1-416-555-1006", .address = "12 Richmond St", .city = "Toronto", .country = "Canada", .created_at = "2026-01-06T09:00:00Z" },
    .{ .id = "client_007", .organization_id = 2, .name = "Stark Industries", .email = "info@stark.com", .phone = "+1-604-555-1007", .address = "500 Georgia St", .city = "Vancouver", .country = "Canada", .created_at = "2026-01-07T09:00:00Z" },
    .{ .id = "client_008", .organization_id = 2, .name = "Wonka Foods", .email = "hello@wonka.com", .phone = "+1-604-555-1008", .address = "101 Granville St", .city = "Vancouver", .country = "Canada", .created_at = "2026-01-08T09:00:00Z" },
    .{ .id = "client_009", .organization_id = 2, .name = "Hooli", .email = "admin@hooli.com", .phone = "+1-604-555-1009", .address = "88 Robson St", .city = "Vancouver", .country = "Canada", .created_at = "2026-01-09T09:00:00Z" },
    .{ .id = "client_010", .organization_id = 2, .name = "Pied Piper", .email = "team@piedpiper.io", .phone = "+1-604-555-1010", .address = "700 Burrard St", .city = "Vancouver", .country = "Canada", .created_at = "2026-01-10T09:00:00Z" },
    .{ .id = "client_011", .organization_id = 3, .name = "Soylent Corp", .email = "info@soylent.com", .phone = "+1-514-555-1011", .address = "50 Rue Sainte-Catherine", .city = "Montreal", .country = "Canada", .created_at = "2026-01-11T09:00:00Z" },
    .{ .id = "client_012", .organization_id = 3, .name = "Cyberdyne Systems", .email = "contact@cyberdyne.com", .phone = "+1-514-555-1012", .address = "99 Sherbrooke St", .city = "Montreal", .country = "Canada", .created_at = "2026-01-12T09:00:00Z" },
    .{ .id = "client_013", .organization_id = 3, .name = "Oscorp", .email = "hello@oscorp.com", .phone = "+1-514-555-1013", .address = "18 Peel St", .city = "Montreal", .country = "Canada", .created_at = "2026-01-13T09:00:00Z" },
    .{ .id = "client_014", .organization_id = 3, .name = "Tyrell Corporation", .email = "support@tyrell.com", .phone = "+1-514-555-1014", .address = "500 René-Lévesque Blvd", .city = "Montreal", .country = "Canada", .created_at = "2026-01-14T09:00:00Z" },
    .{ .id = "client_015", .organization_id = 4, .name = "Black Mesa", .email = "admin@blackmesa.com", .phone = "+1-403-555-1015", .address = "80 8 Ave SW", .city = "Calgary", .country = "Canada", .created_at = "2026-01-15T09:00:00Z" },
    .{ .id = "client_016", .organization_id = 4, .name = "Aperture Science", .email = "lab@aperture.com", .phone = "+1-403-555-1016", .address = "25 Stephen Ave", .city = "Calgary", .country = "Canada", .created_at = "2026-01-16T09:00:00Z" },
    .{ .id = "client_017", .organization_id = 4, .name = "LexCorp", .email = "sales@lexcorp.com", .phone = "+1-403-555-1017", .address = "120 Centre St", .city = "Calgary", .country = "Canada", .created_at = "2026-01-17T09:00:00Z" },
    .{ .id = "client_018", .organization_id = 4, .name = "Massive Dynamic", .email = "info@massivedynamic.com", .phone = "+1-403-555-1018", .address = "10 4 Ave SW", .city = "Calgary", .country = "Canada", .created_at = "2026-01-18T09:00:00Z" },
    .{ .id = "client_019", .organization_id = 5, .name = "Vehement Capital", .email = "contact@vehement.com", .phone = "+1-613-555-1019", .address = "90 Wellington St", .city = "Ottawa", .country = "Canada", .created_at = "2026-01-19T09:00:00Z" },
    .{ .id = "client_020", .organization_id = 5, .name = "Blue Yonder", .email = "hello@blueyonder.com", .phone = "+1-613-555-1020", .address = "55 Elgin St", .city = "Ottawa", .country = "Canada", .created_at = "2026-01-20T09:00:00Z" },
    .{ .id = "client_021", .organization_id = 5, .name = "Quantum Labs", .email = "info@quantumlabs.com", .phone = "+1-613-555-1021", .address = "120 Bank St", .city = "Ottawa", .country = "Canada", .created_at = "2026-01-21T09:00:00Z" },
    .{ .id = "client_022", .organization_id = 5, .name = "Fusion Tech", .email = "support@fusiontech.com", .phone = "+1-613-555-1022", .address = "200 Rideau St", .city = "Ottawa", .country = "Canada", .created_at = "2026-01-22T09:00:00Z" },
    .{ .id = "client_023", .organization_id = 6, .name = "Evergreen Solutions", .email = "contact@evergreen.com", .phone = "+1-902-555-1023", .address = "75 Spring Garden Rd", .city = "Halifax", .country = "Canada", .created_at = "2026-01-23T09:00:00Z" },
    .{ .id = "client_024", .organization_id = 6, .name = "Maple Innovations", .email = "info@mapleinnovations.ca", .phone = "+1-902-555-1024", .address = "30 Barrington St", .city = "Halifax", .country = "Canada", .created_at = "2026-01-24T09:00:00Z" },
    .{ .id = "client_025", .organization_id = 6, .name = "Nova Systems", .email = "hello@novasystems.ca", .phone = "+1-902-555-1025", .address = "200 Hollis St", .city = "Halifax", .country = "Canada", .created_at = "2026-01-25T09:00:00Z" },
    .{ .id = "client_026", .organization_id = 6, .name = "Prairie Software", .email = "sales@prairiesoftware.ca", .phone = "+1-306-555-1026", .address = "100 2nd Ave", .city = "Saskatoon", .country = "Canada", .created_at = "2026-01-26T09:00:00Z" },
    .{ .id = "client_027", .organization_id = 7, .name = "Northern Logistics", .email = "info@northernlogistics.ca", .phone = "+1-204-555-1027", .address = "400 Main St", .city = "Winnipeg", .country = "Canada", .created_at = "2026-01-27T09:00:00Z" },
    .{ .id = "client_028", .organization_id = 7, .name = "Polar Energy", .email = "contact@polarenergy.ca", .phone = "+1-204-555-1028", .address = "50 Portage Ave", .city = "Winnipeg", .country = "Canada", .created_at = "2026-01-28T09:00:00Z" },
    .{ .id = "client_029", .organization_id = 7, .name = "Redwood Consulting", .email = "hello@redwoodconsulting.ca", .phone = "+1-204-555-1029", .address = "300 Graham Ave", .city = "Winnipeg", .country = "Canada", .created_at = "2026-01-29T09:00:00Z" },
    .{ .id = "client_030", .organization_id = 7, .name = "Aurora Digital", .email = "team@auroradigital.ca", .phone = "+1-204-555-1030", .address = "15 Broadway", .city = "Winnipeg", .country = "Canada", .created_at = "2026-01-30T09:00:00Z" },
};

pub const invoices = &[_]JsonInvoice{
    .{ .id = "inv_0001", .invoice_number = "INV-2026-0001", .client_id = "client_001", .items = &[_]JsonInvoiceItem{
        .{ .description = "Website Design", .quantity = 1, .price = 1200.0 },
    }, .tax_rate = 0.13, .discount = 50.0, .status = .Paid, .signature = "John Doe", .issue_date = "2026-01-02", .due_date = "2026-02-01", .currency = "CAD", .notes = "Paid via bank transfer.", .created_at = "2026-01-02T09:00:00Z" },
    .{ .id = "inv_0002", .invoice_number = "INV-2026-0002", .client_id = "client_002", .items = &[_]JsonInvoiceItem{
        .{ .description = "SEO Services", .quantity = 2, .price = 450.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Pending, .signature = null, .issue_date = "2026-01-05", .due_date = "2026-02-04", .currency = "CAD", .notes = "", .created_at = "2026-01-05T11:20:00Z" },
    .{ .id = "inv_0003", .invoice_number = "INV-2026-0003", .client_id = "client_003", .items = &[_]JsonInvoiceItem{
        .{ .description = "Mobile App Development", .quantity = 1, .price = 8500.0 },
    }, .tax_rate = 0.13, .discount = 500.0, .status = .Draft, .signature = null, .issue_date = "2026-01-07", .due_date = "2026-02-06", .currency = "CAD", .notes = "Awaiting approval.", .created_at = "2026-01-07T14:00:00Z" },
    .{ .id = "inv_0004", .invoice_number = "INV-2026-0004", .client_id = "client_004", .items = &[_]JsonInvoiceItem{
        .{ .description = "Cloud Hosting", .quantity = 12, .price = 80.0 },
    }, .tax_rate = 0.13, .discount = 100.0, .status = .Overdue, .signature = "Jane Smith", .issue_date = "2026-01-10", .due_date = "2026-02-09", .currency = "CAD", .notes = "Reminder sent.", .created_at = "2026-01-10T08:30:00Z" },
    .{ .id = "inv_0005", .invoice_number = "INV-2026-0005", .client_id = "client_005", .items = &[_]JsonInvoiceItem{
        .{ .description = "IT Consulting", .quantity = 10, .price = 150.0 },
    }, .tax_rate = 0.13, .discount = 75.0, .status = .Paid, .signature = "Michael Lee", .issue_date = "2026-01-12", .due_date = "2026-02-11", .currency = "CAD", .notes = "", .created_at = "2026-01-12T10:15:00Z" },
    .{ .id = "inv_0006", .invoice_number = "INV-2026-0006", .client_id = "client_006", .items = &[_]JsonInvoiceItem{
        .{ .description = "Logo Design", .quantity = 1, .price = 600.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Pending, .signature = null, .issue_date = "2026-01-15", .due_date = "2026-02-14", .currency = "CAD", .notes = "", .created_at = "2026-01-15T09:30:00Z" },
    .{ .id = "inv_0007", .invoice_number = "INV-2026-0007", .client_id = "client_007", .items = &[_]JsonInvoiceItem{
        .{ .description = "API Integration", .quantity = 20, .price = 120.0 },
    }, .tax_rate = 0.13, .discount = 200.0, .status = .Paid, .signature = "Sarah Brown", .issue_date = "2026-01-18", .due_date = "2026-02-17", .currency = "CAD", .notes = "", .created_at = "2026-01-18T13:00:00Z" },
    .{ .id = "inv_0008", .invoice_number = "INV-2026-0008", .client_id = "client_008", .items = &[_]JsonInvoiceItem{
        .{ .description = "Database Migration", .quantity = 1, .price = 2400.0 },
    }, .tax_rate = 0.13, .discount = 100.0, .status = .Draft, .signature = null, .issue_date = "2026-01-20", .due_date = "2026-02-19", .currency = "CAD", .notes = "Pending client review.", .created_at = "2026-01-20T15:45:00Z" },
    .{ .id = "inv_0009", .invoice_number = "INV-2026-0009", .client_id = "client_009", .items = &[_]JsonInvoiceItem{
        .{ .description = "Content Writing", .quantity = 25, .price = 45.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Paid, .signature = "Emily Davis", .issue_date = "2026-01-22", .due_date = "2026-02-21", .currency = "CAD", .notes = "", .created_at = "2026-01-22T12:10:00Z" },
    .{ .id = "inv_0010", .invoice_number = "INV-2026-0010", .client_id = "client_010", .items = &[_]JsonInvoiceItem{
        .{ .description = "Marketing Campaign", .quantity = 1, .price = 3500.0 },
    }, .tax_rate = 0.13, .discount = 250.0, .status = .Overdue, .signature = null, .issue_date = "2026-01-25", .due_date = "2026-02-24", .currency = "CAD", .notes = "Second reminder issued.", .created_at = "2026-01-25T10:00:00Z" },
    .{ .id = "inv_0011", .invoice_number = "INV-2026-0011", .client_id = "client_011", .items = &[_]JsonInvoiceItem{
        .{ .description = "Security Audit", .quantity = 1, .price = 1800.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Pending, .signature = null, .issue_date = "2026-02-01", .due_date = "2026-03-03", .currency = "CAD", .notes = "", .created_at = "2026-02-01T09:00:00Z" },
    .{ .id = "inv_0012", .invoice_number = "INV-2026-0012", .client_id = "client_012", .items = &[_]JsonInvoiceItem{
        .{ .description = "UX Research", .quantity = 15, .price = 95.0 },
    }, .tax_rate = 0.13, .discount = 100.0, .status = .Paid, .signature = "Alice", .issue_date = "2026-02-03", .due_date = "2026-03-05", .currency = "CAD", .notes = "", .created_at = "2026-02-03T08:45:00Z" },
    .{ .id = "inv_0013", .invoice_number = "INV-2026-0013", .client_id = "client_013", .items = &[_]JsonInvoiceItem{
        .{ .description = "Video Editing", .quantity = 8, .price = 110.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Draft, .signature = null, .issue_date = "2026-02-05", .due_date = "2026-03-07", .currency = "CAD", .notes = "", .created_at = "2026-02-05T13:00:00Z" },
    .{ .id = "inv_0014", .invoice_number = "INV-2026-0014", .client_id = "client_014", .items = &[_]JsonInvoiceItem{
        .{ .description = "Graphic Design", .quantity = 12, .price = 70.0 },
    }, .tax_rate = 0.13, .discount = 20.0, .status = .Pending, .signature = null, .issue_date = "2026-02-08", .due_date = "2026-03-10", .currency = "CAD", .notes = "", .created_at = "2026-02-08T09:20:00Z" },
    .{ .id = "inv_0015", .invoice_number = "INV-2026-0015", .client_id = "client_015", .items = &[_]JsonInvoiceItem{
        .{ .description = "Software License", .quantity = 30, .price = 40.0 },
    }, .tax_rate = 0.13, .discount = 150.0, .status = .Paid, .signature = "Robert", .issue_date = "2026-02-10", .due_date = "2026-03-12", .currency = "CAD", .notes = "", .created_at = "2026-02-10T16:30:00Z" },
    .{ .id = "inv_0016", .invoice_number = "INV-2026-0016", .client_id = "client_016", .items = &[_]JsonInvoiceItem{
        .{ .description = "Maintenance", .quantity = 6, .price = 200.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Pending, .signature = null, .issue_date = "2026-02-12", .due_date = "2026-03-14", .currency = "CAD", .notes = "", .created_at = "2026-02-12T11:00:00Z" },
    .{ .id = "inv_0017", .invoice_number = "INV-2026-0017", .client_id = "client_017", .items = &[_]JsonInvoiceItem{
        .{ .description = "Training", .quantity = 2, .price = 900.0 },
    }, .tax_rate = 0.13, .discount = 50.0, .status = .Paid, .signature = "David", .issue_date = "2026-02-15", .due_date = "2026-03-17", .currency = "CAD", .notes = "", .created_at = "2026-02-15T09:00:00Z" },
    .{ .id = "inv_0018", .invoice_number = "INV-2026-0018", .client_id = "client_018", .items = &[_]JsonInvoiceItem{
        .{ .description = "AI Consultation", .quantity = 5, .price = 500.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Draft, .signature = null, .issue_date = "2026-02-18", .due_date = "2026-03-20", .currency = "CAD", .notes = "", .created_at = "2026-02-18T10:30:00Z" },
    .{ .id = "inv_0019", .invoice_number = "INV-2026-0019", .client_id = "client_019", .items = &[_]JsonInvoiceItem{
        .{ .description = "Server Setup", .quantity = 3, .price = 750.0 },
    }, .tax_rate = 0.13, .discount = 100.0, .status = .Pending, .signature = null, .issue_date = "2026-02-20", .due_date = "2026-03-22", .currency = "CAD", .notes = "", .created_at = "2026-02-20T14:15:00Z" },
    .{ .id = "inv_0020", .invoice_number = "INV-2026-0020", .client_id = "client_020", .items = &[_]JsonInvoiceItem{
        .{ .description = "Email Hosting", .quantity = 24, .price = 12.5 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Overdue, .signature = null, .issue_date = "2026-02-23", .due_date = "2026-03-25", .currency = "CAD", .notes = "", .created_at = "2026-02-23T08:00:00Z" },
    .{ .id = "inv_0021", .invoice_number = "INV-2026-0021", .client_id = "client_021", .items = &[_]JsonInvoiceItem{
        .{ .description = "Data Analytics", .quantity = 12, .price = 130.0 },
    }, .tax_rate = 0.13, .discount = 120.0, .status = .Paid, .signature = "Chris", .issue_date = "2026-02-25", .due_date = "2026-03-27", .currency = "CAD", .notes = "", .created_at = "2026-02-25T15:30:00Z" },
    .{ .id = "inv_0022", .invoice_number = "INV-2026-0022", .client_id = "client_022", .items = &[_]JsonInvoiceItem{
        .{ .description = "DevOps Support", .quantity = 18, .price = 95.0 },
    }, .tax_rate = 0.13, .discount = 80.0, .status = .Pending, .signature = null, .issue_date = "2026-02-27", .due_date = "2026-03-29", .currency = "CAD", .notes = "", .created_at = "2026-02-27T09:40:00Z" },
    .{ .id = "inv_0023", .invoice_number = "INV-2026-0023", .client_id = "client_023", .items = &[_]JsonInvoiceItem{
        .{ .description = "Photography", .quantity = 1, .price = 950.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Draft, .signature = null, .issue_date = "2026-03-01", .due_date = "2026-03-31", .currency = "CAD", .notes = "", .created_at = "2026-03-01T12:00:00Z" },
    .{ .id = "inv_0024", .invoice_number = "INV-2026-0024", .client_id = "client_024", .items = &[_]JsonInvoiceItem{
        .{ .description = "Copywriting", .quantity = 40, .price = 30.0 },
    }, .tax_rate = 0.13, .discount = 60.0, .status = .Paid, .signature = "Emma", .issue_date = "2026-03-03", .due_date = "2026-04-02", .currency = "CAD", .notes = "", .created_at = "2026-03-03T09:10:00Z" },
    .{ .id = "inv_0025", .invoice_number = "INV-2026-0025", .client_id = "client_025", .items = &[_]JsonInvoiceItem{
        .{ .description = "Brand Strategy", .quantity = 1, .price = 4200.0 },
    }, .tax_rate = 0.13, .discount = 300.0, .status = .Overdue, .signature = null, .issue_date = "2026-03-05", .due_date = "2026-04-04", .currency = "CAD", .notes = "", .created_at = "2026-03-05T08:50:00Z" },
    .{ .id = "inv_0026", .invoice_number = "INV-2026-0026", .client_id = "client_026", .items = &[_]JsonInvoiceItem{
        .{ .description = "Network Monitoring", .quantity = 6, .price = 250.0 },
    }, .tax_rate = 0.13, .discount = 0.0, .status = .Pending, .signature = null, .issue_date = "2026-03-07", .due_date = "2026-04-06", .currency = "CAD", .notes = "", .created_at = "2026-03-07T11:15:00Z" },
    .{ .id = "inv_0027", .invoice_number = "INV-2026-0027", .client_id = "client_027", .items = &[_]JsonInvoiceItem{
        .{ .description = "CRM Integration", .quantity = 2, .price = 1400.0 },
    }, .tax_rate = 0.13, .discount = 75.0, .status = .Paid, .signature = "Daniel", .issue_date = "2026-03-10", .due_date = "2026-04-09", .currency = "CAD", .notes = "", .created_at = "2026-03-10T10:00:00Z" },
    .{ .id = "inv_0028", .invoice_number = "INV-2026-0028", .client_id = "client_028", .items = &[_]JsonInvoiceItem{
        .{ .description = "UI Development", .quantity = 60, .price = 55.0 },
    }, .tax_rate = 0.13, .discount = 250.0, .status = .Draft, .signature = null, .issue_date = "2026-03-12", .due_date = "2026-04-11", .currency = "CAD", .notes = "", .created_at = "2026-03-12T14:00:00Z" },
    .{ .id = "inv_0029", .invoice_number = "INV-2026-0029", .client_id = "client_029", .items = &[_]JsonInvoiceItem{
        .{ .description = "QA Testing", .quantity = 40, .price = 45.0 },
    }, .tax_rate = 0.13, .discount = 90.0, .status = .Pending, .signature = null, .issue_date = "2026-03-15", .due_date = "2026-04-14", .currency = "CAD", .notes = "", .created_at = "2026-03-15T13:10:00Z" },
    .{ .id = "inv_0030", .invoice_number = "INV-2026-0030", .client_id = "client_030", .items = &[_]JsonInvoiceItem{
        .{ .description = "Annual Support Contract", .quantity = 1, .price = 5000.0 },
    }, .tax_rate = 0.13, .discount = 500.0, .status = .Paid, .signature = "Sophia", .issue_date = "2026-03-18", .due_date = "2026-04-17", .currency = "CAD", .notes = "Thank you for your continued business.", .created_at = "2026-03-18T09:30:00Z" },
};

pub const dashboard_stats = JsonDashboardStats{ .total_revenue = 125000.0, .paid_count = 48, .pending_count = 12, .overdue_count = 5, .currency = "USD" };

pub const invoices_status = &[_]JsonInvoiceStatusCount{
    .{ .id = "some-id-01", .status = "Paid", .count = 48 },
    .{ .id = "some-id-02", .status = "Sent", .count = 25 },
    .{ .id = "some-id-03", .status = "Draft", .count = 15 },
    .{ .id = "some-id-04", .status = "Overdue", .count = 5 },
};

pub const monthly_revenue = &[_]JsonMonthlyRevenue{
    .{ .month = "Jan", .year = 2026, .currency = "USD", .amount = 12000 },
    .{ .month = "Jan", .year = 2026, .currency = "EUR", .amount = 8500 },
    .{ .month = "Jan", .year = 2026, .currency = "GBP", .amount = 6200 },
    .{ .month = "Jan", .year = 2026, .currency = "NGN", .amount = 150000 },
    .{ .month = "Feb", .year = 2026, .currency = "USD", .amount = 15000 },
    .{ .month = "Feb", .year = 2026, .currency = "EUR", .amount = 9200 },
    .{ .month = "Feb", .year = 2026, .currency = "GBP", .amount = 7100 },
    .{ .month = "Feb", .year = 2026, .currency = "NGN", .amount = 175000 },
    .{ .month = "Mar", .year = 2026, .currency = "USD", .amount = 18000 },
    .{ .month = "Mar", .year = 2026, .currency = "EUR", .amount = 11000 },
    .{ .month = "Mar", .year = 2026, .currency = "GBP", .amount = 8000 },
    .{ .month = "Mar", .year = 2026, .currency = "NGN", .amount = 200000 },
    .{ .month = "Apr", .year = 2026, .currency = "USD", .amount = 22000 },
    .{ .month = "Apr", .year = 2026, .currency = "EUR", .amount = 13500 },
    .{ .month = "Apr", .year = 2026, .currency = "GBP", .amount = 9500 },
    .{ .month = "Apr", .year = 2026, .currency = "NGN", .amount = 225000 },
    .{ .month = "May", .year = 2026, .currency = "USD", .amount = 19500 },
    .{ .month = "May", .year = 2026, .currency = "EUR", .amount = 12000 },
    .{ .month = "May", .year = 2026, .currency = "GBP", .amount = 8700 },
    .{ .month = "May", .year = 2026, .currency = "NGN", .amount = 210000 },
    .{ .month = "Jun", .year = 2026, .currency = "USD", .amount = 25000 },
    .{ .month = "Jun", .year = 2026, .currency = "EUR", .amount = 15500 },
    .{ .month = "Jun", .year = 2026, .currency = "GBP", .amount = 11000 },
    .{ .month = "Jun", .year = 2026, .currency = "NGN", .amount = 250000 },
    .{ .month = "Jan", .year = 2025, .currency = "USD", .amount = 10000 },
    .{ .month = "Jan", .year = 2025, .currency = "EUR", .amount = 7200 },
    .{ .month = "Jan", .year = 2025, .currency = "GBP", .amount = 5400 },
    .{ .month = "Jan", .year = 2025, .currency = "NGN", .amount = 130000 },
    .{ .month = "Feb", .year = 2025, .currency = "USD", .amount = 11500 },
    .{ .month = "Feb", .year = 2025, .currency = "EUR", .amount = 8000 },
    .{ .month = "Feb", .year = 2025, .currency = "GBP", .amount = 6000 },
    .{ .month = "Feb", .year = 2025, .currency = "NGN", .amount = 145000 },
    .{ .month = "Mar", .year = 2025, .currency = "USD", .amount = 13000 },
    .{ .month = "Mar", .year = 2025, .currency = "EUR", .amount = 8800 },
    .{ .month = "Mar", .year = 2025, .currency = "GBP", .amount = 6700 },
    .{ .month = "Mar", .year = 2025, .currency = "NGN", .amount = 160000 },
    .{ .month = "Apr", .year = 2025, .currency = "USD", .amount = 14500 },
    .{ .month = "Apr", .year = 2025, .currency = "EUR", .amount = 9500 },
    .{ .month = "Apr", .year = 2025, .currency = "GBP", .amount = 7200 },
    .{ .month = "Apr", .year = 2025, .currency = "NGN", .amount = 175000 },
    .{ .month = "May", .year = 2025, .currency = "USD", .amount = 16000 },
    .{ .month = "May", .year = 2025, .currency = "EUR", .amount = 10200 },
    .{ .month = "May", .year = 2025, .currency = "GBP", .amount = 7800 },
    .{ .month = "May", .year = 2025, .currency = "NGN", .amount = 190000 },
    .{ .month = "Jun", .year = 2025, .currency = "USD", .amount = 17500 },
    .{ .month = "Jun", .year = 2025, .currency = "EUR", .amount = 11000 },
    .{ .month = "Jun", .year = 2025, .currency = "GBP", .amount = 8300 },
    .{ .month = "Jun", .year = 2025, .currency = "NGN", .amount = 200000 },
};

pub const referral_data = JsonReferralData{ .total_referrals = 12, .active_referrals = 8, .total_earnings = 120.0, .payout = 120.0, .referral_code = "ACME125FT" };
