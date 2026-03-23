"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RolleVelger } from "./RolleVelger";
import { useRolle } from "@/lib/context/RolleContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LENKER = [
  { href: "/", label: "Forside", roller: ["alle"] },
  { href: "/utforsk", label: "Utforsk løsninger", roller: ["alle"] },
  { href: "/kart", label: "Norgeskartet", roller: ["alle"] },
  { href: "/veileder", label: "Veileder", roller: ["alle"] },
  { href: "/regelverk", label: "Regelverk", roller: ["alle"] },
  {
    href: "/meld-inn/produkt",
    label: "Meld inn produkt",
    roller: ["klinisk-leder", "it-sikkerhet", "rhf-koordinator"],
  },
  {
    href: "/meld-inn/forskning",
    label: "Meld inn forskning",
    roller: ["forsker", "klinisk-leder"],
  },
  {
    href: "/meld-inn/bruk",
    label: "Meld inn bruk",
    roller: ["virksomhetsleder", "klinisk-leder", "rhf-koordinator"],
  },
  {
    href: "/tilsyn",
    label: "Tilsynsvisning",
    roller: ["tilsynsansvarlig", "dmp-saksbehandler"],
  },
];

export function Header() {
  const pathname = usePathname();
  const { bruker } = useRolle();
  const [mobileOpen, setMobileOpen] = useState(false);

  const synligeLenker = NAV_LENKER.filter(
    (l) => l.roller.includes("alle") || l.roller.includes(bruker.rolle)
  );

  return (
    <header className="bg-primary-500 text-white shadow-lg sticky top-0 z-30">
      {/* Toppbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo og navn */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-primary-500 font-bold text-sm">HD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-white/70 leading-none">Helsedirektoratet</p>
              <p className="text-sm font-semibold leading-none mt-0.5">KI-løsningsregisteret</p>
            </div>
            <div className="sm:hidden">
              <p className="text-sm font-semibold leading-none">KI-registeret</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {synligeLenker.map((lenke) => (
              <Link
                key={lenke.href}
                href={lenke.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === lenke.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {lenke.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <RolleVelger />
            <button
              className="lg:hidden p-2 text-white/80 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/20 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 py-2">
            {synligeLenker.map((lenke) => (
              <Link
                key={lenke.href}
                href={lenke.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium mb-0.5 transition-colors ${
                  pathname === lenke.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {lenke.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
