# Deploy — GitHub + Vercel

## Live

- **Production:** https://weekofstay-agent-demo.vercel.app
- **GitHub:** https://github.com/drayapaty/weekofstay-agent-demo
- Team: `drayapatys-projects` · Project: `weekofstay-agent-demo`

## Redeploy

```bash
cd kickass-agent-demo
export VERCEL_TOKEN=…   # never commit
vercel --prod --yes --scope drayapatys-projects
```

## Never commit

`.env`, `.env.local`, `box-secrets.json`, API keys, credentialed traces.
