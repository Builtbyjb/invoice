const steps = [
  {
    step: "01",
    title: "Configure your brand",
    description: "Upload your logo, set your base currency, and define your default payment terms.",
  },
  {
    step: "02",
    title: "Add your clients",
    description: "Input client details once. ACorp remembers their preferred currency and past invoices.",
  },
  {
    step: "03",
    title: "Draft the invoice",
    description: "Add line items with a keystroke. Taxes, discounts, and totals are calculated instantly.",
  },
  {
    step: "04",
    title: "Send & get paid",
    description: "Export a pixel-perfect PDF or share via link. Automated reminders ensure you never wait.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-24">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-brand-secondary/20 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-brand-secondary mb-6"
            style={{
              opacity: 1,
              transform: "translateY(10px)",
              transition: "all 0.5s ease-out",
            }}
          >
            <span className="w-1.5 h-1.5 bg-brand-accent" />
            PROCESS
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-brand-ink leading-tight"
            style={{
              opacity: 1,
              transform: "translateY(10px)",
              transition: "all 0.5s ease-out 0.1s",
            }}
          >
            From zero to paid in four steps.
          </h2>
        </div>

        {/* Steps — Horizontal on desktop, vertical on mobile */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-brand-secondary/15">
            <div
              className="h-full bg-brand-ink"
              style={{
                width: "100%",
                transition: "width 1.5s ease-out 0.5s",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className="relative group"
                style={{
                  opacity: 1,
                  transform: "translateY(20px)",
                  transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${200 + i * 150}ms`,
                }}
              >
                {/* Step number */}
                <div className="mb-6">
                  <div className="w-16 h-16 border-2 border-brand-ink flex items-center justify-center bg-white transition-all duration-300 group-hover:scale-105 group-hover:border-brand-accent">
                    <span className="text-xl font-bold font-mono text-brand-ink group-hover:text-brand-accent transition-colors duration-300 tabular-nums">
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-brand-ink mb-2 group-hover:text-brand-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-secondary leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
