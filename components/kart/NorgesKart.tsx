"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import {
  KILosning,
  KIBruksmelding,
  HELSEFORETAK_KOORDINATER,
  GodkjenningsStatus,
  BruksmeldingStatus,
} from "@/lib/types";
import { godkjenningsStatusFarge } from "@/lib/utils";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import Link from "next/link";

export type KartModus = "losninger" | "bruk";

interface Props {
  losninger: KILosning[];
  bruksmeldinger?: KIBruksmelding[];
  kartmodus?: KartModus;
}

function dominantLosningStatus(losninger: KILosning[]): GodkjenningsStatus {
  const prioritet: GodkjenningsStatus[] = [
    "ikke-godkjent",
    "under-utproving",
    "delvis",
    "ukjent",
    "godkjent",
  ];
  for (const p of prioritet) {
    if (losninger.some((l) => l.godkjenningsStatus === p)) return p;
  }
  return "ukjent";
}

function dominantBrukStatus(meldinger: KIBruksmelding[]): BruksmeldingStatus {
  const prioritet: BruksmeldingStatus[] = [
    "avvist",
    "til-oppfolging",
    "ny",
    "godkjent",
  ];
  for (const p of prioritet) {
    if (meldinger.some((m) => m.status === p)) return p;
  }
  return "ny";
}

function brukStatusFarge(status: BruksmeldingStatus): string {
  switch (status) {
    case "godkjent":
      return "#16a34a";
    case "ny":
      return "#2563eb";
    case "til-oppfolging":
      return "#ca8a04";
    case "avvist":
      return "#dc2626";
  }
}

function BrukStatusBadge({ status }: { status: BruksmeldingStatus }) {
  const cfg: Record<BruksmeldingStatus, { bg: string; text: string; label: string }> = {
    godkjent:        { bg: "bg-green-100", text: "text-green-700",  label: "Godkjent" },
    ny:              { bg: "bg-blue-100",  text: "text-blue-700",   label: "Ny" },
    "til-oppfolging":{ bg: "bg-amber-100", text: "text-amber-700",  label: "Til oppfølging" },
    avvist:          { bg: "bg-red-100",   text: "text-red-700",    label: "Avvist" },
  };
  const { bg, text, label } = cfg[status];
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${bg} ${text}`}>
      {label}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletLib = any;

export function NorgesKart({
  losninger,
  bruksmeldinger = [],
  kartmodus = "losninger",
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletMap | null>(null);
  const leafletLibRef = useRef<LeafletLib>(null);
  const markerGroupRef = useRef<LayerGroup | null>(null);

  const [valgtForetak, setValgtForetak] = useState<string | null>(null);
  const [foretakLosninger, setForetakLosninger] = useState<KILosning[]>([]);
  const [foretakBruk, setForetakBruk] = useState<KIBruksmelding[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const gruppertLosninger = useMemo(() => {
    const map: Record<string, KILosning[]> = {};
    for (const l of losninger) {
      if (!map[l.helseforetak]) map[l.helseforetak] = [];
      map[l.helseforetak].push(l);
    }
    return map;
  }, [losninger]);

  const gruppertBruk = useMemo(() => {
    const map: Record<string, KIBruksmelding[]> = {};
    for (const m of bruksmeldinger) {
      if (!map[m.helseforetak]) map[m.helseforetak] = [];
      map[m.helseforetak].push(m);
    }
    return map;
  }, [bruksmeldinger]);

  // Initialiser kart én gang
  useEffect(() => {
    let cancelled = false;

    const initKart = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || leafletRef.current) return;

      const kart = L.map(mapRef.current, {
        center: [65.0, 14.5],
        zoom: 5,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(kart);

      const markerGroup = L.layerGroup().addTo(kart);

      if (!cancelled) {
        leafletRef.current = kart;
        leafletLibRef.current = L;
        markerGroupRef.current = markerGroup;
        setIsLoaded(true);
      } else {
        kart.remove();
      }
    };

    initKart().catch(console.error);

    return () => {
      cancelled = true;
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
        leafletLibRef.current = null;
        markerGroupRef.current = null;
        setIsLoaded(false);
      }
    };
  }, []);

  // Tegn markører på nytt ved dataendring eller modusbytte
  useEffect(() => {
    const L = leafletLibRef.current;
    const group = markerGroupRef.current;
    if (!L || !group || !isLoaded) return;

    group.clearLayers();
    setValgtForetak(null);

    const lagPin = (
      foretak: string,
      antall: number,
      farge: string,
      tooltip: string,
      onClick: () => void
    ) => {
      const koordinater = HELSEFORETAK_KOORDINATER[foretak];
      if (!koordinater) return;

      const ikon = L.divIcon({
        className: "",
        html: `<div style="
          width:34px;height:34px;
          background:${farge};
          border:3px solid white;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 10px rgba(0,0,0,.35);
          font-weight:700;color:white;font-size:12px;
          cursor:pointer;
        ">${antall}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const markør = L.marker([koordinater.lat, koordinater.lng], { icon: ikon });
      markør.on("click", onClick);
      markør.bindTooltip(tooltip, { direction: "top", offset: [0, -12] });
      markør.addTo(group);
    };

    if (kartmodus === "losninger") {
      for (const [foretak, foretakLos] of Object.entries(gruppertLosninger)) {
        const status = dominantLosningStatus(foretakLos);
        const farge = godkjenningsStatusFarge(status);
        const kortNavn = foretak.split("(")[0].trim();
        lagPin(
          foretak,
          foretakLos.length,
          farge,
          `<strong>${kortNavn}</strong><br>${foretakLos.length} løsning${foretakLos.length !== 1 ? "er" : ""}`,
          () => {
            setValgtForetak(foretak);
            setForetakLosninger(foretakLos);
          }
        );
      }
    } else {
      for (const [foretak, meldinger] of Object.entries(gruppertBruk)) {
        const status = dominantBrukStatus(meldinger);
        const farge = brukStatusFarge(status);
        const kortNavn = foretak.split("(")[0].trim();
        lagPin(
          foretak,
          meldinger.length,
          farge,
          `<strong>${kortNavn}</strong><br>${meldinger.length} bruksmelding${meldinger.length !== 1 ? "er" : ""}`,
          () => {
            setValgtForetak(foretak);
            setForetakBruk(meldinger);
          }
        );
      }
    }
  }, [gruppertLosninger, gruppertBruk, kartmodus, isLoaded]);

  const antallForetak =
    kartmodus === "losninger"
      ? Object.keys(gruppertLosninger).length
      : Object.keys(gruppertBruk).length;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
      {/* Kart */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} className="w-full h-full" />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400">Laster kart...</p>
            </div>
          </div>
        )}

        {/* Forklaring */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000] border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            {kartmodus === "losninger" ? "Godkjenningsstatus" : "Bruksmeldingsstatus"}
          </p>
          {kartmodus === "losninger" ? (
            <>
              {[
                { farge: "#16a34a", label: "Godkjent" },
                { farge: "#ca8a04", label: "Delvis / Under utprøving" },
                { farge: "#dc2626", label: "Ikke godkjent" },
              ].map(({ farge, label }) => (
                <div key={label} className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: farge }}
                  />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </>
          ) : (
            <>
              {[
                { farge: "#16a34a", label: "Godkjent" },
                { farge: "#2563eb", label: "Ny – til behandling" },
                { farge: "#ca8a04", label: "Til oppfølging" },
                { farge: "#dc2626", label: "Avvist" },
              ].map(({ farge, label }) => (
                <div key={label} className="flex items-center gap-2 mb-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: farge }}
                  />
                  <span className="text-xs text-gray-600">{label}</span>
                </div>
              ))}
            </>
          )}
          <p className="text-xs text-gray-400 mt-1">Tall = antall</p>
        </div>
      </div>

      {/* Sidepanel */}
      <div className="w-full lg:w-80 flex-shrink-0">
        {valgtForetak ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-auto">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {valgtForetak.split("(")[0].trim()}
              </h3>
              <button
                onClick={() => setValgtForetak(null)}
                className="text-gray-400 hover:text-gray-700 text-xl leading-none ml-2 flex-shrink-0 transition-colors"
                aria-label="Lukk detaljpanel"
              >
                ✕
              </button>
            </div>
            <div className="p-3 space-y-2">
              {kartmodus === "losninger"
                ? foretakLosninger.map((l) => (
                    <Link
                      key={l.id}
                      href={`/utforsk/${l.id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {l.produktnavn}
                          </p>
                          <p className="text-xs text-gray-500">{l.leverandor}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {l.fagfelt.map((f) => (
                              <span key={f} className="text-xs text-primary-600">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <GodkjenningsBadge
                          status={l.godkjenningsStatus}
                          className="flex-shrink-0"
                        />
                      </div>
                    </Link>
                  ))
                : foretakBruk.map((m) => (
                    <div key={m.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {m.produktnavn}
                        </p>
                        <BrukStatusBadge status={m.status} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {m.klinikk}
                        {m.seksjon ? ` › ${m.seksjon}` : ""}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">{m.planlagtBruk}</p>
                      {m.erInnenforGodkjenning !== "ja" && (
                        <p className="text-xs text-amber-600 mt-1.5 font-medium">
                          ⚠{" "}
                          {m.erInnenforGodkjenning === "nei"
                            ? "Utenfor godkjent bruksområde"
                            : "Usikker på godkjenningsomfang"}
                        </p>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex items-center justify-center">
            <div className="text-center p-6">
              <span className="text-4xl mb-3 block">🗺️</span>
              <p className="text-sm text-gray-500">
                {kartmodus === "losninger"
                  ? "Klikk på en pin for å se løsninger ved det aktuelle helseforetaket"
                  : "Klikk på en pin for å se innmeldt bruk ved det aktuelle helseforetaket"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {antallForetak === 0
                  ? "Ingen data for dette laget"
                  : `${antallForetak} helseforetak har innmeldt${kartmodus === "bruk" ? " bruk" : "e løsninger"}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
