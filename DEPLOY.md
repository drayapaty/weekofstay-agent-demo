# Deploy — GitHub + Vercel

Suggested repo name: **`weekofstay-agent-demo`** (or `event-stay-agent-demo`).

## What to commit

Commit **only** this folder’s public surface:

- `index.html`
- `assets/denver-results-live.png` (and optional `denver-jev-observe.jpg`)
- `data/run-summary.json` (sanitized — no keys)
- `README.md`, `NOTES.md`, `DEPLOY.md`, `.gitignore`

## Never commit

- `.env`, `box-secrets.json`, API keys, CDP session ids with secrets
- Raw Jev `state.json` if it ever embeds credentials (prefer `run-summary.json`)
- `node_modules`, `.vercel` secrets

## CoS / operator steps

1. Create empty GitHub repo `weekofstay-agent-demo` (public for easy Vercel, or private + Vercel Git integration).
2. Push this directory as the repo root (or `/` of a `gh-pages` / static project).
3. Import on Vercel → Framework **Other** → Output/root = repo root → Deploy.
4. Optional: custom domain under weekofstay / myreservations marketing.

## Local push sketch (if auth already present)

```bash
cd /workspace/kickass-agent-demo
git init
git add index.html assets data README.md NOTES.md DEPLOY.md .gitignore
git status   # eyeball: no .env / secrets
git commit -m "Week Of Stay live agent demo: Laya + Jev Denver DONE"
gh repo create weekofstay-agent-demo --public --source=. --remote=origin --push
# Then: vercel --yes  (or CoS dashboard import)
```

Static site — no build step required.
