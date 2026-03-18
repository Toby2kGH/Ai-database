import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Helsedirektoratets designprofil
        primary: {
          DEFAULT: "#006A4E",
          50: "#E6F4F0",
          100: "#C0E3D9",
          200: "#80C7B3",
          300: "#40AB8D",
          400: "#008F67",
          500: "#006A4E",
          600: "#005A42",
          700: "#004A36",
          800: "#003A2A",
          900: "#002A1E",
        },
        accent: {
          DEFAULT: "#00A878",
          50: "#E6F7F3",
          100: "#B3EBDE",
          200: "#66D7BD",
          300: "#00C39C",
          400: "#00A878",
          500: "#008D64",
          600: "#007250",
          700: "#00573C",
          800: "#003C28",
          900: "#002114",
        },
        neutral: {
          bg: "#F5F7F5",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
