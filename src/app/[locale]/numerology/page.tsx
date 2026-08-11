import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { NumerologyClient } from "@/components/numerology/NumerologyClient";
import { siteConfig } from "@/lib/site-config";
import { NUMBER_PROFILES } from "@/lib/numerology/profiles";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
  softwareAppJsonLd,
} from "@/lib/seo/page-meta";

const FAQS = [
  {
    q: {
      en: "What is Mulank vs Bhagyank?",
      hi: "मूलांक और भाग्यांक में क्या अंतर है?",
    },
    a: {
      en: "Mulank is your root/psychic number from the birth day only (e.g. 28 → 1). Bhagyank is your destiny/life-path number from all digits of the full date of birth.",
      hi: "मूलांक केवल जन्म दिन से मूल/साइकिक अंक है (जैसे 28 → 1)। भाग्यांक पूरी जन्म तिथि के सभी अंकों से भाग्य/लाइफ-पाथ अंक है।",
    },
  },
  {
    q: {
      en: "Why do Chaldean and Pythagorean name numbers differ?",
      hi: "कैल्डियन और पाइथागोरस नाम अंक अलग क्यों होते हैं?",
    },
    a: {
      en: "They use different letter-to-number tables. Chaldean (common in India) maps letters to 1–8 and treats 9 as sacred; Pythagorean uses sequential 1–9. Mixing tables silently is the most common numerology accuracy bug.",
      hi: "दोनों की अक्षर-अंक सारणियाँ अलग हैं। कैल्डियन (भारत में प्रचलित) 1–8 है और 9 पवित्र माना जाता है; पाइथागोरस क्रमिक 1–9 है। सारणियाँ मिलाना सबसे आम त्रुटि है।",
    },
  },
  {
    q: {
      en: "What is the Lo Shu Grid?",
      hi: "लो शू ग्रिड क्या है?",
    },
    a: {
      en: "A 3×3 magic-square map of digits from your birth date (pattern 4-9-2 / 3-5-7 / 8-1-6). Missing numbers suggest growth themes; complete rows/columns/diagonals are “arrows” of strength.",
      hi: "जन्म तिथि के अंकों का 3×3 जादुई वर्ग मानचित्र (4-9-2 / 3-5-7 / 8-1-6)। अनुपस्थित अंक विकास विषय; पूर्ण पंक्ति/स्तंभ/विकर्ण शक्ति के “तीर” हैं।",
    },
  },
  {
    q: {
      en: "Are master numbers 11 and 22 reduced?",
      hi: "क्या मास्टर अंक 11 और 22 घटाए जाते हैं?",
    },
    a: {
      en: "On this page we preserve 11, 22 and 33 as master numbers for Bhagyank and name totals, following the most common school. Mulank is always a single digit.",
      hi: "इस पृष्ठ पर भाग्यांक और नाम योग के लिए 11, 22, 33 मास्टर अंक सुरक्षित रखे जाते हैं। मूलांक हमेशा एकल अंक होता है।",
    },
  },
] as const;

const SYSTEMS = [
  {
    title: { en: "Chaldean (names)", hi: "कैल्डियन (नाम)" },
    body: {
      en: "Ancient Babylonian system, widely preferred in India for name analysis. Letter values 1–8; 9 is considered sacred/complete and unused in the map. Expression (full name), Soul Urge (vowels) and Personality (consonants) share one table.",
      hi: "प्राचीन बेबीलोनियन प्रणाली — भारत में नाम विश्लेषण हेतु व्यापक। अक्षर मान 1–8; 9 पवित्र/पूर्ण माना जाता है। अभिव्यक्ति, आत्मा और व्यक्तित्व एक ही सारणी साझा करते हैं।",
    },
  },
  {
    title: { en: "Pythagorean (Western)", hi: "पाइथागोरस (पश्चिमी)" },
    body: {
      en: "Sequential A–Z → 1–9. Same reduction logic as Chaldean, including master numbers, but a different alphabet table — so the Name Number for the same spelling often differs.",
      hi: "क्रमिक A–Z → 1–9। कैल्डियन जैसी घटाव विधि, पर अलग अक्षर सारणी — इसलिए एक ही नाम का अंक अक्सर अलग होता है।",
    },
  },
  {
    title: { en: "Vedic Mulank / Bhagyank", hi: "वैदिक मूलांक / भाग्यांक" },
    body: {
      en: "Date-based Indian “life path” maths. Mulank = reduce(day). Bhagyank = reduce(sum of all digits in DDMMYYYY). Ruling planets 1–9 (Sun through Mars) drive compatibility and lucky cues.",
      hi: "तिथि-आधारित भारतीय लाइफ-पाथ गणित। मूलांक = दिन घटाएँ। भाग्यांक = DDMMYYYY के सभी अंक। 1–9 के शासक ग्रह (सूर्य से मंगल) अनुकूलता और शुभ संकेत देते हैं।",
    },
  },
  {
    title: { en: "Lo Shu Grid", hi: "लो शू ग्रिड" },
    body: {
      en: "Chinese magic square adopted in Indian numerology apps. Plot digit counts from the birth date; detect missing numbers and complete arrows (planes of mind, emotion, will, action).",
      hi: "चीनी जादुई वर्ग — भारतीय अंक ऐप्स में अपनाया। जन्म तिथि के अंक गिनकर रखें; अनुपस्थित अंक और पूर्ण तीर (मन, भाव, संकल्प, कर्म) पहचानें।",
    },
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/numerology",
    title: hi
      ? "अंक ज्योतिष कैलकुलेटर — मूलांक, भाग्यांक, नाम अंक, लो शू"
      : "Numerology Calculator — Mulank, Bhagyank, Name Number, Lo Shu",
    description: hi
      ? "मुफ़्त अंक ज्योतिष — वैदिक मूलांक/भाग्यांक, कैल्डियन व पाइथागोरस नाम अंक, लो शू ग्रिड और अंक अर्थ। गणना पहले, व्याख्या बाद में।"
      : "Free numerology — Vedic Mulank/Bhagyank, Chaldean & Pythagorean name numbers, Lo Shu grid and number meanings. Calculate first, interpret second.",
    keywords: hi
      ? [
          "अंक ज्योतिष",
          "मूलांक भाग्यांक",
          "नाम अंक कैलकुलेटर",
          "लो शू ग्रिड",
          "कैल्डियन अंक ज्योतिष",
        ]
      : [
          "numerology calculator",
          "mulank bhagyank",
          "chaldean name number",
          "lo shu grid",
          "life path number",
        ],
  });
}

export default async function NumerologyPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const url = absoluteUrl(locale, "/numerology");
  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  const profiles1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (n) => NUMBER_PROFILES[n]
  );

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "अंक ज्योतिष" : "Numerology", path: "/numerology" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={softwareAppJsonLd({
          name: hi ? "अंक ज्योतिष कैलकुलेटर" : "Numerology Calculator",
          description: hi
            ? "मूलांक, भाग्यांक, नाम अंक और लो शू ग्रिड।"
            : "Mulank, Bhagyank, name numbers and Lo Shu grid.",
          url,
        })}
      />

      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "अंक ज्योतिष" : "Numerology"}
        description={
          hi
            ? "नाम और जन्म तिथि से मूलांक, भाग्यांक, कैल्डियन/पाइथागोरस नाम अंक और लो शू — स्पष्ट सिस्टम लेबल के साथ।"
            : "From name and birth date — Mulank, Bhagyank, Chaldean/Pythagorean name numbers and Lo Shu — with every system clearly labelled."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "अंक ज्योतिष" : "Numerology" },
        ]}
      />

      <div className="container-page max-w-4xl space-y-12 py-10 sm:py-12">
        <NumerologyClient locale={locale} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "चार प्रणालियाँ, एक पृष्ठ" : "Four systems, one page"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "अधिकांश ऐप्स बिना बताए सारणियाँ मिला देते हैं। Astrologics गणना को सिस्टम के अनुसार अलग रखता है — ताकि आप जाँच सकें कि कौन-सा अंक किस पद्धति से आया।"
              : "Most apps silently mix letter tables. Astrologics keeps calculation labelled by system — so you can verify which number came from which method."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SYSTEMS.map((s) => (
              <article
                key={s.title.en}
                className="rounded-2xl border border-black/[0.06] bg-white p-4 sm:p-5"
              >
                <h3 className="font-semibold text-ink">
                  {hi ? s.title.hi : s.title.en}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                  {hi ? s.body.hi : s.body.en}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "अंक 1–9 अर्थ (वैदिक ग्रह)" : "Numbers 1–9 meanings (Vedic planets)"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "प्रत्येक अंक का शासक ग्रह, स्वभाव, शुभ रंग/दिन और अनुकूल अंक — रिपोर्ट में दोबारा उपयोग होने वाला लुकअप।"
              : "Each number’s ruling planet, temperament, lucky colour/day and compatible numbers — a reusable lookup shared by the report."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
            <table className="w-full min-w-[40rem] text-left text-[13px]">
              <thead className="border-b border-black/5 bg-[#fff7f0] text-[11px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-3 py-3 font-bold">#</th>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "शीर्षक" : "Title"}
                  </th>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "ग्रह" : "Planet"}
                  </th>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "सार" : "Essence"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles1to9.map((p) => (
                  <tr key={p.number} className="border-b border-black/[0.04]">
                    <td className="px-3 py-3 font-display text-lg font-bold tabular-nums text-saffron-deep">
                      {p.number}
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink">
                      {hi ? p.title.hi : p.title.en}
                    </td>
                    <td className="px-3 py-3 text-ink-muted">
                      {hi ? p.planet.hi : p.planet.en}
                    </td>
                    <td className="px-3 py-3 text-ink-muted max-w-md">
                      {hi ? p.traits.hi : p.traits.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "कैसे गणना होती है" : "How the maths works"}
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-muted">
            <li>
              {hi
                ? "मूलांक = जन्म दिन के अंक घटाकर एकल अंक (मास्टर नहीं)।"
                : "Mulank = reduce birth day digits to a single digit (no master retention)."}
            </li>
            <li>
              {hi
                ? "भाग्यांक = DDMMYYYY के सभी अंकों का योग घटाएँ; 11/22/33 सुरक्षित।"
                : "Bhagyank = reduce the sum of all DDMMYYYY digits; preserve 11/22/33."}
            </li>
            <li>
              {hi
                ? "नाम अंक = अक्षर → अंक (सिस्टम सारणी) → योग → घटाव; अभिव्यक्ति / आत्मा / व्यक्तित्व।"
                : "Name number = letters → values (system table) → sum → reduce; Expression / Soul / Personality."}
            </li>
            <li>
              {hi
                ? "लो शू = तिथि अंकों की गिनती 3×3 में; पूर्ण पंक्ति/स्तंभ/विकर्ण = सक्रिय तीर।"
                : "Lo Shu = digit counts on the 3×3 grid; complete row/column/diagonal = active arrow."}
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "सामान्य प्रश्न" : "Frequently asked questions"}
          </h2>
          <dl className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-black/[0.06] bg-white px-4 py-3"
              >
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14px] text-ink-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-saffron/20 bg-gradient-to-br from-[#fff7f0] to-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "आगे क्या देखें" : "Explore next"}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <li>
              <Link
                href="/learn/numerology"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "अंक ज्योतिष गाइड →" : "Numerology learn guide →"}
              </Link>
            </li>
            <li>
              <Link
                href="/calculators/lo-shu-grid"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "लो शू कैलकुलेटर →" : "Lo Shu calculator →"}
              </Link>
            </li>
            <li>
              <Link
                href="/calculators/name-numerology"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "नाम अंक उपकरण →" : "Name number tool →"}
              </Link>
            </li>
            <li>
              <Link href="/kundli" className="text-saffron-deep hover:underline">
                {hi ? "जन्म कुंडली →" : "Janam Kundli →"}
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "पद्धति →" : "Methodology →"}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
