import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

interface StatItemProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  isVisible: boolean;
  delay?: number;
}

function StatItem({ value, prefix = "", suffix = "", label, decimals = 0, isVisible, delay = 0 }: StatItemProps) {
  const count = useCountUp(value, isVisible, { duration: 2000, decimals });

  const formatValue = (num: number): string => {
    if (value >= 1000000) return (num / 1000000).toFixed(1);
    if (value >= 1000 && value < 10000) return (num / 1000).toFixed(1);
    if (value >= 10000) return (num / 1000).toFixed(0);
    return num.toFixed(decimals);
  };

  const getSuffix = (): string => {
    if (value >= 1000000) return `M${suffix}`;
    if (value >= 1000) return `K${suffix}`;
    return suffix;
  };

  return (
    <div
      className="relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tighter text-brand-ink tabular-nums mb-2">
        {prefix}{formatValue(count)}{getSuffix()}
      </div>
      <p className="text-xs font-mono font-bold tracking-widest uppercase text-brand-secondary">
        {label}
      </p>
    </div>
  );
}

const stats = [
  { value: 12000000, prefix: "$", suffix: "+", label: "Total Invoiced" },
  { value: 2500, suffix: "+", label: "Active Users" },
  { value: 4.2, suffix: " days", label: "Avg. Payment Time", decimals: 1 },
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
];

export default function Stats() {
  const { ref, isVisible } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section ref={ref} className="relative py-20 md:py-24 bg-white border-y border-brand-secondary/15">
      {/* Dot matrix background */}
      <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <div className="mb-16">
          <p
            className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-brand-secondary mb-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.5s ease-out",
            }}
          >
            // THE TOTALS
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-ink leading-tight"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out 0.1s",
            }}
          >
            Numbers that speak.
          </h2>
        </div>

        {/* Stats grid with dashed separators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatItem
                {...stat}
                isVisible={isVisible}
                delay={200 + i * 100}
              />
              {/* Vertical dashed separator on desktop */}
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px border-r border-dashed border-brand-secondary/20" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom dashed line */}
        <div className="hr-dashed mt-16 animate-print-line" style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.5s ease-out 0.8s" }} />
      </div>
    </section>
  );
}
