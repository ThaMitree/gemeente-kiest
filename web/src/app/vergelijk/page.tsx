"use client";

import { useState } from "react";
import { topics, parties } from "@/lib/parties";
import { TopicFilter } from "@/components/TopicFilter";
import { PartyGrid } from "@/components/PartyGrid";
import { PartyFilter } from "@/components/PartyFilter";

export default function VergelijkPage() {
  const [activeTopic, setActiveTopic] = useState<string>(
    topics[0]?.id ?? "wonen"
  );
  const [hiddenParties, setHiddenParties] = useState<Set<string>>(new Set());

  const visibleParties = parties.filter((p) => !hiddenParties.has(p.id));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vergelijk de partijprogramma&apos;s
        </h1>
        <p className="text-gray-500">
          Kies een onderwerp om te zien wat elke partij voorstelt.
        </p>
      </div>

      <div className="mb-3 flex justify-end">
        <PartyFilter
          parties={parties}
          hiddenParties={hiddenParties}
          onChange={setHiddenParties}
        />
      </div>

      <TopicFilter
        topics={topics}
        activeTopic={activeTopic}
        onChange={setActiveTopic}
      />

      <PartyGrid parties={visibleParties} topicId={activeTopic} />
    </div>
  );
}
