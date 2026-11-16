import type { TopStats } from "@shared/lib/types";
import { formatCurrency } from "@/lib/utils";
import { SkeletonCard } from "@/components/Skeleton";
import { DollarSign, FileCheck, Clock, Users } from "lucide-react";

interface StatsCardsProps {
  stats: TopStats;
  isLoading: boolean;
}

const STATS_ERROR = "—";

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : STATS_ERROR,
      description: "From paid invoices",
      icon: DollarSign,
    },
    {
      title: "Paid Invoices",
      value: stats ? stats.paidInvoices.toString() : STATS_ERROR,
      description: "Successfully collected",
      icon: FileCheck,
    },
    {
      title: "Pending Invoices",
      value: stats ? stats.pendingInvoices : STATS_ERROR,
      description: "Awaiting payment",
      icon: Clock,
    },
    {
      title: "Total Clients",
      value: stats ? stats.totalClients.toString() : STATS_ERROR,
      description: "Active clients",
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div key={card.title}>
          {!isLoading ? (
            <div
              className="animate-fade-up bg-white border border-black/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-500">
                  {card.title}
                </p>
                <div className="w-8 h-8 border border-black/10 flex items-center justify-center flex-shrink-0">
                  <card.icon className="w-4 h-4 text-black" />
                </div>
              </div>
              <div className="text-2xl font-extrabold tracking-tight leading-none mb-1.5 text-black tabular-nums">
                {card.value}
              </div>
              <p className="text-xs text-neutral-500">
                {card.description}
              </p>
            </div>
          ) : (
            <SkeletonCard />
          )}
        </div>
      ))}
    </div>
  );
}
