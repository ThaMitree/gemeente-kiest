"use client";

import { useEffect, useRef, useState } from "react";
import type { Party } from "@/lib/types";

interface Props {
  parties: Party[];
  hiddenParties: Set<string>;
  onChange: (hiddenParties: Set<string>) => void;
}

export function PartyFilter({ parties, hiddenParties, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(id: string) {
    const next = new Set(hiddenParties);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  }

  function selectAll() {
    onChange(new Set());
  }

  function deselectAll() {
    onChange(new Set(parties.map((p) => p.id)));
  }

  const visibleCount = parties.length - hiddenParties.size;
  const allVisible = hiddenParties.size === 0;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
          hiddenParties.size > 0
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
        }`}
      >
        <span>Partijen</span>
        <span
          className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${
            hiddenParties.size > 0
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {visibleCount}/{parties.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-2">
          <div className="flex items-center justify-between px-3 pb-2 mb-1 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">Partijen tonen</span>
            <button
              type="button"
              onClick={allVisible ? deselectAll : selectAll}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              {allVisible ? "Alles verbergen" : "Alles tonen"}
            </button>
          </div>
          {parties.map((party) => {
            const visible = !hiddenParties.has(party.id);
            return (
              <button
                key={party.id}
                type="button"
                onClick={() => toggle(party.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: party.color }}
                />
                <span
                  className={`text-sm flex-1 text-left ${
                    visible ? "text-gray-800" : "text-gray-400 line-through"
                  }`}
                >
                  {party.abbreviation}
                </span>
                <span className={`text-xs ${visible ? "text-gray-400" : "text-gray-300"}`}>
                  {visible ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
