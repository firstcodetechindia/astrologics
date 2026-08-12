# CosmicGPT

Bilingual (English / Hindi) Vedic astrology website at [cosmicgpt.in](https://cosmicgpt.in) — generate a full personalized kundli online, then convert to WhatsApp/call for detailed reading and guidance.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Framer Motion
- next-intl
- astronomy-engine (self-calc sidereal chart, Lahiri ayanamsa)

## Setup

```bash
cd "/Volumes/My Work/Development/vedic"
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configure

Edit `.env.local`:

- `NEXT_PUBLIC_BRAND_NAME` — brand (default: CosmicGPT)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, country code (e.g. `9198XXXXXXXX`)
- `NEXT_PUBLIC_PHONE_NUMBER` — e.g. `+9198XXXXXXXX`
- `NEXT_PUBLIC_SITE_URL` — production URL (`https://cosmicgpt.in`)
- `NEXT_PUBLIC_CONTACT_EMAIL` — e.g. `hello@cosmicgpt.in`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm start` — start production server
- `npm run test:places` — **required before deploys** that touch places search / DB schema (delhi, bombay, firozbad against Neon). Also runs in CI (`.github/workflows/places-search.yml`) when `DATABASE_URL` is set as a repo secret.
- `npm run db:migrate:places` / `npm run db:import:places` — schema + GeoNames reload (see `data/geonames/README.md`)
