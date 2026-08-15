# CosmicTalks follow-ups

## Social festival dates vs Panchang engine — engineering closed 2026-08-14

Hindu tithi greetings now come from `lunarMasaAt` + `hinduFestivalOnDate` (tithi + paksha + Amanta masa named by Purnima nakshatra). Same astronomy-engine + Lahiri stack as `/panchang`. Civil `CIVIL[]` is only Republic Day / Independence Day / Gandhi Jayanti.

Evidence: `npx tsx scripts/festival-panchang-evidence.ts` — Janmashtami 2026 is **2026-09-04** (Krishna Ashtami, Bhadrapada), not civil `08-14`. Diwali 2026 sunrise Delhi is **2026-11-09** Amavasya.

Still blocked for **live Graph posting**: vault `meta_social` is sandbox. Do not paste live Page tokens until a Super Admin explicitly posts. Remaining honesty: Adhika masa is not labelled; festival day uses **sunrise Delhi tithi**, not Nishita/midnight.

## Other parked items

- FAQ accordion / in-content text links on public pages can be &lt; 44px tall.
- `conversation_logs:write` (export/erasure) is P1 — DPDP erasure, not a dump.
- Meta reach/impressions Insights not pulled.
- Social cron `/api/cron/social` requires `CRON_SECRET`.
- Go-live: Auth0 vs OTP decision, live Razorpay, live SMTP/SMS, offline KEK backup, Meta WhatsApp template approval — see `scripts/go-live-audit.ts`.
