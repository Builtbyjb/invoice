import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { MonthRevenue } from "@shared/lib/types";
import { SkeletonBarChart } from "@/components/Skeleton";
import { formatCurrency } from "@/lib/utils";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface RevenueChartProps {
  data: MonthRevenue[];
  isLoading: boolean;
}

export default function RevenueChart({ data, isLoading }: RevenueChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 border-black/10 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Monthly Revenue</CardTitle>
        <CardDescription className="text-neutral-500">Revenue from paid invoices by month</CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000015" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} />
                <Tooltip
                  formatter={(value: ValueType | undefined) => {
                    if (!value) return;
                    return [formatCurrency(Number(value)), "Revenue"];
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #00000020",
                    borderRadius: "0",
                  }}
                />
                <Bar dataKey="revenue" fill="#000000" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <SkeletonBarChart />
        )}
      </CardContent>
    </Card>
  );
}
