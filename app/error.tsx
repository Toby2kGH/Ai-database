"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logg til feilsporing (erstatt med faktisk logger i produksjon)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Noe gikk galt</h1>
        <p className="text-gray-500 text-sm mb-6">
          En uventet feil oppsto. Prøv igjen, eller gå tilbake til forsiden.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">
            Feil-ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Prøv igjen
          </button>
          <Link
            href="/"
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
