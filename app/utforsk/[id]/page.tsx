"use client";

import { use } from "react";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import { formatDato, algoritmeTypeTekst, aiActTekst, kliniskFunksjonTekst } from "@/lib/utils";
import { AlertTriangle, ArrowLeft, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";

export default function LosningDetaljPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const l = MOCKDATA_LOSNINGER.find((x) => x.id === id);

  if (!l) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Løsning ikke funnet.</p>
        <Link href="/utforsk" className="text-primary-600 hover:underline mt-2 inline-block text-sm">
          ← Tilbake til oversikten
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/utforsk"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} /> Tilbake til oversikten
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{l.produktnavn}</h1>
            <p className="text-gray-500">{l.leverandor}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <GodkjenningsBadge status={l.godkjenningsStatus} />
              {l.ceMerket === "ja" && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                  CE-merket{l.mdrKlasse ? ` · MDR klasse ${l.mdrKlasse}` : ""}
                </span>
              )}
              {l.fagfelt.map((f) => (
                <span key={f} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p className="font-mono text-xs mb-1">{l.referansenummer}</p>
            <p>Innmeldt {formatDato(l.innmeldtDato)}</p>
            <p>Oppdatert {formatDato(l.sistOppdatert)}</p>
          </div>
        </div>

        {/* Advarsel ved problematisk status */}
        {(l.godkjenningsStatus === "delvis" || l.godkjenningsStatus === "ikke-godkjent" || l.godkjenningsStatus === "under-utproving") && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-amber-800">
              Denne løsningen er <strong>ikke fullt godkjent</strong> for klinisk bruk. Bruk krever særskilt vurdering.{" "}
              <Link href="/veileder" className="underline">Se veileder for ledere</Link>.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organisasjon */}
        <Seksjon tittel="Organisasjon og ansvar">
          <InfoRad label="RHF" verdi={l.rhf} />
          <InfoRad label="Helseforetak" verdi={l.helseforetak} />
          <InfoRad label="Klinikk/avdeling" verdi={l.klinikk} />
          <InfoRad label="Ansvarlig leder" verdi={`${l.ansvarligLeder.navn}, ${l.ansvarligLeder.tittel}`} />
          <InfoRad label="E-post leder" verdi={l.ansvarligLeder.epost} />
          <InfoRad label="IT-kontakt" verdi={l.itKontakt.navn} />
        </Seksjon>

        {/* Produktinfo */}
        <Seksjon tittel="Produktinformasjon">
          <InfoRad label="Versjon" verdi={l.versjonsnummer} />
          <InfoRad label="Algoritmetype" verdi={algoritmeTypeTekst(l.algoritmeType)} />
          <InfoRad label="AI Act risiko" verdi={aiActTekst(l.aiActRisiko)} />
          <InfoRad
            label="Kontinuerlig lærende"
            verdi={l.kontinuerligLaerende ? "Ja" : "Nei"}
          />
          <InfoRad
            label="CE-merket"
            verdi={l.ceMerket === "ja" ? "Ja" : l.ceMerket === "nei" ? "Nei" : "Vet ikke"}
          />
          {l.mdrKlasse && <InfoRad label="MDR-klasse" verdi={l.mdrKlasse} />}
          {l.udiNummer && <InfoRad label="UDI-nummer" verdi={l.udiNummer} />}
          {l.dmpUrl && (
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-xs text-gray-500">DMP-lenke</span>
              <a
                href={l.dmpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
              >
                Åpne DMP <ExternalLink size={10} />
              </a>
            </div>
          )}
        </Seksjon>

        {/* Klinisk bruk */}
        <Seksjon tittel="Klinisk bruk">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Tiltenkt bruksområde</p>
            <p className="text-sm text-gray-800">{l.tiltenktBruksomrade}</p>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Klinisk funksjon</p>
            <div className="flex flex-wrap gap-1">
              {l.kliniskFunksjon.map((f) => (
                <span key={f} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {kliniskFunksjonTekst(f)}
                </span>
              ))}
            </div>
          </div>
          <InfoRad label="EPJ-integrasjon" verdi={l.epjIntegrasjon ? `Ja – ${l.epjSystem || "ukjent"}` : "Nei"} />
          <div className="py-1.5 border-b border-gray-50">
            <span className="text-xs text-gray-500">Brukersted</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {l.brukersted.map((b) => (
                <span key={b} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{b}</span>
              ))}
            </div>
          </div>
          <div className="py-1.5">
            <span className="text-xs text-gray-500">Aldersgrupper</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {l.pasientAlder.map((a) => (
                <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a}</span>
              ))}
            </div>
          </div>
        </Seksjon>

        {/* Validering og sikkerhet */}
        <Seksjon tittel="Validering og sikkerhet">
          <StatusRad
            label="Lokal validering"
            status={l.lokalValidering === "ja" ? "ok" : l.lokalValidering === "pagaar" ? "advarsel" : "feil"}
            tekst={l.lokalValidering === "ja" ? "Gjennomført" : l.lokalValidering === "pagaar" ? "Pågår" : "Ikke gjennomført"}
          />
          {l.valideringsDato && (
            <InfoRad label="Valideringsdato" verdi={formatDato(l.valideringsDato)} />
          )}
          {l.valideringsAntallPasienter && (
            <InfoRad
              label="Valideringspopulasjon"
              verdi={`${l.valideringsAntallPasienter.toLocaleString("nb-NO")} pasienter`}
            />
          )}
          <StatusRad
            label="DPIA"
            status={l.dpiaGjennomfort === "ja" ? "ok" : l.dpiaGjennomfort === "pagaar" ? "advarsel" : "feil"}
            tekst={l.dpiaGjennomfort === "ja" ? "Gjennomført" : l.dpiaGjennomfort === "pagaar" ? "Pågår" : "Ikke gjennomført"}
          />
          <InfoRad
            label="Norsk infrastruktur"
            verdi={
              l.norskInfrastruktur === "ja" ? "Ja" :
              l.norskInfrastruktur === "nei" ? "Nei" :
              l.norskInfrastruktur === "delvis" ? "Delvis" : "Vet ikke"
            }
          />
          <InfoRad
            label="Avvikshendelser (12 mnd)"
            verdi={l.avvikshendelser === "ingen" ? "Ingen" : l.avvikshendelser}
          />
          {l.avvikskommentar && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
              {l.avvikskommentar}
            </div>
          )}
        </Seksjon>
      </div>
    </div>
  );
}

function Seksjon({ tittel, children }: { tittel: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
        {tittel}
      </h2>
      <div className="space-y-0">{children}</div>
    </div>
  );
}

function InfoRad({ label, verdi }: { label: string; verdi: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs text-gray-800 font-medium text-right max-w-[60%]">{verdi}</span>
    </div>
  );
}

function StatusRad({
  label,
  status,
  tekst,
}: {
  label: string;
  status: "ok" | "advarsel" | "feil";
  tekst: string;
}) {
  const ikon =
    status === "ok" ? <CheckCircle size={14} className="text-green-500" /> :
    status === "advarsel" ? <AlertTriangle size={14} className="text-yellow-500" /> :
    <XCircle size={14} className="text-red-500" />;

  return (
    <div className="flex justify-between py-1.5 border-b border-gray-50">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="flex items-center gap-1 text-xs text-gray-800 font-medium">
        {ikon} {tekst}
      </span>
    </div>
  );
}
