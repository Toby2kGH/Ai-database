"use client";

import { useState } from "react";
import { MOCKDATA_LOSNINGER } from "@/lib/data/losninger";
import { NorgesKart } from "@/components/kart/NorgesKart";

export default function KartPage() {
  const [visType, setVisType] = useState<"produkt" | "forskning">("produkt");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Norgeskartet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Geografisk oversikt over KI-løsninger ved norske helseforetak
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setVisType("produkt")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              visType === "produkt"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Kliniske produkter
          </button>
          <button
            onClick={() => setVisType("forskning")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              visType === "forskning"
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Forskningsprosjekter
          </button>
        </div>
      </div>

      <NorgesKart losninger={MOCKDATA_LOSNINGER} type={visType} />

      {/* Info under kartet */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Helseforetak med løsninger</p>
          <p className="text-2xl font-bold text-gray-800">
            {new Set(MOCKDATA_LOSNINGER.map((l) => l.helseforetak)).size}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Totalt innmeldte løsninger</p>
          <p className="text-2xl font-bold text-gray-800">{MOCKDATA_LOSNINGER.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">RHF representert</p>
          <p className="text-2xl font-bold text-gray-800">4</p>
        </div>
      </div>
    </div>
  );
}
