"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BrukerProfil, BRUKER_PROFILER } from "../types";

const STORAGE_KEY = "ki-register-rolle";

interface RolleContextType {
  bruker: BrukerProfil;
  setBruker: (profil: BrukerProfil) => void;
}

const RolleContext = createContext<RolleContextType>({
  bruker: BRUKER_PROFILER[0],
  setBruker: () => {},
});

export function RolleProvider({ children }: { children: React.ReactNode }) {
  const [bruker, setBrukerState] = useState<BrukerProfil>(BRUKER_PROFILER[0]);

  // Last inn lagret rolle ved oppstart
  useEffect(() => {
    try {
      const lagret = localStorage.getItem(STORAGE_KEY);
      if (lagret) {
        const profil = JSON.parse(lagret) as BrukerProfil;
        // Valider at rollen finnes i BRUKER_PROFILER
        const gyldig = BRUKER_PROFILER.find((p) => p.rolle === profil.rolle);
        if (gyldig) setBrukerState(gyldig);
      }
    } catch {
      // Ignorer feil (privat modus, kvoter o.l.)
    }
  }, []);

  const setBruker = (profil: BrukerProfil) => {
    setBrukerState(profil);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profil));
    } catch {
      // Ignorer feil
    }
  };

  return (
    <RolleContext.Provider value={{ bruker, setBruker }}>
      {children}
    </RolleContext.Provider>
  );
}

export function useRolle() {
  return useContext(RolleContext);
}
