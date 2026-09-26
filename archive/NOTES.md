# NOTES — Week Of Stay live agent demo

**Ran:** Fri Sep 25, 2026 (America/Toronto)  
**Primary goal:** myreservations Denver hotel search for ASN Kidney Week (Oct 20–27 2026, 2 adults), sorted by guest rating per Laya.  
**Outcome:** LIVE Jev status **done** in **4349 ms**. Final URL includes `ci=2026-10-20&co=2026-10-27&adults=2&sort=rating_descending`. Independent verify passed.

## What worked

1. **Laya Choice (live, ~3991 ms)** — `best_rated` (44.5%) + `downtown_lodo` (56.4%). Mapped to MR `sort=rating` and Denver dest.
2. **Free typer (live)** — On MR home, TYPE_TEXT filled Search stays with `Denver` via `cohere/north-mini-code:free` (~679 ms helper). Reasoning `none`.
3. **Jev sort apply (live DONE)** — On ASN-week results URL: CLICK Sort → CLICK Guest Rating: High to Low → DONE. 286 hotels visible (e.g. Staybridge 9.6, Woolley's 9.6).
4. **Chrome CDP Fork-2** (`BU_CDP_URL=http://127.0.0.1:9224`) — harness doctor OK; MR loads through browser (curl alone got HTTP 429).

## What did not (yet)

- **Google Flights ZRH→LON** — After clicking ticket type, observe often collapsed to Scroll/Wait only → BLOCKED. Pivoted to Event Stay / myreservations for a hard landing.
- **Home→full date fill** — Agent reached `/search` after Denver + Search click but kept default Sep 26–27 dates; blocked before calendar TYPE/CLICK. Kept as typer proof only (`live-v1`).

## Costs stance

| Piece | Stance |
| --- | --- |
| OpenRouter text | **Free only** (`…:free`). Never paid models. |
| Laya | Local in-process SDK — no cloud LLM bill |
| Typesafe Jev | Live API (decision heads) |
| Browser | Local Chrome CDP |

## How to re-run

```bash
cd /workspace/jev-ultrafast
# ensure .env: TEXT_MODEL=cohere/north-mini-code:free, TEXT_MODEL_REASONING=none, BU_CDP_URL=http://127.0.0.1:9224
# secrets from box-secrets card — never echo keys

# Laya choice
cd /workspace/Trading-2026/research/jev-desk-loop
.venv/bin/python  # (script as used for laya-live-denver-choice-v2.json)

# Jev DONE on prepared search (no sort) — agent applies rating
cd /workspace/jev-ultrafast
uv run --env-file .env python examples/run.py \
  --url 'https://www.myreservations.com/search?dest=Denver&placeId=ChIJzxcfI6qAa4cR1jaKJ_j0jhE&ci=2026-10-20&co=2026-10-27&adults=2&rooms=1' \
  --goal 'Change sort to Guest Rating High to Low. Stop when hotels with prices are visible. Do not book.'
```

Artifacts (box, may contain DOM text — no API keys):  
`/workspace/jev-ultrafast/artifacts/mr-denver/live-v3/` · playbook HTML · this site under `/workspace/kickass-agent-demo/`.

## Safety

- Never commit `.env`, `box-secrets.json`, or raw traces with credentials.
- Public page uses Week Of Stay / myreservations framing — no secret names.
