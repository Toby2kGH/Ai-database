import type { Metadata } from "next";
import "./globals.css";
import { RolleProvider } from "@/lib/context/RolleContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "KI-løsningsregisteret – Helsedirektoratet",
  description:
    "Nasjonal portal for innmelding og oversikt over KI-løsninger i norsk helse- og omsorgstjeneste.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <head>
        {/* Leaflet CSS lastes lokalt fra /public – ingen ekstern CDN-avhengighet.
            eslint-disable-next-line @next/next/no-css-tags */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/leaflet.css" />
      </head>
      <body className="min-h-screen flex flex-col">
        <RolleProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </RolleProvider>
      </body>
    </html>
  );
}
