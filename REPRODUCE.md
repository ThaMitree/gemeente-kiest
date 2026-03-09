# Reproducing This Site for Your Municipality

This guide explains how to produce a voter comparison site like this one for any municipality. The workflow is: gather party programs → extract text → have Claude Code read the text and produce structured JSON → run the pipeline → deploy.

No Claude API key is needed. You interact with Claude via Claude Code (the CLI), which reads the text files and writes the JSON files in your session.

---

## Prerequisites

- [Claude Code](https://claude.ai/claude-code) installed and authenticated
- Python 3.12+ with `uv` or `pip`
- Node.js 18+ and npm
- `pdftotext` or `pdfplumber` for PDF extraction (see step 3)

---

## Step 1 — Fork and configure

Clone or fork this repo, then edit the three config files:

**`config/municipality.json`** — city name and election metadata:
```json
{
  "name": "Amsterdam",
  "year": 2026,
  "election_date": "18 maart 2026",
  "source_programs_url": "https://...",
  "source_programs_label": "gemeente Amsterdam"
}
```

**`config/parties.json`** — one entry per party, in the order you want them displayed. Pick party colors from their official branding:
```json
[
  {"id": "pvda", "name": "PvdA Amsterdam", "abbreviation": "PvdA", "color": "#E3001B", "text_color": "#FFFFFF"},
  ...
]
```

**`config/topics.json`** — the topics voters will be able to compare. The defaults (14 Dutch municipal topics) work for most Dutch municipalities. Adapt labels or add/remove topics as needed. Keep `id` values lowercase with no spaces.

---

## Step 2 — Gather party programs

Find all party programs for your municipality. They are usually:
- Listed on the municipality website under "verkiezingsprogramma's"
- Published on each party's local chapter website

Collect all PDF files into a `PDFs/` directory next to the repo root (this folder is gitignored).

For parties that only publish a web page (no PDF), note the URL.

---

## Step 3 — Extract text from programs

### PDFs

The file `pipeline/extract_texts.py` is a working example (adapted for Leiden). Edit the `PARTIES` list at the top to match your parties and PDF filenames, then run:

```bash
python3 pipeline/extract_texts.py
```

This produces plain-text files in `texts/` with `[pagina N]` page markers.

Alternatively, use `pdftotext` directly for simple PDFs:
```bash
pdftotext PDFs/yourparty.pdf texts_clean/yourparty.txt
```

After extraction, spot-check a few text files to make sure the content looks readable. Multi-column or spread layouts sometimes extract poorly — the `layout=True` option in pdfplumber handles most cases.

### Web pages

For parties without a PDF, either:
- Use `extract_texts.py` with a Playwright extractor (see the FVD/Sleutelstad examples in the file)
- Or manually copy-paste the program text into a `.txt` file in `texts_clean/`

---

## Step 4 — Have Claude Code produce the party JSONs

This is the core step. Open a Claude Code session in the project root and work through parties one at a time.

### What to tell Claude

For each party, say something like:

> "Read the party program text for [party name] from `texts_clean/yourparty.txt`. Extract their positions on each of the 14 topics in `config/topics.json`. Write the result to `party_jsons/yourparty.json` using the schema below. Base everything strictly on the source text — do not fabricate. Use `coverage: "geen"` when a topic is not mentioned."

**JSON schema** (show this to Claude):
```json
{
  "party_id": "pvda",
  "party_name": "PvdA Amsterdam",
  "analyzed_at": "2026-03-01",
  "source": "pdf",
  "topics": {
    "wonen": {
      "summary": "2-4 sentences summarising the position in Dutch.",
      "key_points": ["concrete point 1", "concrete point 2"],
      "quote": "Exact quote from the program text.",
      "coverage": "volledig"
    }
  }
}
```

`coverage` values: `"volledig"` (topic well-covered), `"beperkt"` (briefly mentioned), `"geen"` (not mentioned).

### Reading strategy for large PDFs

Tell Claude to split the text by page markers first and read the table of contents, then jump to relevant sections:

```python
import re
from pathlib import Path

text = Path('texts_clean/yourparty.txt').read_text()
parts = re.split(r'\[pagina (\d+)\]', text)
pages = {}
for i in range(1, len(parts), 2):
    pages[int(parts[i])] = parts[i+1].strip()

# Read TOC first (usually pages 3-6)
for p in [3, 4, 5, 6]:
    print(f'=== PAGE {p} ===')
    print(pages[p][:600])
```

For web-extracted texts with `## Chapter` markers:
```python
import re
from pathlib import Path

text = Path('texts_clean/yourparty.txt').read_text()
sections = re.split(r'\n## ', '\n' + text)
for s in sections:
    print(s[:200])
    print('---')
```

### Tips

- Look at `party_jsons/cda.json` as a worked example of the expected output.
- Quotes should be verbatim from the source text — not paraphrased.
- Keep summaries neutral and factual (2–4 sentences in Dutch).
- If a topic spans multiple chapters, combine the key points but keep the summary concise.
- Very long programs (100+ pages) can be chunked: read the TOC first to find which pages cover which topics, then read only those pages.

---

## Step 5 — Run the pipeline and build

Once all party JSONs are in `party_jsons/`, run:

```bash
python3 pipeline/transform.py
cd web && npm run build
```

`transform.py` reads `config/` and all party JSONs and generates `web/src/data/parties.json`.
`npm run build` produces the static site in `web/.next/`.

---

## Step 6 — Deploy

See `DEPLOYMENT.md` for Docker Compose + Cloudflare Tunnel setup. In short:

```bash
cp .env.example .env
# set CF_TUNNEL_TOKEN in .env
docker compose up -d --build
```

---

## What to customise beyond the config

- **`web/src/components/InfoDisclosure.tsx`** — the info modal. Update the project name, your name/handle, contact email, and any disclosure text you want to show visitors.
- **`pipeline/extract_texts.py`** — adapt the `PARTIES` list to your municipality's parties and sources.
- The site is in Dutch by default. If you want another language, update the topic labels in `config/topics.json` and the UI strings in `web/src/app/vergelijk/page.tsx` and `web/src/app/layout.tsx`.
