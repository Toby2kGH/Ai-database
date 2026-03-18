"use client";

import React, { createContext, useContext, useState } from "react";
import { BrukerProfil, BRUKER_PROFILER } from "../types";

interface RolleContextType {
  bruker: BrukerProfil;
  setBruker: (profil: BrukerProfil) => void;
}

const RolleContext = createContext<RolleContextType>({
  bruker: BRUKER_PROFILER[0],
  setBruker: () => {},
});

export function RolleProvider({ children }: { children: React.ReactNode }) {
  const [bruker, setBruker] = useState<BrukerProfil>(BRUKER_PROFILER[0]);

  return (
    <RolleContext.Provider value={{ bruker, setBruker }}>
      {children}
    </RolleContext.Provider>
  );
}

export function useRolle() {
  return useContext(RolleContext);
}
