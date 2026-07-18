import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--archivo", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oppr — Operational intelligence software for manufacturing",
  description:
    "Oppr captures operational context from the field, connects it with your machine data, and turns what works into repeatable action.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          `cz-shortcut-listen`) inject attributes onto <body> before React
          hydrates, which otherwise trips a false-positive hydration warning.
          This suppresses only <body>'s own attribute diff, one level deep. */}
      <body
        suppressHydrationWarning
        className={`${archivo.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
