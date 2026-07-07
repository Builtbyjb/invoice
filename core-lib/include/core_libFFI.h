#ifndef CORE_LIB_FFI_H
#define CORE_LIB_FFI_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    CoreInvoiceStatusDraft = 0,
    CoreInvoiceStatusPending = 1,
    CoreInvoiceStatusPaid = 2,
    CoreInvoiceStatusOverdue = 3,
} CoreInvoiceStatus;

typedef struct {
    const char* id;
    uint64_t organization_id;
    const char* name;
    const char* email;
    const char* phone;
    const char* address;
    const char* city;
    const char* country;
    const char* created_at;
} CoreClient;

typedef struct {
    const CoreClient* ptr;
    size_t len;
} CoreClientList;

typedef struct {
    const char* description;
    uint32_t quantity;
    double price;
} CoreInvoiceItem;

typedef struct {
    const CoreInvoiceItem* ptr;
    size_t len;
} CoreInvoiceItemList;

typedef struct {
    const char* id;
    const char* invoice_number;
    const char* client_id;
    CoreInvoiceItemList items;
    double tax_rate;
    double discount;
    CoreInvoiceStatus status;
    const char* signature; /* NULL when absent */
    const char* issue_date;
    const char* due_date;
    const char* currency;
    const char* notes;
    const char* created_at;
} CoreInvoice;

typedef struct {
    const CoreInvoice* ptr;
    size_t len;
} CoreInvoiceList;

typedef struct {
    double total_revenue;
    uint64_t paid_count;
    uint64_t pending_count;
    uint64_t overdue_count;
    const char* currency;
} CoreDashboardStats;

typedef struct {
    const char* id;
    const char* status;
    uint64_t count;
} CoreInvoiceStatusCount;

typedef struct {
    const CoreInvoiceStatusCount* ptr;
    size_t len;
} CoreInvoiceStatusCountList;

typedef struct {
    const char* month;
    uint16_t year;
    const char* currency;
    uint32_t amount;
} CoreMonthlyRevenue;

typedef struct {
    const CoreMonthlyRevenue* ptr;
    size_t len;
} CoreMonthlyRevenueList;

typedef struct {
    CoreDashboardStats dashboard_stats;
    CoreInvoiceStatusCountList invoices_status;
    CoreMonthlyRevenueList monthly_revenue;
} CoreDashboard;

typedef struct {
    uint64_t total_referrals;
    uint64_t active_referrals;
    double total_earnings;
    double payout;
    const char* referral_code;
} CoreReferralData;

/* All returned responses are heap-allocated and must be freed with the
   matching core_lib_free_* function. */

CoreClientList core_lib_fetch_clients(void);
void core_lib_free_clients(CoreClientList list);

CoreInvoiceList core_lib_fetch_invoices(void);
void core_lib_free_invoices(CoreInvoiceList list);

CoreDashboard* core_lib_fetch_dashboard(void);
void core_lib_free_dashboard(CoreDashboard* dashboard);

CoreReferralData* core_lib_fetch_referral_data(void);
void core_lib_free_referral_data(CoreReferralData* referral);

#ifdef __cplusplus
}
#endif

#endif /* CORE_LIB_FFI_H */
