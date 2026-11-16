import { DownloadButton } from "@/components/DownloadButton";

const trustMarkers = ["No credit card required", "Free up to 5 invoices/mo", "Cancel anytime"];

export default function CTA() {
  return (
    <section className="relative py-16 md:py-20 px-6 bg-brand-bg overflow-hidden">
      <div className="container mx-auto">
        <div className="relative bg-white border border-brand-secondary/20 px-8 md:px-16 py-20 md:py-28 text-center paper-texture receipt-shadow receipt-tear">
          {/* Background texture */}
          <div className="absolute inset-0 bg-dot-matrix opacity-30 pointer-events-none" />

          {/* Decorative border frame */}
          <div className="absolute inset-4 border border-brand-secondary/10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Eyebrow */}
            <p
              className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-brand-secondary mb-6"
              style={{
                opacity: 1,
                transform: "translateY(10px)",
                transition: "all 0.5s ease-out",
              }}
            >
              // START TODAY
            </p>

            {/* Main Headline */}
            <h2
              className="font-bold tracking-tighter mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
              style={{
                opacity: 1,
                transform: "translateY(10px)",
                transition: "all 0.5s ease-out 0.1s",
              }}
            >
              Ready to get
              <br />
              paid faster?
            </h2>

            {/* Subtext */}
            <p
              className="text-base md:text-lg mb-10 text-brand-secondary max-w-xl mx-auto leading-relaxed"
              style={{
                opacity: 1,
                transform: "translateY(10px)",
                transition: "all 0.5s ease-out 0.2s",
              }}
            >
              Join thousands of independent professionals who have upgraded their financial workflow.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
              style={{
                opacity: 1,
                transform: "translateY(10px)",
                transition: "all 0.5s ease-out 0.3s",
              }}
            >
              <DownloadButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-brand-ink transition-all duration-300 hover:bg-brand-ink/90 hover:shadow-lg active:scale-[0.97]">
                Download App
              </DownloadButton>
            </div>

            {/* Trust Markers */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono font-bold tracking-wider text-brand-secondary uppercase"
              style={{
                opacity: 1,
                transform: "translateY(10px)",
                transition: "all 0.5s ease-out 0.4s",
              }}
            >
              {trustMarkers.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-accent" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
