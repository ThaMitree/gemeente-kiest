# Gemeente Kiest — open-source partijprogramma vergelijker

Een onafhankelijk hulpmiddel waarmee kiezers de verkiezingsprogramma's van lokale partijen naast elkaar kunnen leggen, per onderwerp. Geen binding met partijen, gemeenten of andere organisaties.

**Bekijk het live voorbeeld: [Leiden 2026](https://leidseverkiezingen.dimitry.cc/vergelijk)**

---

## Wat is dit?

Dit project maakt het makkelijk om voor jouw gemeente een vergelijkingstool te bouwen op basis van de officiële verkiezingsprogramma's. De samenvattingen worden gegenereerd met behulp van AI — de werkwijze is transparant en volledig reproduceerbaar.

De Leidse versie is in één middag gebouwd door [Dimitry (ThaMitree)](https://github.com/ThaMitree), met hulp van [Claude Code](https://claude.ai/claude-code) (Anthropic) en [Codex](https://openai.com/codex) (OpenAI).

**Hoe het werkt:**
1. Partijprogramma's verzamelen (PDF of webpagina)
2. Tekst extraheren met de meegeleverde pipeline
3. Claude Code leest de tekst en schrijft per partij een gestructureerd JSON-bestand
4. De pipeline combineert alles tot één dataset
5. De Next.js frontend rendert de vergelijker statisch — geen live AI-calls voor bezoekers

---

## Zelf bouwen voor jouw gemeente?

De repository is opgezet als template. Je hebt geen API-sleutel nodig — alleen [Claude Code](https://claude.ai/claude-code) als CLI.

**Stap 1:** Clone of fork deze repo

**Stap 2:** Pas de drie config-bestanden aan:
- `config/municipality.json` — naam, jaar, verkiezingsdatum
- `config/parties.json` — partijen met naam en kleur
- `config/topics.json` — de onderwerpen (standaard 14 Nederlandse gemeentethema's)

**Stap 3:** Verzamel de verkiezingsprogramma's en extraheer de tekst

**Stap 4:** Open een Claude Code sessie en laat het de JSON-bestanden schrijven op basis van de tekst

**Stap 5:** Draai de pipeline en build de site:
```bash
python3 pipeline/transform.py
cd web && npm run build
```

Zie [`REPRODUCE.md`](./REPRODUCE.md) voor het volledige stappenplan inclusief leesstrategieën voor grote PDF's en een voorbeeldprompt voor Claude Code.

---

## Tech stack

- **Frontend:** Next.js 15 (statisch gegenereerd)
- **Data pipeline:** Python 3.12
- **Deployment:** Docker Compose + Cloudflare Tunnel (zie [`DEPLOYMENT.md`](./DEPLOYMENT.md))
- **AI-tooling (alleen tijdens content-productie):** Claude Code, Codex

---

## Disclaimer

De samenvattingen zijn volledig AI-gegenereerd en niet handmatig geverifieerd. Raadpleeg altijd de originele partijprogramma's voor de volledige context. Dit project heeft geen enkele binding met politieke partijen of gemeentelijke organisaties.

---

## Meedoen of vragen?

Gevonden een fout in de Leidse versie, of heb je dit voor jouw gemeente gebouwd? Open een issue of stuur een pull request.
