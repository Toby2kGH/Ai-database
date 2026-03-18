"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { KILosning, HELSEFORETAK_KOORDINATER, GodkjenningsStatus } from "@/lib/types";
import { godkjenningsStatusFarge } from "@/lib/utils";
import { GodkjenningsBadge } from "@/components/ui/GodkjenningsBadge";
import Link from "next/link";

interface Props {
  losninger: KILosning[];
}

// Gruppér løsninger per helseforetak
function grupperPerForetak(losninger: KILosning[]) {
  const map: Record<string, KILosning[]> = {};
  for (const l of losninger) {
    if (!map[l.helseforetak]) map[l.helseforetak] = [];
    map[l.helseforetak].push(l);
  }
  return map;
}

// Beregn dominerende status for et foretak (verste status vinner)
function dominantStatus(losninger: KILosning[]): GodkjenningsStatus {
  const prioritet: GodkjenningsStatus[] = [
    "ikke-godkjent", "under-utproving", "delvis", "ukjent", "godkjent"
  ];
  for (const p of prioritet) {
    if (losninger.some((l) => l.godkjenningsStatus === p)) return p;
  }
  return "ukjent";
}

export function NorgesKart({ losninger }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletMap | null>(null);
  const [valgtForetak, setValgtForetak] = useState<string | null>(null);
  const [foretakLosninger, setForetakLosninger] = useState<KILosning[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const gruppert = useMemo(() => grupperPerForetak(losninger), [losninger]);

  useEffect(() => {

    // Leaflet importeres dynamisk (SSR-safe)
    const initKart = async () => {
      const L = (await import("leaflet")).default;

      if (!mapRef.current || leafletRef.current) return;

      const kart = L.map(mapRef.current, {
        center: [65.0, 14.5],
        zoom: 5,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(kart);

      // Legg til pin for hvert helseforetak med løsninger
      for (const [foretak, foretakLos] of Object.entries(gruppert)) {
        const koordinater = HELSEFORETAK_KOORDINATER[foretak];
        if (!koordinater) continue;

        const status = dominantStatus(foretakLos);
        const farge = godkjenningsStatusFarge(status);

        // Egendefinert farget sirkel-markør
        const ikon = L.divIcon({
          className: "",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background-color: ${farge};
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              font-weight: bold;
              color: white;
              font-size: 12px;
            ">${foretakLos.length}</div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const markør = L.marker([koordinater.lat, koordinater.lng], { icon: ikon });

        markør.on("click", () => {
          setValgtForetak(foretak);
          setForetakLosninger(foretakLos);
        });

        markør.bindTooltip(
          `<strong>${foretak.split("(")[0].trim()}</strong><br>${foretakLos.length} løsning${foretakLos.length > 1 ? "er" : ""}`,
          { direction: "top", offset: [0, -10] }
        );

        markør.addTo(kart);
      }

      leafletRef.current = kart;
      setIsLoaded(true);
    };

    initKart().catch(console.error);

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, [gruppert]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[600px]">
      {/* Kart */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <div ref={mapRef} className="w-full h-full" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-400">Laster kart...</p>
          </div>
        )}

        {/* Forklaring */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000] border border-gray-100">
          <p className="text-xs font-semibold text-gray-600 mb-2">Godkjenningsstatus</p>
          {[
            { farge: "#16a34a", label: "Godkjent" },
            { farge: "#ca8a04", label: "Delvis / Ukjent" },
            { farge: "#dc2626", label: "Ikke godkjent" },
          ].map(({ farge, label }) => (
            <div key={label} className="flex items-center gap-2 mb-1">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: farge }}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-1">Tall = antall løsninger</p>
        </div>
      </div>

      {/* Sidepanel med foretak-detaljer */}
      <div className="w-full lg:w-80 flex-shrink-0">
        {valgtForetak ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-auto">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                {valgtForetak.split("(")[0].trim()}
              </h3>
              <button
                onClick={() => setValgtForetak(null)}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="p-3 space-y-2">
              {foretakLosninger.map((l) => (
                <Link
                  key={l.id}
                  href={`/utforsk/${l.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{l.produktnavn}</p>
                      <p className="text-xs text-gray-500">{l.leverandor}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {l.fagfelt.map((f) => (
                          <span key={f} className="text-xs text-primary-600">{f}</span>
                        ))}
                      </div>
                    </div>
                    <GodkjenningsBadge status={l.godkjenningsStatus} className="flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex items-center justify-center">
            <div className="text-center p-6">
              <span className="text-4xl mb-3 block">🗺️</span>
              <p className="text-sm text-gray-500">
                Klikk på en pin på kartet for å se løsninger ved det aktuelle helseforetaket
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {Object.keys(gruppert).length} helseforetak har innmeldte løsninger
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
