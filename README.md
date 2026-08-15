# CosmicTalks

Bilingual (English / Hindi) Vedic astrology website. Intended public origin: [thecosmictalks.com](https://www.thecosmictalks.com) (set `NEXT_PUBLIC_SITE_URL` to the host that actually serves the app until that domain’s DNS is live). Generate a full personalized kundli online, then convert to WhatsApp/call for detailed reading and guidance.

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

- `NEXT_PUBLIC_BRAND_NAME` — brand (default: CosmicTalks). **Production:** set this in the Vercel dashboard; the build-time default is not enough if an old env value is already stored there.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, country code (e.g. `9198XXXXXXXX`)
- `NEXT_PUBLIC_PHONE_NUMBER` — e.g. `+9198XXXXXXXX`
- `NEXT_PUBLIC_SITE_URL` — public origin (`https://www.thecosmictalks.com` once DNS is live). Until then, keep this pointed at the host that currently serves the app so canonical URLs stay correct.
- `NEXT_PUBLIC_CONTACT_EMAIL` — e.g. `hello@thecosmictalks.com`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm start` — start production server
- `npm run test:places` — **required before deploys** that touch places search / DB schema (delhi, bombay, firozbad against Neon). Also runs in CI (`.github/workflows/places-search.yml`) when `DATABASE_URL` is set as a repo secret.
- `npm run test:cross-validate` — Swiss Ephemeris, Jagannatha Hora, DrikPanchang, and **cached** NASA JPL Horizons vs the live `astronomy-engine` chart path. CI sets `HORIZONS_OFFLINE=1` and never calls Horizons. Refresh cadence (do **not** hit the live API on every run) is documented in `scripts/fixtures/cross-validation/README.md`.
- `npm run db:migrate:places` / `npm run db:import:places` — schema + GeoNames reload (see `data/geonames/README.md`)
