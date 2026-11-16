const companies = [
  "Meridian Studios",
  "Apex Creative",
  "Nova Digital",
  "Flux Agency",
  "Prism Works",
  "Vertex Labs",
  "Orbit Design",
  "Catalyst Co",
  "Horizon Media",
  "Terra Studio",
];

export default function Logos() {
  return (
    <section className="py-8 bg-white border-y border-brand-secondary/15 overflow-hidden">
      {/* Minimal header */}
      <div className="container mx-auto px-6 mb-6">
        <p className="text-center text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-brand-secondary/50">
          Trusted by independent professionals
        </p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee-h">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-12 px-6">
              {companies.map((name, i) => (
                <div key={`${setIdx}-${i}`} className="flex-shrink-0 group cursor-default">
                  <span className="text-lg font-bold text-brand-secondary/30 tracking-tight whitespace-nowrap group-hover:text-brand-ink transition-colors duration-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
