"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { RotateCcw, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHero } from "@/components/ui/PageHero";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { ContactCTA } from "@/components/kundli/ContactCTA";
import { KundliChart } from "@/components/kundli/KundliChart";
import { Link } from "@/i18n/navigation";
import { AiAstrologerLabel } from "@/components/talk/AiAstrologerLabel";
import { GuruReveal, type GuruClosingFilter } from "@/components/chat/GuruReveal";
import type { City } from "@/lib/astrology/cities";
import { formatPlaceLabel } from "@/lib/astrology/cities";
import { timeZoneForPlace } from "@/lib/astrology/timezone";
import type { KundliResult } from "@/lib/astrology/types";
import {
  FREE_CHAT_LIMIT,
  followUpQuestions,
} from "@/lib/ai/chat-limits";
import { cn } from "@/lib/utils";

const FREE_USAGE_KEY = "cosmicgpt_free_chats_used";

type Msg = {
  role: "user" | "assistant";
  content: string;
  /** Shown in-chat after free limit when user asks another question */
  kind?: "gate";
};
type ChartCard = {
  name: string;
  place: string;
  lagna: string;
  moon: string;
  sun: string;
  nakshatra: string;
  dasha: string;
};

type BirthPayload = {
  name: string;
  date: string;
  time: string;
  place: string;
  lat?: number;
  lon?: number;
  timezoneOffsetMinutes?: number;
  timeZone?: string;
};

function readFreeUsed(): number {
  if (typeof window === "undefined") return 0;
  const n = Number(localStorage.getItem(FREE_USAGE_KEY) || "0");
  return Number.isFinite(n) ? Math.min(Math.max(0, Math.floor(n)), FREE_CHAT_LIMIT) : 0;
}

function writeFreeUsed(n: number) {
  localStorage.setItem(FREE_USAGE_KEY, String(Math.min(n, FREE_CHAT_LIMIT)));
}

function GuruAvatar({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const label = hi ? "एआई गुरु" : "AI Guru";
  return (
    <div
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f4a261] shadow-sm ring-2 ring-white"
      title={label}
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/ai-guru-avatar.png"
        alt=""
        width={40}
        height={40}
        className="h-full w-full object-cover"
        decoding="async"
      />
    </div>
  );
}

function UserAvatar({ hi }: { hi: boolean }) {
  const label = hi ? "आप" : "You";
  return (
    <div
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#5b9bd5] shadow-sm ring-2 ring-white"
      title={label}
      aria-label={label}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/user-avatar.png"
        alt=""
        width={40}
        height={40}
        className="h-full w-full object-cover"
        decoding="async"
      />
    </div>
  );
}

export function ChatClient() {
  const locale = useLocale();
  const hi = locale === "hi";
  const listRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"kundli" | "chat">("kundli");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [birth, setBirth] = useState<BirthPayload | null>(null);
  const [card, setCard] = useState<ChartCard | null>(null);
  const [kundli, setKundli] = useState<KundliResult | null>(null);
  const [chartKey, setChartKey] = useState<string | null>(null);
  const [starterSuggestions, setStarterSuggestions] = useState<string[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [freeUsed, setFreeUsed] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [triedBirth, setTriedBirth] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealSentences, setRevealSentences] = useState<string[]>([]);
  const [revealCueMs, setRevealCueMs] = useState<number[]>([]);
  const [revealFilter, setRevealFilter] = useState<GuruClosingFilter | null>(
    null
  );
  const closingCache = useRef<{
    sentences: string[];
    cueMs: number[];
    filter: GuruClosingFilter;
  } | null>(null);

  const freeExhausted = freeUsed >= FREE_CHAT_LIMIT;
  const userQuestionCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages]
  );

  useEffect(() => {
    setFreeUsed(readFreeUsed());
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, followUps, freeUsed]);

  function birthPayload(): BirthPayload | null {
    if (
      name.trim().length < 2 ||
      !date ||
      !time ||
      place.trim().length < 2
    ) {
      return null;
    }
    return {
      name: name.trim(),
      date,
      time,
      place: city ? formatPlaceLabel(city) : place.trim(),
      lat: city?.lat,
      lon: city?.lon,
      timezoneOffsetMinutes: city?.timezoneOffsetMinutes,
      timeZone: timeZoneForPlace({
        lat: city?.lat,
        lon: city?.lon,
        offsetMinutes: city?.timezoneOffsetMinutes ?? 330,
      }),
    };
  }

  async function fetchClosing(question: string) {
    if (!birth) return null;
    if (closingCache.current) return closingCache.current;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "closing",
        message: question,
        locale,
        history: messages,
        birth,
        chartKey,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) return null;
    const sentences = Array.isArray(data.sentences)
      ? data.sentences.map((s: unknown) => String(s)).filter(Boolean)
      : String(data.text || "")
          .split(/(?<=[.!?।])\s+/)
          .map((s: string) => s.trim())
          .filter(Boolean);
    const cueMs = Array.isArray(data.cueMs)
      ? data.cueMs.map((n: unknown) => Number(n) || 0)
      : sentences.map((_: string, i: number) => 700 + i * 2200);
    const filter: GuruClosingFilter = {
      factFilterRan: true,
      scopeFlagged: Boolean(data.filter?.scopeFlagged),
      flagged: Boolean(data.filter?.flagged),
    };
    if (data.filter?.factFilterRan !== true) return null;
    const packed = { sentences, cueMs, filter };
    closingCache.current = packed;
    return packed;
  }

  async function openGuruReveal(question: string) {
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setFollowUps([]);
    setStarterSuggestions([]);
    setRevealOpen(true);
    setRevealLoading(true);
    try {
      const packed = await fetchClosing(question);
      if (packed) {
        setRevealSentences(packed.sentences);
        setRevealCueMs(packed.cueMs);
        setRevealFilter(packed.filter);
      } else {
        setRevealSentences([]);
        setRevealCueMs([]);
        setRevealFilter(null);
      }
    } catch {
      setRevealSentences([]);
      setRevealFilter(null);
    } finally {
      setRevealLoading(false);
    }
  }

  async function startChat() {
    const payload = birthPayload();
    if (!payload) {
      setTriedBirth(true);
      setShakeKey((k) => k + 1);
      setError(
        hi
          ? "जन्म तिथि, समय और स्थान आवश्यक हैं।"
          : "Date, time and place of birth are required."
      );
      return;
    }
    setTriedBirth(false);
    setError(null);
    setPreparing(true);
    try {
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birth: payload, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (hi ? "कुंडली नहीं बनी।" : "Could not build kundli."));
        return;
      }
      setBirth(payload);
      setCard(data.card);
      setKundli(data.kundli ?? null);
      setChartKey(typeof data.chartKey === "string" ? data.chartKey : null);
      setStarterSuggestions(data.suggestions || []);
      setFollowUps([]);

      const serverUsed =
        typeof data.freeUsed === "number" ? data.freeUsed : readFreeUsed();
      const used = Math.max(serverUsed, readFreeUsed());
      setFreeUsed(used);
      writeFreeUsed(used);

      // If free quota already used, still show suggestions — taps open signup gate
      if (used >= FREE_CHAT_LIMIT) {
        setFollowUps(followUpQuestions(hi ? "hi" : "en", FREE_CHAT_LIMIT));
        setStarterSuggestions([]);
      }

      setMessages([
        {
          role: "assistant",
          content:
            used >= FREE_CHAT_LIMIT
              ? hi
                ? `नमस्ते${payload.name ? ` ${payload.name}` : ""}। आपकी कुंडली तैयार है। मुफ़्त प्रश्न पूरे हो चुके हैं — नीचे एक प्रश्न चुनें, फिर साइन अप करके बात जारी रखें।`
                : `Namaste${payload.name ? ` ${payload.name}` : ""}. Your kundli is ready. Free questions are used up — pick a question below, then sign up to continue.`
              : hi
                ? `नमस्ते${payload.name ? ` ${payload.name}` : ""}। आपकी कुंडली तैयार है — बाईं ओर चार्ट देखें। ${FREE_CHAT_LIMIT} मुफ़्त प्रश्न उपलब्ध हैं। पूछें या सुझाए गए प्रश्नों में से चुनें।`
                : `Namaste${payload.name ? ` ${payload.name}` : ""}. Your kundli is ready — see the chart on the left. You have ${FREE_CHAT_LIMIT} free questions. Ask anything, or tap a suggestion.`,
        },
      ]);
      setStep("chat");
    } catch {
      setError(hi ? "नेटवर्क त्रुटि।" : "Network error.");
    } finally {
      setPreparing(false);
    }
  }

  function showSignupGate(question: string) {
    void openGuruReveal(question);
  }

  async function send(textRaw?: string) {
    const text = (textRaw ?? input).trim();
    if (!text || loading || !birth) return;

    // After free limit: show in-chat signup card, then login/signup via CTA
    if (freeUsed >= FREE_CHAT_LIMIT) {
      showSignupGate(text);
      return;
    }

    const history = messages;
    const nextUser: Msg = { role: "user", content: text };
    setMessages([...history, nextUser, { role: "assistant", content: "" }]);
    setInput("");
    setStarterSuggestions([]);
    setFollowUps([]);
    setLoading(true);
    setError(null);
    let nextUsed = freeUsed;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          locale,
          history,
          birth,
          chartKey,
        }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const used =
          typeof data.freeUsed === "number" ? data.freeUsed : FREE_CHAT_LIMIT;
        setFreeUsed(used);
        writeFreeUsed(used);
        setMessages((m) => m.slice(0, -2));
        showSignupGate(text);
        setLoading(false);
        return;
      }

      if (!res.ok || !res.body) {
        throw new Error("Chat failed");
      }

      nextUsed = freeUsed + 1;
      setFreeUsed(nextUsed);
      writeFreeUsed(nextUsed);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const line = part
            .split("\n")
            .find((l) => l.startsWith("data:"));
          if (!line) continue;
          const raw = line.slice(5).trim();
          try {
            const json = JSON.parse(raw) as {
              delta?: string;
              error?: string;
              done?: boolean;
            };
            if (json.error) {
              reply = json.error;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: reply };
                return copy;
              });
            }
            if (json.delta) {
              reply += json.delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: reply };
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }

      if (!reply) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: hi ? "उत्तर नहीं मिल सका।" : "No reply generated.",
          };
          return copy;
        });
      }

      // Always offer next suggestions — after 3 free, taps open the Guru reveal
      setFollowUps(followUpQuestions(hi ? "hi" : "en", nextUsed));
      if (nextUsed >= FREE_CHAT_LIMIT) {
        void fetchClosing("").catch(() => null);
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            e instanceof Error
              ? e.message
              : hi
                ? "नेटवर्क त्रुटि।"
                : "Network error.",
        };
        return copy;
      });
      setFollowUps(followUpQuestions(hi ? "hi" : "en", nextUsed));
    } finally {
      setLoading(false);
    }
  }

  function resetKundli() {
    setStep("kundli");
    setMessages([]);
    setBirth(null);
    setKundli(null);
    setChartKey(null);
    setCard(null);
    setFollowUps([]);
    setStarterSuggestions([]);
    setRevealOpen(false);
    setRevealSentences([]);
    setRevealFilter(null);
    closingCache.current = null;
  }

  const hasGate = revealOpen;
  const showStarter =
    !loading &&
    userQuestionCount === 0 &&
    starterSuggestions.length > 0 &&
    !hasGate &&
    !freeExhausted;
  const showFollowUps =
    !loading && followUps.length > 0 && !hasGate;

  return (
    <div className="bg-cosmic-navy">
      <PageHero
        title={hi ? "एआई एस्ट्रो चैट" : "AI Astro Chat"}
        description={
          hi
            ? "एआई गुरु से अपनी लाहिरी जन्म कुंडली पर तीन मुफ्त प्रश्न पूछें — एआई ज्योतिषी, मानव नहीं।"
            : "Ask AI Guru about your Lahiri janam kundli — three free questions. AI astrologer, not a human."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "एआई चैट" : "AI Chat" },
        ]}
        actions={
          <Link
            href="/kundli"
            className="inline-flex items-center justify-center rounded-lg border border-saffron/30 bg-surface/85 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
          >
            {hi ? "पूर्ण कुंडली →" : "Full kundli →"}
          </Link>
        }
      />

      <div className="container-page py-6 sm:py-8">
        {step === "kundli" ? (
          <GlassCard strong className="space-y-5">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                <Sparkles className="h-3.5 w-3.5" />
                {hi ? "चरण 1 · कुंडली" : "Step 1 · Kundli"}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-ink">
                {hi ? "अपनी जन्म कुंडली बनाएँ" : "Create your birth chart"}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                {hi
                  ? `हमारा एआई आपकी कुंडली पर आधारित है — ${FREE_CHAT_LIMIT} मुफ़्त प्रश्न, फिर लॉगिन / साइन अप।`
                  : `Our AI is grounded in your kundli — ${FREE_CHAT_LIMIT} free questions, then login / signup.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label={hi ? "नाम" : "Name"}
                required
                error={
                  triedBirth && name.trim().length < 2
                    ? hi
                      ? "आवश्यक"
                      : "Required"
                    : false
                }
                shakeKey={shakeKey}
              >
                <input
                  className="field"
                  placeholder={hi ? "आपका नाम" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormField>
              <FormField
                label={hi ? "जन्म तिथि" : "Date of birth"}
                required
                error={
                  triedBirth && !date
                    ? hi
                      ? "आवश्यक"
                      : "Required"
                    : false
                }
                shakeKey={shakeKey}
              >
                <input
                  type="date"
                  className="field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormField>
              <FormField
                label={hi ? "जन्म समय" : "Time of birth"}
                required
                error={
                  triedBirth && !time
                    ? hi
                      ? "आवश्यक"
                      : "Required"
                    : false
                }
                shakeKey={shakeKey}
              >
                <input
                  type="time"
                  className="field"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FormField>
              <PlaceAutocomplete
                label={hi ? "जन्म स्थान" : "Place of birth"}
                required
                value={place}
                onChange={setPlace}
                onCity={setCity}
                placeholder={hi ? "जन्म स्थान" : "Place of birth"}
                error={
                  triedBirth && place.trim().length < 2
                    ? hi
                      ? "आवश्यक"
                      : "Required"
                    : false
                }
                shakeKey={shakeKey}
                inputClassName="!py-2.5"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-saffron/20 bg-sand/50 px-3 py-2 text-sm text-saffron-deep">
                {error}
              </p>
            ) : null}

            <Button
              type="button"
              className="w-full !py-3.5"
              disabled={preparing}
              onClick={() => void startChat()}
            >
              {preparing
                ? hi
                  ? "कुंडली बन रही है…"
                  : "Building kundli…"
                : hi
                  ? "कुंडली बनाएँ व चैट शुरू करें"
                  : "Build kundli & start chat"}
            </Button>
          </GlassCard>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] lg:items-start">
            <aside className="space-y-4 lg:sticky lg:top-24">
              <GlassCard className="!p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                      {hi ? "आपकी कुंडली" : "Your kundli"}
                    </p>
                    {card ? (
                      <>
                        <p className="mt-0.5 font-display text-[15px] font-bold text-ink">
                          {card.name}
                        </p>
                        <p className="text-[11px] text-ink-muted">{card.place}</p>
                      </>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={resetKundli}
                    className="inline-flex items-center gap-1 rounded-lg border border-saffron/25 px-2 py-1 text-[11px] font-semibold text-saffron-deep hover:bg-cosmic-purple/15"
                  >
                    <RotateCcw className="h-3 w-3" />
                    {hi ? "कुंडली बदलें" : "Change kundli"}
                  </button>
                </div>

                {kundli ? (
                  <div className="mt-2">
                    <KundliChart
                      kundli={kundli}
                      compact
                      className="!border-0 !bg-transparent !p-0 !shadow-none"
                    />
                  </div>
                ) : null}

                {card ? (
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {[
                      [hi ? "लग्न" : "Lagna", card.lagna],
                      [hi ? "चंद्र" : "Moon", card.moon],
                      [hi ? "सूर्य" : "Sun", card.sun],
                      [hi ? "नक्षत्र" : "Nakshatra", card.nakshatra],
                      [hi ? "दशा" : "Dasha", card.dasha],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/10 bg-cosmic-navy px-2.5 py-1.5"
                      >
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-ink-muted">
                          {label}
                        </p>
                        <p className="mt-0.5 text-[12px] font-semibold leading-snug text-ink">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </GlassCard>
            </aside>

            <section className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron/25 bg-surface px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                    <Sparkles className="h-3 w-3" />
                    {hi ? "एआई गुरु" : "AI Guru"}
                  </span>
                  <AiAstrologerLabel locale={locale} size="sm" />
                  <p className="min-w-0 text-[11px] text-ink-muted">
                    {hi
                      ? "आपकी कुंडली पर आधारित मार्गदर्शन"
                      : "Guidance grounded in your kundli"}
                  </p>
                </div>
                <p
                  className={cn(
                    "text-[11px] font-semibold",
                    freeExhausted ? "text-maroon" : "text-ink-muted"
                  )}
                >
                  {hi
                    ? `${freeUsed}/${FREE_CHAT_LIMIT} मुफ़्त प्रश्न उपयोग`
                    : `${freeUsed}/${FREE_CHAT_LIMIT} free questions used`}
                </p>
              </div>

              {showStarter ? (
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {starterSuggestions.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={loading}
                      onClick={() => void send(q)}
                      className="rounded-lg border border-saffron/25 bg-surface px-2.5 py-2 text-left text-[11px] font-medium leading-snug text-ink transition hover:border-saffron/50 hover:bg-cosmic-purple/15 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}

              <GlassCard strong className="!overflow-hidden !p-0">
                <div
                  ref={listRef}
                  className="max-h-[min(62vh,560px)] min-h-[280px] space-y-2.5 overflow-y-auto p-3"
                >
                  {messages.map((m, i) => {
                    const isUser = m.role === "user";
                    const isLastAssistant =
                      !isUser &&
                      i === messages.length - 1 &&
                      Boolean(m.content) &&
                      !loading &&
                      userQuestionCount > 0 &&
                      !hasGate;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-end gap-2",
                          isUser ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {isUser ? (
                          <UserAvatar hi={hi} />
                        ) : (
                          <GuruAvatar locale={locale} />
                        )}

                        <div
                          className={cn(
                            "max-w-[min(100%,26rem)] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed whitespace-pre-wrap shadow-sm",
                            isUser
                              ? "rounded-br-md bg-saffron text-white"
                              : "rounded-bl-md bg-surface text-ink ring-1 ring-black/[0.06]"
                          )}
                        >
                          {!isUser ? (
                            <div className="mb-1">
                              <AiAstrologerLabel locale={locale} size="sm" />
                            </div>
                          ) : (
                            <p className="mb-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/80">
                              {hi ? "आप" : "You"}
                            </p>
                          )}

                          {!isUser && !m.content && loading ? (
                            <span className="inline-flex items-center gap-1.5 text-ink-muted">
                              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                              {hi ? "सोच रहा है…" : "Thinking…"}
                            </span>
                          ) : (
                            m.content
                          )}

                          {isLastAssistant ? (
                            <p className="mt-2 border-t border-white/10 pt-1.5 text-[10px] text-ink-muted">
                              {hi
                                ? `${freeUsed}/${FREE_CHAT_LIMIT} मुफ़्त प्रश्न उपयोग`
                                : `${freeUsed}/${FREE_CHAT_LIMIT} free questions used`}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 border-t border-saffron/15 p-2.5">
                  <input
                    className="flex-1 rounded-xl border border-saffron/25 bg-surface px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-saffron/20 disabled:bg-cosmic-navy"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && void send()
                    }
                    placeholder={
                      hasGate
                        ? hi
                          ? "जारी रखने के लिए साइन अप करें…"
                          : "Sign up to continue…"
                        : freeExhausted
                          ? hi
                            ? "कोई सुझाया प्रश्न चुनें…"
                            : "Pick a suggested question…"
                          : hi
                            ? "अपना प्रश्न लिखें…"
                            : "Ask about your kundli…"
                    }
                    disabled={loading || hasGate}
                  />
                  <Button
                    type="button"
                    onClick={() => void send()}
                    disabled={loading || hasGate || !input.trim()}
                    className="!px-3.5 !py-2"
                  >
                    {loading ? (
                      "…"
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">
                          {hi ? "भेजें" : "Send"}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="px-2.5 pb-2 text-[11px] text-ink-muted">
                  <Link
                    href="/methodology"
                    className="font-semibold text-saffron-deep hover:underline"
                  >
                    {hi ? "यह कैसे काम करता है" : "How this works"}
                  </Link>
                  {hi
                    ? " — एआई ग्रह स्थिति गढ़ता नहीं; केवल गणना चार्ट की व्याख्या करता है।"
                    : " — AI does not invent planets; it only explains your calculated chart."}
                </p>
              </GlassCard>

              {showFollowUps ? (
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {followUps.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={loading}
                      onClick={() => void send(q)}
                      className="rounded-lg border border-white/10 bg-surface px-2.5 py-2 text-left text-[11px] font-medium leading-snug text-ink transition hover:border-saffron/40 hover:bg-cosmic-purple/15"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : null}

              <p className="text-center text-[10px] text-ink-muted lg:text-left">
                {hi
                  ? "मार्गदर्शन हेतु। चिकित्सा / कानूनी / वित्तीय सलाह नहीं।"
                  : "For guidance only — not medical, legal or financial advice."}
              </p>
            </section>
          </div>
        )}

        <div className="mt-8">
          <ContactCTA />
        </div>
      </div>
      {revealOpen ? (
        <GuruReveal
          locale={locale}
          sentences={revealSentences}
          cueMs={revealCueMs}
          filter={revealFilter}
          loading={revealLoading}
        />
      ) : null}
    </div>
  );
}
