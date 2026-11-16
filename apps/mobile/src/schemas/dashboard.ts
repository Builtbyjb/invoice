import { z } from 'zod';

export const dashboardStatsSchema = z.object({
  paidCount: z.number(),
  sentCount: z.number(),
  overdueCount: z.number(),
  draftCount: z.number(),
});
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const monthlyRevenueSchema = z.object({
  month: z.string(),
  amount: z.number(),
});
export type MonthlyRevenue = z.infer<typeof monthlyRevenueSchema>;

export const monthlyRevenueListSchema = z.array(monthlyRevenueSchema);
