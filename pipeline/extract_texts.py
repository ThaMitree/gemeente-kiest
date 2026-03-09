"""
Extract all party programs to plain .txt files in ../texts/

PDFs  → pdfplumber (layout-aware extraction)
Web   → Playwright (for JS-rendered or tabbed program pages)

NOTE: This file is the Leiden 2026 example. If you are reproducing this
project for a different municipality, adapt the PARTIES list below with
your own party names, PDF filenames, and web URLs. PDF files are expected
in a PDFs/ directory next to this repository.

Usage:
    python3 pipeline/extract_texts.py              # all parties
    python3 pipeline/extract_texts.py cda d66      # specific parties by id
"""
import sys
from pathlib import Path

# ── Party definitions ──────────────────────────────────────────────────────────
PARTIES = [
    {
        "id": "groenlinks_pvda",
        "name": "GroenLinks-PvdA",
        "source": "pdf",
        "path": "GroenLinks-PvdA-Leiden-verkiezingsprogramma-2026-DEF-klikbaar.pdf",
    },
    {
        "id": "d66",
        "name": "D66",
        "source": "pdf",
        "path": "VP-Leiden-4.pdf",
    },
    {
        "id": "cda",
        "name": "CDA",
        "source": "pdf",
        "path": "Verkiezingsprogramma-CDA-Leiden-2026-2030-DEF.pdf",
    },
    {
        "id": "pvdd",
        "name": "Partij voor de Dieren",
        "source": "pdf",
        "path": "Beleidsversie-Verkiezingsprogramma-PvdD-Leiden-26-30.pdf",
    },
    {
        "id": "christenunie",
        "name": "ChristenUnie",
        "source": "pdf",
        "path": "Samen.-Voor-Leiden-Verkiezingsprogramma-ChristenUnie-Leiden-2026-2030-LowRess.pdf",
    },
    {
        "id": "volt",
        "name": "Volt",
        "source": "pdf",
        "path": "volt-leiden-verkiezingsprogramma-2026-2030.pdf",
    },
    {
        "id": "svl",
        "name": "Studenten Voor Leiden",
        "source": "pdf",
        "path": "SVL-verkiezingsprogramma.pdf",
    },
    {
        "id": "sp",
        "name": "SP",
        "source": "pdf",
        "path": "2026-GR-Verkiezingsprogramma-Leiden-dubbelblad.pdf",
    },
    {
        "id": "fvd",
        "name": "Forum voor Democratie",
        "source": "fvd_web",
        "path": "https://fvd.nl/gemeentes/leiden",
    },
    {
        "id": "partij_sleutelstad",
        "name": "Partij Sleutelstad",
        "source": "sleutelstad_web",
        "path": "https://partijsleutelstad.nl/programma/",
    },
    {
        "id": "vvd",
        "name": "VVD",
        "source": "pdf",
        "path": "vvd_leiden_programma_2026-2030.pdf",
    },
]

PDF_DIR = Path(__file__).parent.parent / "PDFs"
OUT_DIR = Path(__file__).parent.parent / "texts"


# ── Extractors ─────────────────────────────────────────────────────────────────

def extract_pdf(filename: str) -> str:
    import pdfplumber

    path = PDF_DIR / filename
    pages = []
    with pdfplumber.open(path) as pdf:
        total = len(pdf.pages)
        for i, page in enumerate(pdf.pages):
            print(f"    page {i+1}/{total}", end="\r", flush=True)
            # layout=True preserves columns and spread layouts better
            text = page.extract_text(layout=True, x_tolerance=3, y_tolerance=3)
            if not text or len(text.strip()) < 30:
                text = page.extract_text(x_tolerance=3, y_tolerance=3) or ""
            if text.strip():
                pages.append(f"[pagina {i+1}]\n{text.strip()}")
    print()  # newline after progress
    return "\n\n".join(pages)


def extract_fvd() -> str:
    """FVD uses a 10-chapter tab UI; click through each chapter with Playwright."""
    from playwright.sync_api import sync_playwright

    url = "https://fvd.nl/gemeentes/leiden"
    print("    using Playwright (accordion chapters)...", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle", timeout=30_000)
        page.wait_for_timeout(2000)

        # Chapter buttons look like: "1\nBestuur\n15 punten"
        buttons = page.query_selector_all("button")
        chapter_btns = []
        for btn in buttons:
            first_line = (btn.inner_text() or "").strip().split("\n")[0].strip()
            if first_line.isdigit() and 1 <= int(first_line) <= 10:
                chapter_btns.append(btn)

        sections: list[str] = []
        seen_lines: set[str] = set()

        for btn in chapter_btns:
            btn_text = (btn.inner_text() or "").strip().split("\n")
            chapter_name = btn_text[1] if len(btn_text) > 1 else btn_text[0]
            btn.click()
            page.wait_for_timeout(800)

            raw = (page.query_selector("main") or page).inner_text()
            # Deduplicate boilerplate that repeats across chapter views
            lines = [l.strip() for l in raw.split("\n") if l.strip()]
            new_lines = [l for l in lines if l not in seen_lines]
            seen_lines.update(new_lines)
            if new_lines:
                sections.append(f"## {chapter_name}\n" + "\n".join(new_lines))

        browser.close()

    return "\n\n".join(sections)


def extract_sleutelstad() -> str:
    """Partij Sleutelstad spreads its program across ~20 subpages."""
    import re
    from playwright.sync_api import sync_playwright

    base_url = "https://partijsleutelstad.nl/programma/"
    print("    using Playwright (crawling subpages)...", flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(base_url, wait_until="networkidle", timeout=30_000)
        page.wait_for_timeout(2000)

        hrefs = page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
        browser.close()

    subpages = sorted({
        h for h in hrefs
        if re.search(r"partijsleutelstad\.nl/programma/[^/#]+/?$", h)
    })
    print(f"    {len(subpages)} subpages found", flush=True)

    sections: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for i, url in enumerate(subpages):
            print(f"    {i+1}/{len(subpages)}: {url.split('/')[-2]}", end="\r", flush=True)
            pg = browser.new_page()
            try:
                pg.goto(url, wait_until="networkidle", timeout=20_000)
                pg.wait_for_timeout(1000)
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(pg.content(), "html.parser")
                for tag in soup.select("nav, footer, header, script, style"):
                    tag.decompose()
                content = (
                    soup.find("main") or soup.find("article")
                    or soup.find(id="content") or soup.body
                )
                text = content.get_text(separator="\n", strip=True) if content else ""
                slug = url.rstrip("/").split("/")[-1].replace("-", " ").title()
                if text.strip():
                    sections.append(f"## {slug}\n{text.strip()}")
            except Exception as e:
                print(f"\n    skipping {url}: {e}")
            finally:
                pg.close()
        browser.close()

    print()
    return "\n\n".join(sections)


# ── Main ───────────────────────────────────────────────────────────────────────

def process(party: dict) -> None:
    out_path = OUT_DIR / f"{party['id']}.txt"

    src = party["source"]
    if src == "pdf":
        text = extract_pdf(party["path"])
    elif src == "fvd_web":
        text = extract_fvd()
    elif src == "sleutelstad_web":
        text = extract_sleutelstad()
    else:
        raise ValueError(f"Unknown source type: {src}")

    out_path.write_text(text, encoding="utf-8")
    size_kb = out_path.stat().st_size // 1024
    print(f"    saved → {out_path.name} ({size_kb} KB, {len(text):,} chars)")


def main() -> None:
    filter_ids = set(sys.argv[1:])

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    targets = [p for p in PARTIES if not filter_ids or p["id"] in filter_ids]
    if filter_ids and len(targets) != len(filter_ids):
        unknown = filter_ids - {p["id"] for p in targets}
        print(f"Unknown party IDs: {unknown}")
        print(f"Valid IDs: {[p['id'] for p in PARTIES]}")
        sys.exit(1)

    print(f"Extracting {len(targets)} party program(s) to {OUT_DIR}/\n")
    for party in targets:
        print(f"[{party['name']}]")
        try:
            process(party)
        except Exception as e:
            print(f"    ERROR: {e}")
        print()

    print("Done.")


if __name__ == "__main__":
    main()
