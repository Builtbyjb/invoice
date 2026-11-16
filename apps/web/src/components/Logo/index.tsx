import { Link } from "@tanstack/react-router";

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <div className="relative w-8 h-8 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M16 2L2 26H11L16 17.5L21 26H30L16 2Z" fill="#000000" />
          <path
            d="M16 17.5L21 26H11L16 17.5Z"
            fill="#000000"
            className="opacity-20 group-hover:opacity-100 transition-opacity duration-300"
          />
        </svg>
      </div>
      <span className="font-bold text-xl tracking-tighter text-black">Invoice</span>
    </Link>
  );
}
