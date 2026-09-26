export const qk = {
  clients: {
    all: ['clients'] as const,
    list: () => ['clients', 'list'] as const,
    search: (q: string) => ['clients', 'search', q] as const,
    detail: (id: string) => ['clients', 'detail', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    list: () => ['invoices', 'list'] as const,
    detail: (id: string) => ['invoices', 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: ['dashboard', 'stats'] as const,
    revenue: (year: string, currency: string) => ['dashboard', 'revenue', year, currency] as const,
  },
  referral: ['referral'] as const,
};
