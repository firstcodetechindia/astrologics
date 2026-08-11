import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { VastuClient } from "@/components/vastu/VastuClient";
import { siteConfig } from "@/lib/site-config";
import { DIRECTIONS, PLACEMENT_RULES } from "@/lib/vastu/rules";
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
      en: "What is the Vastu Purusha Mandala?",
      hi: "वास्तु पुरुष मंडल क्या है?",
    },
    a: {
      en: "A directional grid over the home — eight directions plus the center (Brahmasthan) — each with a classical deity, element and preferred room use.",
      hi: "घर पर दिशा ग्रिड — आठ दिशाएँ व केंद्र (ब्रह्मस्थान) — प्रत्येक का शास्त्रीय देवता, तत्व और पसंदीदा कक्ष उपयोग।",
    },
  },
  {
    q: {
      en: "Why do you ask me to confirm true North?",
      hi: "सच्चा उत्तर दिशा पुष्टि क्यों माँगते हैं?",
    },
    a: {
      en: "Vastu accuracy depends on correct compass orientation. Photo-based floor plans often misread North — we use your confirmed direction tags instead of guessing from an image.",
      hi: "वास्तु सटीकता सही कम्पास अभिविन्यास पर निर्भर है। फोटो फ्लोर प्लान अक्सर उत्तर गलत पढ़ते हैं — हम छवि से अनुमान के बजाय आपकी पुष्टि दिशा टैग उपयोग करते हैं।",
    },
  },
  {
    q: {
      en: "What is Astro-Vastu?",
      hi: "एस्ट्रो-वास्तु क्या है?",
    },
    a: {
      en: "Direction rules plus your chart: Lagna element for sleep/study facing, and current Mahadasha for which home zones to prioritise temporarily — without inventing planetary positions.",
      hi: "दिशा नियम + आपकी कुंडली: सोने/अध्ययन हेतु लग्न तत्व, और अस्थायी क्षेत्र प्राथमिकता हेतु वर्तमान महादशा — ग्रह स्थिति गढ़े बिना।",
    },
  },
  {
    q: {
      en: "Do remedies mean breaking walls?",
      hi: "क्या उपाय का मतलब दीवार तोड़ना है?",
    },
    a: {
      en: "No. Default remedies are non-structural — light, colour, order, symbolic placement. Structural change is only a last resort when you are already renovating.",
      hi: "नहीं। डिफ़ॉल्ट उपाय गैर-संरचनात्मक हैं — प्रकाश, रंग, व्यवस्था, प्रतीक। संरचना केवल तब जब आप पहले से नवीनीकरण कर रहे हों।",
    },
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/vastu",
    title: hi
      ? "वास्तु शास्त्र जाँच — दोष, स्कोर व उपाय"
      : "Vastu Shastra Checker — Dosha, Score & Remedies",
    description: hi
      ? "मुफ़्त वास्तु जाँच — वास्तु पुरुष मंडल दिशा नियम, क्षेत्र-वार दोष, गैर-संरचनात्मक उपाय और वैकल्पिक एस्ट्रो-वास्तु (लग्न + दशा)।"
      : "Free Vastu check — Vastu Purusha Mandala direction rules, zone-by-zone Dosha, non-structural remedies and optional Astro-Vastu (Lagna + Dasha).",
    keywords: hi
      ? ["वास्तु शास्त्र", "वास्तु दोष", "वास्तु उपाय", "ईशान", "एस्ट्रो वास्तु"]
      : [
          "vastu shastra",
          "vastu dosha",
          "vastu remedies",
          "north east vastu",
          "astro vastu",
        ],
  });
}

export default async function VastuPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const url = absoluteUrl(locale, "/vastu");
  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "वास्तु" : "Vastu", path: "/vastu" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={softwareAppJsonLd({
          name: hi ? "वास्तु जाँच कैलकुलेटर" : "Vastu Checker",
          description: hi
            ? "दिशा नियम, दोष स्कोर और उपाय।"
            : "Direction rules, Dosha score and remedies.",
          url,
        })}
      />

      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "वास्तु शास्त्र" : "Vastu Shastra"}
        description={
          hi
            ? "वास्तु पुरुष मंडल दिशा नियम → दोष चिह्न → गैर-संरचनात्मक उपाय। स्कोर केवल सार है।"
            : "Vastu Purusha Mandala direction rules → Dosha flags → non-structural remedies. Score is only a summary."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "वास्तु" : "Vastu" },
        ]}
      />

      <div className="container-page max-w-4xl space-y-12 py-10 sm:py-12">
        <VastuClient locale={locale} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "वास्तु पुरुष मंडल — दिशाएँ" : "Vastu Purusha Mandala — directions"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "आठ दिशाएँ + ब्रह्मस्थान। प्रत्येक का देवता, तत्व और विषय — नियम इंजन इन्हीं पर चलता है।"
              : "Eight directions + Brahmasthan. Each has a deity, element and theme — the rule engine runs on these."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DIRECTIONS.map((d) => (
              <article
                key={d.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-4"
              >
                <h3 className="font-semibold text-ink">
                  {hi ? d.label.hi : d.label.en}
                </h3>
                <p className="mt-1 text-[12px] font-medium text-saffron-deep">
                  {hi ? d.deity.hi : d.deity.en} ·{" "}
                  {hi ? d.element.hi : d.element.en}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  {hi ? d.theme.hi : d.theme.en}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "मुख्य स्थान नियम" : "Key placement rules"}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
            <table className="w-full min-w-[36rem] text-left text-[13px]">
              <thead className="border-b border-black/5 bg-[#fff7f0] text-[11px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "कक्ष" : "Room"}
                  </th>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "आदर्श" : "Ideal"}
                  </th>
                  <th className="px-3 py-3 font-bold">
                    {hi ? "बचें" : "Avoid"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLACEMENT_RULES.map((r) => (
                  <tr key={r.room} className="border-b border-black/[0.04]">
                    <td className="px-3 py-3 font-semibold text-ink">
                      {hi ? r.label.hi : r.label.en}
                    </td>
                    <td className="px-3 py-3 text-ink-muted">
                      {r.ideal
                        .map(
                          (id) =>
                            DIRECTIONS.find((d) => d.id === id)?.[
                              hi ? "label" : "label"
                            ][hi ? "hi" : "en"] ?? id
                        )
                        .join(", ") || "—"}
                    </td>
                    <td className="px-3 py-3 text-ink-muted">
                      {r.avoid.length
                        ? r.avoid
                            .map(
                              (id) =>
                                DIRECTIONS.find((d) => d.id === id)?.label[
                                  hi ? "hi" : "en"
                                ] ?? id
                            )
                            .join(", ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "कैसे काम करता है" : "How this works"}
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-ink-muted">
            <li>
              {hi
                ? "आप कक्ष प्रकार + दिशा चिह्नित करते हैं (MVP संरचित इनपुट — फोटो CV नहीं)।"
                : "You mark room type + direction (MVP structured input — not photo CV)."}
            </li>
            <li>
              {hi
                ? "नियम इंजन प्रत्येक क्षेत्र को आदर्श / कामचलाऊ / दोष से मिलाता है; प्रवेश व रसोई का भार अधिक।"
                : "The rule engine matches each zone as ideal / acceptable / Dosha; entrance and kitchen weigh more."}
            </li>
            <li>
              {hi
                ? "रिपोर्ट प्रत्येक दोष को सादे शब्दों में समझाती है और गैर-संरचनात्मक उपाय जोड़ती है।"
                : "The report explains each Dosha in plain language and pairs a non-structural remedy."}
            </li>
            <li>
              {hi
                ? "कुल स्कोर केवल सार है — क्षेत्र सूची की जगह नहीं लेता।"
                : "Overall score is only a summary — never a replacement for the zone list."}
            </li>
            <li>
              {hi
                ? "वैकल्पिक एस्ट्रो-वास्तु: लग्न तत्व + वर्तमान महादशा से व्यक्तिगत प्राथमिकता।"
                : "Optional Astro-Vastu: Lagna element + current Mahadasha for personalised priorities."}
            </li>
          </ol>
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
            {hi ? "आगे देखें" : "Explore next"}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <li>
              <Link
                href="/kundli"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "जन्म कुंडली →" : "Janam Kundli →"}
              </Link>
            </li>
            <li>
              <Link
                href="/numerology"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "अंक ज्योतिष →" : "Numerology →"}
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
            <li>
              <Link
                href="/chat-with-astrologer"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "ज्योतिषी से बात →" : "Talk to an astrologer →"}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
