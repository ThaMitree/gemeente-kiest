"use client";

import { useState } from "react";

interface Props {
  name: string;
  year: number;
  contactEmail: string;
  repoUrl: string;
}

export function InfoDisclosure({ name, year, contactEmail, repoUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors cursor-pointer"
        aria-label="Informatie over de herkomst van de inhoud"
        title="Informatie"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl border border-gray-200 shadow-xl p-5 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg font-bold text-gray-900">Over deze vergelijker</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                aria-label="Sluiten"
              >
                Sluiten
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>{name} Kiest {year}</strong> is een onafhankelijk, open-source project van Dimitry (ThaMitree).
                Hoewel ik zelf politiek betrokken ben, heeft dit project <strong>geen enkele binding</strong> met
                politieke partijen, de gemeente {name}, of andere organisaties. Het is een persoonlijk initiatief
                bedoeld om kiezers te helpen bij het vergelijken van verkiezingsprogramma&apos;s.
              </p>
              <p>
                De samenvattingen zijn gegenereerd met behulp van AI-modellen (<strong>Codex</strong> van OpenAI en{" "}
                <strong>Claude Code</strong> van Anthropic). De werkwijze: partijprogramma&apos;s verzamelen,
                tekst extraheren, en per partij samenvatten op veertien vaste thema&apos;s.
              </p>
              <p className="border-l-2 border-amber-400 pl-3 text-gray-600">
                <strong>Disclaimer:</strong> de inhoud is volledig AI-gegenereerd en niet handmatig geverifieerd.
                Raadpleeg altijd de originele partijprogramma&apos;s voor volledige context en definitieve standpunten.
              </p>
              <p>
                De broncode is open-source beschikbaar op{" "}
                <a className="text-blue-600 hover:underline" href={repoUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                . Wil je dit ook voor jouw gemeente opzetten? De repository bevat een stappenplan om dit te reproduceren
                met je eigen partijprogramma&apos;s en Claude Code — geen API-sleutel nodig.
              </p>
              <p>
                Vragen of correcties? Mail naar{" "}
                <a className="text-blue-600 hover:underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
