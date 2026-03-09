"use client";

import { useState } from "react";
import type { Party } from "@/lib/types";

interface Props {
  party: Party;
  topicId: string;
}

export function PartyCard({ party, topicId }: Props) {
  const [expanded, setExpanded] = useState(false);
  const position = party.positions[topicId];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
      {/* Colored header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: party.color }}
      >
        <span
          className="font-bold text-sm leading-tight"
          style={{ color: party.text_color }}
        >
          {party.name}
        </span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0 ml-2"
          style={{ color: party.text_color, backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          {party.abbreviation}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {position ? (
          <>
            <p className="text-sm text-gray-700 leading-relaxed">{position.summary}</p>

            {position.key_points.length > 0 && (
              <div>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <span
                    className="inline-block transition-transform duration-150"
                    style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
                  >
                    ▶
                  </span>
                  {expanded ? "Verberg" : `${position.key_points.length} speerpunten`}
                </button>

                {expanded && (
                  <ul className="mt-2 space-y-1">
                    {position.key_points.map((point, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: party.color }}
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {position.quote && (
              <blockquote className="mt-auto border-l-2 pl-3 text-xs text-gray-400 italic leading-relaxed" style={{ borderColor: party.color }}>
                &ldquo;{position.quote}&rdquo;
              </blockquote>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Geen standpunt gevonden voor dit onderwerp.
          </p>
        )}
      </div>
    </div>
  );
}
