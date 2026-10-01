import { dashboardStatsSchema, monthlyRevenueListSchema } from '@/schemas/dashboard';

import { apiRequest } from './client';

export function getDashboardStats(signal?: AbortSignal) {
  return apiRequest({
    path: '/api/v1/user/dashboard/stats',
    method: 'GET',
    schema: dashboardStatsSchema,
    requiresAuth: true,
    signal,
  });
}

/** `year` is omitted for "Lifetime". */
export function getMonthlyRevenue({ year, currency }: { year?: string; currency: string }, signal?: AbortSignal) {
  return apiRequest({
    path: '/api/v1/user/dashboard/revenues',
    method: 'GET',
    query: { currency, year: year ? year : undefined },
    schema: monthlyRevenueListSchema,
    requiresAuth: true,
    signal,
  });
}
