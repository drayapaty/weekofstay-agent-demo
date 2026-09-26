# Environment Setup

## Required Environment Variables

### `LITEAPI_API_KEY`

**Purpose:** LiteAPI key for Feedz hotel search endpoint  
**Format:** String API key  
**Where to get:** LiteAPI partner dashboard

## Setting Environment Variables

### Local Development

Create `.env.local` in project root:

```bash
LITEAPI_API_KEY=your_actual_key_here
```

**Never commit** `.env.local` to git (already in `.gitignore`).

### Vercel Production

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `weekofstay-agent-demo`
3. Settings → Environment Variables
4. Add variable:
   - **Key:** `LITEAPI_API_KEY`
   - **Value:** Your LiteAPI key
   - **Environments:** Production, Preview, Development (check all)
5. Redeploy for changes to take effect

### Vercel CLI

```bash
vercel env add LITEAPI_API_KEY
# Paste your key when prompted
# Select environments: Production, Preview, Development
```

## Security Notes

- **Never log** API keys in console or responses
- **Never commit** keys to git
- **Never expose** keys to client-side code
- Keys are redacted in error responses
- API routes run server-side only (Next.js App Router)

## Verifying Setup

### Local

```bash
npm run dev
# Visit http://localhost:3000
# Try a search — if it returns hotels, env is correct
```

### Production

```bash
curl https://weekofstay-agent-demo.vercel.app/api/health
# Should return: {"ok":true,"service":"weekofstay-sf-poc",...}
```

### Test Search

```bash
curl -X POST https://weekofstay-agent-demo.vercel.app/api/hotels/search \
  -H "Content-Type: application/json" \
  -d '{"query":"Downtown SF, 2 nights"}'
```

If you see `"ok": false` with `"error": "missing_api_key"`, the environment variable is not set correctly.
