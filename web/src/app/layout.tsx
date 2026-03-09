import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { InfoDisclosure } from "@/components/InfoDisclosure";
import { municipality } from "@/lib/parties";

const geist = Geist({ subsets: ["latin"] });

const { name, year, election_date, source_programs_url, source_programs_label, contact_email, repo_url } = municipality;
const siteTitle = `${name} Kiest ${year} — Partijprogramma Vergelijker`;

export const metadata: Metadata = {
  title: siteTitle,
  description: `Vergelijk de verkiezingsprogramma's van alle partijen voor de gemeenteraadsverkiezingen ${name} ${year}.`,
  openGraph: {
    title: `${name} Kiest ${year}`,
    description: `Vergelijk partijprogramma's voor ${name} ${year}.`,
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className={`${geist.className} bg-gray-50 min-h-screen antialiased`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900">{name} Kiest {year}</span>
              <span className="text-gray-400 text-sm ml-2 hidden sm:inline">
                Partijprogramma vergelijker
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">
                Gemeenteraadsverkiezingen · {election_date}
              </span>
              <InfoDisclosure name={name} year={year} contactEmail={contact_email} repoUrl={repo_url} />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-gray-200 space-y-2">
          <p className="text-xs text-gray-400 text-center">
            Samenvattingen gegenereerd met{" "}
            <strong className="font-medium">Codex</strong> (OpenAI) en{" "}
            <strong className="font-medium">Claude Code</strong> (Anthropic) op basis van de verkiezingsprogramma&apos;s zoals
            gepubliceerd door de{" "}
            <a
              href={source_programs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
            >
              {source_programs_label}
            </a>
            . Volgorde van partijen conform dezelfde publicatie.
            Altijd de originele bronnen raadplegen voor de volledige context.
          </p>
          <p className="text-xs text-gray-400 text-center">
            Dit ook voor jouw gemeente? Klik op de{" "}
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] leading-none">i</span>
            {" "}voor meer informatie.
          </p>
        </footer>
      </body>
    </html>
  );
}
