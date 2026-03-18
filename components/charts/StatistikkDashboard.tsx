"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { KILosning } from "@/lib/types";
import { beregnStatistikk, godkjenningsStatusTekst } from "@/lib/utils";

interface Props {
  losninger: KILosning[];
}

const RHF_FARGER: Record<string, string> = {
  "Helse Sør-Øst": "#006A4E",
  "Helse Vest": "#00A878",
  "Helse Midt-Norge": "#40AB8D",
  "Helse Nord": "#80C7B3",
};

const STATUS_FARGER: Record<string, string> = {
  "godkjent": "#16a34a",
  "delvis": "#ca8a04",
  "ikke-godkjent": "#dc2626",
  "under-utproving": "#ea580c",
  "ukjent": "#9ca3af",
};

export function RHFStolpeDiagram({ losninger }: Props) {
  const { perRHF } = beregnStatistikk(losninger);
  const data = Object.entries(perRHF).map(([rhf, antall]) => ({
    rhf: rhf.replace("Helse ", ""),
    antall,
    farge: RHF_FARGER[rhf],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="rhf" tick={{ fontSize: 11 }} width={80} />
        <Tooltip
          formatter={(value) => [value, "Løsninger"]}
          labelStyle={{ fontWeight: 600 }}
        />
        <Bar dataKey="antall" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.farge} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GodkjenningsStatusDiagram({ losninger }: Props) {
  const { perStatus } = beregnStatistikk(losninger);
  const data = Object.entries(perStatus)
    .filter(([, v]) => v > 0)
    .map(([status, antall]) => ({
      name: godkjenningsStatusTekst(status as any),
      value: antall,
      farge: STATUS_FARGER[status],
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.farge} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "løsninger"]} />
        <Legend
          formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopFagfeltListe({ losninger }: Props) {
  const { topFagfelt } = beregnStatistikk(losninger);
  const maks = topFagfelt[0]?.[1] || 1;

  return (
    <div className="space-y-3">
      {topFagfelt.map(([fagfelt, antall]) => (
        <div key={fagfelt}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{fagfelt}</span>
            <span className="text-gray-500">{antall} løsninger</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${(antall / maks) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
