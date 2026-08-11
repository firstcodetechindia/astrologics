import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";

const QUESTIONS = [
  {
    en: "Why am I struggling in my career right now?",
    hi: "अभी करियर में संघर्ष क्यों लग रहा है?",
  },
  {
    en: "What does my current Mahadasha mean?",
    hi: "मेरी वर्तमान महादशा का क्या अर्थ है?",
  },
  {
    en: "What are the strongest areas of my Kundli?",
    hi: "मेरी कुंडली के सबसे मजबूत क्षेत्र कौन से हैं?",
  },
] as const;

export function AiGuruSection({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="border-y border-saffron/15 bg-gradient-to-b from-[#fff7f0] to-white py-10 sm:py-12">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10">
          <Reveal>
            <h2 className="heading-1 font-display tracking-tight text-ink">
              {hi ? "एआई ज्योतिष गाइड" : "AI Astrology Guide"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-ink-muted">
              {hi
                ? "अपनी गणना की गई कुंडली पर सरल भाषा में पूछें — ग्रह स्थिति गढ़े नहीं जाते।"
                : "Ask about your calculated chart in plain language — planetary positions are never invented."}
            </p>
            <Link
              href="/chat"
              className="btn-grad mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-ivory"
            >
              <MessageCircle className="h-4 w-4" />
              {hi ? "एआई गुरु से पूछें" : "Ask AI Guru"}
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="space-y-2">
              {QUESTIONS.map((q) => (
                <li key={q.en}>
                  <Link
                    href="/chat"
                    className="block rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-[13px] font-medium text-ink transition hover:border-saffron/35"
                  >
                    “{hi ? q.hi : q.en}”
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
