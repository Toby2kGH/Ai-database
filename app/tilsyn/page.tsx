"use client";

import { useState, useMemo } from "react";
import { useRolle } from "@/lib/context/RolleContext";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import { eksporterCSV, formatDato } from "@/lib/utils";
import { AlertTriangle, Download, Shield, Eye, XCircle, FileWarning } from "lucide-react";
import Link from "next/link";
import {
  RHFStolpeDiagram,
  GodkjenningsStatusDiagram,
} from "@/components/charts/StatistikkDashboard";

export default function TilsynPage() {
  const { bruker } = useRolle();
  const [aktivtFilter, setAktivtFilter] = useState<string>("alle");

  // useMemo kalles alltid (ikke betinget) – tilgangskontroll skjer etter hooks
  const filtrerteLosninger = useMemo(() => {
    switch (aktivtFilter) {
      case "mangler-dmp":
        return MOCKDATA_LOSNINGER.filter((l) => l.ceMerket === "ja" && !l.dmpUrl);
      case "off-label":
        return MOCKDATA_LOSNINGER.filter((l) =>
          l.godkjenningsStatus === "delvis" || l.godkjenningsStatus === "ikke-godkjent"
        );
      case "mangler-dpia":
        return MOCKDATA_LOSNINGER.filter((l) => l.dpiaGjennomfort !== "ja");
      case "mangler-validering":
        return MOCKDATA_LOSNINGER.filter((l) => l.lokalValidering !== "ja");
      case "hoy-risiko":
        return MOCKDATA_LOSNINGER.filter((l) =>
          l.aiActRisiko === "hoy-medisinsk" || l.aiActRisiko === "hoy-annex3"
        );
      default:
        return MOCKDATA_LOSNINGER;
    }
  }, [aktivtFilter]);

  const varsler = {
    mangler_dmp: MOCKDATA_LOSNINGER.filter((l) => l.ceMerket === "ja" && !l.dmpUrl).length,
    off_label: MOCKDATA_LOSNINGER.filter((l) => l.godkjenningsStatus === "delvis" || l.godkjenningsStatus === "ikke-godkjent").length,
    mangler_dpia: MOCKDATA_LOSNINGER.filter((l) => l.dpiaGjennomfort !== "ja").length,
    ingen_validering: MOCKDATA_LOSNINGER.filter((l) => l.lokalValidering === "nei").length,
    hoy_risiko: MOCKDATA_LOSNINGER.filter((l) => ["hoy-medisinsk", "hoy-annex3"].includes(l.aiActRisiko)).length,
  };

  const handleEksport = () => {
    const csv = eksporterCSV(filtrerteLosninger);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ki-register-tilsyn-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Tilgangskontroll – etter alle hooks
  if (!["tilsynsansvarlig", "dmp-saksbehandler"].includes(bruker.rolle)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
          <Shield className="text-amber-500 mx-auto mb-3" size={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Begrenset tilgang</h2>
          <p className="text-sm text-gray-600 mb-4">
            Tilsynsvisningen er kun tilgjengelig for tilsynsmyndigheter.
            Velg &quot;Tilsynsansvarlig&quot; eller &quot;DMP-saksbehandler&quot; i rolle-velgeren øverst.
          </p>
          <Link href="/" className="text-primary-600 text-sm hover:underline">← Til forsiden</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-primary-500" size={22} />
            <h1 className="text-2xl font-bold text-gray-800">Tilsynsvisning</h1>
          </div>
          <p className="text-sm text-gray-500">
            Innlogget som: <strong>{bruker.navn}</strong> · {bruker.organisasjon}
          </p>
        </div>
        <button
          onClick={handleEksport}
          className="flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <Download size={16} />
          Eksporter register (CSV)
        </button>
      </div>

      {/* Varsel-dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <VarselKort
          tittel="Off-label / ikke godkjent"
          antall={varsler.off_label}
          ikon={<AlertTriangle size={18} />}
          farge="bg-red-50 border-red-200 text-red-700"
          aktiv={aktivtFilter === "off-label"}
          onClick={() => setAktivtFilter(aktivtFilter === "off-label" ? "alle" : "off-label")}
        />
        <VarselKort
          tittel="Mangler DMP-registrering"
          antall={varsler.mangler_dmp}
          ikon={<FileWarning size={18} />}
          farge="bg-amber-50 border-amber-200 text-amber-700"
          aktiv={aktivtFilter === "mangler-dmp"}
          onClick={() => setAktivtFilter(aktivtFilter === "mangler-dmp" ? "alle" : "mangler-dmp")}
        />
        <VarselKort
          tittel="Mangler DPIA"
          antall={varsler.mangler_dpia}
          ikon={<Shield size={18} />}
          farge="bg-orange-50 border-orange-200 text-orange-700"
          aktiv={aktivtFilter === "mangler-dpia"}
          onClick={() => setAktivtFilter(aktivtFilter === "mangler-dpia" ? "alle" : "mangler-dpia")}
        />
        <VarselKort
          tittel="Ingen lokal validering"
          antall={varsler.ingen_validering}
          ikon={<XCircle size={18} />}
          farge="bg-yellow-50 border-yellow-200 text-yellow-700"
          aktiv={aktivtFilter === "mangler-validering"}
          onClick={() => setAktivtFilter(aktivtFilter === "mangler-validering" ? "alle" : "mangler-validering")}
        />
        <VarselKort
          tittel="Høyrisikoklasse (AI Act)"
          antall={varsler.hoy_risiko}
          ikon={<Eye size={18} />}
          farge="bg-blue-50 border-blue-200 text-blue-700"
          aktiv={aktivtFilter === "hoy-risiko"}
          onClick={() => setAktivtFilter(aktivtFilter === "hoy-risiko" ? "alle" : "hoy-risiko")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Statistikk */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fordeling per RHF</h3>
          <RHFStolpeDiagram losninger={MOCKDATA_LOSNINGER} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Godkjenningsstatus</h3>
          <GodkjenningsStatusDiagram losninger={MOCKDATA_LOSNINGER} />
        </div>

        {/* Nøkkelstatistikk */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Nøkkelstatistikk</h3>
          <div className="space-y-3">
            <StatLinje label="Totalt registrert" verdi={MOCKDATA_LOSNINGER.length} />
            <StatLinje label="CE-merket" verdi={MOCKDATA_LOSNINGER.filter(l => l.ceMerket === "ja").length} />
            <StatLinje label="MDR klasse IIb eller III" verdi={MOCKDATA_LOSNINGER.filter(l => l.mdrKlasse === "IIb" || l.mdrKlasse === "III").length} />
            <StatLinje label="LLM-baserte løsninger" verdi={MOCKDATA_LOSNINGER.filter(l => l.algoritmeType === "llm").length} />
            <StatLinje label="Kontinuerlig lærende" verdi={MOCKDATA_LOSNINGER.filter(l => l.kontinuerligLaerende).length} />
            <StatLinje label="Avvikshendelser rapportert" verdi={MOCKDATA_LOSNINGER.filter(l => l.avvikshendelser !== "ingen").length} />
            <StatLinje label="Utenfor EØS-infrastruktur" verdi={MOCKDATA_LOSNINGER.filter(l => l.norskInfrastruktur === "nei").length} farge="text-red-600" />
          </div>
        </div>
      </div>

      {/* Filter-indikatorer */}
      {aktivtFilter !== "alle" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <p className="text-sm text-amber-800">
            <strong>Aktivt filter:</strong> Viser {filtrerteLosninger.length} løsninger
          </p>
          <button
            onClick={() => setAktivtFilter("alle")}
            className="text-xs text-amber-700 hover:text-amber-900 font-medium"
          >
            Nullstill filter ✕
          </button>
        </div>
      )}

      {/* Løsningstabell */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            Registrerte KI-løsninger ({filtrerteLosninger.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produkt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Helseforetak</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CE / MDR</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Act</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">DPIA</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Innmeldt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrerteLosninger.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{l.produktnavn}</p>
                    <p className="text-xs text-gray-500">{l.leverandor}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 text-xs">{l.helseforetak.split("(")[0].trim()}</p>
                    <p className="text-xs text-gray-400">{l.rhf.replace("Helse ", "")}</p>
                  </td>
                  <td className="px-4 py-3">
                    <GodkjenningsBadge status={l.godkjenningsStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${l.ceMerket === "ja" ? "bg-blue-50 text-blue-700" : l.ceMerket === "nei" ? "bg-gray-100 text-gray-500" : "bg-yellow-50 text-yellow-700"}`}>
                      {l.ceMerket === "ja" ? `CE · ${l.mdrKlasse || "–"}` : l.ceMerket === "nei" ? "Ikke CE" : "Vet ikke"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {l.aiActRisiko === "hoy-medisinsk" || l.aiActRisiko === "hoy-annex3" ? (
                        <span className="text-red-600 font-medium">Høy</span>
                      ) : l.aiActRisiko === "begrenset" ? (
                        <span className="text-yellow-600">Begrenset</span>
                      ) : l.aiActRisiko === "minimal" ? (
                        <span className="text-green-600">Minimal</span>
                      ) : "Ukjent"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${l.dpiaGjennomfort === "ja" ? "bg-green-50 text-green-700" : l.dpiaGjennomfort === "pagaar" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>
                      {l.dpiaGjennomfort === "ja" ? "Ja" : l.dpiaGjennomfort === "pagaar" ? "Pågår" : "Nei"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{formatDato(l.innmeldtDato)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/utforsk/${l.id}`}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Vis →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function VarselKort({
  tittel, antall, ikon, farge, aktiv, onClick,
}: {
  tittel: string;
  antall: number;
  ikon: React.ReactNode;
  farge: string;
  aktiv: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-all ${farge} ${aktiv ? "ring-2 ring-offset-1 ring-gray-400 shadow-md" : "hover:shadow-sm"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {ikon}
        <span className="text-2xl font-bold">{antall}</span>
      </div>
      <p className="text-xs font-medium leading-tight">{tittel}</p>
    </button>
  );
}

function StatLinje({ label, verdi, farge }: { label: string; verdi: number; farge?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-semibold ${farge || "text-gray-800"}`}>{verdi}</span>
    </div>
  );
}
