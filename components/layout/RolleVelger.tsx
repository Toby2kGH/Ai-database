"use client";

import { useRolle } from "@/lib/context/RolleContext";
import { BRUKER_PROFILER, BrukerProfil } from "@/lib/types";
import { UserCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const ROLLE_IKONER: Record<string, string> = {
  "offentlig": "🌐",
  "klinisk-leder": "🩺",
  "it-sikkerhet": "🔒",
  "rhf-koordinator": "🏥",
  "tilsynsansvarlig": "👁️",
  "dmp-saksbehandler": "📋",
  "forsker": "🔬",
};

const ROLLE_NAVN: Record<string, string> = {
  "offentlig": "Offentlig",
  "klinisk-leder": "Klinisk leder",
  "it-sikkerhet": "IT-sikkerhet",
  "rhf-koordinator": "RHF-koordinator",
  "tilsynsansvarlig": "Tilsynsansvarlig",
  "dmp-saksbehandler": "DMP-saksbehandler",
  "forsker": "Forsker",
};

export function RolleVelger() {
  const { bruker, setBruker } = useRolle();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm transition-colors"
      >
        <UserCircle size={18} />
        <span className="hidden sm:inline">
          <span className="font-medium">{ROLLE_NAVN[bruker.rolle]}</span>
          {bruker.navn && bruker.navn !== "Offentlig besøkende" && (
            <span className="text-white/70 ml-1">– {bruker.navn.split(" ")[0]}</span>
          )}
        </span>
        <span className="sm:hidden">{ROLLE_IKONER[bruker.rolle]}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Velg rolle (demo)
              </p>
            </div>
            <div className="py-1">
              {BRUKER_PROFILER.map((profil: BrukerProfil) => (
                <button
                  key={profil.rolle}
                  onClick={() => {
                    setBruker(profil);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors ${
                    bruker.rolle === profil.rolle ? "bg-primary-50" : ""
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {ROLLE_IKONER[profil.rolle]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ROLLE_NAVN[profil.rolle]}
                    </p>
                    {profil.navn && profil.navn !== "Offentlig besøkende" && (
                      <p className="text-xs text-gray-500">{profil.navn}</p>
                    )}
                    {profil.organisasjon && (
                      <p className="text-xs text-gray-400">{profil.organisasjon}</p>
                    )}
                  </div>
                  {bruker.rolle === profil.rolle && (
                    <span className="ml-auto text-primary-500 flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
