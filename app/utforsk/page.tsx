"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import { formatDato, eksporterCSV } from "@/lib/utils";
import { KILosning, RHF, GodkjenningsStatus, HELSEFORETAK_PER_RHF } from "@/lib/types";
import { useRolle } from "@/lib/context/RolleContext";
import { Search, Download, ExternalLink, Filter, X } from "lucide-react";
import Link from "next/link";

const ALLE_FAGFELT = [
  "Radiologi", "Patologi", "Kardiologi", "Onkologi", "Akuttmedisin",
  "Psykiatri", "Nevrologi", "Gastroenterologi", "Ortopedi",
  "Generell indremedisin", "Allmennmedisin", "Intensivmedisin",
];

const STATUS_FILTER: { label: string; verdi: GodkjenningsStatus }[] = [
  { label: "Godkjent", verdi: "godkjent" },
  { label: "Delvis godkjent", verdi: "delvis" },
  { label: "Ikke godkjent", verdi: "ikke-godkjent" },
  { label: "Under utprøving", verdi: "under-utproving" },
  { label: "Ukjent", verdi: "ukjent" },
];

// Wrapper med Suspense for useSearchParams
export default function UtforskPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-400">Laster...</div>}>
      <UtforskInnhold />
    </Suspense>
  );
}

function UtforskInnhold() {
  const searchParams = useSearchParams();
  const { bruker } = useRolle();

  const [sokeTekst, setSokeTekst] = useState(searchParams.get("q") || "");
  const [valgtRHF, setValgtRHF] = useState<RHF | "">("");
  const [valgtForetak, setValgtForetak] = useState("");
  const [valgteFagfelt, setValgteFagfelt] = useState<string[]>([]);
  const [valgteStatuser, setValgteStatuser] = useState<GodkjenningsStatus[]>([]);
  const [visFilter, setVisFilter] = useState(false);

  // Dynamisk helseforetak-liste basert på valgt RHF
  const tilgjengeligeForetak = valgtRHF
    ? HELSEFORETAK_PER_RHF[valgtRHF]
    : [];

  const filtrerteLosninger = useMemo(() => {
    return MOCKDATA_LOSNINGER.filter((l) => {
      // Tekstsøk
      if (sokeTekst) {
        const s = sokeTekst.toLowerCase();
        const treff =
          l.produktnavn.toLowerCase().includes(s) ||
          l.leverandor.toLowerCase().includes(s) ||
          l.fagfelt.some((f) => f.toLowerCase().includes(s)) ||
          l.helseforetak.toLowerCase().includes(s) ||
          l.tiltenktBruksomrade.toLowerCase().includes(s);
        if (!treff) return false;
      }
      if (valgtRHF && l.rhf !== valgtRHF) return false;
      if (valgtForetak && l.helseforetak !== valgtForetak) return false;
      if (valgteFagfelt.length > 0 && !valgteFagfelt.some((f) => l.fagfelt.includes(f as any))) return false;
      if (valgteStatuser.length > 0 && !valgteStatuser.includes(l.godkjenningsStatus)) return false;
      return true;
    });
  }, [sokeTekst, valgtRHF, valgtForetak, valgteFagfelt, valgteStatuser]);

  const handleEksport = () => {
    const csv = eksporterCSV(filtrerteLosninger);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ki-losninger-eksport.csv";
    a.click();
  };

  const toggleFagfelt = (f: string) => {
    setValgteFagfelt((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const toggleStatus = (s: GodkjenningsStatus) => {
    setValgteStatuser((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const nullstillFilter = () => {
    setSokeTekst("");
    setValgtRHF("");
    setValgtForetak("");
    setValgteFagfelt([]);
    setValgteStatuser([]);
  };

  const harAktivFilter =
    sokeTekst || valgtRHF || valgtForetak || valgteFagfelt.length > 0 || valgteStatuser.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Utforsk KI-løsninger</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtrerteLosninger.length} av {MOCKDATA_LOSNINGER.length} løsninger vises
          </p>
        </div>
        <div className="flex gap-2">
          {(bruker.rolle === "tilsynsansvarlig" || bruker.rolle === "dmp-saksbehandler" || bruker.rolle === "rhf-koordinator") && (
            <button
              onClick={handleEksport}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Eksporter CSV
            </button>
          )}
          <button
            onClick={() => setVisFilter(!visFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              visFilter ? "bg-primary-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} />
            Filter
            {harAktivFilter && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>
            )}
          </button>
        </div>
      </div>

      {/* Søkefelt */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={sokeTekst}
          onChange={(e) => setSokeTekst(e.target.value)}
          placeholder="Søk på produktnavn, leverandør, fagfelt, helseforetak..."
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        {sokeTekst && (
          <button
            onClick={() => setSokeTekst("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter-panel */}
        {visFilter && (
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Filtrer</h2>
                {harAktivFilter && (
                  <button
                    onClick={nullstillFilter}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Nullstill
                  </button>
                )}
              </div>

              {/* RHF */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Regionalt helseforetak
                </label>
                <select
                  value={valgtRHF}
                  onChange={(e) => {
                    setValgtRHF(e.target.value as RHF | "");
                    setValgtForetak("");
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                >
                  <option value="">Alle RHF</option>
                  {(["Helse Sør-Øst", "Helse Vest", "Helse Midt-Norge", "Helse Nord"] as RHF[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Helseforetak */}
              {valgtRHF && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Helseforetak
                  </label>
                  <select
                    value={valgtForetak}
                    onChange={(e) => setValgtForetak(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                  >
                    <option value="">Alle foretak</option>
                    {tilgjengeligeForetak.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Fagfelt */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Fagfelt
                </label>
                <div className="space-y-1.5">
                  {ALLE_FAGFELT.map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={valgteFagfelt.includes(f)}
                        onChange={() => toggleFagfelt(f)}
                        className="w-3.5 h-3.5 text-primary-500 rounded border-gray-300 focus:ring-primary-300"
                      />
                      <span className="text-xs text-gray-700">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Godkjenningsstatus */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Godkjenningsstatus
                </label>
                <div className="space-y-1.5">
                  {STATUS_FILTER.map(({ label, verdi }) => (
                    <label key={verdi} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={valgteStatuser.includes(verdi)}
                        onChange={() => toggleStatus(verdi)}
                        className="w-3.5 h-3.5 text-primary-500 rounded border-gray-300 focus:ring-primary-300"
                      />
                      <span className="text-xs text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Resultatliste */}
        <div className="flex-1">
          {filtrerteLosninger.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <p className="text-gray-500 text-sm">Ingen løsninger funnet med gjeldende filter.</p>
              <button
                onClick={nullstillFilter}
                className="mt-3 text-primary-600 text-sm hover:underline"
              >
                Nullstill filter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtrerteLosninger.map((l) => (
                <LosningKort key={l.id} losning={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LosningKort({ losning: l }: { losning: KILosning }) {
  return (
    <Link href={`/utforsk/${l.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-gray-900">{l.produktnavn}</h3>
              <GodkjenningsBadge status={l.godkjenningsStatus} />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {l.leverandor} · {l.rhf} · {l.helseforetak.split("(")[0].trim()}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {l.fagfelt.map((f) => (
                <span
                  key={f}
                  className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{l.tiltenktBruksomrade}</p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-2 text-right">
            <span className="text-xs text-gray-400">
              Ref: {l.referansenummer}
            </span>
            {l.ceMerket === "ja" && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                CE {l.mdrKlasse && `· MDR ${l.mdrKlasse}`}
              </span>
            )}
            {l.dmpUrl && (
              <span className="flex items-center gap-1 text-xs text-primary-600">
                <ExternalLink size={10} /> DMP-registrert
              </span>
            )}
            <span className="text-xs text-gray-400">{formatDato(l.innmeldtDato)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
