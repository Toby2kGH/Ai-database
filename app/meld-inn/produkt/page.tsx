"use client";

import { useState } from "react";
import { useRolle } from "@/lib/context/RolleContext";
import { Stepper } from "@/components/forms/Stepper";
import { HELSEFORETAK_PER_RHF, RHF } from "@/lib/types";
import { AlertTriangle, CheckCircle, ExternalLink, Info } from "lucide-react";
import Link from "next/link";

const STEG = [
  { nummer: 1, tittel: "Organisasjon" },
  { nummer: 2, tittel: "Produkt" },
  { nummer: 3, tittel: "Klinisk bruk" },
  { nummer: 4, tittel: "Validering" },
  { nummer: 5, tittel: "Oppsummering" },
];

const FAGFELT_LISTE = [
  "Radiologi", "Patologi", "Kardiologi", "Onkologi", "Akuttmedisin",
  "Psykiatri", "Nevrologi", "Gastroenterologi", "Ortopedi",
  "Generell indremedisin", "Allmennmedisin", "Intensivmedisin", "Øvrig",
];

const KLINISKE_FUNKSJONER = [
  { verdi: "diagnostikk-bildediagnostikk", label: "Diagnostisk støtte (bildediagnostikk)" },
  { verdi: "diagnostikk-lab", label: "Diagnostisk støtte (laboratorium/patologi)" },
  { verdi: "klinisk-beslutningsstotte", label: "Klinisk beslutningsstøtte" },
  { verdi: "risikovurdering-triagering", label: "Risikovurdering/triagering" },
  { verdi: "pasientovervaking", label: "Pasientovervåkning" },
  { verdi: "administrativ-automatisering", label: "Administrativ automatisering (journalnotat, koding)" },
  { verdi: "medikamenthandtering", label: "Medikamenthåndtering" },
  { verdi: "kirurgisk-planlegging", label: "Kirurgisk planlegging/assistanse" },
  { verdi: "befolkningshelseanalyse", label: "Befolkningshelseanalyse" },
  { verdi: "annet", label: "Annet" },
];

const BEHANDLINGSGRUNNLAG = [
  "Samtykke", "Hjemmel i helselovgivning", "Vitenskapelig forskning", "Annet"
];

type FormData = {
  // Steg 1
  rhf: RHF | "";
  helseforetak: string;
  klinikk: string;
  fagfelt: string[];
  lederNavn: string;
  lederTittel: string;
  lederEpost: string;
  itKontaktNavn: string;
  itKontaktEpost: string;
  // Steg 2
  produktnavn: string;
  leverandor: string;
  dmpUrl: string;
  versjonsnummer: string;
  ceMerket: string;
  mdrKlasse: string;
  udiNummer: string;
  aiActRisiko: string;
  algoritmeType: string;
  kontinuerligLaerende: string;
  // Steg 3
  tiltenktBruksomrade: string;
  kliniskFunksjon: string[];
  godkjenningsStatus: string;
  epjIntegrasjon: string;
  epjSystem: string;
  pasientAlder: string[];
  brukersted: string[];
  // Steg 4
  lokalValidering: string;
  valideringsDato: string;
  valideringsAntallPasienter: string;
  dpiaGjennomfort: string;
  norskInfrastruktur: string;
  behandlingsgrunnlag: string[];
  avvikshendelser: string;
  avvikskommentar: string;
  // Steg 5
  bekreftet: boolean;
};

const INITIAL_DATA: FormData = {
  rhf: "", helseforetak: "", klinikk: "", fagfelt: [],
  lederNavn: "", lederTittel: "", lederEpost: "",
  itKontaktNavn: "", itKontaktEpost: "",
  produktnavn: "", leverandor: "", dmpUrl: "", versjonsnummer: "",
  ceMerket: "", mdrKlasse: "", udiNummer: "",
  aiActRisiko: "", algoritmeType: "", kontinuerligLaerende: "",
  tiltenktBruksomrade: "", kliniskFunksjon: [], godkjenningsStatus: "",
  epjIntegrasjon: "", epjSystem: "", pasientAlder: [], brukersted: [],
  lokalValidering: "", valideringsDato: "", valideringsAntallPasienter: "",
  dpiaGjennomfort: "", norskInfrastruktur: "", behandlingsgrunnlag: [],
  avvikshendelser: "", avvikskommentar: "",
  bekreftet: false,
};

export default function MeldInnProduktPage() {
  const { bruker } = useRolle();
  const [aktivtSteg, setAktivtSteg] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [sendt, setSendt] = useState(false);
  const [referansenummer] = useState(
    `HSO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`
  );

  // Sjekk tilgang
  if (!["klinisk-leder", "it-sikkerhet", "rhf-koordinator", "tilsynsansvarlig"].includes(bruker.rolle)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
          <AlertTriangle className="text-amber-500 mx-auto mb-3" size={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Innlogging kreves</h2>
          <p className="text-sm text-gray-600 mb-4">
            Du må velge en rolle med innmeldingstilgang øverst på siden (f.eks. Klinisk leder).
          </p>
          <Link href="/" className="text-primary-600 text-sm hover:underline">← Til forsiden</Link>
        </div>
      </div>
    );
  }

  if (sendt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Innmelding registrert!</h2>
          <p className="text-sm text-gray-600 mb-4">
            KI-løsningen er nå registrert i det nasjonale registeret.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Referansenummer</p>
            <p className="font-mono font-bold text-lg text-primary-600">{referansenummer}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/utforsk"
              className="bg-primary-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Se i registeret
            </Link>
            <button
              onClick={() => { setData(INITIAL_DATA); setAktivtSteg(1); setSendt(false); }}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Meld inn ny løsning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const update = (felt: keyof FormData, verdi: any) => {
    setData((prev) => ({ ...prev, [felt]: verdi }));
  };

  const toggleListe = (felt: "fagfelt" | "kliniskFunksjon" | "pasientAlder" | "brukersted" | "behandlingsgrunnlag", verdi: string) => {
    setData((prev) => {
      const liste = prev[felt] as string[];
      return {
        ...prev,
        [felt]: liste.includes(verdi) ? liste.filter((x) => x !== verdi) : [...liste, verdi],
      };
    });
  };

  const foretakListe = data.rhf ? HELSEFORETAK_PER_RHF[data.rhf as RHF] : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meld inn KI-produkt</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registrer en KI-løsning i det nasjonale oversiktsregisteret
        </p>
      </div>

      <Stepper steg={STEG} aktivtSteg={aktivtSteg} />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* STEG 1 */}
        {aktivtSteg === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Organisasjon og ansvar</h2>
            <div className="space-y-4">
              <FormFelt label="Regionalt helseforetak *">
                <select
                  value={data.rhf}
                  onChange={(e) => { update("rhf", e.target.value); update("helseforetak", ""); }}
                  className={INPUT_KLASSE}
                >
                  <option value="">Velg RHF</option>
                  {(["Helse Sør-Øst", "Helse Vest", "Helse Midt-Norge", "Helse Nord"] as RHF[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </FormFelt>

              <FormFelt label="Helseforetak *">
                <select
                  value={data.helseforetak}
                  onChange={(e) => update("helseforetak", e.target.value)}
                  disabled={!data.rhf}
                  className={INPUT_KLASSE}
                >
                  <option value="">Velg helseforetak</option>
                  {foretakListe.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </FormFelt>

              <FormFelt label="Klinikk/avdeling">
                <input
                  type="text"
                  value={data.klinikk}
                  onChange={(e) => update("klinikk", e.target.value)}
                  placeholder="F.eks. Radiologisk avdeling"
                  className={INPUT_KLASSE}
                />
              </FormFelt>

              <FormFelt label="Fagfelt (velg alle aktuelle) *">
                <div className="grid grid-cols-2 gap-2">
                  {FAGFELT_LISTE.map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.fagfelt.includes(f)}
                        onChange={() => toggleListe("fagfelt", f)}
                        className="w-4 h-4 text-primary-500 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{f}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Ansvarlig leder</h3>
                  <div className="space-y-3">
                    <input type="text" value={data.lederNavn} onChange={(e) => update("lederNavn", e.target.value)} placeholder="Fullt navn *" className={INPUT_KLASSE} />
                    <input type="text" value={data.lederTittel} onChange={(e) => update("lederTittel", e.target.value)} placeholder="Tittel (f.eks. Overlege)" className={INPUT_KLASSE} />
                    <input type="email" value={data.lederEpost} onChange={(e) => update("lederEpost", e.target.value)} placeholder="E-post *" className={INPUT_KLASSE} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">IT-kontakt</h3>
                  <div className="space-y-3">
                    <input type="text" value={data.itKontaktNavn} onChange={(e) => update("itKontaktNavn", e.target.value)} placeholder="Fullt navn" className={INPUT_KLASSE} />
                    <input type="email" value={data.itKontaktEpost} onChange={(e) => update("itKontaktEpost", e.target.value)} placeholder="E-post" className={INPUT_KLASSE} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEG 2 */}
        {aktivtSteg === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Produktinformasjon</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFelt label="Produktnavn *">
                  <input type="text" value={data.produktnavn} onChange={(e) => update("produktnavn", e.target.value)} placeholder="Navn på KI-løsningen" className={INPUT_KLASSE} />
                </FormFelt>
                <FormFelt label="Leverandør/produsent *">
                  <input type="text" value={data.leverandor} onChange={(e) => update("leverandor", e.target.value)} placeholder="Firmanavn" className={INPUT_KLASSE} />
                </FormFelt>
              </div>

              <FormFelt label="DMP/EUDAMED-lenke">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={data.dmpUrl}
                    onChange={(e) => update("dmpUrl", e.target.value)}
                    placeholder="https://dmp.no/register/..."
                    className={`${INPUT_KLASSE} flex-1`}
                  />
                  {data.dmpUrl && (
                    <a
                      href={data.dmpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100 transition-colors flex-shrink-0"
                    >
                      <ExternalLink size={12} /> Sjekk DMP
                    </a>
                  )}
                </div>
              </FormFelt>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFelt label="Versjonsnummer">
                  <input type="text" value={data.versjonsnummer} onChange={(e) => update("versjonsnummer", e.target.value)} placeholder="F.eks. 2.1.4" className={INPUT_KLASSE} />
                </FormFelt>
                <FormFelt label="CE-merket som medisinsk utstyr? *">
                  <div className="flex gap-3">
                    {["ja", "nei", "vet-ikke"].map((v) => (
                      <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="ceMerket" value={v} checked={data.ceMerket === v} onChange={(e) => update("ceMerket", e.target.value)} className="text-primary-500" />
                        <span className="text-sm">{v === "ja" ? "Ja" : v === "nei" ? "Nei" : "Vet ikke"}</span>
                      </label>
                    ))}
                  </div>
                </FormFelt>
              </div>

              {data.ceMerket === "ja" && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <FormFelt label="MDR-klasse">
                      <select value={data.mdrKlasse} onChange={(e) => update("mdrKlasse", e.target.value)} className={INPUT_KLASSE}>
                        <option value="">Velg klasse</option>
                        {["I", "IIa", "IIb", "III"].map((k) => <option key={k} value={k}>Klasse {k}</option>)}
                      </select>
                    </FormFelt>
                    <FormFelt label="UDI-nummer">
                      <input type="text" value={data.udiNummer} onChange={(e) => update("udiNummer", e.target.value)} placeholder="00000000000" className={INPUT_KLASSE} />
                    </FormFelt>
                  </div>
                </div>
              )}

              <FormFelt label="AI Act risikoklassifisering *">
                <select value={data.aiActRisiko} onChange={(e) => update("aiActRisiko", e.target.value)} className={INPUT_KLASSE}>
                  <option value="">Velg risikokategori</option>
                  <option value="hoy-medisinsk">Høy risiko – medisinsk utstyr</option>
                  <option value="hoy-annex3">Høy risiko – Annex III</option>
                  <option value="begrenset">Begrenset risiko</option>
                  <option value="minimal">Minimal risiko</option>
                  <option value="ukjent">Vet ikke</option>
                </select>
              </FormFelt>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFelt label="Algoritmetype *">
                  <select value={data.algoritmeType} onChange={(e) => update("algoritmeType", e.target.value)} className={INPUT_KLASSE}>
                    <option value="">Velg type</option>
                    <option value="dyp-laering">Dyp læring / nevrale nettverk</option>
                    <option value="klassisk-ml">Klassisk maskinlæring</option>
                    <option value="llm">Store språkmodeller (LLM)</option>
                    <option value="regelbasert-ml">Regelbasert + ML hybrid</option>
                    <option value="annet">Annet</option>
                  </select>
                </FormFelt>
                <FormFelt label="Kontinuerlig lærende modell?">
                  <div className="flex gap-3 pt-2">
                    {["ja", "nei"].map((v) => (
                      <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="kontLaerende" value={v} checked={data.kontinuerligLaerende === v} onChange={(e) => update("kontinuerligLaerende", e.target.value)} className="text-primary-500" />
                        <span className="text-sm">{v === "ja" ? "Ja" : "Nei"}</span>
                      </label>
                    ))}
                  </div>
                </FormFelt>
              </div>
            </div>
          </div>
        )}

        {/* STEG 3 */}
        {aktivtSteg === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Klinisk bruk</h2>
            <div className="space-y-4">
              <FormFelt label={`Tiltenkt bruksområde * (${data.tiltenktBruksomrade.length}/500 tegn)`}>
                <textarea
                  value={data.tiltenktBruksomrade}
                  onChange={(e) => e.target.value.length <= 500 && update("tiltenktBruksomrade", e.target.value)}
                  rows={4}
                  placeholder="Beskriv hva KI-løsningen er ment å gjøre i klinisk praksis..."
                  className={`${INPUT_KLASSE} resize-none`}
                />
              </FormFelt>

              <FormFelt label="Primær klinisk funksjon (velg alle aktuelle) *">
                <div className="space-y-2">
                  {KLINISKE_FUNKSJONER.map((f) => (
                    <label key={f.verdi} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={data.kliniskFunksjon.includes(f.verdi)} onChange={() => toggleListe("kliniskFunksjon", f.verdi)} className="w-4 h-4 text-primary-500 rounded border-gray-300" />
                      <span className="text-sm text-gray-700">{f.label}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              {/* Godkjenningsstatus – fremhevet */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-yellow-500" size={18} />
                  <h3 className="text-sm font-bold text-yellow-800">⚠️ GODKJENNINGSSTATUS – viktig felt</h3>
                </div>
                <FormFelt label="Er løsningen godkjent for denne bruken? *">
                  <div className="space-y-2">
                    {[
                      { v: "godkjent", label: "Ja – innenfor CE-merket intended purpose" },
                      { v: "godkjent-intern", label: "Ja – etter intern klinisk validering uten CE-krav" },
                      { v: "delvis", label: "Delvis – noen brukstilfeller er utenfor godkjent bruk (off-label)" },
                      { v: "under-utproving", label: "Nei – ikke godkjent, under utprøving" },
                      { v: "ukjent", label: "Vet ikke" },
                    ].map(({ v, label }) => (
                      <label key={v} className="flex items-start gap-2 cursor-pointer">
                        <input type="radio" name="godkjStatus" value={v} checked={data.godkjenningsStatus === v} onChange={(e) => update("godkjenningsStatus", e.target.value)} className="mt-0.5 text-primary-500" />
                        <span className="text-sm text-gray-800">{label}</span>
                      </label>
                    ))}
                  </div>
                </FormFelt>
                {(data.godkjenningsStatus === "delvis" || data.godkjenningsStatus === "under-utproving") && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={14} />
                    <p className="text-xs text-red-800">
                      Bruk utenfor godkjent formål krever særskilt vurdering.{" "}
                      <Link href="/veileder" className="underline font-medium">Se veileder for ledere</Link>{" "}
                      for krav til dokumentasjon og godkjenning.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFelt label="EPJ-integrasjon?">
                  <div className="flex gap-3 pt-2">
                    {["ja", "nei"].map((v) => (
                      <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="radio" name="epjInt" value={v} checked={data.epjIntegrasjon === v} onChange={(e) => update("epjIntegrasjon", e.target.value)} className="text-primary-500" />
                        <span className="text-sm">{v === "ja" ? "Ja" : "Nei"}</span>
                      </label>
                    ))}
                  </div>
                </FormFelt>
                {data.epjIntegrasjon === "ja" && (
                  <FormFelt label="Hvilket EPJ-system?">
                    <select value={data.epjSystem} onChange={(e) => update("epjSystem", e.target.value)} className={INPUT_KLASSE}>
                      <option value="">Velg system</option>
                      {["DIPS", "Epic", "Helseplattformen", "CGM Clinicalsuite", "Annet"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormFelt>
                )}
              </div>

              <FormFelt label="Pasientgruppens alder">
                <div className="flex flex-wrap gap-4">
                  {["Nyfødte", "Barn", "Voksne", "Eldre"].map((a) => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={data.pasientAlder.includes(a)} onChange={() => toggleListe("pasientAlder", a)} className="w-4 h-4 text-primary-500 rounded border-gray-300" />
                      <span className="text-sm">{a}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              <FormFelt label="Brukes løsningen i">
                <div className="flex flex-wrap gap-4">
                  {["Poliklinikk", "Sengepost", "Akuttmottak", "Intensiv", "Operasjon", "Primærhelsetjeneste"].map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={data.brukersted.includes(b)} onChange={() => toggleListe("brukersted", b)} className="w-4 h-4 text-primary-500 rounded border-gray-300" />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>
            </div>
          </div>
        )}

        {/* STEG 4 */}
        {aktivtSteg === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Validering og sikkerhet</h2>
            <div className="space-y-4">
              <FormFelt label="Er lokal validering gjennomført? *">
                <div className="flex gap-4">
                  {["ja", "nei", "pagaar"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="lokalVal" value={v} checked={data.lokalValidering === v} onChange={(e) => update("lokalValidering", e.target.value)} className="text-primary-500" />
                      <span className="text-sm">{v === "ja" ? "Ja" : v === "nei" ? "Nei" : "Pågår"}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              {data.lokalValidering === "ja" && (
                <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <FormFelt label="Valideringsdato">
                      <input type="date" value={data.valideringsDato} onChange={(e) => update("valideringsDato", e.target.value)} className={INPUT_KLASSE} />
                    </FormFelt>
                    <FormFelt label="Antall pasienter i valideringsdatasettet">
                      <input type="number" value={data.valideringsAntallPasienter} onChange={(e) => update("valideringsAntallPasienter", e.target.value)} placeholder="0" className={INPUT_KLASSE} />
                    </FormFelt>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white rounded border border-green-200">
                    <Info className="text-green-600 flex-shrink-0 mt-0.5" size={14} />
                    <p className="text-xs text-green-700">
                      Du kan laste opp valideringssammendrag (PDF) etter at innmeldingen er godkjent via e-post.
                    </p>
                  </div>
                </div>
              )}

              <FormFelt label="Er DPIA gjennomført? *">
                <div className="flex gap-4">
                  {["ja", "nei", "pagaar"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="dpia" value={v} checked={data.dpiaGjennomfort === v} onChange={(e) => update("dpiaGjennomfort", e.target.value)} className="text-primary-500" />
                      <span className="text-sm">{v === "ja" ? "Ja" : v === "nei" ? "Nei" : "Pågår"}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              <FormFelt label="Er data behandlet på norsk infrastruktur / innenfor EØS? *">
                <select value={data.norskInfrastruktur} onChange={(e) => update("norskInfrastruktur", e.target.value)} className={INPUT_KLASSE}>
                  <option value="">Velg alternativ</option>
                  <option value="ja">Ja</option>
                  <option value="nei">Nei</option>
                  <option value="delvis">Delvis</option>
                  <option value="vet-ikke">Vet ikke</option>
                </select>
              </FormFelt>

              <FormFelt label="Behandlingsgrunnlag for personopplysninger">
                <div className="flex flex-wrap gap-4">
                  {BEHANDLINGSGRUNNLAG.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={data.behandlingsgrunnlag.includes(b)} onChange={() => toggleListe("behandlingsgrunnlag", b)} className="w-4 h-4 text-primary-500 rounded border-gray-300" />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              <FormFelt label="Avvikshendelser siste 12 mnd *">
                <div className="flex gap-4">
                  {["ingen", "1-5", "flere"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="avvik" value={v} checked={data.avvikshendelser === v} onChange={(e) => update("avvikshendelser", e.target.value)} className="text-primary-500" />
                      <span className="text-sm">{v === "ingen" ? "Ingen" : v === "1-5" ? "1–5" : "Flere enn 5"}</span>
                    </label>
                  ))}
                </div>
              </FormFelt>

              {data.avvikshendelser !== "ingen" && data.avvikshendelser && (
                <FormFelt label="Beskriv avvikshendelsene kort">
                  <textarea
                    value={data.avvikskommentar}
                    onChange={(e) => update("avvikskommentar", e.target.value)}
                    rows={3}
                    placeholder="Type avvik, konsekvenser og tiltak som ble iverksatt..."
                    className={`${INPUT_KLASSE} resize-none`}
                  />
                </FormFelt>
              )}
            </div>
          </div>
        )}

        {/* STEG 5 – Oppsummering */}
        {aktivtSteg === 5 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Oppsummering og innsending</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <OppsummeringSeksjon tittel="Organisasjon">
                  <OppsRad label="RHF" verdi={data.rhf} />
                  <OppsRad label="Helseforetak" verdi={data.helseforetak} />
                  <OppsRad label="Klinikk" verdi={data.klinikk || "–"} />
                  <OppsRad label="Fagfelt" verdi={data.fagfelt.join(", ") || "–"} />
                  <OppsRad label="Ansvarlig leder" verdi={data.lederNavn || "–"} />
                </OppsummeringSeksjon>

                <OppsummeringSeksjon tittel="Produkt">
                  <OppsRad label="Produktnavn" verdi={data.produktnavn || "–"} />
                  <OppsRad label="Leverandør" verdi={data.leverandor || "–"} />
                  <OppsRad label="Versjon" verdi={data.versjonsnummer || "–"} />
                  <OppsRad label="CE-merket" verdi={data.ceMerket === "ja" ? "Ja" : data.ceMerket === "nei" ? "Nei" : "Vet ikke"} />
                  <OppsRad label="AI Act risiko" verdi={data.aiActRisiko || "–"} />
                </OppsummeringSeksjon>

                <OppsummeringSeksjon tittel="Klinisk bruk">
                  <OppsRad label="Godkjenningsstatus" verdi={data.godkjenningsStatus || "–"} />
                  <OppsRad label="EPJ-integrasjon" verdi={data.epjIntegrasjon === "ja" ? `Ja (${data.epjSystem})` : "Nei"} />
                  <OppsRad label="Brukersted" verdi={data.brukersted.join(", ") || "–"} />
                </OppsummeringSeksjon>

                <OppsummeringSeksjon tittel="Validering">
                  <OppsRad label="Lokal validering" verdi={data.lokalValidering === "ja" ? "Ja" : data.lokalValidering === "pagaar" ? "Pågår" : "Nei"} />
                  <OppsRad label="DPIA" verdi={data.dpiaGjennomfort === "ja" ? "Ja" : data.dpiaGjennomfort === "pagaar" ? "Pågår" : "Nei"} />
                  <OppsRad label="Norsk infrastruktur" verdi={data.norskInfrastruktur || "–"} />
                  <OppsRad label="Avvikshendelser" verdi={data.avvikshendelser || "–"} />
                </OppsummeringSeksjon>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.bekreftet}
                    onChange={(e) => update("bekreftet", e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-primary-800">
                    Jeg bekrefter som ansvarlig leder at informasjonen er korrekt og at bruken av
                    denne KI-løsningen er i tråd med gjeldende regelverk, inkludert MDR, AI Act,
                    personvernlovgivning og relevante interne godkjenningsprosesser.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigasjonsknapper */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setAktivtSteg((prev) => Math.max(1, prev - 1))}
            disabled={aktivtSteg === 1}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Tilbake
          </button>

          {aktivtSteg < 5 ? (
            <button
              onClick={() => setAktivtSteg((prev) => Math.min(5, prev + 1))}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
            >
              Neste steg →
            </button>
          ) : (
            <button
              onClick={() => data.bekreftet && setSendt(true)}
              disabled={!data.bekreftet}
              className="px-8 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send inn innmelding
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const INPUT_KLASSE =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white";

function FormFelt({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function OppsummeringSeksjon({ tittel, children }: { tittel: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{tittel}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function OppsRad({ label, verdi }: { label: string; verdi: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0 w-28">{label}:</span>
      <span className="text-xs text-gray-800 font-medium">{verdi}</span>
    </div>
  );
}
