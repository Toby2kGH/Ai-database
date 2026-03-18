/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sikkerhetsheadere påkrevd for offentlig helseportal
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Hindrer innlasting i iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Hindrer MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Tvinger HTTPS i 1 år inkl. subdomener
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Begrenser referrer-informasjon til tredjeparter
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Deaktiverer unødvendige nettleser-APIer
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=()" },
          // Hindrer XSS via cross-site scripting filter
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Content Security Policy
          // unsafe-inline trengs for Tailwind og Recharts inline styles
          // data: trengs for Leaflet ikoner
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval'",   // Next.js krever unsafe-eval i dev
              "style-src 'self' 'unsafe-inline'",  // Tailwind bruker inline styles
              "img-src 'self' data: https://*.tile.openstreetmap.org",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
