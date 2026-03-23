"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export function DisclaimerBanner() {
  const [vist, setVist] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("disclaimer-skjult") === "true") {
        setVist(false);
      }
    } catch {
      // Ignorer (privat modus eller deaktivert sessionStorage)
    }
  }, []);

  const skjul = () => {
    try {
      sessionStorage.setItem("disclaimer-skjult", "true");
    } catch {
      // Ignorer
    }
    setVist(false);
  };

  if (!vist) return null;

  return (
    <div
      role="banner"
      aria-label="Prototypevarsel"
      className="bg-amber-50 border-b-2 border-amber-400 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <AlertTriangle
          className="text-amber-600 flex-shrink-0 mt-0.5"
          size={18}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <span className="inline-block bg-amber-300 text-amber-900 text-xs font-black px-2 py-0.5 rounded tracking-wide mr-2 uppercase">
            Prototype
          </span>
          <span className="text-sm font-semibold text-amber-900">
            Dette er et konsepteksempel – ikke et offisielt system
          </span>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Portalen demonstrerer mulig funksjonalitet i et nasjonalt KI-løsningsregister for helsesektoren.{" "}
            <strong>All data er fiktiv.</strong> Ingen opplysninger lagres eller behandles. Kobling mot DMP og
            Helsetilsynets systemer er simulert.
          </p>
        </div>
        <button
          onClick={skjul}
          className="text-amber-500 hover:text-amber-800 flex-shrink-0 p-1 rounded transition-colors"
          aria-label="Skjul prototypevarsel"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
