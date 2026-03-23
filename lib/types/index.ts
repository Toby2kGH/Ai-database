// TypeScript-typer for KI-løsningsregisteret

export type RHF = "Helse Sør-Øst" | "Helse Vest" | "Helse Midt-Norge" | "Helse Nord";

export type GodkjenningsStatus =
  | "godkjent"
  | "delvis"
  | "ikke-godkjent"
  | "under-utproving"
  | "ukjent";

export type MDRKlasse = "I" | "IIa" | "IIb" | "III";

export type AIActRisiko =
  | "hoy-medisinsk"
  | "hoy-annex3"
  | "begrenset"
  | "minimal"
  | "ukjent";

export type AlgoritmeType =
  | "dyp-laering"
  | "klassisk-ml"
  | "llm"
  | "regelbasert-ml"
  | "annet";

export type KliniskFunksjon =
  | "diagnostikk-bildediagnostikk"
  | "diagnostikk-lab"
  | "klinisk-beslutningsstotte"
  | "risikovurdering-triagering"
  | "pasientovervaking"
  | "administrativ-automatisering"
  | "medikamenthandtering"
  | "kirurgisk-planlegging"
  | "befolkningshelseanalyse"
  | "annet";

export type Fagfelt =
  | "Radiologi"
  | "Patologi"
  | "Kardiologi"
  | "Onkologi"
  | "Akuttmedisin"
  | "Psykiatri"
  | "Nevrologi"
  | "Gastroenterologi"
  | "Ortopedi"
  | "Generell indremedisin"
  | "Allmennmedisin"
  | "Intensivmedisin"
  | "Øvrig";

export type EPJSystem = "DIPS" | "Epic" | "Helseplattformen" | "CGM Clinicalsuite" | "Annet";

export type Brukersted =
  | "Poliklinikk"
  | "Sengepost"
  | "Akuttmottak"
  | "Intensiv"
  | "Operasjon"
  | "Primærhelsetjeneste";

export type Aldersgruppe = "Nyfødte" | "Barn" | "Voksne" | "Eldre";

// Helseforetak per RHF
export const HELSEFORETAK_PER_RHF: Record<RHF, string[]> = {
  "Helse Sør-Øst": [
    "Oslo universitetssykehus (OUS)",
    "Akershus universitetssykehus (Ahus)",
    "Sykehuset Innlandet",
    "Vestre Viken",
    "Sykehuset Østfold",
    "Sykehuset i Vestfold",
    "Sykehuset Telemark",
    "Sørlandet sykehus",
    "Sunnaas sykehus",
  ],
  "Helse Vest": [
    "Haukeland universitetssjukehus",
    "Stavanger universitetssjukehus",
    "Ålesund sjukehus",
    "Haraldsplass Diakonale Sykehus",
    "Helse Fonna",
    "Helse Førde",
  ],
  "Helse Midt-Norge": [
    "St. Olavs hospital",
    "Ålesund sjukehus (Møre og Romsdal)",
    "Sykehuset Namsos",
    "Sykehuset Levanger",
  ],
  "Helse Nord": [
    "Universitetssykehuset Nord-Norge (UNN)",
    "Nordlandssykehuset",
    "Helgelandssykehuset",
    "Finnmarkssykehuset",
  ],
};

// Koordinater for helseforetak (for kart)
export const HELSEFORETAK_KOORDINATER: Record<string, { lat: number; lng: number; rhf: RHF }> = {
  "Oslo universitetssykehus (OUS)": { lat: 59.9396, lng: 10.7267, rhf: "Helse Sør-Øst" },
  "Akershus universitetssykehus (Ahus)": { lat: 59.9269, lng: 10.9484, rhf: "Helse Sør-Øst" },
  "Sykehuset Innlandet": { lat: 60.7946, lng: 11.0678, rhf: "Helse Sør-Øst" },
  "Vestre Viken": { lat: 59.7558, lng: 10.2067, rhf: "Helse Sør-Øst" },
  "Sykehuset Østfold": { lat: 59.2836, lng: 11.1097, rhf: "Helse Sør-Øst" },
  "Sykehuset i Vestfold": { lat: 59.2553, lng: 10.4156, rhf: "Helse Sør-Øst" },
  "Sykehuset Telemark": { lat: 59.1878, lng: 9.5975, rhf: "Helse Sør-Øst" },
  "Sørlandet sykehus": { lat: 58.1599, lng: 7.9945, rhf: "Helse Sør-Øst" },
  "Sunnaas sykehus": { lat: 59.7786, lng: 10.6728, rhf: "Helse Sør-Øst" },
  "Haukeland universitetssjukehus": { lat: 60.3722, lng: 5.3600, rhf: "Helse Vest" },
  "Stavanger universitetssjukehus": { lat: 58.9700, lng: 5.7181, rhf: "Helse Vest" },
  "Ålesund sjukehus": { lat: 62.4723, lng: 6.1549, rhf: "Helse Vest" },
  "Haraldsplass Diakonale Sykehus": { lat: 60.4005, lng: 5.3378, rhf: "Helse Vest" },
  "Helse Fonna": { lat: 59.7498, lng: 5.5130, rhf: "Helse Vest" },
  "Helse Førde": { lat: 61.4519, lng: 5.8577, rhf: "Helse Vest" },
  "St. Olavs hospital": { lat: 63.4190, lng: 10.4023, rhf: "Helse Midt-Norge" },
  "Ålesund sjukehus (Møre og Romsdal)": { lat: 62.4723, lng: 6.1549, rhf: "Helse Midt-Norge" },
  "Sykehuset Namsos": { lat: 64.4647, lng: 11.4970, rhf: "Helse Midt-Norge" },
  "Sykehuset Levanger": { lat: 63.7447, lng: 11.2934, rhf: "Helse Midt-Norge" },
  "Universitetssykehuset Nord-Norge (UNN)": { lat: 69.6828, lng: 18.9810, rhf: "Helse Nord" },
  "Nordlandssykehuset": { lat: 67.2898, lng: 14.5745, rhf: "Helse Nord" },
  "Helgelandssykehuset": { lat: 66.3145, lng: 14.1503, rhf: "Helse Nord" },
  "Finnmarkssykehuset": { lat: 70.0630, lng: 25.0000, rhf: "Helse Nord" },
};

// Hovedtype for en innmeldt KI-løsning
export interface KILosning {
  id: string;
  innmeldtDato: string;
  sistOppdatert: string;
  referansenummer: string;

  // Steg 1 – Organisasjon
  rhf: RHF;
  helseforetak: string;
  klinikk: string;
  fagfelt: Fagfelt[];
  ansvarligLeder: {
    navn: string;
    tittel: string;
    epost: string;
  };
  itKontakt: {
    navn: string;
    epost: string;
  };

  // Steg 2 – Produktinformasjon
  produktnavn: string;
  leverandor: string;
  dmpUrl?: string;
  versjonsnummer: string;
  ceMerket: "ja" | "nei" | "vet-ikke";
  mdrKlasse?: MDRKlasse;
  udiNummer?: string;
  aiActRisiko: AIActRisiko;
  algoritmeType: AlgoritmeType;
  kontinuerligLaerende: boolean;

  // Steg 3 – Klinisk bruk
  tiltenktBruksomrade: string;
  kliniskFunksjon: KliniskFunksjon[];
  godkjenningsStatus: GodkjenningsStatus;
  epjIntegrasjon: boolean;
  epjSystem?: EPJSystem;
  pasientAlder: Aldersgruppe[];
  brukersted: Brukersted[];

  // Steg 4 – Validering
  lokalValidering: "ja" | "nei" | "pagaar";
  valideringsDato?: string;
  valideringsAntallPasienter?: number;
  dpiaGjennomfort: "ja" | "nei" | "pagaar";
  norskInfrastruktur: "ja" | "nei" | "delvis" | "vet-ikke";
  behandlingsgrunnlag: string[];
  avvikshendelser: "ingen" | "1-5" | "flere";
  avvikskommentar?: string;
}

// Forskningsprosjekt
export interface Forskningsprosjekt {
  id: string;
  innmeldtDato: string;
  referansenummer: string;

  // Steg 1
  prosjektnavn: string;
  prosjektleder: string;
  institusjon: string;
  avdeling: string;
  prosjekttype: "ny-losning" | "validering" | "implementeringsstudie" | "registerbasert";
  finansieringskilde: string;

  // Steg 2
  rekGodkjenning: "ja" | "sokt" | "ikke-paakrevd" | "vet-ikke";
  rekNummer?: string;
  dmpGodkjenning: "ja" | "sokt" | "ikke-paakrevd";
  datatilsynMelding: "ja" | "under-arbeid" | "ikke-paakrevd";
  helsepersonelloven29: "ja" | "nei" | "ikke-aktuelt";

  // Steg 4
  sammendrag: string;
  planlagtOppstart: string;
  planlagtSlutt: string;

  // Status
  status: "aktiv" | "avsluttet" | "planlagt";
  rhf: RHF;
  helseforetak: string;
}

// Status på en bruksmelding hos Helsetilsynet
export type BruksmeldingStatus =
  | "ny"
  | "til-oppfolging"
  | "godkjent"
  | "avvist";

// Omfang av bruk
export type BruksOmfang =
  | "pilot"          // Begrenset pilot, under 50 pasienter
  | "avdeling"       // Én avdeling
  | "foretak"        // Hele helseforetaket
  | "regionalt";     // Regionalt / RHF-nivå

// Melding om bruk av en godkjent KI-løsning (innmeldt av virksomhetsleder)
export interface KIBruksmelding {
  id: string;
  innmeldtDato: string;
  sistOppdatert: string;
  referansenummer: string;

  // Hvilken løsning brukes
  kiLosningId: string;
  produktnavn: string;
  leverandor: string;
  kiLosningGodkjenningsStatus: GodkjenningsStatus;

  // Virksomhetsopplysninger
  rhf: RHF;
  helseforetak: string;
  klinikk: string;
  seksjon?: string;
  ansvarligLeder: {
    navn: string;
    tittel: string;
    epost: string;
  };

  // Bruksbeskrivelse
  planlagtBruk: string;          // Fritekstbeskrivelse av planlagt bruk
  erInnenforGodkjenning: "ja" | "nei" | "usikker";
  begrunnelseAvvik?: string;     // Påkrevd hvis nei/usikker

  // Omfang
  omfang: BruksOmfang;
  estimertAntallPasienterAarlig: number;
  planlagtOppstart: string;
  planlagtVarighet: "under-3-mnd" | "3-12-mnd" | "over-1-aar" | "lopende";

  // Tilsynsstatus
  status: BruksmeldingStatus;
  tilsynskommentar?: string;
}

// Brukerrolle for demo-simulering
export type BrukerRolle =
  | "virksomhetsleder"
  | "klinisk-leder"
  | "it-sikkerhet"
  | "rhf-koordinator"
  | "tilsynsansvarlig"
  | "dmp-saksbehandler"
  | "forsker"
  | "offentlig";

export interface BrukerProfil {
  rolle: BrukerRolle;
  navn: string;
  organisasjon: string;
  avdeling?: string;
  rhf?: RHF;
  helseforetak?: string;
}

export const BRUKER_PROFILER: BrukerProfil[] = [
  {
    rolle: "offentlig",
    navn: "Offentlig besøkende",
    organisasjon: "",
    avdeling: "",
  },
  {
    rolle: "virksomhetsleder",
    navn: "Direktør Siw Andersen",
    organisasjon: "St. Olavs hospital",
    avdeling: "Sykehusledelse",
    rhf: "Helse Midt-Norge",
    helseforetak: "St. Olavs hospital",
  },
  {
    rolle: "klinisk-leder",
    navn: "Dr. Astrid Berge",
    organisasjon: "Haukeland universitetssjukehus",
    avdeling: "Radiologisk avdeling",
    rhf: "Helse Vest",
    helseforetak: "Haukeland universitetssjukehus",
  },
  {
    rolle: "it-sikkerhet",
    navn: "Tor-Erik Nilsen",
    organisasjon: "Helse Vest IKT",
    avdeling: "IT-sikkerhet",
    rhf: "Helse Vest",
  },
  {
    rolle: "rhf-koordinator",
    navn: "Marit Solberg",
    organisasjon: "Helse Vest RHF",
    avdeling: "Fagavdeling KI og digitalisering",
    rhf: "Helse Vest",
  },
  {
    rolle: "tilsynsansvarlig",
    navn: "Jan Haugen",
    organisasjon: "Statens helsetilsyn",
    avdeling: "Avdeling for medisinsk utstyr",
  },
  {
    rolle: "dmp-saksbehandler",
    navn: "Karianne Thorvaldsen",
    organisasjon: "Direktoratet for medisinske produkter",
    avdeling: "Seksjon for kunstig intelligens",
  },
  {
    rolle: "forsker",
    navn: "Prof. Erik Viken",
    organisasjon: "Universitetet i Bergen / Haukeland",
    avdeling: "Institutt for klinisk medisin",
    rhf: "Helse Vest",
    helseforetak: "Haukeland universitetssjukehus",
  },
];
