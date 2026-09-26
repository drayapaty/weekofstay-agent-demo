# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Git repository connected to Vercel
- `LITEAPI_API_KEY` environment variable set in Vercel

## Vercel Deployment (Recommended)

### Option 1: Git Push (Automatic)

1. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: SF PoC with live hotel search"
   git push origin main
   ```

2. Vercel automatically deploys on push (if Git integration is enabled)

3. Check deployment status at https://vercel.com/drayapatys-projects/weekofstay-agent-demo

### Option 2: Vercel CLI (Manual)

1. Install Vercel CLI (if not already):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

4. Follow prompts or use:
   ```bash
   vercel --prod --yes --scope drayapatys-projects
   ```

## Environment Variables Setup

Before deploying, ensure `LITEAPI_API_KEY` is set in Vercel:

```bash
vercel env add LITEAPI_API_KEY production
# Paste your key when prompted
```

Or via Vercel Dashboard:
- Project Settings → Environment Variables
- Add `LITEAPI_API_KEY`
- Select all environments (Production, Preview, Development)

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

## Build Configuration

Vercel auto-detects Next.js. Configuration in:
- `next.config.js` — Next.js settings
- `vercel.json` — Vercel platform config
- `package.json` — Build scripts

### Build Command
```bash
npm run build
```

### Output Directory
`.next/`

## Post-Deployment Verification

### 1. Health Check
```bash
curl https://weekofstay-agent-demo.vercel.app/api/health
```

Expected response:
```json
{
  "ok": true,
  "service": "weekofstay-sf-poc",
  "feedz": true,
  "timestamp": "2026-09-26T..."
}
```

### 2. Search API Test
```bash
curl -X POST https://weekofstay-agent-demo.vercel.app/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{"query":"Downtown SF, Thanksgiving weekend, 2 nights"}'
```

Expected: `"ok": true` with hotel results

### 3. UI Test
Visit https://weekofstay-agent-demo.vercel.app and try:
- "Thanksgiving weekend, 2 nights"
- "Downtown SF, November 23-27"
- "Union Square area, 3 nights"

## Rollback

If deployment has issues:

```bash
vercel rollback
```

Or in Vercel Dashboard:
- Deployments → Select previous working deployment
- Promote to Production

## Custom Domain (Optional)

To add weekofstay.com:

1. Vercel Dashboard → Domains → Add Domain
2. Enter `weekofstay.com` or subdomain
3. Configure DNS records as shown
4. Wait for verification

## Monitoring

- **Deployment logs:** Vercel Dashboard → Deployments → View Function Logs
- **Analytics:** Vercel Analytics (if enabled)
- **Errors:** Runtime logs in deployment detail view

## Common Issues

### Build fails

Check:
- Node version compatibility (18+)
- All dependencies in `package.json`
- TypeScript errors: `npm run build` locally

### API returns 502

Check:
- `LITEAPI_API_KEY` is set in Vercel env
- Feedz API is accessible from Vercel edge
- No CORS issues (same-origin API)

### Missing environment variable

Error: `"error": "missing_api_key"`

Fix:
```bash
vercel env add LITEAPI_API_KEY production
vercel --prod  # redeploy
```

## Production URL

**Live site:** https://weekofstay-agent-demo.vercel.app

## Team & Project

- **Vercel Team:** drayapatys-projects
- **Project:** weekofstay-agent-demo
- **GitHub:** https://github.com/drayapaty/weekofstay-agent-demo
