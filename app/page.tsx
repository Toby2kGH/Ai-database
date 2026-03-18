"use client";

import Link from "next/link";
import { Search, TrendingUp, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { MOCKDATA_FORSKNING } from "@/lib/data/forskning";
import { beregnStatistikk, formatDato } from "@/lib/utils";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import {
  RHFStolpeDiagram,
  GodkjenningsStatusDiagram,
  TopFagfeltListe,
} from "@/components/charts/StatistikkDashboard";
import { useState } from "react";
import { useRouter } from "next/navigation";

const { perStatus } = beregnStatistikk(MOCKDATA_LOSNINGER);
const sisteInnmeldinger = [...MOCKDATA_LOSNINGER]
  .sort((a, b) => new Date(b.innmeldtDato).getTime() - new Date(a.innmeldtDato).getTime())
  .slice(0, 5);

export default function Forside() {
  const [sok, setSok] = useState("");
  const router = useRouter();

  const handleSok = (e: React.FormEvent) => {
    e.preventDefault();
    if (sok.trim()) {
      router.push(`/utforsk?q=${encodeURIComponent(sok)}`);
    } else {
      router.push("/utforsk");
    }
  };

  return (
    <div>
      {/* Hero-seksjon */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <p className="text-primary-100 text-sm font-semibold uppercase tracking-wider mb-3">
              Helsedirektoratet
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              KI-løsningsregisteret
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Nasjonal oversikt over kunstig intelligens i norsk helse- og omsorgstjeneste.
              Meld inn produkter og forskningsprosjekter, og få tilgang til veiledning om regelverket.
            </p>

            {/* Søkefelt */}
            <form onSubmit={handleSok} className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={sok}
                  onChange={(e) => setSok(e.target.value)}
                  placeholder="Søk etter produkt, leverandør eller fagfelt..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors text-sm flex-shrink-0"
              >
                Søk
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Statistikkbanner */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatKort
              ikon={<TrendingUp className="text-primary-500" size={22} />}
              tall={MOCKDATA_LOSNINGER.length}
              label="Innmeldte KI-løsninger"
            />
            <StatKort
              ikon={<CheckCircle className="text-green-500" size={22} />}
              tall={perStatus.godkjent}
              label="Godkjente løsninger"
            />
            <StatKort
              ikon={<AlertTriangle className="text-yellow-500" size={22} />}
              tall={perStatus.delvis + perStatus["ikke-godkjent"] + perStatus["under-utproving"]}
              label="Krever oppfølging"
            />
            <StatKort
              ikon={<FileText className="text-primary-400" size={22} />}
              tall={MOCKDATA_FORSKNING.length}
              label="Forskningsprosjekter"
            />
          </div>
        </div>
      </section>

      {/* Hurtiglenker */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HurtigLenke
            href="/utforsk"
            ikon="🔍"
            tittel="Utforsk løsninger"
            beskrivelse="Søk og filtrer alle innmeldte KI-produkter i registeret"
            farge="bg-primary-50 hover:bg-primary-100"
          />
          <HurtigLenke
            href="/kart"
            ikon="🗺️"
            tittel="Norgeskartet"
            beskrivelse="Se geografisk fordeling av KI-løsninger ved helseforetak"
            farge="bg-blue-50 hover:bg-blue-100"
          />
          <HurtigLenke
            href="/meld-inn/produkt"
            ikon="📋"
            tittel="Meld inn produkt"
            beskrivelse="Registrer et nytt KI-produkt i nasjonal oversikt"
            farge="bg-green-50 hover:bg-green-100"
          />
          <HurtigLenke
            href="/veileder"
            ikon="📖"
            tittel="Veileder for ledere"
            beskrivelse="Steg-for-steg guide til regelverk og godkjenning"
            farge="bg-orange-50 hover:bg-orange-100"
          />
        </div>
      </section>

      {/* Dashbord-statistikk */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Oversikt og statistikk</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Fordeling per RHF</h3>
            <p className="text-xs text-gray-400 mb-4">Antall innmeldte løsninger</p>
            <RHFStolpeDiagram losninger={MOCKDATA_LOSNINGER} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Godkjenningsstatus</h3>
            <p className="text-xs text-gray-400 mb-4">Fordeling av statustyper</p>
            <GodkjenningsStatusDiagram losninger={MOCKDATA_LOSNINGER} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Topp 5 fagfelt</h3>
            <p className="text-xs text-gray-400 mb-4">Flest innmeldte løsninger</p>
            <TopFagfeltListe losninger={MOCKDATA_LOSNINGER} />
          </div>
        </div>
      </section>

      {/* Siste innmeldinger og ressurser */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Siste innmeldinger</h2>
              <Link href="/utforsk" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                Se alle →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {sisteInnmeldinger.map((l) => (
                <Link
                  key={l.id}
                  href={`/utforsk/${l.id}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.produktnavn}</p>
                    <p className="text-xs text-gray-500">
                      {l.leverandor} · {l.helseforetak.split("(")[0].trim()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <GodkjenningsBadge status={l.godkjenningsStatus} />
                    <span className="text-xs text-gray-400">{formatDato(l.innmeldtDato)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700">Viktige ressurser</h2>
            </div>
            <div className="p-5 space-y-2">
              {[
                { href: "/veileder", intern: true, tittel: "Veileder: Hva må du sjekke?", beskrivelse: "Guide for ledere som skal ta i bruk KI", ikon: "📖" },
                { href: "https://dmp.no", intern: false, tittel: "DMP – Medisinsk utstyr register", beskrivelse: "Sjekk CE-merking og MDR-klassifisering", ikon: "🏛️" },
                { href: "https://datatilsynet.no/regelverk/veileder/kunstig-intelligens/", intern: false, tittel: "Datatilsynets KI-veileder", beskrivelse: "Personvern og DPIA ved bruk av KI", ikon: "🔒" },
                { href: "/regelverk", intern: true, tittel: "Fullstendig regelverksoversikt", beskrivelse: "Alle lenker og kontaktpunkter samlet", ikon: "📂" },
              ].map((r) =>
                r.intern ? (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg flex-shrink-0">{r.ikon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{r.tittel}</p>
                      <p className="text-xs text-gray-500">{r.beskrivelse}</p>
                    </div>
                  </Link>
                ) : (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg flex-shrink-0">{r.ikon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {r.tittel}<span className="text-gray-400 ml-1">↗</span>
                      </p>
                      <p className="text-xs text-gray-500">{r.beskrivelse}</p>
                    </div>
                  </a>
                )
              )}
              <div className="mt-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-xs font-semibold text-primary-700 mb-1">Tverretatlig veiledning</p>
                <p className="text-xs text-primary-600">
                  Kontakt:{" "}
                  <a href="mailto:ki.veiledning@helsedir.no" className="underline font-medium">
                    ki.veiledning@helsedir.no
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Varselbanner */}
      {perStatus["ikke-godkjent"] + perStatus["under-utproving"] > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {perStatus["ikke-godkjent"] + perStatus["under-utproving"]} løsninger i registeret
                er ikke fullt godkjent for klinisk bruk
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Tilsynsmyndigheter kan se detaljer i{" "}
                <Link href="/tilsyn" className="underline font-medium">
                  Tilsynsvisningen
                </Link>.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function StatKort({ ikon, tall, label }: { ikon: React.ReactNode; tall: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
        {ikon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{tall}</p>
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function HurtigLenke({
  href, ikon, tittel, beskrivelse, farge,
}: {
  href: string; ikon: string; tittel: string; beskrivelse: string; farge: string;
}) {
  return (
    <Link href={href} className={`block p-5 rounded-xl border border-transparent transition-colors ${farge}`}>
      <span className="text-3xl mb-3 block">{ikon}</span>
      <h3 className="font-semibold text-gray-800 mb-1">{tittel}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{beskrivelse}</p>
    </Link>
  );
}
