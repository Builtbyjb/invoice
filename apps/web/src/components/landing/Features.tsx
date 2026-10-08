import { useInView } from "@/hooks/useInView";
import { FileText, Clock, DollarSign, Users, BarChart3, Receipt } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Lightning-fast invoicing",
    description: "Create professional invoices in under 60 seconds. Add line items, set due dates, download PDFs.",
    tag: "CORE",
  },
  {
    icon: Clock,
    title: "Automatic reminders",
    description: "Reduce late payments without awkward follow-up emails. Set it and forget it.",
    tag: "AUTO",
  },
  {
    icon: DollarSign,
    title: "Multi-currency",
    description: "Bill clients globally in USD, CAD, NGN and more. Currency symbols render perfectly.",
    tag: "GLOBAL",
  },
  {
    icon: Users,
    title: "Client management",
    description: "Keep all your clients, contact details, and invoice history in one clean view.",
    tag: "CRM",
  },
  {
    icon: BarChart3,
    title: "Insights & analytics",
    description: "Track revenue trends and payment patterns from a single dashboard.",
    tag: "DATA",
  },
  {
    icon: Receipt,
    title: "Receipt tracking",
    description: "Automatically match payments to invoices and keep your books clean.",
    tag: "TRACK",
  },
];

export default function Features() {
  const { ref, isVisible } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-brand-bg relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-secondary/20 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-brand-secondary mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out",
            }}
          >
            <span className="w-1.5 h-1.5 bg-brand-accent" />
            ITEMIZED
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-brand-ink leading-tight mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out 0.1s",
            }}
          >
            Everything you need, nothing you don't.
          </h2>
          <p
            className="text-lg text-brand-secondary leading-relaxed"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out 0.2s",
            }}
          >
            A focused toolkit for creating, sending, and tracking invoices. No bloat, no noise.
          </p>
        </div>

        {/* Features as a receipt list */}
        <div className="space-y-0">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-brand-secondary/20">
            <div className="col-span-1 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-secondary">#</div>
            <div className="col-span-5 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-secondary">Feature</div>
            <div className="col-span-5 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-secondary">Description</div>
            <div className="col-span-1 text-right text-[10px] font-mono font-bold tracking-widest uppercase text-brand-secondary">Tag</div>
          </div>

          {/* Feature rows */}
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-brand-secondary/10 hover:bg-white/60 transition-colors duration-300 cursor-default"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${300 + i * 80}ms`,
                }}
              >
                {/* Number */}
                <div className="md:col-span-1 flex items-center gap-3">
                  <span className="text-2xl font-bold font-mono text-brand-secondary/30 group-hover:text-brand-accent transition-colors duration-300 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 border border-brand-secondary/20 flex items-center justify-center shrink-0 group-hover:border-brand-accent/40 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-brand-ink group-hover:text-brand-accent transition-colors duration-300" />
                  </div>
                  <span className="text-lg font-bold text-brand-ink group-hover:text-brand-accent transition-colors duration-300">
                    {feature.title}
                  </span>
                </div>

                {/* Description */}
                <div className="md:col-span-5 flex items-center">
                  <p className="text-sm text-brand-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Tag */}
                <div className="md:col-span-1 flex items-center justify-end">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-brand-accent bg-brand-accent/10 px-2 py-1">
                    {feature.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom line */}
        <div className="hr-dashed mt-8" />
      </div>
    </section>
  );
}
