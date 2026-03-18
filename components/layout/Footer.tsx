import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">HD</span>
              </div>
              <span className="font-semibold text-white">KI-løsningsregisteret</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nasjonal portal for innmelding og oversikt over KI-løsninger i norsk
              helse- og omsorgstjeneste. Driftes av Helsedirektoratet.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Spørsmål: ki.register@helsedir.no
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Portalen</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/utforsk" className="hover:text-white transition-colors">Utforsk løsninger</Link></li>
              <li><Link href="/kart" className="hover:text-white transition-colors">Norgeskartet</Link></li>
              <li><Link href="/veileder" className="hover:text-white transition-colors">Veileder for ledere</Link></li>
              <li><Link href="/regelverk" className="hover:text-white transition-colors">Regelverk og ressurser</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Eksterne ressurser</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://dmp.no" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  DMP – Direktoratet for medisinske produkter ↗
                </a>
              </li>
              <li>
                <a href="https://datatilsynet.no" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Datatilsynet ↗
                </a>
              </li>
              <li>
                <a href="https://helsetilsynet.no" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Statens helsetilsyn ↗
                </a>
              </li>
              <li>
                <a href="https://helsedirektoratet.no" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Helsedirektoratet ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © 2024 Helsedirektoratet. Dette er et demoregister.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Tilgjengelighet (WCAG 2.1 AA)</span>
            <span>|</span>
            <span>Personvern</span>
            <span>|</span>
            <span>Kontakt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
