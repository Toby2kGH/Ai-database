"use client";

import { useState } from "react";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { MOCKDATA_BRUKSMELDINGER } from "@/lib/data/bruksmeldinger";
import { NorgesKart, KartModus } from "@/components/kart/NorgesKart";
import { Map, Activity } from "lucide-react";

export default function KartPage() {
  const [kartmodus, setKartmodus] = useState<KartModus>("losninger");

  const godkjenteLosninger = MOCKDATA_LOSNINGER.filter(
    (l) => l.godkjenningsStatus === "godkjent"
  ).length;
  const aktiveBruksmeldinger = MOCKDATA_BRUKSMELDINGER.filter(
    (m) => m.status === "godkjent"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Topptittel og toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Norgeskartet</h1>
          <p className="text-sm text-gray-500 mt-1">
            {kartmodus === "losninger"
              ? "Geografisk oversikt over innmeldte KI-løsninger ved norske helseforetak"
              : "Geografisk oversikt over innmeldt aktiv bruk av KI-løsninger"}
          </p>
        </div>

        {/* Lag-toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
          <button
            onClick={() => setKartmodus("losninger")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              kartmodus === "losninger"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Map size={15} />
            Innmeldte løsninger
          </button>
          <button
            onClick={() => setKartmodus("bruk")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              kartmodus === "bruk"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity size={15} />
            Aktiv bruk
          </button>
        </div>
      </div>

      {/* Kart */}
      <NorgesKart
        losninger={MOCKDATA_LOSNINGER}
        bruksmeldinger={MOCKDATA_BRUKSMELDINGER}
        kartmodus={kartmodus}
      />

      {/* Statistikkboks under kartet */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kartmodus === "losninger" ? (
          <>
            <StatBox
              label="Helseforetak med løsninger"
              verdi={new Set(MOCKDATA_LOSNINGER.map((l) => l.helseforetak)).size}
            />
            <StatBox label="Totalt innmeldte løsninger" verdi={MOCKDATA_LOSNINGER.length} />
            <StatBox label="Godkjente løsninger" verdi={godkjenteLosninger} highlight />
            <StatBox label="RHF representert" verdi={4} />
          </>
        ) : (
          <>
            <StatBox
              label="Helseforetak med bruksmeldinger"
              verdi={new Set(MOCKDATA_BRUKSMELDINGER.map((m) => m.helseforetak)).size}
            />
            <StatBox label="Totalt bruksmeldinger" verdi={MOCKDATA_BRUKSMELDINGER.length} />
            <StatBox label="Godkjent bruk" verdi={aktiveBruksmeldinger} highlight />
            <StatBox
              label="Til oppfølging / avvist"
              verdi={
                MOCKDATA_BRUKSMELDINGER.filter(
                  (m) => m.status === "til-oppfolging" || m.status === "avvist"
                ).length
              }
              warning
            />
          </>
        )}
      </div>

      {/* Informasjonsboks */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        {kartmodus === "losninger" ? (
          <>
            <strong>Om dette laget:</strong> Viser alle KI-løsninger som er innmeldt av helseforetak.
            Farge angir dominerende godkjenningsstatus per foretak. Klikk på en pin for detaljer om
            enkeltløsninger, med lenke til fullstendig registrering og DMP-kobling.
          </>
        ) : (
          <>
            <strong>Om dette laget:</strong> Viser bruksmeldinger innmeldt av virksomhetsledere.
            Farge angir behandlingsstatus for Helsetilsynets oppfølging.{" "}
            <span className="text-amber-700 font-medium">Gule og røde pins</span> indikerer meldinger
            som krever tilsynsoppfølging.
          </>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  verdi,
  highlight,
  warning,
}: {
  label: string;
  verdi: number;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "bg-primary-50 border-primary-200"
          : warning
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-gray-200"
      }`}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-primary-700" : warning ? "text-amber-700" : "text-gray-800"
        }`}
      >
        {verdi}
      </p>
    </div>
  );
}
