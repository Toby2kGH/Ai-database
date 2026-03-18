import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
            <Search className="text-primary-400" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Side ikke funnet</h1>
        <p className="text-gray-500 text-sm mb-6">
          Siden du leter etter finnes ikke, eller har blitt flyttet.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Til forsiden
          </Link>
          <Link
            href="/utforsk"
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Utforsk løsninger
          </Link>
        </div>
      </div>
    </div>
  );
}
