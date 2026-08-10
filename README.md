# Astrologics

Bilingual (English / Hindi) Vedic astrology website at [astrologics.co](https://astrologics.co) — generate a full personalized kundli online, then convert to WhatsApp/call for detailed reading and guidance.

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

- `NEXT_PUBLIC_BRAND_NAME` — brand (default: Astrologics)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only, country code (e.g. `9198XXXXXXXX`)
- `NEXT_PUBLIC_PHONE_NUMBER` — e.g. `+9198XXXXXXXX`
- `NEXT_PUBLIC_SITE_URL` — production URL (`https://astrologics.co`)
- `NEXT_PUBLIC_CONTACT_EMAIL` — e.g. `hello@astrologics.co`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm start` — start production server
