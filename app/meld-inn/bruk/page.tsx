"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRolle } from "@/lib/context/RolleContext";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { HELSEFORETAK_PER_RHF } from "@/lib/types";
import type { RHF, BruksOmfang } from "@/lib/types";
import { Stepper } from "@/components/forms/Stepper";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
  Users,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  Send,
  Save,
} from "lucide-react";
import Link from "next/link";
import { Shield } from "lucide-react";

const STEG = [
  { nummer: 1, tittel: "Velg KI-løsning" },
  { nummer: 2, tittel: "Beskriv bruk" },
  { nummer: 3, tittel: "Organisasjon" },
  { nummer: 4, tittel: "Omfang & send" },
];

const RHF_LISTE: RHF[] = [
  "Helse Sør-Øst",
  "Helse Vest",
  "Helse Midt-Norge",
  "Helse Nord",
];

const OMFANG_ETIKETTER: Record<BruksOmfang, string> = {
  pilot: "Begrenset pilot (< 50 pasienter)",
  avdeling: "Én avdeling",
  foretak: "Hele helseforetaket",
  regionalt: "Regionalt / RHF-nivå",
};

const VARIGHET_ETIKETTER: Record<string, string> = {
  "under-3-mnd": "Under 3 måneder",
  "3-12-mnd": "3–12 måneder",
  "over-1-aar": "Over 1 år",
  lopende: "Løpende / ubegrenset",
};

interface FormData {
  // Steg 1
  kiLosningId: string;
  // Steg 2
  planlagtBruk: string;
  erInnenforGodkjenning: "ja" | "nei" | "usikker" | "";
  begrunnelseAvvik: string;
  // Steg 3
  rhf: RHF | "";
  helseforetak: string;
  klinikk: string;
  seksjon: string;
  lederNavn: string;
  lederTittel: string;
  lederEpost: string;
  // Steg 4
  omfang: BruksOmfang | "";
  estimertAntallPasienter: string;
  planlagtOppstart: string;
  planlagtVarighet: string;
}

const AUTOSAVE_KEY = "ki-bruksmelding-utkast";

const TOM_FORM: FormData = {
  kiLosningId: "",
  planlagtBruk: "",
  erInnenforGodkjenning: "",
  begrunnelseAvvik: "",
  rhf: "",
  helseforetak: "",
  klinikk: "",
  seksjon: "",
  lederNavn: "",
  lederTittel: "",
  lederEpost: "",
  omfang: "",
  estimertAntallPasienter: "",
  planlagtOppstart: "",
  planlagtVarighet: "",
};

export default function MeldInnBrukPage() {
  const { bruker } = useRolle();
  const [aktivtSteg, setAktivtSteg] = useState(1);
  const [form, setForm] = useState<FormData>(() => {
    try {
      const lagret = localStorage.getItem(AUTOSAVE_KEY);
      if (lagret) return JSON.parse(lagret) as FormData;
    } catch { /* ignorer */ }
    return {
      ...TOM_FORM,
      rhf: (bruker.rhf as RHF) || "",
      helseforetak: bruker.helseforetak || "",
      lederNavn: bruker.navn || "",
    };
  });
  const [sok, setSok] = useState("");
  const [sendt, setSendt] = useState(false);
  const [harUtkast, setHarUtkast] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sjekk om det finnes et lagret utkast
  useEffect(() => {
    try {
      setHarUtkast(!!localStorage.getItem(AUTOSAVE_KEY));
    } catch { /* ignorer */ }
  }, []);

  // Autosave med 2 sekunders debounce
  useEffect(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
        setHarUtkast(true);
      } catch { /* ignorer */ }
    }, 2000);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form]);

  const sokResultater = useMemo(() => {
    if (sok.trim().length < 2) return [];
    const q = sok.toLowerCase();
    return MOCKDATA_LOSNINGER.filter(
      (l) =>
        l.produktnavn.toLowerCase().includes(q) ||
        l.leverandor.toLowerCase().includes(q) ||
        l.tiltenktBruksomrade.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [sok]);

  const valgtLosning = MOCKDATA_LOSNINGER.find((l) => l.id === form.kiLosningId);

  const helseforetak = form.rhf
    ? HELSEFORETAK_PER_RHF[form.rhf as RHF] ?? []
    : [];

  function oppdater<K extends keyof FormData>(felt: K, verdi: FormData[K]) {
    setForm((prev) => ({ ...prev, [felt]: verdi }));
  }

  function kanGaVidere(): boolean {
    switch (aktivtSteg) {
      case 1:
        return !!form.kiLosningId;
      case 2:
        return (
          form.planlagtBruk.trim().length >= 20 &&
          !!form.erInnenforGodkjenning &&
          (form.erInnenforGodkjenning === "ja" ||
            form.begrunnelseAvvik.trim().length >= 50)
        );
      case 3:
        return (
          !!form.rhf &&
          !!form.helseforetak &&
          form.klinikk.trim().length > 0 &&
          form.lederNavn.trim().length > 0 &&
          form.lederEpost.includes("@")
        );
      case 4: {
        const antall = parseInt(form.estimertAntallPasienter);
        const oppstart = form.planlagtOppstart
          ? new Date(form.planlagtOppstart)
          : null;
        const idag = new Date();
        idag.setHours(0, 0, 0, 0);
        return (
          !!form.omfang &&
          antall > 0 &&
          antall <= 500000 &&
          !!oppstart &&
          oppstart >= idag &&
          !!form.planlagtVarighet
        );
      }
      default:
        return false;
    }
  }

  function sendSkjema() {
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignorer */ }
    setSendt(true);
  }

  function nullstillUtkast() {
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch { /* ignorer */ }
    setHarUtkast(false);
    setForm({
      ...TOM_FORM,
      rhf: (bruker.rhf as RHF) || "",
      helseforetak: bruker.helseforetak || "",
      lederNavn: bruker.navn || "",
    });
    setAktivtSteg(1);
    setSok("");
  }

  if (!["virksomhetsleder", "klinisk-leder", "rhf-koordinator"].includes(bruker.rolle)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
          <Shield className="text-amber-500 mx-auto mb-3" size={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Begrenset tilgang</h2>
          <p className="text-sm text-gray-600 mb-4">
            Bruksmeldingsskjemaet er kun tilgjengelig for virksomhetsledere, kliniske ledere og
            RHF-koordinatorer. Velg riktig rolle øverst.
          </p>
          <Link href="/" className="text-primary-600 text-sm hover:underline">
            ← Til forsiden
          </Link>
        </div>
      </div>
    );
  }

  if (sendt) {
    const ref = `BRUK-2025-${String(Math.floor(Math.random() * 900) + 100)}`;
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-10">
          <CheckCircle2 className="text-green-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bruksmelding sendt!</h2>
          <p className="text-sm text-gray-600 mb-1">
            Meldingen er registrert med referansenummer:
          </p>
          <p className="text-lg font-mono font-bold text-primary-600 mb-4">{ref}</p>
          <p className="text-sm text-gray-500 mb-6">
            Helsetilsynet vil behandle meldingen og ta kontakt ved behov. Forventet saksbehandlingstid er 5–10 virkedager.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/utforsk"
              className="px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              Utforsk KI-løsninger
            </Link>
            <button
              onClick={nullstillUtkast}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Meld inn ny bruk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Tittel */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meld inn bruk av KI-løsning</h1>
        <p className="text-sm text-gray-500 mt-1">
          Virksomhetsleder skal melde til Helsetilsynet ved planlagt bruk av godkjente KI-løsninger i klinisk praksis.
        </p>
      </div>

      {/* Autosave-banner */}
      {harUtkast && aktivtSteg === 1 && !form.kiLosningId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Save size={15} />
            Du har et lagret utkast. Fortsett der du slapp, eller start på nytt.
          </div>
          <button
            onClick={nullstillUtkast}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
          >
            Start på nytt
          </button>
        </div>
      )}

      {/* Stepper */}
      <Stepper steg={STEG} aktivtSteg={aktivtSteg} />

      {/* Steg-innhold */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
        {aktivtSteg === 1 && (
          <Steg1
            sok={sok}
            setSok={setSok}
            sokResultater={sokResultater}
            valgtId={form.kiLosningId}
            onVelg={(id) => oppdater("kiLosningId", id)}
            valgtLosning={valgtLosning}
          />
        )}
        {aktivtSteg === 2 && valgtLosning && (
          <Steg2
            losning={valgtLosning}
            form={form}
            oppdater={oppdater}
          />
        )}
        {aktivtSteg === 3 && (
          <Steg3
            form={form}
            oppdater={oppdater}
            helseforetakListe={helseforetak}
            rhfListe={RHF_LISTE}
          />
        )}
        {aktivtSteg === 4 && valgtLosning && (
          <Steg4
            form={form}
            oppdater={oppdater}
            losning={valgtLosning}
          />
        )}
      </div>

      {/* Navigasjon */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setAktivtSteg((s) => Math.max(1, s - 1))}
          disabled={aktivtSteg === 1}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Forrige
        </button>

        {aktivtSteg < 4 ? (
          <button
            onClick={() => setAktivtSteg((s) => s + 1)}
            disabled={!kanGaVidere()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Neste
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={sendSkjema}
            disabled={!kanGaVidere()}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
            Send bruksmelding
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Steg 1: Velg løsning ──────────────────────────────────────────────────

function Steg1({
  sok,
  setSok,
  sokResultater,
  valgtId,
  onVelg,
  valgtLosning,
}: {
  sok: string;
  setSok: (v: string) => void;
  sokResultater: ReturnType<typeof MOCKDATA_LOSNINGER.filter>;
  valgtId: string;
  onVelg: (id: string) => void;
  valgtLosning: (typeof MOCKDATA_LOSNINGER)[0] | undefined;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
        <Search size={18} className="text-primary-500" />
        Søk etter KI-løsning
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Søk på produktnavn, leverandør eller bruksområde for å finne løsningen du planlegger å ta i bruk.
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          placeholder="F.eks. «MammoAssist», «Sectra», «bildediagnostikk»…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {sokResultater.length > 0 && (
        <div className="space-y-2 mb-4">
          {sokResultater.map((l) => (
            <button
              key={l.id}
              onClick={() => onVelg(l.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                valgtId === l.id
                  ? "border-primary-400 bg-primary-50 ring-1 ring-primary-300"
                  : "border-gray-200 hover:border-primary-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{l.produktnavn}</p>
                  <p className="text-xs text-gray-500">{l.leverandor} · {l.helseforetak.split("(")[0].trim()}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{l.tiltenktBruksomrade}</p>
                </div>
                <GodkjenningsBadge status={l.godkjenningsStatus} />
              </div>
            </button>
          ))}
        </div>
      )}

      {sok.trim().length >= 2 && sokResultater.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 mb-4">
          Ingen løsninger funnet for «{sok}». Prøv et annet søkeord.
        </div>
      )}

      {valgtLosning && (
        <>
          <div className={`border rounded-lg p-4 ${
            valgtLosning.godkjenningsStatus === "ikke-godkjent"
              ? "bg-red-50 border-red-200"
              : valgtLosning.godkjenningsStatus === "under-utproving"
              ? "bg-amber-50 border-amber-200"
              : "bg-green-50 border-green-200"
          }`}>
            <p className={`text-xs font-semibold mb-1 ${
              valgtLosning.godkjenningsStatus === "ikke-godkjent"
                ? "text-red-700"
                : valgtLosning.godkjenningsStatus === "under-utproving"
                ? "text-amber-700"
                : "text-green-700"
            }`}>Valgt løsning:</p>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{valgtLosning.produktnavn}</p>
                <p className="text-xs text-gray-500">{valgtLosning.leverandor}</p>
              </div>
              <GodkjenningsBadge status={valgtLosning.godkjenningsStatus} />
            </div>
          </div>
          {valgtLosning.godkjenningsStatus === "under-utproving" && (
            <div className="mt-2 bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                <strong>Advarsel:</strong> Denne løsningen er under utprøving og ikke fullvalidert for produksjonsbruk.
                Bruk utenfor godkjent studie krever særskilt begrunnelse.
              </p>
            </div>
          )}
          {valgtLosning.godkjenningsStatus === "ikke-godkjent" && (
            <div className="mt-2 bg-red-50 border border-red-300 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={15} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                <strong>OBS:</strong> Denne løsningen er ikke godkjent. Du kan fortsette for å melde inn planlagt bruk,
                men Helsetilsynet vil behandle dette med ekstra grundighet.
              </p>
            </div>
          )}
        </>
      )}

      {!valgtLosning && sok.trim().length === 0 && (
        <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-6 text-center">
          <Info size={20} className="mx-auto mb-2 text-gray-300" />
          Skriv minst 2 tegn for å søke i registeret over godkjente KI-løsninger.
        </div>
      )}
    </div>
  );
}

// ─── Steg 2: Beskriv bruk ──────────────────────────────────────────────────

function Steg2({
  losning,
  form,
  oppdater,
}: {
  losning: (typeof MOCKDATA_LOSNINGER)[0];
  form: FormData;
  oppdater: <K extends keyof FormData>(felt: K, verdi: FormData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
        <CheckCircle2 size={18} className="text-primary-500" />
        Beskriv planlagt bruk
      </h2>

      {/* Løsnings-sammendrag */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5 text-sm">
        <p className="font-semibold text-blue-800 mb-1">{losning.produktnavn}</p>
        <p className="text-blue-700 text-xs mb-2">{losning.tiltenktBruksomrade}</p>
        <div className="flex flex-wrap gap-3 text-xs text-blue-600">
          <span>Status: <GodkjenningsBadge status={losning.godkjenningsStatus} /></span>
          <span>CE-merket: {losning.ceMerket === "ja" ? `Ja (MDR ${losning.mdrKlasse || "–"})` : losning.ceMerket === "nei" ? "Nei" : "Vet ikke"}</span>
          <span>AI Act: {losning.aiActRisiko}</span>
        </div>
      </div>

      {/* Planlagt bruk */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beskriv din planlagte bruk <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Forklar konkret hvordan løsningen vil bli brukt i klinisk praksis, herunder pasientgruppe, klinisk kontekst og rolle i beslutningsprosessen.
        </p>
        <textarea
          value={form.planlagtBruk}
          onChange={(e) => oppdater("planlagtBruk", e.target.value)}
          rows={5}
          placeholder="F.eks.: «Løsningen vil brukes til automatisk screening av …, og vil fungere som beslutningsstøtte for radiologer ved …»"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {form.planlagtBruk.length}/20 tegn minimum
        </p>
      </div>

      {/* Innenfor godkjenning */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Er bruken innenfor løsningens godkjente bruksområde? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["ja", "usikker", "nei"] as const).map((val) => (
            <button
              key={val}
              onClick={() => oppdater("erInnenforGodkjenning", val)}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                form.erInnenforGodkjenning === val
                  ? val === "ja"
                    ? "bg-green-50 border-green-400 text-green-700 ring-1 ring-green-300"
                    : val === "usikker"
                    ? "bg-amber-50 border-amber-400 text-amber-700 ring-1 ring-amber-300"
                    : "bg-red-50 border-red-400 text-red-700 ring-1 ring-red-300"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {val === "ja" ? "Ja" : val === "usikker" ? "Usikker" : "Nei / off-label"}
            </button>
          ))}
        </div>
      </div>

      {/* Avvik-begrunnelse */}
      {(form.erInnenforGodkjenning === "nei" || form.erInnenforGodkjenning === "usikker") && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <label className="text-sm font-medium text-amber-800">
              Begrunn avviket / usikkerheten <span className="text-red-500">*</span>
            </label>
          </div>
          <p className="text-xs text-amber-700 mb-2">
            Beskriv hvorfor du er usikker på eller planlegger bruk utenfor godkjent bruksområde. Tilsynet vil vurdere dette særskilt.
          </p>
          <textarea
            value={form.begrunnelseAvvik}
            onChange={(e) => oppdater("begrunnelseAvvik", e.target.value)}
            rows={3}
            placeholder="F.eks.: «Valideringsstudien inkluderte ikke vår pasientgruppe (samiskspråklige, 70+), og vi er usikre på overførbarheten.»"
            className="w-full px-3 py-2.5 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white resize-none"
          />
          <p className="text-xs text-amber-700 mt-1">
            {form.begrunnelseAvvik.length}/50 tegn minimum
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Steg 3: Organisasjon ─────────────────────────────────────────────────

function Steg3({
  form,
  oppdater,
  helseforetakListe,
  rhfListe,
}: {
  form: FormData;
  oppdater: <K extends keyof FormData>(felt: K, verdi: FormData[K]) => void;
  helseforetakListe: string[];
  rhfListe: RHF[];
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
        <Building2 size={18} className="text-primary-500" />
        Organisasjonsopplysninger
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Oppgi virksomheten og ansvarlig leder som melder inn bruken.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* RHF */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            RHF <span className="text-red-500">*</span>
          </label>
          <select
            value={form.rhf}
            onChange={(e) => {
              oppdater("rhf", e.target.value as RHF);
              oppdater("helseforetak", "");
            }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">Velg RHF</option>
            {rhfListe.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Helseforetak */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Helseforetak <span className="text-red-500">*</span>
          </label>
          <select
            value={form.helseforetak}
            onChange={(e) => oppdater("helseforetak", e.target.value)}
            disabled={!form.rhf}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">Velg helseforetak</option>
            {helseforetakListe.map((hf) => (
              <option key={hf} value={hf}>{hf}</option>
            ))}
          </select>
        </div>

        {/* Klinikk */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Klinikk / avdeling <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.klinikk}
            onChange={(e) => oppdater("klinikk", e.target.value)}
            placeholder="F.eks. Radiologisk avdeling"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>

        {/* Seksjon */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Seksjon <span className="text-gray-400">(valgfritt)</span>
          </label>
          <input
            type="text"
            value={form.seksjon}
            onChange={(e) => oppdater("seksjon", e.target.value)}
            placeholder="F.eks. Seksjon for brystdiagnostikk"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mt-4">
        <p className="text-xs font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
          <Users size={14} /> Ansvarlig leder
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Navn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lederNavn}
              onChange={(e) => oppdater("lederNavn", e.target.value)}
              placeholder="Fullt navn"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tittel
            </label>
            <input
              type="text"
              value={form.lederTittel}
              onChange={(e) => oppdater("lederTittel", e.target.value)}
              placeholder="F.eks. Seksjonsoverlege"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              E-post <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.lederEpost}
              onChange={(e) => oppdater("lederEpost", e.target.value)}
              placeholder="leder@helseforetak.no"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Steg 4: Omfang + oppsummering ────────────────────────────────────────

function Steg4({
  form,
  oppdater,
  losning,
}: {
  form: FormData;
  oppdater: <K extends keyof FormData>(felt: K, verdi: FormData[K]) => void;
  losning: (typeof MOCKDATA_LOSNINGER)[0];
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1 flex items-center gap-2">
        <CalendarCheck size={18} className="text-primary-500" />
        Omfang og oppsummering
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Angi planlagt omfang, så kan du se over all informasjonen før innsending.
      </p>

      {/* Omfang-velger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {(Object.entries(OMFANG_ETIKETTER) as [BruksOmfang, string][]).map(([verdi, etikett]) => (
          <button
            key={verdi}
            onClick={() => oppdater("omfang", verdi)}
            className={`px-3 py-2.5 rounded-lg border text-xs font-medium text-left transition-all leading-tight ${
              form.omfang === verdi
                ? "bg-primary-50 border-primary-400 text-primary-700 ring-1 ring-primary-300"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {etikett}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Est. pasienter / år <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={form.estimertAntallPasienter}
            onChange={(e) => oppdater("estimertAntallPasienter", e.target.value)}
            placeholder="F.eks. 4200"
            min={1}
            max={500000}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              parseInt(form.estimertAntallPasienter) > 500000
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {parseInt(form.estimertAntallPasienter) > 500000 && (
            <p className="text-xs text-red-600 mt-1">Verdien virker urimelig høy. Kontroller estimatet.</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Planlagt oppstart <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.planlagtOppstart}
            onChange={(e) => oppdater("planlagtOppstart", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              form.planlagtOppstart && new Date(form.planlagtOppstart) < new Date()
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {form.planlagtOppstart && new Date(form.planlagtOppstart) < new Date(new Date().toISOString().split("T")[0]) && (
            <p className="text-xs text-red-600 mt-1">Oppstartsdato kan ikke være i fortiden.</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Planlagt varighet <span className="text-red-500">*</span>
          </label>
          <select
            value={form.planlagtVarighet}
            onChange={(e) => oppdater("planlagtVarighet", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">Velg varighet</option>
            {Object.entries(VARIGHET_ETIKETTER).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Oppsummering */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Oppsummering</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <OppsumRad label="Løsning" verdi={losning.produktnavn} />
          <OppsumRad label="Leverandør" verdi={losning.leverandor} />
          <OppsumRad label="Helseforetak" verdi={form.helseforetak} />
          <OppsumRad label="Klinikk" verdi={form.klinikk} />
          {form.seksjon && <OppsumRad label="Seksjon" verdi={form.seksjon} />}
          <OppsumRad label="Ansvarlig leder" verdi={form.lederNavn} />
          <OppsumRad
            label="Innenfor godkjenning"
            verdi={
              form.erInnenforGodkjenning === "ja"
                ? "Ja"
                : form.erInnenforGodkjenning === "nei"
                ? "Nei / off-label"
                : "Usikker"
            }
            farge={
              form.erInnenforGodkjenning === "ja"
                ? "text-green-700"
                : form.erInnenforGodkjenning === "usikker"
                ? "text-amber-700"
                : "text-red-700"
            }
          />
          <OppsumRad label="Omfang" verdi={form.omfang ? OMFANG_ETIKETTER[form.omfang] : "–"} />
          <OppsumRad label="Est. pasienter/år" verdi={form.estimertAntallPasienter || "–"} />
          <OppsumRad label="Planlagt oppstart" verdi={form.planlagtOppstart || "–"} />
          <OppsumRad
            label="Varighet"
            verdi={form.planlagtVarighet ? VARIGHET_ETIKETTER[form.planlagtVarighet] : "–"}
          />
        </div>
        {form.planlagtBruk && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-xs font-medium text-gray-600 mb-1">Planlagt bruk:</p>
            <p className="text-xs text-gray-700 leading-relaxed">{form.planlagtBruk}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OppsumRad({
  label,
  verdi,
  farge,
}: {
  label: string;
  verdi: string;
  farge?: string;
}) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 min-w-[120px] shrink-0">{label}:</span>
      <span className={`font-medium text-gray-800 ${farge || ""}`}>{verdi || "–"}</span>
    </div>
  );
}
