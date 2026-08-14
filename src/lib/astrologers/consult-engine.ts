import { getSql, hasDatabaseUrl } from "@/lib/db";
import { capturePayment, createCheckout, getBillingSettings } from "@/lib/billing/engine";
import { commissionSplit, rupees } from "@/lib/billing/gst";
import { ensureAiChatSeed, getPersona } from "@/lib/ai/chat-agent-store";
import { DIRECTORY_ASTROLOGERS, type DirectoryAstrologer } from "@/lib/astrologers/directory";

export type AstrologerKind = "REAL_HUMAN" | "AI_PERSONA";

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function ensurePhase5Astrologers() {
  if (!hasDatabaseUrl()) return;
  await ensureAiChatSeed();
  const sql = getSql();
  const guru = await getPersona("ai_guru");
  const vikram = await sql`SELECT id FROM billing_astrologers WHERE phone = ${"9876500101"} LIMIT 1`;
  if (!vikram[0]) {
    await sql`
      INSERT INTO billing_astrologers (
        display_name, phone, kind, commission_bps, payout_upi, active, bio,
        specialties_json, rate_minor, available, slug, persona_id
      )
      VALUES (
        ${"Pandit Vikram Sharma"},
        ${"9876500101"},
        ${"REAL_HUMAN"},
        ${2000},
        ${"vikram@upi"},
        ${true},
        ${"Verified Vedic astrologer. Live human consultations for dasha, marriage and career timing."},
        ${JSON.stringify(["Vedic", "Dasha", "Marriage"])},
        ${2500},
        ${true},
        ${"pandit-vikram-sharma"},
        ${null}
      )
    `;
  }
  const jyoti = await sql`SELECT id FROM billing_astrologers WHERE slug = ${"jyoti-ai-guru"} LIMIT 1`;
  if (!jyoti[0]) {
    await sql`
      INSERT INTO billing_astrologers (
        display_name, phone, kind, commission_bps, payout_upi, active, bio,
        specialties_json, rate_minor, available, slug, persona_id
      )
      VALUES (
        ${"Jyoti — AI Guru"},
        ${null},
        ${"AI_PERSONA"},
        ${1500},
        ${"ai-guru@upi"},
        ${true},
        ${"AI astrologer persona powered by CosmicGyan AI Guru. Chart answers are fact-filtered. Clearly labeled AI — not a human."},
        ${JSON.stringify(["Vedic", "Kundli", "AI Guru"])},
        ${1500},
        ${true},
        ${"jyoti-ai-guru"},
        ${guru?.id || null}
      )
    `;
  } else {
    await sql`
      UPDATE billing_astrologers
      SET kind = ${"AI_PERSONA"}, persona_id = ${guru?.id || null}, active = ${true}
      WHERE slug = ${"jyoti-ai-guru"}
    `;
  }
}

function rowToDirectory(r: Record<string, unknown>): DirectoryAstrologer {
  const kind = String(r.kind || "REAL_HUMAN") as AstrologerKind;
  const specs = parseJson<string[]>(r.specialties_json, ["Vedic"]);
  return {
    id: String(r.slug || r.id),
    billingId: String(r.id),
    name: String(r.display_name),
    gender: kind === "AI_PERSONA" ? "female" : "male",
    image: kind === "AI_PERSONA" ? "/images/astrologers/f00.jpg" : "/images/astrologers/m00.jpg",
    verified: true,
    online: Boolean(r.available),
    badge: kind === "AI_PERSONA" ? "new" : "top-choice",
    skills: specs,
    languages: ["Hindi", "English"],
    experienceYears: kind === "AI_PERSONA" ? 0 : 12,
    rating: 5,
    ordersLabel: kind === "AI_PERSONA" ? "AI" : "Live",
    pricePerMin: Math.round(Number(r.rate_minor || 0) / 100),
    firstChatFree: false,
    categories: ["career", "marriage"],
    featured: true,
    kind,
    bio: String(r.bio || ""),
    personaId: r.persona_id ? String(r.persona_id) : null,
  };
}

export async function listLiveDirectory(): Promise<DirectoryAstrologer[]> {
  await ensurePhase5Astrologers();
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM billing_astrologers
    WHERE active = ${true} AND slug IS NOT NULL
    ORDER BY kind DESC, display_name
  `;
  return rows.map((r) => rowToDirectory(r as Record<string, unknown>));
}

export async function getLiveBySlug(slug: string) {
  if (!slug) return null;
  if (hasDatabaseUrl()) {
    const list = await listLiveDirectory();
    const live = list.find((a) => a.id === slug || a.billingId === slug);
    if (live) return live;
  }
  return DIRECTORY_ASTROLOGERS.find((a) => a.id === slug) || null;
}

export async function clampAstrologerRate(rateMinor: number) {
  const settings = await getBillingSettings();
  const min = Number(settings.consult_rate_min_minor || 500);
  const max = Number(settings.consult_rate_max_minor || 50000);
  return Math.min(max, Math.max(min, Math.round(rateMinor)));
}

export async function upsertDirectoryAstrologer(input: {
  id?: string;
  displayName: string;
  phone?: string | null;
  kind: AstrologerKind;
  bio?: string;
  specialties?: string[];
  rateMinor: number;
  commissionBps?: number | null;
  personaId?: string | null;
  slug?: string;
  available?: boolean;
  active?: boolean;
  payoutUpi?: string | null;
}) {
  const sql = getSql();
  const kind: AstrologerKind = input.kind === "AI_PERSONA" ? "AI_PERSONA" : "REAL_HUMAN";
  const rate = await clampAstrologerRate(input.rateMinor);
  const phone = input.phone ? String(input.phone).replace(/\D/g, "") : null;
  const slug = input.slug || slugify(input.displayName);
  const specs = JSON.stringify(input.specialties || ["Vedic"]);
  let resolvedPersona: string | null = kind === "AI_PERSONA" ? input.personaId || null : null;
  if (kind === "AI_PERSONA" && !resolvedPersona) {
    const guru = await getPersona("ai_guru");
    resolvedPersona = guru?.id || null;
    if (!resolvedPersona) throw new Error("AI_PERSONA needs a Phase 4 persona (seed ai_guru first)");
  }

  if (input.id) {
    await sql`
      UPDATE billing_astrologers SET
        display_name = ${input.displayName},
        phone = ${phone},
        kind = ${kind},
        bio = ${input.bio || ""},
        specialties_json = ${specs},
        rate_minor = ${rate},
        commission_bps = ${input.commissionBps ?? null},
        persona_id = ${resolvedPersona},
        slug = ${slug},
        available = ${input.available ?? true},
        active = ${input.active ?? true},
        payout_upi = ${input.payoutUpi || null}
      WHERE id = ${input.id}
    `;
    return { id: input.id, slug, rateMinor: rate, kind };
  }

  const inserted = await sql`
    INSERT INTO billing_astrologers (
      display_name, phone, kind, commission_bps, payout_upi, active, bio,
      specialties_json, rate_minor, available, slug, persona_id
    )
    VALUES (
      ${input.displayName},
      ${phone},
      ${kind},
      ${input.commissionBps ?? null},
      ${input.payoutUpi || null},
      ${input.active ?? true},
      ${input.bio || ""},
      ${specs},
      ${rate},
      ${input.available ?? true},
      ${slug},
      ${resolvedPersona}
    )
    RETURNING id
  `;
  return { id: String(inserted[0]?.id), slug, rateMinor: rate, kind };
}

export async function completeMockConsult(input: {
  astrologerSlug: string;
  customerName: string;
  minutes?: number;
}) {
  await ensurePhase5Astrologers();
  const sql = getSql();
  const astro = await sql`
    SELECT * FROM billing_astrologers
    WHERE slug = ${input.astrologerSlug} OR id::text = ${input.astrologerSlug}
    LIMIT 1
  `;
  if (!astro[0]) throw new Error("Astrologer not found");
  const kind = String(astro[0].kind || "REAL_HUMAN");
  const minutes = Math.max(1, input.minutes || 5);
  const rate = await clampAstrologerRate(Number(astro[0].rate_minor || 2000));
  const amountMinor = rate * minutes;
  const checkout = await createCheckout({
    purpose: "consultation",
    amountMinor,
    customer: {
      displayName: input.customerName,
      email: `phase5.${input.astrologerSlug.replace(/[^a-z0-9]/g, "")}@example.invalid`,
      phone: kind === "REAL_HUMAN" ? "9876500199" : "9876500198",
      stateCode: "MH",
    },
    astrologerId: String(astro[0].id),
    description: `${minutes} min ${kind} consult with ${astro[0].display_name}`,
  });
  const captured = await capturePayment(checkout.paymentId, `pay_phase5_${Date.now()}`);
  const payRow = await sql`SELECT customer_id FROM payments WHERE id = ${checkout.paymentId} LIMIT 1`;
  const customerId = String(payRow[0]?.customer_id || "");
  const settings = await getBillingSettings();
  const bps =
    astro[0].commission_bps != null
      ? Number(astro[0].commission_bps)
      : settings.global_commission_bps;
  const split = commissionSplit(
    Number(checkout.gst?.taxableMinor || captured.commission?.taxableMinor || 0) ||
      Math.round((amountMinor * 10000) / 11800),
    0,
    bps
  );
  const session = await sql`
    INSERT INTO consult_sessions (
      astrologer_id, customer_id, payment_id, kind, status, minutes, transcript_json
    )
    VALUES (
      ${String(astro[0].id)},
      ${customerId || null},
      ${checkout.paymentId},
      ${kind},
      ${"completed"},
      ${minutes},
      ${JSON.stringify([
        { role: "user", content: `Hello, this is a ${minutes}-minute mock session.` },
        {
          role: "assistant",
          content:
            kind === "AI_PERSONA"
              ? "I am Jyoti, an AI astrologer — not a human. I can explain your calculated chart."
              : "Namaste — this is a live human consultation mock.",
        },
      ])}
    )
    RETURNING id
  `;
  const sessionId = String(session[0]?.id);
  const prior = await sql`
    SELECT count(*)::int AS n FROM astrologer_client_notes
    WHERE astrologer_id = ${String(astro[0].id)} AND customer_id = ${customerId}
  `;
  await sql`
    INSERT INTO astrologer_client_notes (astrologer_id, customer_id, note, repeat_client)
    VALUES (
      ${String(astro[0].id)},
      ${customerId},
      ${"Consultation history only — no platform-wide account dump."},
      ${Number(prior[0]?.n || 0) > 0}
    )
  `;
  await sql`
    INSERT INTO consult_ratings (
      session_id, astrologer_id, customer_display_name, stars, comment
    )
    VALUES (
      ${sessionId},
      ${String(astro[0].id)},
      ${input.customerName},
      ${5},
      ${"Clear session. Waiting on astrologer reply in partner inbox."}
    )
  `;
  return {
    sessionId,
    kind,
    labeledAi: kind === "AI_PERSONA",
    paymentId: checkout.paymentId,
    captured,
    commission: captured.commission || split,
    math: {
      minutes,
      rateMinor: rate,
      amountMinor,
      commissionBps: bps,
      platform: rupees((captured.commission || split).platformMinor),
      astrologer: rupees((captured.commission || split).astrologerMinor),
      formula: `taxable × ${bps / 100}% platform, remainder to astrologer`,
    },
  };
}

export async function listAstrologerClients(astrologerId: string) {
  const sql = getSql();
  return sql`
    SELECT n.id, n.note, n.repeat_client, n.created_at,
           c.display_name, c.id AS customer_id
    FROM astrologer_client_notes n
    JOIN billing_customers c ON c.id = n.customer_id
    WHERE n.astrologer_id = ${astrologerId}
    ORDER BY n.created_at DESC
    LIMIT 40
  `;
}

export async function getPartnerPanel(phone: string) {
  await ensurePhase5Astrologers();
  const sql = getSql();
  const digits = phone.replace(/\D/g, "");
  const astro = await sql`SELECT * FROM billing_astrologers WHERE phone = ${digits} LIMIT 1`;
  if (!astro[0]) return null;
  const id = String(astro[0].id);
  const settings = await getBillingSettings();
  const clients = await listAstrologerClients(id);
  const inbox = await sql`
    SELECT s.id, s.status, s.minutes, s.kind, s.created_at, c.display_name
    FROM consult_sessions s
    LEFT JOIN billing_customers c ON c.id = s.customer_id
    WHERE s.astrologer_id = ${id}
    ORDER BY s.created_at DESC
    LIMIT 30
  `;
  const ratings = await sql`
    SELECT id, stars, comment, reply, customer_display_name, created_at
    FROM consult_ratings
    WHERE astrologer_id = ${id}
    ORDER BY created_at DESC
    LIMIT 20
  `;
  return {
    astrologer: {
      id,
      displayName: String(astro[0].display_name),
      kind: String(astro[0].kind),
      bio: String(astro[0].bio || ""),
      available: Boolean(astro[0].available),
      rateMinor: Number(astro[0].rate_minor || 0),
      commissionBps:
        astro[0].commission_bps != null
          ? Number(astro[0].commission_bps)
          : settings.global_commission_bps,
      slug: String(astro[0].slug || ""),
      verificationDocs: parseJson<unknown[]>(astro[0].verification_docs_json, []),
    },
    rateBounds: {
      minMinor: settings.consult_rate_min_minor,
      maxMinor: settings.consult_rate_max_minor,
    },
    inbox: inbox.map((s) => ({
      id: String(s.id),
      status: String(s.status),
      minutes: Number(s.minutes),
      kind: String(s.kind),
      createdAt: String(s.created_at),
      clientName: String(s.display_name || "Client"),
    })),
    calendar: inbox.map((s) => ({
      id: String(s.id),
      when: String(s.created_at),
      title: `${s.minutes} min with ${s.display_name || "Client"}`,
    })),
    clients: clients.map((c) => ({
      id: String(c.id),
      displayName: String(c.display_name),
      note: String(c.note),
      repeatClient: Boolean(c.repeat_client),
      createdAt: String(c.created_at),
      customerId: String(c.customer_id),
    })),
    ratings: ratings.map((r) => ({
      id: String(r.id),
      stars: Number(r.stars),
      comment: String(r.comment || ""),
      reply: String(r.reply || ""),
      clientName: String(r.customer_display_name),
      createdAt: String(r.created_at),
    })),
  };
}

export async function updatePartnerPanel(
  phone: string,
  action:
    | { type: "availability"; available: boolean }
    | { type: "rate"; rateMinor: number }
    | { type: "note"; customerId: string; note: string }
    | { type: "rating-reply"; ratingId: string; reply: string }
    | { type: "verification"; filename: string }
) {
  const panel = await getPartnerPanel(phone);
  if (!panel) throw new Error("No billing profile for this phone");
  if (String(panel.astrologer.kind) === "AI_PERSONA") {
    throw new Error("AI personas are managed from Super Admin, not the human partner panel");
  }
  const sql = getSql();
  const id = panel.astrologer.id;
  if (action.type === "availability") {
    await sql`UPDATE billing_astrologers SET available = ${action.available} WHERE id = ${id}`;
  } else if (action.type === "rate") {
    const rate = await clampAstrologerRate(action.rateMinor);
    await sql`UPDATE billing_astrologers SET rate_minor = ${rate} WHERE id = ${id}`;
  } else if (action.type === "note") {
    await sql`
      INSERT INTO astrologer_client_notes (astrologer_id, customer_id, note, repeat_client)
      VALUES (${id}, ${action.customerId}, ${action.note.slice(0, 2000)}, ${true})
    `;
  } else if (action.type === "rating-reply") {
    await sql`
      UPDATE consult_ratings SET reply = ${action.reply.slice(0, 2000)}
      WHERE id = ${action.ratingId} AND astrologer_id = ${id}
    `;
  } else if (action.type === "verification") {
    const docs = [
      ...panel.astrologer.verificationDocs,
      { filename: action.filename.slice(0, 120), uploadedAt: new Date().toISOString() },
    ];
    await sql`
      UPDATE billing_astrologers
      SET verification_docs_json = ${JSON.stringify(docs)}
      WHERE id = ${id}
    `;
  }
  return getPartnerPanel(phone);
}
