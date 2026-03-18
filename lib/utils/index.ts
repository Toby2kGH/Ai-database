import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GodkjenningsStatus, KILosning, RHF } from "../types";

// shadcn/ui standard hjelpefunksjon
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatering av dato til norsk format
export function formatDato(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Godkjenningsstatus til lesbar tekst
export function godkjenningsStatusTekst(status: GodkjenningsStatus): string {
  const map: Record<GodkjenningsStatus, string> = {
    "godkjent": "Godkjent",
    "delvis": "Delvis godkjent",
    "ikke-godkjent": "Ikke godkjent",
    "under-utproving": "Under utprøving",
    "ukjent": "Ukjent status",
  };
  return map[status];
}

// Godkjenningsstatus til CSS-klasse
export function godkjenningsStatusKlasse(status: GodkjenningsStatus): string {
  const map: Record<GodkjenningsStatus, string> = {
    "godkjent": "badge-godkjent",
    "delvis": "badge-delvis",
    "ikke-godkjent": "badge-ikke-godkjent",
    "under-utproving": "badge-ikke-godkjent",
    "ukjent": "badge-ukjent",
  };
  return map[status];
}

// Godkjenningsstatus til farge for kart-pin
export function godkjenningsStatusFarge(status: GodkjenningsStatus): string {
  const map: Record<GodkjenningsStatus, string> = {
    "godkjent": "#16a34a",
    "delvis": "#ca8a04",
    "ikke-godkjent": "#dc2626",
    "under-utproving": "#ea580c",
    "ukjent": "#6b7280",
  };
  return map[status];
}

// Algoritme-type til lesbar tekst
export function algoritmeTypeTekst(type: string): string {
  const map: Record<string, string> = {
    "dyp-laering": "Dyp læring / nevrale nettverk",
    "klassisk-ml": "Klassisk maskinlæring",
    "llm": "Store språkmodeller (LLM)",
    "regelbasert-ml": "Regelbasert + ML hybrid",
    "annet": "Annet",
  };
  return map[type] || type;
}

// AI Act risiko til lesbar tekst
export function aiActTekst(risiko: string): string {
  const map: Record<string, string> = {
    "hoy-medisinsk": "Høy risiko – medisinsk utstyr",
    "hoy-annex3": "Høy risiko – Annex III",
    "begrenset": "Begrenset risiko",
    "minimal": "Minimal risiko",
    "ukjent": "Vet ikke",
  };
  return map[risiko] || risiko;
}

// Klinisk funksjon til lesbar tekst
export function kliniskFunksjonTekst(funksjon: string): string {
  const map: Record<string, string> = {
    "diagnostikk-bildediagnostikk": "Diagnostisk støtte (bildediagnostikk)",
    "diagnostikk-lab": "Diagnostisk støtte (laboratorium/patologi)",
    "klinisk-beslutningsstotte": "Klinisk beslutningsstøtte",
    "risikovurdering-triagering": "Risikovurdering/triagering",
    "pasientovervaking": "Pasientovervåkning",
    "administrativ-automatisering": "Administrativ automatisering",
    "medikamenthandtering": "Medikamenthåndtering",
    "kirurgisk-planlegging": "Kirurgisk planlegging/assistanse",
    "befolkningshelseanalyse": "Befolkningshelseanalyse",
    "annet": "Annet",
  };
  return map[funksjon] || funksjon;
}

// Statistikk-beregninger for dashboard
export function beregnStatistikk(losninger: KILosning[]) {
  const perRHF: Record<RHF, number> = {
    "Helse Sør-Øst": 0,
    "Helse Vest": 0,
    "Helse Midt-Norge": 0,
    "Helse Nord": 0,
  };

  const perStatus: Record<GodkjenningsStatus, number> = {
    "godkjent": 0,
    "delvis": 0,
    "ikke-godkjent": 0,
    "under-utproving": 0,
    "ukjent": 0,
  };

  const perFagfelt: Record<string, number> = {};

  for (const l of losninger) {
    perRHF[l.rhf]++;
    perStatus[l.godkjenningsStatus]++;
    for (const f of l.fagfelt) {
      perFagfelt[f] = (perFagfelt[f] || 0) + 1;
    }
  }

  const topFagfelt = Object.entries(perFagfelt)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return { perRHF, perStatus, topFagfelt };
}

// Eksport til CSV
export function eksporterCSV(losninger: KILosning[]): string {
  const headers = [
    "Referansenummer",
    "Produktnavn",
    "Leverandør",
    "RHF",
    "Helseforetak",
    "Fagfelt",
    "Godkjenningsstatus",
    "CE-merket",
    "MDR-klasse",
    "AI Act risiko",
    "Innmeldt dato",
  ];

  const rader = losninger.map((l) => [
    l.referansenummer,
    l.produktnavn,
    l.leverandor,
    l.rhf,
    l.helseforetak,
    l.fagfelt.join("; "),
    godkjenningsStatusTekst(l.godkjenningsStatus),
    l.ceMerket === "ja" ? "Ja" : l.ceMerket === "nei" ? "Nei" : "Vet ikke",
    l.mdrKlasse || "",
    aiActTekst(l.aiActRisiko),
    formatDato(l.innmeldtDato),
  ]);

  const linjer = [headers, ...rader].map((rad) =>
    rad.map((felt) => `"${felt}"`).join(",")
  );

  return linjer.join("\n");
}
