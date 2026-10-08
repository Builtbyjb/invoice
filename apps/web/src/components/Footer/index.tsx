import { Link } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";

type Item = {
  label: string;
  to: string;
};

type FooterItem = {
  title: string;
  items: Item[];
};

type Props = {
  footerItems: FooterItem[];
  logo: React.ReactNode;
  description: string;
};

export default function Footer({ footerItems, logo, description }: Props) {
  return (
    <footer className="border-t border-black/10 px-6 py-10 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          {logo}
          <p className="text-sm mt-2 max-w-xs leading-relaxed text-neutral-500">{description}</p>
        </div>

        <div className="flex items-start gap-12">
          {footerItems.map((footerItem, idx) => (
            <div key={idx}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-black">{footerItem.title}</p>
              <ul className="flex flex-col gap-2">
                {footerItem.items.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.to} className="text-sm transition-opacity hover:opacity-60 text-neutral-500">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="max-w-7xl mx-auto mt-8 bg-black/10" />

      <div className="max-w-7xl mx-auto mt-6 flex items-center justify-between text-black">
        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} ACorp. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="text-xs transition-opacity hover:opacity-60 text-neutral-500">
            Privacy
          </Link>
          <Link to="/terms-of-service" className="text-xs transition-opacity hover:opacity-60 text-neutral-500">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
