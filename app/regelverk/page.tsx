import { ExternalLink } from "lucide-react";

const RESSURSER = [
  {
    kategori: "Medisinsk utstyr og CE-merking",
    farge: "bg-blue-50 border-blue-200",
    ikonfarge: "text-blue-600",
    lenker: [
      {
        tittel: "DMP – Direktoratet for medisinske produkter",
        beskrivelse: "Norsk kompetanseorgan for medisinsk utstyr. Registrering, CE-merking, MDR.",
        href: "https://dmp.no",
        label: "dmp.no",
      },
      {
        tittel: "EUDAMED – EU database for medisinsk utstyr",
        beskrivelse: "Europeisk register for CE-merkede medisinske produkter og UDI-numre.",
        href: "https://ec.europa.eu/tools/eudamed",
        label: "ec.europa.eu/tools/eudamed",
      },
      {
        tittel: "MDR – Medical Device Regulation",
        beskrivelse: "EU-forordning 2017/745 om medisinsk utstyr, gjeldende i Norge via EØS.",
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017R0745",
        label: "EUR-Lex",
      },
      {
        tittel: "DMP – Veileder for KI som medisinsk utstyr",
        beskrivelse: "Norsk veiledning om klassifisering av KI-baserte løsninger under MDR.",
        href: "https://dmp.no/medisinsk-utstyr/kunstig-intelligens",
        label: "dmp.no/medisinsk-utstyr/kunstig-intelligens",
      },
    ],
  },
  {
    kategori: "AI Act og KI-regulering",
    farge: "bg-purple-50 border-purple-200",
    ikonfarge: "text-purple-600",
    lenker: [
      {
        tittel: "EU AI Act – Forordning (EU) 2024/1689",
        beskrivelse: "EUs forordning om kunstig intelligens. Definerer risikoklasser og plikter.",
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        label: "EUR-Lex",
      },
      {
        tittel: "Datatilsynets AI Act-veileder",
        beskrivelse: "Norsk veiledning om AI Act – hva gjelder for norske virksomheter?",
        href: "https://www.datatilsynet.no/regelverk/veileder/kunstig-intelligens/ai-act/",
        label: "datatilsynet.no",
      },
      {
        tittel: "KI-rådet – nasjonal strategi",
        beskrivelse: "Det norske KI-rådet og anbefalinger om KI i offentlig sektor.",
        href: "https://ki-strategi.no",
        label: "ki-strategi.no",
      },
      {
        tittel: "Felles KI-plan for helse- og omsorgstjenesten",
        beskrivelse: "Helsedirektoratets handlingsplan for kunstig intelligens i helse.",
        href: "https://helsedirektoratet.no/kunstig-intelligens",
        label: "helsedirektoratet.no/kunstig-intelligens",
      },
    ],
  },
  {
    kategori: "Personvern og GDPR",
    farge: "bg-green-50 border-green-200",
    ikonfarge: "text-green-600",
    lenker: [
      {
        tittel: "Datatilsynet – Personvern og KI",
        beskrivelse: "Veiledning om GDPR, DPIA og personvernplikter ved bruk av KI.",
        href: "https://www.datatilsynet.no/regelverk/veileder/kunstig-intelligens/",
        label: "datatilsynet.no",
      },
      {
        tittel: "DPIA-veileder og maler",
        beskrivelse: "Hjelp til å gjennomføre personvernkonsekvensvurdering.",
        href: "https://www.datatilsynet.no/rettigheter-og-plikter/virksomheters-plikter/vurdere-personvernkonsekvenser-dpia/",
        label: "datatilsynet.no/dpia",
      },
      {
        tittel: "Norm for informasjonssikkerhet i helse",
        beskrivelse: "Normen er et rammeverk for informasjonssikkerhet og personvern i helsesektoren.",
        href: "https://www.normen.no",
        label: "normen.no",
      },
    ],
  },
  {
    kategori: "Tilsyn og klageinstanser",
    farge: "bg-amber-50 border-amber-200",
    ikonfarge: "text-amber-600",
    lenker: [
      {
        tittel: "Statens helsetilsyn – KI-tilsyn",
        beskrivelse: "Helsetilsynets rolle og veiledning ved bruk av KI i helsevesenet.",
        href: "https://helsetilsynet.no/tilsyn/temaer/kunstig-intelligens/",
        label: "helsetilsynet.no",
      },
      {
        tittel: "Pasientsikkerhetsprogrammet",
        beskrivelse: "Nasjonalt program for pasientsikkerhet – prosedyrer og avvikssystem.",
        href: "https://pasientsikkerhetsprogrammet.no",
        label: "pasientsikkerhetsprogrammet.no",
      },
      {
        tittel: "Meldeordningen for uønskede hendelser",
        beskrivelse: "Meld avvik og uønskede hendelser til Helsetilsynet.",
        href: "https://unom.no",
        label: "unom.no",
      },
    ],
  },
  {
    kategori: "Forskning og etikk",
    farge: "bg-red-50 border-red-200",
    ikonfarge: "text-red-600",
    lenker: [
      {
        tittel: "REK – Regionale komiteer for medisinsk og helsefaglig forskningsetikk",
        beskrivelse: "Søk om etisk forhåndsgodkjenning for medisinsk og helsefaglig forskning.",
        href: "https://rekportalen.no",
        label: "rekportalen.no",
      },
      {
        tittel: "Helseforskningsloven",
        beskrivelse: "Lov om medisinsk og helsefaglig forskning (helseforskningsloven).",
        href: "https://lovdata.no/dokument/NL/lov/2008-06-20-44",
        label: "lovdata.no",
      },
      {
        tittel: "Helsedataservice – tilgang til helseregistre",
        beskrivelse: "Søk om tilgang til norske helseregistre for forskning.",
        href: "https://www.helsedataservice.no",
        label: "helsedataservice.no",
      },
    ],
  },
  {
    kategori: "Innkjøp og anskaffelser",
    farge: "bg-gray-50 border-gray-200",
    ikonfarge: "text-gray-600",
    lenker: [
      {
        tittel: "Sykehusinnkjøp HF",
        beskrivelse: "Nasjonalt foretak for innkjøp til spesialisthelsetjenesten.",
        href: "https://sykehusinnkjop.no",
        label: "sykehusinnkjop.no",
      },
      {
        tittel: "Difi – Veileder for innkjøp av KI",
        beskrivelse: "Veiledning for offentlige anskaffelser av kunstig intelligens.",
        href: "https://anskaffelser.no/kunstig-intelligens",
        label: "anskaffelser.no",
      },
      {
        tittel: "Standard Norge – KI-standarder",
        beskrivelse: "Norske og internasjonale standarder relevante for KI (ISO/IEC 42001 m.fl.).",
        href: "https://standard.no",
        label: "standard.no",
      },
    ],
  },
];

export default function RegelverkPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Regelverk og ressurser</h1>
        <p className="text-gray-500 mt-2">
          Samling av de viktigste regelverkslenker, veiledere og ressurser for bruk av KI i helsesektoren.
        </p>
      </div>

      {/* Fremhevet kontaktinfo */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-primary-800 mb-1">Tverretatlig veiledning</h2>
          <p className="text-xs text-primary-700">
            Helsedirektoratet, DMP, Datatilsynet og Helsetilsynet tilbyr felles veiledning om KI-regulering i helse.
          </p>
        </div>
        <a
          href="mailto:ki.veiledning@helsedir.no"
          className="flex-shrink-0 bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          📧 ki.veiledning@helsedir.no
        </a>
      </div>

      {/* Ressurskategorier */}
      <div className="space-y-6">
        {RESSURSER.map((kategori) => (
          <div key={kategori.kategori} className={`rounded-xl border p-5 ${kategori.farge}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wide mb-4 ${kategori.ikonfarge}`}>
              {kategori.kategori}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kategori.lenker.map((lenke) => (
                <a
                  key={lenke.href}
                  href={lenke.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow group border border-white/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                        {lenke.tittel}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">{lenke.beskrivelse}</p>
                      <p className="text-xs text-gray-400 font-mono">{lenke.label}</p>
                    </div>
                    <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lovendringer og tidslinje */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Viktige regulatoriske milepæler</h2>
        <div className="space-y-3">
          {[
            { dato: "August 2026", tekst: "AI Act fullt ut gjeldende for høyrisiko KI-systemer", farge: "bg-red-100 text-red-700" },
            { dato: "Februar 2025", tekst: "AI Act ikrafttredelse – forbud mot uakseptabel risiko KI", farge: "bg-amber-100 text-amber-700" },
            { dato: "August 2024", tekst: "AI Act vedtatt i EU", farge: "bg-blue-100 text-blue-700" },
            { dato: "Mai 2021", tekst: "MDR fullt ut gjeldende i EU/EØS", farge: "bg-green-100 text-green-700" },
            { dato: "Mai 2018", tekst: "GDPR ikrafttredelse", farge: "bg-purple-100 text-purple-700" },
          ].map(({ dato, tekst, farge }) => (
            <div key={dato} className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${farge}`}>
                {dato}
              </span>
              <span className="text-sm text-gray-700">{tekst}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
