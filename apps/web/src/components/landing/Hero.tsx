import { FileText } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import type { Invoice, InvoiceItem } from "@shared/lib/types";

const mockInvoice: Omit<Invoice, "id" | "clientId" | "createdAt"> & { clientName: string; clientEmail: string } = {
  invoiceNumber: "INV-2026-001",
  clientName: "Meridian Studios",
  clientEmail: "billing@meridian.co",
  items: [
    { description: "Brand Identity Design", quantity: 1, unitPrice: 4500 },
    { description: "Frontend Development", quantity: 1, unitPrice: 4850 },
  ],
  taxRate: 0,
  discount: 0,
  status: "paid",
  signature: null,
  issueDate: "2026-05-01",
  dueDate: "2026-05-17",
  currency: "USD",
  notes: "",
};

const calculateTotal = (items: InvoiceItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

export default function Hero() {
  const total = calculateTotal(mockInvoice.items);

  return (
    <section className="relative min-h-screen flex items-center bg-brand-bg overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-dot-matrix opacity-50 pointer-events-none" />

      {/* Ruler lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-repeating-linear-gradient(90deg, #000000 0px, #000000 4px, transparent 4px, transparent 8px) opacity-20" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-repeating-linear-gradient(90deg, #000000 0px, #000000 4px, transparent 4px, transparent 8px) opacity-20" />

      <div className="container relative z-10 mx-auto px-6 py-20 lg:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column — Typography */}
        <div className="lg:col-span-6 space-y-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.2em] uppercase text-brand-secondary tabular-nums animate-fade-up">
            <span className="w-2 h-2 bg-brand-accent rounded-full" />
            INVOICING FOR FREELANCERS
          </div>

          {/* Giant Headline */}
          <div className="space-y-1">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-brand-ink animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              Print
            </h1>
            <h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] text-brand-ink animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Money.
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl text-brand-secondary max-w-md leading-relaxed font-medium animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Create, send, and track professional invoices in under a minute. The financial tool built for the creative
            class.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <DownloadButton
              size="lg"
              className="bg-brand-ink text-white hover:bg-brand-ink/90 rounded-none px-8 h-14 text-base font-bold group transition-all duration-300 hover:shadow-lg"
            >
              Download App
            </DownloadButton>
          </div>

          {/* Dashed line */}
          <div className="hr-dashed animate-print-line" style={{ animationDelay: "0.6s" }} />

          {/* Trust markers */}
          <div
            className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold tracking-wide text-brand-secondary tabular-nums animate-fade-up"
            style={{ animationDelay: "0.7s" }}
          >
            <span>NO CC REQUIRED</span>
            <span className="text-brand-secondary/30">|</span>
            <span>5 FREE INVOICES/MO</span>
          </div>
        </div>

        {/* Right Column — Receipt Card */}
        <div className="lg:col-span-6 relative h-[500px] md:h-[600px] hidden md:flex items-center justify-center">
          {/* The Receipt */}
          <div className="relative receipt-3d receipt-shadow paper-texture bg-white p-8 w-[380px] receipt-top receipt-bottom receipt-tear animate-fade-in">
            {/* Receipt Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="w-8 h-8 bg-brand-ink flex items-center justify-center mb-3">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-brand-secondary uppercase">
                  ACORP INVOICE
                </p>
                <p className="text-xs font-mono text-brand-secondary">{mockInvoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono font-bold tracking-widest text-brand-secondary uppercase">DUE</p>
                <p className="text-xs font-mono text-brand-ink">
                  {new Date(mockInvoice.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Dashed line */}
            <div className="hr-dashed mb-6" />

            {/* Client */}
            <div className="mb-6">
              <p className="text-[10px] font-mono font-bold tracking-widest text-brand-secondary uppercase mb-1">
                BILL TO
              </p>
              <p className="text-sm font-bold text-brand-ink">{mockInvoice.clientName}</p>
              <p className="text-xs font-mono text-brand-secondary">{mockInvoice.clientEmail}</p>
            </div>

            {/* Line Items */}
            <div className="space-y-3 mb-6">
              {mockInvoice.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-bold text-brand-ink">{item.description}</p>
                    <p className="text-xs font-mono text-brand-secondary">
                      {item.quantity}x @ ${item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-mono font-bold text-brand-ink tabular-nums">
                    ${(item.quantity * item.unitPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Dashed line */}
            <div className="hr-dashed mb-6" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-mono font-bold tracking-widest text-brand-secondary uppercase">TOTAL</p>
              <p className="text-2xl font-bold font-mono text-brand-ink tabular-nums">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Status Stamp */}
            <div className="mt-8 flex justify-center">
              <div className="stamp px-4 py-1 border-2 border-brand-accent text-brand-accent text-xs font-mono font-bold tracking-widest uppercase">
                PAID
              </div>
            </div>

            {/* Receipt texture overlay */}
            <div className="absolute inset-0 receipt-texture pointer-events-none opacity-30" />
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 border border-brand-secondary/20 rounded-full animate-float pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-16 h-16 border border-brand-accent/20 rounded-full animate-float-delayed pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
