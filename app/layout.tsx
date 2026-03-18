import type { Metadata } from "next";
import "./globals.css";
import { RolleProvider } from "@/lib/context/RolleContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "KI-løsningsregisteret – Helsedirektoratet",
  description:
    "Nasjonal portal for innmelding og oversikt over KI-løsninger i norsk helse- og omsorgstjeneste.",
  other: {
    "leaflet-css": "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
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
