"use client";

import { useState } from "react";
import { useRolle } from "@/lib/context/RolleContext";
import { Stepper } from "@/components/forms/Stepper";
import { AlertTriangle, CheckCircle, ExternalLink, Info } from "lucide-react";
import Link from "next/link";

const STEG = [
  { nummer: 1, tittel: "Prosjekt" },
  { nummer: 2, tittel: "Regulatorisk" },
  { nummer: 3, tittel: "Sjekkliste" },
  { nummer: 4, tittel: "Innsending" },
];

// 12-punkts sjekkliste for leder
const SJEKKLISTE_PUNKTER = [
  {
    id: 1,
    tekst: "Er KI-løsningen klassifisert under MDR (medisinsk utstyr)?",
    ressurs: "https://dmp.no/medisinsk-utstyr/klassifisering",
    ressursLabel: "MDR-klassifisering (DMP)",
  },
  {
    id: 2,
    tekst: "Er AI Act risikoklassifisering vurdert?",
    ressurs: "https://www.datatilsynet.no/regelverk/veileder/kunstig-intelligens/ai-act/",
    ressursLabel: "AI Act veileder (Datatilsynet)",
  },
  {
    id: 3,
    tekst: "Er DPIA (personvernkonsekvensvurdering) gjennomført?",
    ressurs: "https://www.datatilsynet.no/rettigheter-og-plikter/virksomheters-plikter/vurdere-personvernkonsekvenser-dpia/",
    ressursLabel: "DPIA-veileder (Datatilsynet)",
  },
  {
    id: 4,
    tekst: "Er REK-søknad vurdert (er studien fremleggingspliktig)?",
    ressurs: "https://rekportalen.no",
    ressursLabel: "REK-portalen",
  },
  {
    id: 5,
    tekst: "Er databehandleravtale med alle databehandlere på plass?",
    ressurs: "https://www.datatilsynet.no/regelverk/veileder/databehandleravtaler/",
    ressursLabel: "Databehandleravtaler (Datatilsynet)",
  },
  {
    id: 6,
    tekst: "Er data anonymisert eller pseudonymisert i henhold til krav?",
    ressurs: "https://www.datatilsynet.no/regelverk/veileder/anonymisering/",
    ressursLabel: "Anonymisering (Datatilsynet)",
  },
  {
    id: 7,
    tekst: "Er opplæring av brukere (helsepersonell) planlagt og dokumentert?",
    ressurs: "https://helsedirektoratet.no/kompetanse-og-utdanning/opplaering",
    ressursLabel: "Opplæringskrav (Helsedirektoratet)",
  },
  {
    id: 8,
    tekst: "Er plan for menneskelig oversikt (human oversight) dokumentert?",
    ressurs: "https://www.datatilsynet.no/regelverk/veileder/kunstig-intelligens/ai-act/",
    ressursLabel: "Human oversight (AI Act)",
  },
  {
    id: 9,
    tekst: "Er avviksprosedyrer etablert for KI-systemet?",
    ressurs: "https://helsetilsynet.no/tilsyn/temaer/kunstig-intelligens/",
    ressursLabel: "Avviksprosedyrer (Helsetilsynet)",
  },
  {
    id: 10,
    tekst: "Er post-market surveillance (PMS) plan etablert?",
    ressurs: "https://dmp.no/medisinsk-utstyr/markedsovervaking",
    ressursLabel: "PMS (DMP)",
  },
  {
    id: 11,
    tekst: "Er DMP varslet ved utprøving av ikke CE-merket medisinsk utstyr?",
    ressurs: "https://dmp.no/kliniske-utstyrsstudier",
    ressursLabel: "Kliniske utstyrsstudier (DMP)",
  },
  {
    id: 12,
    tekst: "Er intern godkjenning fra IT-sikkerhet innhentet?",
    ressurs: "https://www.nkom.no/sikkerhet",
    ressursLabel: "IT-sikkerhetskrav",
  },
];

interface ProsjektFormData {
  prosjektnavn: string;
  prosjektleder: string;
  institusjon: string;
  avdeling: string;
  prosjekttype: string;
  finansieringskilde: string;
  rekGodkjenning: string;
  rekNummer: string;
  dmpGodkjenning: string;
  datatilsynMelding: string;
  helsepersonelloven29: string;
  sjekklistePunkter: number[];
  sammendrag: string;
  oppstart: string;
  slutt: string;
  bekreftet: boolean;
}
type FormData = ProsjektFormData;

const INITIAL_DATA: FormData = {
  prosjektnavn: "", prosjektleder: "", institusjon: "", avdeling: "",
  prosjekttype: "", finansieringskilde: "",
  rekGodkjenning: "", rekNummer: "", dmpGodkjenning: "", datatilsynMelding: "",
  helsepersonelloven29: "",
  sjekklistePunkter: [],
  sammendrag: "", oppstart: "", slutt: "",
  bekreftet: false,
};

export default function MeldInnForskningPage() {
  const { bruker } = useRolle();
  const [aktivtSteg, setAktivtSteg] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [sendt, setSendt] = useState(false);
  const [referansenummer] = useState(
    `FP-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`
  );

  if (!["forsker", "klinisk-leder", "rhf-koordinator"].includes(bruker.rolle)) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
          <AlertTriangle className="text-amber-500 mx-auto mb-3" size={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Innlogging kreves</h2>
          <p className="text-sm text-gray-600 mb-4">
            Velg rollen &quot;Forsker&quot; eller &quot;Klinisk leder&quot; øverst for å melde inn et prosjekt.
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">Prosjekt registrert!</h2>
          <p className="text-sm text-gray-600 mb-4">
            Forskningsprosjektet er nå registrert i det nasjonale KI-registeret.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Referansenummer</p>
            <p className="font-mono font-bold text-lg text-primary-600">{referansenummer}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/utforsk" className="bg-primary-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              Se registeret
            </Link>
            <button
              onClick={() => { setData(INITIAL_DATA); setAktivtSteg(1); setSendt(false); }}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Meld inn nytt prosjekt
            </button>
          </div>
        </div>
      </div>
    );
  }

  const update = (felt: keyof FormData, verdi: string | boolean | number[]) => {
    setData((prev) => ({ ...prev, [felt]: verdi }));
  };

  const toggleSjekk = (id: number) => {
    setData((prev) => ({
      ...prev,
      sjekklistePunkter: prev.sjekklistePunkter.includes(id)
        ? prev.sjekklistePunkter.filter((x) => x !== id)
        : [...prev.sjekklistePunkter, id],
    }));
  };

  const manglendePunkter = SJEKKLISTE_PUNKTER.filter(
    (p) => !data.sjekklistePunkter.includes(p.id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meld inn forskningsprosjekt</h1>
        <p className="text-sm text-gray-500 mt-1">Registrer et KI-forskningsprosjekt i nasjonal oversikt</p>
      </div>

      <Stepper steg={STEG} aktivtSteg={aktivtSteg} />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* STEG 1 */}
        {aktivtSteg === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Prosjektidentifikasjon</h2>
            <div className="space-y-4">
              <FormFelt label="Prosjektnavn *">
                <input type="text" value={data.prosjektnavn} onChange={(e) => update("prosjektnavn", e.target.value)} placeholder="Fullt tittel på prosjektet" className={INPUT_KLASSE} />
              </FormFelt>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFelt label="Prosjektleder *">
                  <input type="text" value={data.prosjektleder} onChange={(e) => update("prosjektleder", e.target.value)} placeholder="Navn og tittel" className={INPUT_KLASSE} />
                </FormFelt>
                <FormFelt label="Institusjon *">
                  <input type="text" value={data.institusjon} onChange={(e) => update("institusjon", e.target.value)} placeholder="Sykehus/universitet" className={INPUT_KLASSE} />
                </FormFelt>
              </div>
              <FormFelt label="Avdeling/seksjon">
                <input type="text" value={data.avdeling} onChange={(e) => update("avdeling", e.target.value)} placeholder="F.eks. Institutt for klinisk medisin" className={INPUT_KLASSE} />
              </FormFelt>
              <FormFelt label="Prosjekttype *">
                <select value={data.prosjekttype} onChange={(e) => update("prosjekttype", e.target.value)} className={INPUT_KLASSE}>
                  <option value="">Velg type</option>
                  <option value="ny-losning">Utvikling av ny KI-løsning</option>
                  <option value="validering">Validering av eksisterende KI-løsning</option>
                  <option value="implementeringsstudie">Implementeringsstudie</option>
                  <option value="registerbasert">Registerbasert studie</option>
                </select>
              </FormFelt>
              <FormFelt label="Finansieringskilde">
                <input type="text" value={data.finansieringskilde} onChange={(e) => update("finansieringskilde", e.target.value)} placeholder="F.eks. Norges Forskningsråd, RHF-midler, EU Horizon..." className={INPUT_KLASSE} />
              </FormFelt>
            </div>
          </div>
        )}

        {/* STEG 2 */}
        {aktivtSteg === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Regulatorisk status</h2>
            <div className="space-y-5">
              <RegulatoriskFelt
                label="REK-godkjenning"
                felt="rekGodkjenning"
                verdi={data.rekGodkjenning}
                onChange={update}
                alternativer={[
                  { v: "ja", label: "Ja – har godkjenning" },
                  { v: "sokt", label: "Søkt" },
                  { v: "ikke-paakrevd", label: "Ikke påkrevd" },
                  { v: "vet-ikke", label: "Vet ikke" },
                ]}
              />
              {data.rekGodkjenning === "ja" && (
                <FormFelt label="REK-nummer">
                  <input type="text" value={data.rekNummer} onChange={(e) => update("rekNummer", e.target.value)} placeholder="F.eks. 2024/123" className={INPUT_KLASSE} />
                </FormFelt>
              )}

              <RegulatoriskFelt
                label="DMP-godkjenning for klinisk utprøving"
                felt="dmpGodkjenning"
                verdi={data.dmpGodkjenning}
                onChange={update}
                alternativer={[
                  { v: "ja", label: "Ja" },
                  { v: "sokt", label: "Søkt" },
                  { v: "ikke-paakrevd", label: "Ikke påkrevd" },
                ]}
              />

              <RegulatoriskFelt
                label="Datatilsynet-melding/DPIA"
                felt="datatilsynMelding"
                verdi={data.datatilsynMelding}
                onChange={update}
                alternativer={[
                  { v: "ja", label: "Ja" },
                  { v: "under-arbeid", label: "Under arbeid" },
                  { v: "ikke-paakrevd", label: "Ikke påkrevd" },
                ]}
              />

              <RegulatoriskFelt
                label="Søknad om helsepersonelloven § 29-dispensasjon"
                felt="helsepersonelloven29"
                verdi={data.helsepersonelloven29}
                onChange={update}
                alternativer={[
                  { v: "ja", label: "Ja" },
                  { v: "nei", label: "Nei" },
                  { v: "ikke-aktuelt", label: "Ikke aktuelt" },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEG 3 – Sjekkliste */}
        {aktivtSteg === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Veileder-sjekkliste</h2>
            <p className="text-sm text-gray-500 mb-5">
              Gå gjennom alle 12 punktene. Manglende punkter vil markeres med advarsel.
            </p>

            <div className="space-y-3">
              {SJEKKLISTE_PUNKTER.map((punkt) => {
                const avkrysset = data.sjekklistePunkter.includes(punkt.id);
                return (
                  <div
                    key={punkt.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      avkrysset ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={avkrysset}
                        onChange={() => toggleSjekk(punkt.id)}
                        className="mt-1 w-4 h-4 text-green-500 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${avkrysset ? "text-green-800 line-through decoration-green-400" : "text-gray-800"}`}>
                          {punkt.id}. {punkt.tekst}
                        </p>
                        <a
                          href={punkt.ressurs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary-600 hover:underline mt-1"
                        >
                          <ExternalLink size={10} /> {punkt.ressursLabel}
                        </a>
                      </div>
                      {!avkrysset && (
                        <span className="flex-shrink-0">
                          <AlertTriangle size={16} className="text-yellow-400" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {manglendePunkter.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-amber-500" size={16} />
                  <p className="text-sm font-semibold text-amber-800">
                    {manglendePunkter.length} punkt{manglendePunkter.length > 1 ? "er" : ""} ikke bekreftet
                  </p>
                </div>
                <p className="text-xs text-amber-700">
                  Du kan fortsette uten å bekrefte alle punkter, men manglende punkter vil vises
                  som advarsler i registeret og kan kreve oppfølging.
                </p>
              </div>
            )}

            {manglendePunkter.length === 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <p className="text-sm font-semibold text-green-800">
                  Alle 12 punkter er bekreftet – prosjektet er godt regulatorisk forankret!
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEG 4 */}
        {aktivtSteg === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Prosjektbeskrivelse og innsending</h2>
            <div className="space-y-4">
              <FormFelt label={`Kort prosjektsammendrag * (${data.sammendrag.length}/300 tegn)`}>
                <textarea
                  value={data.sammendrag}
                  onChange={(e) => e.target.value.length <= 300 && update("sammendrag", e.target.value)}
                  rows={4}
                  placeholder="Beskriv prosjektets mål, metode og forventet nytte..."
                  className={`${INPUT_KLASSE} resize-none`}
                />
              </FormFelt>

              <div className="grid grid-cols-2 gap-4">
                <FormFelt label="Planlagt oppstart *">
                  <input type="date" value={data.oppstart} onChange={(e) => update("oppstart", e.target.value)} className={INPUT_KLASSE} />
                </FormFelt>
                <FormFelt label="Planlagt sluttdato *">
                  <input type="date" value={data.slutt} onChange={(e) => update("slutt", e.target.value)} className={INPUT_KLASSE} />
                </FormFelt>
              </div>

              {/* Oppsummering regulatorisk */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Regulatorisk oversikt</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-gray-500">REK:</span><span className="font-medium">{data.rekGodkjenning || "–"}</span>
                  <span className="text-gray-500">DMP:</span><span className="font-medium">{data.dmpGodkjenning || "–"}</span>
                  <span className="text-gray-500">DPIA:</span><span className="font-medium">{data.datatilsynMelding || "–"}</span>
                  <span className="text-gray-500">Sjekkliste:</span>
                  <span className="font-medium">{data.sjekklistePunkter.length}/12 punkter</span>
                </div>
              </div>

              {data.sjekklistePunkter.length < 12 && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Info className="text-amber-500 flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-xs text-amber-800">
                    {12 - data.sjekklistePunkter.length} av sjekkliste-punktene er ikke bekreftet.
                    Prosjektet vil registreres med advarselstatus.
                  </p>
                </div>
              )}

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.bekreftet}
                    onChange={(e) => update("bekreftet", e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-500 rounded border-gray-300"
                  />
                  <span className="text-sm text-primary-800">
                    Jeg bekrefter som prosjektleder at informasjonen er korrekt, at nødvendige
                    godkjenninger er innhentet eller planlagt, og at prosjektet vil gjennomføres i
                    tråd med gjeldende regelverk.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigasjon */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setAktivtSteg((prev) => Math.max(1, prev - 1))}
            disabled={aktivtSteg === 1}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Tilbake
          </button>
          {aktivtSteg < 4 ? (
            <button
              onClick={() => setAktivtSteg((prev) => Math.min(4, prev + 1))}
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
              Send inn prosjekt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const INPUT_KLASSE = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white";

function FormFelt({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function RegulatoriskFelt({
  label, felt, verdi, onChange, alternativer,
}: {
  label: string;
  felt: keyof FormData;
  verdi: string;
  onChange: (felt: keyof FormData, verdi: string) => void;
  alternativer: { v: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-4">
        {alternativer.map(({ v, label }) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={felt}
              value={v}
              checked={verdi === v}
              onChange={(e) => onChange(felt, e.target.value)}
              className="text-primary-500"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

