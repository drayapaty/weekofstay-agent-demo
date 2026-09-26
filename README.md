# Week Of Stay · Event Stay Agent Demo

Magazine-quality **LIVE** demo of an event-week hotel agent:

1. **Laya** chooses sort + neighborhood for ASN Kidney Week (Denver, Oct 20–27 2026).
2. **Jev Ultrafast** drives [myreservations.com](https://www.myreservations.com) in a real Chrome CDP session.
3. Free OpenRouter typer (`cohere/north-mini-code:free`) types the destination when needed.
4. Run ends **DONE** with rating-sorted results (~4.3s) and a live screenshot.

## Open locally

```bash
cd kickass-agent-demo   # or open index.html in a browser
python3 -m http.server 8765
# → http://127.0.0.1:8765
```

## Layout

```
index.html          # showpiece (SAMPLE chrome + LIVE evidence badges)
assets/             # live screenshot(s)
data/run-summary.json
NOTES.md            # what worked / costs / re-run
DEPLOY.md           # GitHub + Vercel notes for CoS
```

## Badges

- **LIVE** — real Laya / Jev / CDP / screenshot from the Sep 25 2026 run.
- **SAMPLE UI** — this page’s presentation chrome (not the hotel site).
- **Free typer** — OpenRouter `:free` model only; reasoning off.

See [NOTES.md](./NOTES.md) for blockers (Flights observe) and re-run commands.
