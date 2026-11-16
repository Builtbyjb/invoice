import { useQuery } from "@tanstack/react-query";

import { getDashboardStats, getMonthlyRevenue } from "../../lib/api/dashboard";
import { qk } from "../../lib/query/keys";

export const LIFETIME = "Lifetime";

export function useDashboardStats() {
    return useQuery({
        queryKey: qk.dashboard.stats,
        queryFn: ({ signal }) => getDashboardStats(signal),
    });
}

export function useMonthlyRevenue(year: string, currency: string | undefined) {
    return useQuery({
        queryKey: qk.dashboard.revenue(year, currency ?? ""),
        queryFn: ({ signal }) =>
            getMonthlyRevenue(
                { year: year === LIFETIME ? undefined : year, currency: currency! },
                signal,
            ),
        enabled: !!currency,
    });
}
