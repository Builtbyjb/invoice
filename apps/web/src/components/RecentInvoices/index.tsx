import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@shared/lib/types";
import { format } from "date-fns";
import { formatCurrency, getBadgeVariant } from "@/lib/utils";
import { calculateTotalAmount } from "@shared/utils/util";
import { SkeletonBarChart } from "@/components/Skeleton";

interface RecentInvoicesProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export default function RecentInvoices({ invoices, isLoading }: RecentInvoicesProps) {
  const navigate = useNavigate();

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleNavigate = (invoice: Invoice) => {
    navigate({ to: `/clients/${invoice.clientId}/invoices/${invoice.id}` });
  };

  return (
    <Card className="col-span-1 lg:col-span-2 border-black/10 rounded-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
          <CardDescription className="text-neutral-500">Latest invoice activity</CardDescription>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: "/invoices" })}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {!isLoading ? (
          <div className="space-y-0">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-black/10 text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-500">
              <div className="col-span-3">Invoice</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right"></div>
            </div>
            {recentInvoices.map((invoice, i) => (
              <div
                key={invoice.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 py-4 items-center transition-colors duration-200 hover:bg-black/[0.02] cursor-pointer ${i < recentInvoices.length - 1 ? "border-b border-black/5" : ""}`}
                onClick={() => handleNavigate(invoice)}
              >
                <div className="md:col-span-3">
                  <span className="font-bold text-black">{invoice.invoiceNumber}</span>
                </div>
                <div className="md:col-span-2 text-sm text-neutral-500">
                  {format(new Date(invoice.issueDate), "MMM d, yyyy")}
                </div>
                <div className="md:col-span-3">
                  <span className="font-bold text-black tabular-nums">
                    {formatCurrency(
                      calculateTotalAmount(invoice.items, invoice.taxRate, invoice.discount),
                      invoice.currency,
                    )}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <Badge className={`${getBadgeVariant(invoice.status)} capitalize rounded-none border-0`}>
                    {invoice.status}
                  </Badge>
                </div>
                <div className="md:col-span-2 text-right">
                  <span className="text-xs text-neutral-400 font-mono">
                    {format(new Date(invoice.dueDate), "MMM d")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SkeletonBarChart />
        )}
      </CardContent>
    </Card>
  );
}
