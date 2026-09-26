# Week Of Stay · San Francisco PoC

**Production-quality** San Francisco stay planning proof-of-concept. Intent-driven hotel search with live pricing.

## 🎯 What's Built

✅ **Polished UI/UX** — Modern Next.js + Tailwind, magazine-quality decision briefs  
✅ **Live hotel search** — Same-origin `/api/hotels/search` powered by Feedz partner API  
✅ **SF-only city lock** — Soft-refuses other cities; keeps session on San Francisco  
✅ **Vercel-native** — Serverless API routes (no tunnel/box dependency)  
✅ **Real pricing** — Live availability, cancellation truth, nightly rates  

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Deploy to Vercel

```bash
vercel --prod
```

Or push to `main` branch for automatic deployment via Vercel Git integration.

## 🏗️ Architecture

```
/app
  /api
    /hotels/search   → POST/GET hotel search (Feedz partner API)
    /health          → Health check endpoint
  page.tsx           → Main SF session UI
  layout.tsx         → App shell + fonts
  globals.css        → Tailwind + design system

/components          → Reusable UI components (future)
/lib
  utils.ts           → cn() utility for Tailwind merging
```

## 🎨 Product Constraints

- **One city per session:** San Francisco only
- **Intent in → decision out:** Natural language query → curated results
- **Live price/availability:** No cache delay
- **v1 Book CTA:** Per-product deep link to myreservations.com (no combo checkout)
- **Stay-first PoC:** Dining/events/alerts UI copy as "coming soon" stubs

## 🔗 API Endpoints

### `POST /api/hotels/search`

**Request:**
```json
{
  "query": "Downtown SF, Thanksgiving weekend, 2 nights",
  "check_in": "2026-11-26",
  "check_out": "2026-11-28",
  "adults": 2,
  "rooms": 1
}
```

**Response:**
```json
{
  "ok": true,
  "place_label": "Downtown SF / Union Square",
  "dates": { "check_in": "2026-11-26", "check_out": "2026-11-28" },
  "nights": 2,
  "hotel_count": 12,
  "hotels": [...],
  "recommendation": {
    "hotel_id": "...",
    "name": "...",
    "nightly": 189.00,
    "stay_total": 378.00,
    "cancel_tag": "RFN",
    "why": "Highest guest rating (9.2) · 0.8 mi to Union Square · $189/night · Refundable"
  }
}
```

### `GET /api/health`

Health check — returns `{ ok: true, service: "weekofstay-sf-poc" }`

## 🧪 Testing

Try these queries:

- `Thanksgiving weekend, 2 nights`
- `Downtown SF, November 23-27`
- `Union Square area, 3 nights mid-November`

City warnings trigger for non-SF cities (NYC, LA, etc.) — product constraint demo.

## 📦 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v3 + custom design system
- **UI:** Lucide React icons, custom components
- **Fonts:** Inter (sans), Instrument Serif (headings), JetBrains Mono (code)
- **API:** Feedz partner API (myreservations.com integration)
- **Deploy:** Vercel serverless

## 🎯 What's Next (Not in v1)

- Multi-city support
- Voice input integration
- Save/share sessions
- Transport/dining/events spine
- User authentication

## 📄 License

Private project — not for public distribution.

## 🔗 Links

- **Production:** https://weekofstay-agent-demo.vercel.app
- **GitHub:** https://github.com/drayapaty/weekofstay-agent-demo
- **Vercel Team:** drayapatys-projects
