"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, ExternalLink, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";

export default function VeilederPage() {
  const [aktivScenario, setAktivScenario] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Veileder for ledere</h1>
        <p className="text-gray-500 mt-2">
          Interaktiv guide for kliniske ledere som vurderer å ta i bruk KI-løsninger.
          Velg ditt scenario nedenfor.
        </p>
      </div>

      <div className="space-y-4">
        <ScenarioKort
          nummer={1}
          aktiv={aktivScenario === 1}
          onToggle={() => setAktivScenario(aktivScenario === 1 ? null : 1)}
          tittel="Kjøpe og ta i bruk eksisterende KI-løsning fra leverandør"
          beskrivelse="For kliniske ledere som ønsker å implementere et kommersielt KI-produkt"
          farge="bg-blue-50 border-blue-200"
          ikonfarge="text-blue-500"
        >
          <LeverandorTre />
        </ScenarioKort>

        <ScenarioKort
          nummer={2}
          aktiv={aktivScenario === 2}
          onToggle={() => setAktivScenario(aktivScenario === 2 ? null : 2)}
          tittel="Utvikle eller tilpasse KI-løsning internt"
          beskrivelse="For foretak som vil bygge egne KI-modeller eller tilpasse eksisterende"
          farge="bg-purple-50 border-purple-200"
          ikonfarge="text-purple-500"
        >
          <InternUtviklingTre />
        </ScenarioKort>

        <ScenarioKort
          nummer={3}
          aktiv={aktivScenario === 3}
          onToggle={() => setAktivScenario(aktivScenario === 3 ? null : 3)}
          tittel="Kjøpe inn KI-løsning via anbud"
          beskrivelse="Sjekkliste for innkjøpsansvarlige – krav til leverandører"
          farge="bg-green-50 border-green-200"
          ikonfarge="text-green-500"
        >
          <AnbudsSjekkliste />
        </ScenarioKort>
      </div>

      {/* Kontaktinfo */}
      <div className="mt-8 bg-primary-50 border border-primary-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-primary-800 mb-2">Trenger du mer veiledning?</h2>
        <p className="text-sm text-primary-700 mb-3">
          Helsedirektoratet tilbyr tverretatlig veiledning for spørsmål om KI-regulering i helsesektoren
          – i samarbeid med DMP, Datatilsynet og Helsetilsynet.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:ki.veiledning@helsedir.no"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            📧 ki.veiledning@helsedir.no
          </a>
          <Link
            href="/regelverk"
            className="inline-flex items-center gap-2 bg-white text-primary-600 border border-primary-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            📂 Se alle regelverkslenker
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScenarioKort({
  nummer, aktiv, onToggle, tittel, beskrivelse, farge, ikonfarge, children,
}: {
  nummer: number;
  aktiv: boolean;
  onToggle: () => void;
  tittel: string;
  beskrivelse: string;
  farge: string;
  ikonfarge: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden ${farge}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-black/5 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-lg ${ikonfarge} flex-shrink-0`}>
          {nummer}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">{tittel}</h2>
          <p className="text-sm text-gray-600 mt-0.5">{beskrivelse}</p>
        </div>
        {aktiv ? <ChevronDown size={20} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />}
      </button>
      {aktiv && (
        <div className="border-t border-white/50 bg-white/60 p-5">
          {children}
        </div>
      )}
    </div>
  );
}

function LeverandorTre() {
  const [steg, setSteg] = useState<string[]>([]);

  const currentPath = steg[steg.length - 1];

  const gaTilbake = () => setSteg((prev) => prev.slice(0, -1));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm mb-4">
        Følg stegene for å vurdere om løsningen er klar for klinisk bruk:
      </h3>

      {steg.length === 0 && (
        <SporsmalKort
          sporsmal="Er KI-løsningen CE-merket som medisinsk utstyr (MDR)?"
          info="De fleste KI-løsninger til klinisk beslutningsstøtte er klassifisert som medisinsk utstyr og krever CE-merking etter MDR."
          ressurser={[{ label: "MDR-veileder (DMP)", href: "https://dmp.no/medisinsk-utstyr" }]}
          onJa={() => setSteg(["ceMerket-ja"])}
          onNei={() => setSteg(["ceMerket-nei"])}
        />
      )}

      {currentPath === "ceMerket-ja" && (
        <SporsmalKort
          sporsmal="Er bruksområdet du planlegger innenfor produktets CE-merkede intended purpose?"
          info="CE-merking er gitt for et bestemt bruksformål. Bruk utenfor dette er 'off-label' og krever egen dokumentasjon."
          ressurser={[{ label: "Intended purpose (DMP)", href: "https://dmp.no/medisinsk-utstyr/intended-purpose" }]}
          onJa={() => setSteg([...steg, "dpia-sjekk"])}
          onNei={() => setSteg([...steg, "off-label-advarsel"])}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "off-label-advarsel" && (
        <StatusKort
          type="advarsel"
          tittel="Off-label bruk – særskilt vurdering kreves"
          tekst="Bruk utenfor godkjent formål (off-label) er tillatt, men krever: (1) skriftlig klinisk begrunnelse, (2) risikovurdering, (3) informasjon til pasienten, (4) dokumentasjon i journal. Du kan registrere løsningen med status 'Delvis' i KI-registeret."
          ressurser={[
            { label: "Off-label veileder (Helsetilsynet)", href: "https://helsetilsynet.no" },
            { label: "Meld inn med 'delvis' status", href: "/meld-inn/produkt" },
          ]}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "ceMerket-nei" && (
        <SporsmalKort
          sporsmal="Planlegger du klinisk utprøving (testing på pasienter) av løsningen?"
          info="Ikke CE-merkede KI-løsninger som testes på pasienter er kliniske utstyrsstudier og krever DMP-godkjenning."
          ressurser={[{ label: "Kliniske utstyrsstudier (DMP)", href: "https://dmp.no/kliniske-utstyrsstudier" }]}
          onJa={() => setSteg([...steg, "dmp-paakrevd"])}
          onNei={() => setSteg([...steg, "intern-validering"])}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "dmp-paakrevd" && (
        <StatusKort
          type="stop"
          tittel="DMP-godkjenning påkrevd"
          tekst="Klinisk utprøving av ikke CE-merket medisinsk utstyr krever forhåndsgodkjenning fra DMP. Start godkjenningsprosessen før utprøving. REK-søknad kan også være nødvendig."
          ressurser={[
            { label: "Søk DMP-godkjenning", href: "https://dmp.no/kliniske-utstyrsstudier" },
            { label: "REK-portalen", href: "https://rekportalen.no" },
            { label: "Meld inn forskningsprosjekt", href: "/meld-inn/forskning" },
          ]}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "intern-validering" && (
        <SporsmalKort
          sporsmal="Er det gjennomført intern klinisk validering på lokale data?"
          info="For ikke CE-merkede løsninger uten klinisk utprøving anbefaler Helsedirektoratet intern validering på lokale pasientdata før klinisk bruk."
          onJa={() => setSteg([...steg, "dpia-sjekk"])}
          onNei={() => setSteg([...steg, "validering-mangler"])}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "validering-mangler" && (
        <StatusKort
          type="advarsel"
          tittel="Validering bør gjennomføres"
          tekst="Helsedirektoratet anbefaler at KI-løsninger valideres på lokale data før klinisk bruk, selv om CE-merking ikke er påkrevd. Dokumenter validering og involver kliniske eksperter."
          ressurser={[
            { label: "Veileder for klinisk validering av KI", href: "https://helsedirektoratet.no" },
          ]}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "dpia-sjekk" && (
        <SporsmalKort
          sporsmal="Er DPIA (personvernkonsekvensvurdering) gjennomført?"
          info="DPIA er påkrevd ved systematisk bruk av KI på sensitive personopplysninger (helseopplysninger). Datatilsynet kan konsulteres."
          ressurser={[{ label: "DPIA-veileder (Datatilsynet)", href: "https://datatilsynet.no/rettigheter-og-plikter/virksomheters-plikter/vurdere-personvernkonsekvenser-dpia/" }]}
          onJa={() => setSteg([...steg, "klar-innmelding"])}
          onNei={() => setSteg([...steg, "dpia-mangler"])}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "dpia-mangler" && (
        <StatusKort
          type="advarsel"
          tittel="DPIA mangler – gjennomfør før iverksettelse"
          tekst="DPIA er sannsynligvis påkrevd. Gjennomfør DPIA og send til Datatilsynet for forhåndskonsultasjon ved behov. Involver personvernombudet."
          ressurser={[
            { label: "DPIA mal (Datatilsynet)", href: "https://datatilsynet.no" },
          ]}
          onGaTilbake={gaTilbake}
        />
      )}

      {currentPath === "klar-innmelding" && (
        <StatusKort
          type="ok"
          tittel="Løsningen er klar for innmelding!"
          tekst="Basert på dine svar ser grunnlaget for klinisk bruk godt ut. Husk å melde løsningen inn i KI-registeret og oppdatere ved endringer."
          ressurser={[
            { label: "Meld inn i KI-registeret", href: "/meld-inn/produkt" },
          ]}
          onGaTilbake={gaTilbake}
        />
      )}
    </div>
  );
}

function InternUtviklingTre() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-700 mb-4">
        Intern utvikling av KI kan i noen tilfeller være <strong>egentilvirkning etter MDR Art. 5(5)</strong>,
        som gir fritak fra full MDR-sertifisering, men med strenge vilkår.
      </p>
      {[
        { steg: "1", tittel: "Vurder MDR Art. 5(5) – egentilvirkning", tekst: "Fritaket gjelder kun for helseinstitusjoner som tilvirker utstyr til eget bruk, ikke for kommersiell distribusjon. Kravene er strenge – dokumenter at vilkårene er oppfylt.", href: "https://dmp.no/medisinsk-utstyr/egentilvirkning" },
        { steg: "2", tittel: "REK-søknad", tekst: "Hvis utvikling involverer bruk av pasientdata til trening eller testing, vurder fremleggingsplikt til REK.", href: "https://rekportalen.no" },
        { steg: "3", tittel: "Datatilsynet og DPIA", tekst: "Innhenting og bruk av pasientdata til ML-trening er sannsynligvis meldepliktig. Gjennomfør DPIA.", href: "https://datatilsynet.no" },
        { steg: "4", tittel: "Intern godkjenning og IT-sikkerhet", tekst: "Alle nye systemer med tilgang til pasientdata krever IT-sikkerhetsgjennomgang og godkjenning.", href: "https://helsedirektoratet.no" },
        { steg: "5", tittel: "Meld inn som forskningsprosjekt", tekst: "Intern KI-utvikling bør meldes inn i KI-registeret som forskningsprosjekt eller produkt under utvikling.", href: "/meld-inn/forskning" },
      ].map(({ steg, tittel, tekst, href }) => (
        <div key={steg} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {steg}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">{tittel}</p>
            <p className="text-xs text-gray-600 mb-2">{tekst}</p>
            <a href={href} target={href.startsWith("/") ? "_self" : "_blank"} rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              Les mer <ExternalLink size={10} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnbudsSjekkliste() {
  const [huket, setHuket] = useState<number[]>([]);

  const punkter = [
    "Leverandøren kan dokumentere CE-merking etter MDR for medisinsk utstyr",
    "CE-sertifikat og technical documentation er tilgjengelig på forespørsel",
    "Leverandøren kan dokumentere AI Act-compliance (GPAI/high-risk AI)",
    "Databehandleravtale (DBA) er tilgjengelig og tilfredsstiller krav",
    "Alle data behandles innenfor EØS eller med tilstrekkelig overføringsgrunnlag",
    "Leverandøren kan beskrive algoritmen og treningsdataene (forklarbarhet)",
    "Leverandøren har PMS-plan (post-market surveillance) dokumentert",
    "SLA inkluderer krav til oppetid, vedlikehold og sikkerhetsoppdateringer",
    "Leverandøren tilbyr opplæring og brukerstøtte på norsk/skandinavisk",
    "Integrasjon med norske EPJ-systemer er dokumentert og testet",
    "Leverandøren er villig til lokale valideringsstudier",
    "Klageinstans og kontaktpunkt for avvikshåndtering er definert",
  ];

  const toggle = (i: number) => {
    setHuket((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Bruk denne sjekklisten som kravspesifikasjon i anbudsdokumenter:
      </p>
      <div className="space-y-2">
        {punkter.map((p, i) => (
          <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${huket.includes(i) ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
            <input
              type="checkbox"
              checked={huket.includes(i)}
              onChange={() => toggle(i)}
              className="mt-0.5 w-4 h-4 text-green-500 rounded border-gray-300"
            />
            <span className={`text-sm ${huket.includes(i) ? "text-green-800 line-through decoration-green-400" : "text-gray-800"}`}>
              {p}
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {huket.length}/{punkter.length} krav bekreftet · Eksporter sjekklisten for bruk i anbud
      </p>
    </div>
  );
}

function SporsmalKort({
  sporsmal, info, ressurser, onJa, onNei, onGaTilbake,
}: {
  sporsmal: string;
  info?: string;
  ressurser?: { label: string; href: string }[];
  onJa: () => void;
  onNei: () => void;
  onGaTilbake?: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="font-semibold text-gray-800 mb-3">{sporsmal}</p>
      {info && (
        <p className="text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
          ℹ️ {info}
        </p>
      )}
      {ressurser && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ressurser.map((r) => (
            <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              <ExternalLink size={10} /> {r.label}
            </a>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        {onGaTilbake && (
          <button onClick={onGaTilbake} className="text-sm text-gray-500 hover:text-gray-700 mr-auto">← Tilbake</button>
        )}
        <button onClick={onNei} className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Nei
        </button>
        <button onClick={onJa} className="px-5 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          Ja
        </button>
      </div>
    </div>
  );
}

function StatusKort({
  type, tittel, tekst, ressurser, onGaTilbake,
}: {
  type: "ok" | "advarsel" | "stop";
  tittel: string;
  tekst: string;
  ressurser?: { label: string; href: string }[];
  onGaTilbake: () => void;
}) {
  const konfig = {
    ok: { ikon: <CheckCircle className="text-green-500" size={20} />, farge: "bg-green-50 border-green-200", tekstFarge: "text-green-800" },
    advarsel: { ikon: <AlertTriangle className="text-amber-500" size={20} />, farge: "bg-amber-50 border-amber-200", tekstFarge: "text-amber-800" },
    stop: { ikon: <XCircle className="text-red-500" size={20} />, farge: "bg-red-50 border-red-200", tekstFarge: "text-red-800" },
  }[type];

  return (
    <div className={`rounded-xl border p-5 ${konfig.farge}`}>
      <div className="flex items-center gap-3 mb-3">
        {konfig.ikon}
        <h3 className={`font-semibold ${konfig.tekstFarge}`}>{tittel}</h3>
      </div>
      <p className={`text-sm mb-4 ${konfig.tekstFarge}`}>{tekst}</p>
      {ressurser && (
        <div className="flex flex-wrap gap-3 mb-4">
          {ressurser.map((r) => (
            <a key={r.href} href={r.href} target={r.href.startsWith("/") ? "_self" : "_blank"} rel="noopener noreferrer"
              className="text-sm font-medium text-primary-700 hover:underline flex items-center gap-1">
              {r.label} {!r.href.startsWith("/") && <ExternalLink size={12} />}
            </a>
          ))}
        </div>
      )}
      <button onClick={onGaTilbake} className="text-sm text-gray-500 hover:text-gray-700">← Start på nytt</button>
    </div>
  );
}
