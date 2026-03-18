"use client";

import { Check } from "lucide-react";

interface Steg {
  nummer: number;
  tittel: string;
}

interface Props {
  steg: Steg[];
  aktivtSteg: number;
}

export function Stepper({ steg, aktivtSteg }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steg.map((s, i) => (
        <div key={s.nummer} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                aktivtSteg > s.nummer
                  ? "bg-primary-500 border-primary-500 text-white"
                  : aktivtSteg === s.nummer
                  ? "bg-white border-primary-500 text-primary-600"
                  : "bg-white border-gray-200 text-gray-400"
              }`}
            >
              {aktivtSteg > s.nummer ? <Check size={16} /> : s.nummer}
            </div>
            <p
              className={`text-xs mt-1 font-medium hidden sm:block text-center max-w-[80px] leading-tight ${
                aktivtSteg >= s.nummer ? "text-primary-600" : "text-gray-400"
              }`}
            >
              {s.tittel}
            </p>
          </div>
          {i < steg.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                aktivtSteg > s.nummer ? "bg-primary-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
