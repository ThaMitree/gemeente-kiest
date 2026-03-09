# How Site Content Is Made

This project is a **static voter comparison** website for municipal elections.

## Short version
- Party programmes are collected from PDFs/web pages.
- They are converted to plain text.
- Claude Code reads the text and summarizes each party's position into a structured JSON file.
- A transform step combines all party files into one frontend dataset.
- The Next.js app renders that dataset.
  There is no live AI call in production for visitors.

## Configuration

- `config/municipality.json` — city name, year, election date, source URL
- `config/parties.json` — party display metadata (names, colors, order)
- `config/topics.json` — the topic taxonomy shown to visitors

## Data flow
1. **Raw sources**
   Original party programme PDFs/web pages (stored locally, not in git).

2. **Text extraction** (`pipeline/extract_texts.py`)
   Converts PDFs and web pages to plain text with `[pagina N]` markers.

3. **Per-party JSON output** (`party_jsons/{id}.json`)
   Each party gets the same topic schema, produced in a Claude Code session:
   - `summary`
   - `key_points`
   - `quote`
   - `coverage`

4. **Frontend transform** (`python3 pipeline/transform.py`)
   Reads `config/` and all party JSONs. Generates:
   - `web/src/data/parties.json`

5. **Frontend build** (`web/`)
   Next.js reads `web/src/data/parties.json` and statically renders the site.

## Where to edit content
- Edit party files in `party_jsons/`.
- Edit municipality/party/topic config in `config/`.
- Then run:
  1. `python3 pipeline/transform.py`
  2. `cd web && npm run build`

## Reproducing for a different municipality
See `REPRODUCE.md`.
