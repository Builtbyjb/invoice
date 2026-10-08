import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { InvoiceStatusData } from "@shared/lib/types";
import { SkeletonPieChart } from "@/components/Skeleton";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface StatusChartProps {
  data: InvoiceStatusData[];
  isLoading: boolean;
}

const COLORS = ["#000000", "#737373", "#a3a3a3", "#d4d4d4"];

export default function StatusChart({ data, isLoading }: StatusChartProps) {
  return (
    <Card className="border-black/10 rounded-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Invoice Status</CardTitle>
        <CardDescription className="text-neutral-500">Distribution by current status</CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  label={true}
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: ValueType | undefined, name: NameType | undefined) => {
                    if (!value || !name) return;
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #00000020",
                    borderRadius: "0",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: "#000000", fontSize: "12px" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <SkeletonPieChart />
        )}
      </CardContent>
    </Card>
  );
}
