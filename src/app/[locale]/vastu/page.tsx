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
  {
    q: {
      en: "Is Vastu Shastra scientifically proven?",
      hi: "क्या वास्तु शास्त्र वैज्ञानिक रूप से सिद्ध है?",
    },
    a: {
      en: "Vastu is a traditional Indian architectural and spatial-design system, not a scientifically tested discipline in the way structural engineering is. Many of its guidelines (natural light, ventilation, decluttering, open central spaces) overlap with sound design practice independent of the traditional framework — we present both the classical reasoning and note where guidance aligns with general good design sense.",
      hi: "वास्तु पारंपरिक भारतीय स्थापत्य/स्थान-डिज़ाइन प्रणाली है — संरचना इंजीनियरिंग जैसी वैज्ञानिक रूप से परीक्षित विधा नहीं। कई दिशानिर्देश (प्राकृतिक प्रकाश, वायु संचार, अव्यवस्था हटाना, खुला केंद्र) सामान्य अच्छे डिज़ाइन से मेल खाते हैं — हम शास्त्रीय तर्क और जहाँ सामान्य डिज़ाइन बोध से मेल हो दोनों बताते हैं।",
    },
  },
  {
    q: {
      en: "Can I check Vastu for a rented flat I can’t renovate?",
      hi: "क्या किराये के फ्लैट की वास्तु जाँच सकते हैं जहाँ नवीनीकरण संभव नहीं?",
    },
    a: {
      en: "Yes — this is exactly what non-structural remedies are for. Renters can apply colour, placement, and object-based remedies without any construction or landlord approval.",
      hi: "हाँ — गैर-संरचनात्मक उपाय ठीक इसी हेतु हैं। किरायेदार रंग, स्थान और वस्तु-आधारित उपाय बिना निर्माण या मकान मालिक अनुमति लगा सकते हैं।",
    },
  },
  {
    q: {
      en: "How is Astro-Vastu different from regular Vastu?",
      hi: "एस्ट्रो-वास्तु सामान्य वास्तु से कैसे अलग है?",
    },
    a: {
      en: "Regular Vastu applies the same directional rules to everyone. Astro-Vastu adds your personal chart — your Lagna element and current Mahadasha — to prioritize which zones matter most for you right now, without changing the underlying directional rules themselves.",
      hi: "सामान्य वास्तु सभी पर समान दिशा नियम लागू करता है। एस्ट्रो-वास्तु आपकी कुंडली जोड़ता है — लग्न तत्व व वर्तमान महादशा — ताकि अभी कौन-से क्षेत्र अधिक मायने रखते हैं, बिना मूल दिशा नियमों को बदले।",
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
      ? "वास्तु शास्त्र जाँच — घर दोष व उपाय"
      : "Vastu Shastra Checker — Home Vastu Dosha & Remedies",
    description: hi
      ? "मुफ़्त वास्तु शास्त्र जाँच — क्षेत्र-वार दोष चिह्न व गैर-संरचनात्मक उपाय, वैकल्पिक एस्ट्रो-वास्तु कुंडली सहित।"
      : "Free Vastu Shastra checker for your home. Get zone-by-zone Dosha flags with non-structural remedies — plus optional Astro-Vastu using your chart.",
    keywords: hi
      ? [
          "वास्तु शास्त्र जाँच",
          "वास्तु कैलकुलेटर",
          "वास्तु दोष उपाय",
          "रसोई वास्तु दिशा",
          "मुख्य द्वार वास्तु",
          "एस्ट्रो वास्तु",
        ]
      : [
          "vastu shastra checker",
          "vastu calculator online free",
          "home vastu consultation free",
          "vastu dosha remedies",
          "vastu tips for home",
          "main door vastu direction",
          "kitchen vastu direction",
          "bedroom vastu direction",
          "vastu for main entrance",
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
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "वास्तु" : "Vastu", path: "/vastu" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={softwareAppJsonLd({
          name: hi ? "वास्तु शास्त्र जाँच" : "Vastu Shastra Checker",
          description: hi
            ? "घर के क्षेत्र दोष व गैर-संरचनात्मक उपाय।"
            : "Home zone Dosha flags and non-structural remedies.",
          url,
        })}
      />

      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "वास्तु शास्त्र जाँच" : "Vastu Shastra Checker"}
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

      <div className="container-page py-10 sm:py-12">
        <div className="space-y-12">
        <p className="rounded-2xl border border-saffron/15 bg-surface px-5 py-4 text-[15px] leading-relaxed text-ink">
          {hi ? (
            <>
              CosmicTalks का मुफ़्त वास्तु शास्त्र चेकर घर के कक्षों को दिशाओं से
              मिलाकर क्षेत्र-वार दोष चिह्नित करता है और डिफ़ॉल्ट रूप से
              गैर-संरचनात्मक उपाय सुझाता है — दीवार तोड़ना अंतिम विकल्प। वैकल्पिक
              एस्ट्रो-वास्तु{" "}
              <Link
                href="/kundli"
                className="font-semibold text-saffron-deep hover:underline"
              >
                जन्म कुंडली
              </Link>{" "}
              के लग्न तत्व व दशा से जोड़ता है। दिशा नियम स्रोत{" "}
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                पद्धति
              </Link>{" "}
              पृष्ठ की पारदर्शिता से जुड़ा है।
            </>
          ) : (
            <>
              CosmicTalks’s free Vastu Shastra checker matches your home’s rooms
              to classical directions, flags zone-by-zone Doshas, and defaults to
              non-structural remedies — rebuilding walls is a last resort.
              Optional Astro-Vastu personalises priorities using your{" "}
              <Link
                href="/kundli"
                className="font-semibold text-saffron-deep hover:underline"
              >
                Janam Kundli
              </Link>{" "}
              Lagna element and current dasha. Directional rules are classical
              Vastu Purusha Mandala placements; see{" "}
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                Methodology
              </Link>{" "}
              for how CosmicTalks separates calculation from interpretation.
            </>
          )}
        </p>

        <VastuClient locale={locale} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "वास्तु पुरुष मंडल — दिशाएँ"
              : "Vastu Purusha Mandala — directions"}
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
                className="rounded-2xl border border-white/10 bg-surface p-4"
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
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "रसोई वास्तु दिशा, मुख्य द्वार वास्तु, बेडरूम वास्तु — नीचे सारणी में आदर्श व वर्जित दिशाएँ।"
              : "Kitchen Vastu direction, main door Vastu, bedroom Vastu — ideal and avoid directions in the table below."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
            <table className="w-full min-w-[36rem] text-left text-[13px]">
              <thead className="border-b border-white/10 bg-deep-indigo/80 text-[11px] uppercase tracking-wider text-ink-muted">
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
                  <tr key={r.room} className="border-b border-white/10">
                    <td className="px-3 py-3 font-semibold text-ink">
                      {hi ? r.label.hi : r.label.en}
                    </td>
                    <td className="px-3 py-3 text-ink-muted">
                      {r.ideal
                        .map(
                          (id) =>
                            DIRECTIONS.find((d) => d.id === id)?.label[
                              hi ? "hi" : "en"
                            ] ?? id
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
            {hi
              ? "सामान्य वास्तु दोष और उनका अर्थ"
              : "Common Vastu Doshas and what they mean"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "वास्तविक घरों में कुछ क्षेत्र असंगतियाँ बार-बार आती हैं — प्लॉट आकार और निर्माण मानदंड आदर्श वास्तु योजना से अधिक बाध्य करते हैं। ईशान में रसोई सबसे आम दोषों में है — अग्नि तत्व को शांत जल क्षेत्र में रखती है; मानक गैर-संरचनात्मक उपाय ताँबे की वस्तु और जहाँ संभव हो चूल्हे को कमरे के दक्षिण-पूर्व कोने की ओर खिसकाना है। ईशान या ब्रह्मस्थान में शौचालय दूसरा बारंबार चिह्न है — नमक-पानी सफाई और अव्यवस्था-मुक्त बंद स्थान से संबोधित, संरचना बदलाव से नहीं। अवरुद्ध/अव्यवस्थित मुख्य द्वार दिशा निरपेक्ष दोष माना जाता है — प्रवेश अवरोध सकारात्मक ऊर्जा प्रवाह को सीमित करता है।"
              : "Some zone mismatches come up more often than others in real homes, since layouts are constrained by plot shape and construction norms rather than ideal Vastu planning. A kitchen in the North-East is one of the most common Doshas we see flagged — it places the fire element in the zone meant for calm and water energy, and the standard non-structural remedy is a copper object placed in the kitchen along with, where possible, shifting the stove itself toward the South-East corner of the room. A toilet in the North-East or in the Brahmasthan (center) is another frequent flag, generally addressed with salt-water cleaning routines and keeping the space strictly clean and closed when not in use, rather than any structural change. A blocked or cluttered main entrance is treated as a Dosha regardless of its direction, since an obstructed entry is considered to restrict the flow of positive energy into the home irrespective of which zone it sits in."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "क्या वास्तु उपायों के लिए दीवार तोड़नी पड़ती है?"
              : "Do Vastu remedies require breaking walls?"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "नहीं — और यही कारण है कि यह पृष्ठ गैर-संरचनात्मक उपायों को डिफ़ॉल्ट रखता है। व्यवहार में अधिकांश वास्तु सुधार प्रकाश, रंग, वस्तुओं का स्थान, अव्यवस्था हटाना और प्रतीकात्मक तत्व (ताँबा, नमक, आईना, पौधे) से होते हैं — निर्माण से नहीं। संरचना बदलाव अंतिम उपाय है, मुख्यतः जब आप पहले से नवीनीकरण या नए निर्माण में हों — केवल चिह्नित क्षेत्र सुधार हेतु नहीं।"
              : "No — and this page defaults to non-structural remedies for exactly this reason. The vast majority of Vastu corrections in practice involve light, colour, placement of objects, decluttering, and symbolic elements (copper, salt, mirrors, plants) rather than construction. Structural change is treated as a last resort, relevant mainly if you’re already renovating or building from scratch — not something to undertake solely to fix a flagged zone in an existing home."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "पूर्ण वास्तु परामर्श कब लें"
              : "When to get a full Vastu consultation"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi ? (
              <>
                यह चेकर घर के प्रमुख क्षेत्रों का तेज़, पारदर्शी स्व-सेवा पाठ है —
                पूर्ण साइट-विज़िट परामर्श का विकल्प नहीं, जो प्लॉट आकार, आसपास
                संरचनाएँ और माप शामिल करता है जिन्हें यह उपकरण नहीं पकड़ता। यदि
                रिपोर्ट कई प्रमुख दोष एक साथ चिह्नित करे (विशेषकर प्रवेश, रसोई और
                मास्टर बेडरूम साथ), या आप मौजूदा घर सुधार के बजाय नया निर्माण
                कर रहे हों, तो गहरा विश्लेषण लायक है।{" "}
                <Link
                  href="/chat-with-astrologer"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  ज्योतिषी से बात →
                </Link>
              </>
            ) : (
              <>
                This checker is built for a quick, transparent, self-serve read
                of your home’s major zones — it’s not a substitute for a full
                site-visit consultation, which accounts for plot shape,
                surrounding structures, and measurements this tool doesn’t
                capture. If your report flags several major Doshas together
                (especially entrance, kitchen, and master bedroom
                simultaneously), or if you’re planning new construction rather
                than correcting an existing home, a full consultation is worth
                the deeper analysis.{" "}
                <Link
                  href="/chat-with-astrologer"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Talk to an astrologer →
                </Link>
              </>
            )}
          </p>
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
                className="rounded-xl border border-white/10 bg-surface px-4 py-3"
              >
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14px] text-ink-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-saffron/20 surface-wash p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "आगे देखें" : "Explore next"}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
            <li>
              <Link href="/kundli" className="text-saffron-deep hover:underline">
                {hi ? "जन्म कुंडली (एस्ट्रो-वास्तु) →" : "Janam Kundli (Astro-Vastu) →"}
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
    </div>
  );
}
