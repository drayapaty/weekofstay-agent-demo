# Deploy — GitHub + Vercel

## GitHub (done)

- **Repo:** https://github.com/drayapaty/weekofstay-agent-demo (public)
- **Commit:** `ca14389` — Week Of Stay live agent demo
- Clean static root: `index.html`, `assets/`, `data/run-summary.json`, docs. No `.env` / secrets.

## Vercel (needs CoS / owner)

MCP `create_git_project` / `create_deployment` hit:

- Git link verification 404 / project not listed on team
- Deploy API **403** — “You don't have permission to create a Production Deployment for this project”

**Operator steps (dashboard):**

1. Vercel → Add New Project → Import `drayapaty/weekofstay-agent-demo`
2. Framework: **Other** · Root: `/` · Build: none · Output: `.`
3. Deploy production
4. Optional custom domain under Week Of Stay / myreservations marketing

Or CLI (owner token):

```bash
cd kickass-agent-demo
vercel link --yes
vercel --prod --yes
```

## Never commit

`.env`, `box-secrets.json`, API keys, credentialed traces.
