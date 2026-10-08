import { useInView } from "@/hooks/useInView";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "It completely transformed how I manage my freelance business. I used to spend hours on invoicing — now it takes minutes.",
    author: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
  },
  {
    quote: "The automatic reminders alone have saved me thousands in unpaid invoices.",
    author: "Marcus Johnson",
    role: "Web Developer",
    avatar: "MJ",
  },
  {
    quote: "Clean, professional, and incredibly easy to use. My clients always comment on how polished my invoices look.",
    author: "Elena Rodriguez",
    role: "Jeweler",
    avatar: "ER",
  },
  {
    quote: "Finally, an invoicing tool that doesn't feel like accounting software from 2005.",
    author: "David Park",
    role: "Photographer",
    avatar: "DP",
  },
];

function StarRating({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-3 h-3 fill-black text-black" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-black/20 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-500 mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out",
            }}
          >
            <span className="w-1.5 h-1.5 bg-black" />
            TESTIMONIALS
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-black leading-tight"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.5s ease-out 0.1s",
            }}
          >
            What people are saying.
          </h2>
        </div>

        {/* Testimonials Grid — Equal 4-column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 100}ms`,
              }}
            >
              <div className="h-full bg-white border border-black/10 p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <StarRating className="mb-4" />
                    <blockquote className="text-base font-medium leading-relaxed mb-6 text-black">
                      "{t.quote}"
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-black/30 flex items-center justify-center text-xs font-bold text-black">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">{t.author}</p>
                      <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
