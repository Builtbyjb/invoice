// import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DownloadButton } from "@/components/DownloadButton";

type Props = {
  logo: React.ReactNode;
};

export default function Navbar({ logo }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const routerState = useRouterState();
  // const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex gap-8">{logo}</div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <DownloadButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-brand-ink transition-all duration-300 hover:bg-brand-ink/90 hover:shadow-lg active:scale-[0.97]">
            Download App
          </DownloadButton>
        </div>

        {/* Mobile toggle */}
        <Button
          type="button"
          variant="outline"
          className="md:hidden p-2 -m-2 transition-colors text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10 bg-white">
          <Separator className="my-2 bg-black/10" />
          <div className="flex flex-col gap-3 pt-2">
            <DownloadButton className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-brand-ink transition-all duration-300 hover:bg-brand-ink/90 hover:shadow-lg active:scale-[0.97]">
              Download App
            </DownloadButton>
          </div>
        </div>
      )}
    </header>
  );
}
