import type { Party } from "@/lib/types";
import { PartyCard } from "./PartyCard";

interface Props {
  parties: Party[];
  topicId: string;
}

export function PartyGrid({ parties, topicId }: Props) {
  if (parties.length === 0) {
    return (
      <p className="text-center text-gray-400 py-16">
        Nog geen partijgegevens beschikbaar.
      </p>
    );
  }

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
    >
      {parties.map((party) => (
        <PartyCard key={party.id} party={party} topicId={topicId} />
      ))}
    </div>
  );
}
