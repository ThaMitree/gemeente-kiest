"""
Transform party_jsons/ into web/src/data/parties.json.

Reads config from config/municipality.json, config/parties.json, and config/topics.json.
Run from the project root:

    python3 pipeline/transform.py
"""
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT     = Path(__file__).parent.parent
JSON_DIR = ROOT / "party_jsons"
OUTPUT   = ROOT / "web" / "src" / "data" / "parties.json"
CONFIG   = ROOT / "config"


def load_config() -> tuple[dict, list[dict], list[dict]]:
    municipality = json.loads((CONFIG / "municipality.json").read_text())
    parties      = json.loads((CONFIG / "parties.json").read_text())
    topics       = json.loads((CONFIG / "topics.json").read_text())
    return municipality, parties, topics


def transform() -> dict:
    municipality, party_meta, topics = load_config()

    parties_out = []
    for meta in party_meta:
        path = JSON_DIR / f"{meta['id']}.json"
        if not path.exists():
            print(f"  SKIP: {meta['id']}.json not found yet")
            continue

        party_data = json.loads(path.read_text())
        raw_topics = party_data.get("topics", {})

        positions: dict = {}
        for topic in topics:
            tid   = topic["id"]
            entry = raw_topics.get(tid)
            if entry:
                positions[tid] = {
                    "summary":    entry.get("summary", ""),
                    "key_points": entry.get("key_points", []),
                    "quote":      entry.get("quote", ""),
                    "coverage":   entry.get("coverage", "onbekend"),
                }
            else:
                positions[tid] = None

        filled = sum(1 for v in positions.values() if v)
        print(f"  {meta['name']}: {filled}/{len(topics)} topics")

        parties_out.append({
            "id":           meta["id"],
            "name":         meta["name"],
            "abbreviation": meta["abbreviation"],
            "color":        meta["color"],
            "text_color":   meta["text_color"],
            "source":       party_data.get("source", "unknown"),
            "positions":    positions,
        })

    return {
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "municipality": municipality,
        "topics":       topics,
        "parties":      parties_out,
    }


if __name__ == "__main__":
    print("Transforming party JSONs...")
    data = transform()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f"\nWritten to {OUTPUT}")
    print(f"Parties: {len(data['parties'])}, Topics: {len(data['topics'])}")
