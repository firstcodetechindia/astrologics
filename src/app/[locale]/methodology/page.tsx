import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";
import { SILENT_SETTINGS } from "@/lib/astrology/silent-settings";

const FAQS = [
  {
    q: {
      en: "What ayanamsa does CosmicGPT use?",
      hi: "CosmicGPT कौन-सा अयनांश उपयोग करता है?",
    },
    a: {
      en: "Lahiri (Chitrapaksha) ayanamsa — the standard used in India’s Rashtriya Panchang and most Vedic software.",
      hi: "लाहिरी (चित्रापक्ष) अयनांश — भारत के राष्ट्रीय पंचांग और अधिकांश वैदिक सॉफ़्टवेयर का मानक।",
    },
  },
  {
    q: {
      en: "What’s the difference between Vedic and Western astrology on this site?",
      hi: "इस साइट पर वैदिक और पश्चिमी ज्योतिष में क्या अंतर है?",
    },
    a: {
      en: "Janam Kundli and most calculators use sidereal Lahiri positions with whole-sign houses. Learn guides also cover Western (tropical) concepts separately and label which system you are reading.",
      hi: "जन्म कुंडली और अधिकांश कैलकुलेटर लाहिरी निरयण स्थिति व पूर्ण-राशि भाव उपयोग करते हैं। सीखें गाइड में पश्चिमी (ट्रॉपिकल) अवधारणाएँ अलग से बताई जाती हैं।",
    },
  },
  {
    q: {
      en: "Does CosmicGPT sell my birth data?",
      hi: "क्या CosmicGPT मेरा जन्म डेटा बेचता है?",
    },
    a: {
      en: "No. Birth details are used to calculate your chart and are not sold to third parties, including remedy or gemstone sellers. You can request deletion via Contact.",
      hi: "नहीं। जन्म विवरण कुंडली गणना हेतु उपयोग होते हैं और तीसरे पक्षों को नहीं बेचे जाते। Contact से हटाने का अनुरोध कर सकते हैं।",
    },
  },
  {
    q: {
      en: "Does the AI invent planetary positions?",
      hi: "क्या एआई ग्रह स्थिति गढ़ता है?",
    },
    a: {
      en: "No. AI Guru only interprets chart data already calculated by the ephemeris engine.",
      hi: "नहीं। एआई गुरु केवल गणना इंजन से निकले चार्ट डेटा की व्याख्या करता है।",
    },
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/methodology",
    title: hi
      ? "हमारी पद्धति — CosmicGPT कुंडली कैसे गणना करता है"
      : "Our Methodology — How CosmicGPT Calculates Your Chart",
    description: hi
      ? "देखें CosmicGPT आपकी कुंडली कैसे गणना करता है — अयनांश, भाव पद्धति, इफेमेरिस स्रोत और एआई दृष्टिकोण, पारदर्शी रूप से।"
      : "See exactly how CosmicGPT calculates your Kundli — ayanamsa, house system, ephemeris source and AI approach, explained transparently.",
    keywords: hi
      ? [
          "ज्योतिष पद्धति",
          "लाहिरी अयनांश",
          "कुंडली गणना",
          "CosmicGPT methodology",
        ]
      : [
          "astrology methodology",
          "lahiri ayanamsa",
          "how kundli is calculated",
          "vedic house system",
          "CosmicGPT calculation method",
        ],
  });
}

export default async function MethodologyPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          {
            name: hi ? "पद्धति" : "Methodology",
            path: "/methodology",
          },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "हमारी पद्धति" : "Our Methodology"}
        description={
          hi
            ? "गणना, व्याख्या और एआई — स्पष्ट रूप से अलग, ताकि आप जाँच सकें।"
            : "Calculation, interpretation and AI — clearly separated, so you can verify our work."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "पद्धति" : "Methodology" },
        ]}
      />

      <article className="container-page py-10 sm:py-12 text-[15px] leading-relaxed text-ink-muted">
        <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "हम यह पृष्ठ क्यों प्रकाशित करते हैं" : "Why we publish this"}
          </h2>
          <p>
            {hi
              ? "अधिकांश ज्योतिष प्लेटफ़ॉर्म गणना का तरीका बताए बिना विश्वास माँगते हैं। हम इसे उल्टा मानते हैं — खासकर जन्म कुंडली जैसी व्यक्तिगत चीज़ के लिए। यह पृष्ठ बताता है कि CosmicGPT किन गणना विधियों, डेटा स्रोतों और एआई दृष्टिकोण का उपयोग करता है, ताकि आप हमारे काम की जाँच कर सकें — केवल हमारे शब्द पर भरोसा न करें।"
              : "Most astrology platforms ask you to trust their calculations without ever showing how they arrived at them. We think that's backwards — especially for something as personal as your birth chart. This page explains exactly which calculation methods, data sources and AI approach CosmicGPT uses, so you can verify our work instead of just taking our word for it."}
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "आपकी कुंडली कैसे गणना होती है" : "How your chart is calculated"}
          </h2>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi
                ? "अयनांश (साइडिरियल सुधार)"
                : "Ayanamsa (sidereal correction)"}
            </h3>
            <p>
              {hi
                ? "हम लाहिरी (चित्रापक्ष) अयनांश उपयोग करते हैं — भारत सरकार के राष्ट्रीय पंचांग का मानक — और इसे जन्म तिथि के लिए ताज़ा गणना करते हैं (स्थिर पुराना स्थिरांक नहीं)। कुंडली परिणाम में प्रयुक्त डिग्री मान ऑडिट हेतु संग्रहीत रहता है। यदि आपने पश्चिमी ज्योतिष ऐप इस्तेमाल किया और यहाँ अलग सूर्य राशि मिली, तो यह ऑफ़सेट — कोई त्रुटि नहीं — उसका कारण है।"
                : "We use Lahiri (Chitrapaksha) ayanamsa — the Indian government’s Rashtriya Panchang standard — calculated fresh for your birth date (not a fixed stale constant). The numeric degree used for your chart is stored with the result for auditability. If you've used a Western astrology app and gotten a different Sun sign here, this offset — not an error — is why."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "भाव पद्धति" : "House system"}
            </h3>
            <p>
              {hi
                ? "मुख्य D1 (राशि) भाव पूर्ण-राशि पद्धति से हैं — वैदिक परंपरा, जहाँ प्रत्येक भाव लग्न से ठीक एक राशि है। KP मॉड्यूल प्लैसिडस कुस्प उपयोग करता है; भाव चलित श्रीपति (भाव मध्य) उपयोग करता है। हम प्रति चार्ट प्रकार पद्धति स्पष्ट करते हैं।"
                : "Primary D1 (Rashi) houses use whole-sign — the traditional Vedic method where each house is exactly one sign from Lagna. The KP module uses Placidus cusps; Bhav Chalit uses Sripati (Bhava Madhya). We state the system per chart type rather than mixing them silently."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "राहु–केतु (नोड)" : "Rahu–Ketu (lunar nodes)"}
            </h3>
            <p>
              {hi
                ? SILENT_SETTINGS.find((s) => s.id === "node")!.docText.hi
                : SILENT_SETTINGS.find((s) => s.id === "node")!.docText.en}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "इफेमेरिस स्रोत" : "Ephemeris source"}
            </h3>
            <p>
              {hi
                ? "ग्रह स्थितियाँ astronomy-engine से गणना होती हैं — VSOP87/ELP-आधारित मॉडल जो NASA JPL-श्रेणी के कक्षीय डेटा से संरेखित हैं। इसका अर्थ है कि आपकी कुंडली की कच्ची ग्रह स्थितियाँ खगोलीय रूप से सत्यापन योग्य हैं, किसी भी ज्योतिषीय व्याख्या से स्वतंत्र।"
                : "Planetary positions are calculated with astronomy-engine — VSOP87/ELP-derived models aligned with NASA JPL-class orbital data. This means the raw planetary positions in your chart are astronomically verifiable, independent of any astrological interpretation layered on top."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi ? "दशा प्रणाली" : "Dasha system"}
            </h3>
            <p>
              {hi
                ? "जीवन-काल समय (महादशा/अंतर्दशा) विंशोत्तरी दशा से गणना होता है — जन्म पर चंद्र नक्षत्र स्थिति पर आधारित, वैदिक ज्योतिष की मानक समय-पद्धति, नौ ग्रहीय अवधियों में 120-वर्ष चक्र।"
                : "Life-period timing (Mahadasha/Antardasha) is calculated using the Vimshottari Dasha system, based on your Moon's Nakshatra position at birth — the standard timing method in Vedic astrology, spanning a 120-year cycle across nine planetary periods."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi
                ? "सूर्योदय और वैदिक दिन"
                : "Sunrise and the Vedic day"}
            </h3>
            <p>
              {hi
                ? SILENT_SETTINGS.find((s) => s.id === "sunrise_day_boundary")!
                    .docText.hi
                : SILENT_SETTINGS.find((s) => s.id === "sunrise_day_boundary")!
                    .docText.en}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-ink">
              {hi
                ? "समय क्षेत्र और स्थान"
                : "Time zone and location handling"}
            </h3>
            <p>
              {hi
                ? SILENT_SETTINGS.find((s) => s.id === "timezone")!.docText.hi
                : SILENT_SETTINGS.find((s) => s.id === "timezone")!.docText.en}{" "}
              {hi
                ? "यदि शहर डेटाबेस में नहीं है, तो निकटतम सत्यापित निर्देशांक से गणना होती है और कुंडली पर चिह्नित की जाती है।"
                : "If your city isn’t in our database, we use the nearest verified coordinates and flag this on your chart."}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "पाँच मौन सेटिंग्स (लॉक)"
              : "The five silent settings (locked)"}
          </h2>
          <p>
            {hi
              ? "एक ही जन्म डेटा पर प्लेटफ़ॉर्म असहमत क्यों होते हैं — हमारे डिफ़ॉल्ट, औचित्य और दस्तावेज़ी भाषा:"
              : "Why platforms disagree on identical birth data — our defaults, justification, and documentation:"}
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-ink">
                <tr>
                  <th className="px-3 py-2 font-semibold">
                    {hi ? "सेटिंग" : "Setting"}
                  </th>
                  <th className="px-3 py-2 font-semibold">
                    {hi ? "डिफ़ॉल्ट" : "Default"}
                  </th>
                  <th className="px-3 py-2 font-semibold">
                    {hi ? "औचित्य" : "Why"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {SILENT_SETTINGS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-white/10 align-top"
                  >
                    <td className="px-3 py-2 text-ink">
                      {hi ? row.setting.hi : row.setting.en}
                    </td>
                    <td className="px-3 py-2">
                      {hi ? row.currentDefault.hi : row.currentDefault.en}
                    </td>
                    <td className="px-3 py-2">
                      {hi ? row.justification.hi : row.justification.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "लाल किताब मॉड्यूल" : "Lal Kitab module"}
          </h2>
          <p>
            {hi
              ? "लाल किताब भाव वही पूर्ण-राशि D1 भाव उपयोग करते हैं; पक्का घर व ऋण नियम-तालिकाएँ हैं, दूसरा इफेमेरिस नहीं। रिपोर्ट में पक्का घर, Andha (शनि/राहु/केतु 6/8/12), पितृ/नारी/देव/मातृ ऋण स्क्रीन, और Tier-1 सांस्कृतिक उपाय — प्रत्येक basedOn प्लेसमेंट के साथ।"
              : "Lal Kitab houses use the same whole-sign D1 houses; Pakka Ghar and Rin are rule tables, not a second ephemeris. The report lists Pakka Ghar status, Andha (Saturn/Rahu/Ketu in 6/8/12), Pitri/Nari/Dev/Maatru Rin screens, and Tier-1 cultural remedies — each with basedOn placements."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "साढ़े साती ट्रैकर" : "Sade Sati tracker"}
          </h2>
          <p>
            {hi
              ? "साढ़े साती = जन्म चंद्र से 12वीं, समान या 2री राशि में शनि गोचर। चरण सीमा शनि सायन राशि-प्रवेश से (astronomy-engine + लाहिरी)। ढैया डिफ़ॉल्ट बंद। भय-% स्कोर नहीं — दशा के साथ पढ़ें।"
              : "Sade Sati = Saturn transiting the 12th, same, or 2nd sign from natal Moon. Phase windows use Saturn sidereal sign ingress (astronomy-engine + Lahiri). Dhaiya off by default. No fear-% scores — read with dasha context."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "वर्षफल (ताजिक)" : "Varshphal (Tajika)"}
          </h2>
          <p>
            {hi
              ? "वर्षफल = सूर्य वापसी (सायन सूर्य = जन्म सूर्य) + वर्ष लग्न + मुंथा + सरलीकृत वर्षेश्वर + सीमित सहाम। यह वार्षिक समय-परत है — जन्म कुंडली/विंशोत्तरी का विकल्प नहीं।"
              : "Varshphal = solar return (sidereal Sun = natal Sun) + Varsha Lagna + Muntha + simplified Varsheshwara + a small Saham set. An annual timing overlay — not a replacement for the birth chart or Vimshottari."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "प्रश्न कुंडली" : "Prashna Kundli"}
          </h2>
          <p>
            {hi
              ? "प्रश्न = पूछने के क्षण/स्थान की कुंडली (लाहिरी, पूर्ण-राशि लग्न)। विषय→भाव मानचित्र; कारक स्वामी के केन्द्र/त्रिकोण vs 6/8/12/अस्त/पाप युति से झुकाव/सावधानी/अपर्याप्त — basedOn सहित; %-संभावना नहीं। चिकित्सकीय/कानूनी फैसला नहीं।"
              : "Prashna = chart for the asking instant/place (Lahiri, whole-sign Lagna). Topic→house map; lean/caution/insufficient from topic lords in kendra/trikona vs 6/8/12/combust/malefic contact — each with basedOn; no %-odds. Not medical or legal verdicts."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "मुहूर्त (निर्वाचन)" : "Muhurta (electional)"}
          </h2>
          <p>
            {hi
              ? "मुहूर्त खोज = अधिकतम 14 दिन, दिन चौघड़िया खंड + पंचांग। कठोर: राहु काल, विष्टि। नरम/सहायक गतिविधि प्रोफ़ाइल। परिणाम पास / सावधानी / बचें — भाग्य-% नहीं। जन्म चंद्र 8वाँ फ़िल्टर वैकल्पिक (डिफ़ॉल्ट बंद)। एक-दिन चौघड़िया/होरा/राहु काल अलग रहते हैं।"
              : "Muhurta Finder = up to 14 days of daytime Choghadiya segments + Panchang. Hard: Rahu Kaal, Vishti. Soft/support via activity profiles. Results are pass / caution / avoid — no luck %. Natal Moon 8th filter optional (off by default). Single-day Choghadiya/Hora/Rahu Kaal tools remain separate."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "जन्म समय सुधार" : "Birth-time rectification"}
          </h2>
          <p>
            {hi
              ? "अनुमानित जन्म समय ± विंडो में विंशोत्तरी महा/अंतर स्वामियों का दिनांकित घटना भावों से मेल। विश्वसनीयता low/medium/high; स्कोर = घटना-मेल अनुपात (सही जन्म समय % नहीं)। लग्न-फ़्लिप सावधानी; कुंडली पर समय लागू करने से पहले उपयोगकर्ता पुष्टि। अनुमानित सहायता — प्रमाण-पत्र नहीं।"
              : "Sweeps approximate birth time ± window; scores Vimshottari maha/antar lords vs dated event houses. Confidence low/medium/high; score = event-match ratio (not “% true birth time”). Lagna-flip caution; user confirms before applying time to kundli. Heuristic aid — not certificate-grade proof."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "गणना बनाम व्याख्या बनाम विवादित"
              : "What's calculation vs. interpretation vs. contested"}
          </h2>
          <p>
            {hi
              ? "हम मानते हैं कि यह अंतर मायने रखता है, और अधिकांश प्लेटफ़ॉर्म इसे जानबूझकर धुंधला करते हैं। हम इसे ऐसे अलग करते हैं:"
              : "We think this distinction matters and most platforms blur it deliberately. Here's how we separate it:"}
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-ink">
                {hi
                  ? "गणना (खगोलीय रूप से सत्यापन योग्य):"
                  : "Calculation (astronomically verifiable):"}
              </strong>{" "}
              {hi
                ? "ग्रह स्थितियाँ, राशि स्थान, भाव सीमाएँ, नक्षत्र, दशा समयरेखा। ये इफेमेरिस डेटा और गणित से आते हैं — समान इनपुट वाले दो सही इंजन हमेशा सहमत होंगे।"
                : "Planetary positions, sign placements, house cusps, Nakshatra, dasha timeline. These come from ephemeris data and math — two correctly-built engines using the same inputs will always agree."}
            </li>
            <li>
              <strong className="text-ink">
                {hi
                  ? "पारंपरिक व्याख्या (पाठ-आधारित, सत्यापन योग्य नहीं):"
                  : "Traditional interpretation (textually grounded, not verifiable):"}
              </strong>{" "}
              {hi
                ? "किसी स्थिति का “अर्थ” — उदाहरण के लिए, सप्तम भाव में मंगल संबंधों में घर्षण से जुड़ा। यह शास्त्रीय ग्रंथों (बृहत्पाराशर होरा शास्त्र, सारावली आदि) और सदियों की व्याख्या परंपरा से आता है। यह खगोलीय रूप से सिद्ध नहीं है, पर गढ़ा भी नहीं — इसका दस्तावेज़ी वंश है, जिसे हम जहाँ संभव हो संदर्भित करते हैं।"
                : 'What a placement "means" — for example, that Mars in the 7th house relates to relationship friction. This comes from classical texts (Brihat Parashara Hora Shastra, Saravali, and others) and centuries of interpretive tradition. It\'s not astronomically provable, but it isn\'t invented either — it has a documented lineage, which we try to reference where relevant.'}
            </li>
            <li>
              <strong className="text-ink">
                {hi
                  ? "विवादित या संप्रदाय-विशिष्ट:"
                  : "Contested or school-specific:"}
              </strong>{" "}
              {hi
                ? "अलग परंपराएँ (पाराशरी बनाम जैमिनी, वैदिक बनाम केपी, वैदिक बनाम पश्चिमी) कभी-कभी एक ही कुंडली पर असहमत होती हैं। जहाँ ऐसा होता है, हम असहमति दिखाने का प्रयास करते हैं — चुपचाप एक संप्रदाय चुनकर उसे एकमात्र उत्तर के रूप में पेश करने के बजाय।"
                : "Different traditions (Parashari vs. Jaimini, Vedic vs. KP, Vedic vs. Western) sometimes disagree on the same chart. Where this happens, we try to show the disagreement rather than silently picking one school and presenting it as the only answer."}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "हमारा एआई गुरु कैसे काम करता है" : "How our AI Guru works"}
          </h2>
          <p>
            {hi
              ? "हमारा एआई ग्रह स्थितियाँ बनाता या गढ़ता नहीं — वह केवल उस कुंडली की व्याख्या करता है जिसकी गणना पहले ही हमारे इफेमेरिस इंजन ने की है। जब आप प्रश्न पूछते हैं, तो वह:"
              : "Our AI does not generate or invent planetary positions — it only interprets a chart that has already been calculated by our ephemeris engine. When you ask it a question, it:"}
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              {hi
                ? "आपका पहले से गणना चार्ट डेटा पढ़ता है (स्थान, भाव, वर्तमान दशा)"
                : "Reads your already-calculated chart data (placements, houses, current dasha)"}
            </li>
            <li>
              {hi
                ? "आपके प्रश्न के लिए प्रासंगिक पारंपरिक सिद्धांत संदर्भित करता है"
                : "References the relevant traditional principle for your question"}
            </li>
            <li>
              {hi
                ? "उस सिद्धांत को सरल भाषा में समझाता है, और बताता है कि उत्तर किस स्थिति पर आधारित है"
                : "Explains that principle in plain language, and tells you which placement it's basing the answer on"}
            </li>
          </ol>
          <p>
            {hi
              ? "यदि प्रश्न ऐसे निर्णय माँगता है जिन पर शास्त्रों में असहमति है, तो एआई एक व्याख्या को निश्चित बताने के बजाय यह कहता है। यह स्वास्थ्य निदान नहीं देता, वित्तीय या कानूनी सलाह नहीं देता, और झूठे विश्वास के साथ विशिष्ट घटनाएँ नहीं भविष्यवाणी करता — यहाँ ज्योतिष चिंतन के लिए पारंपरिक ढाँचा है, गारंटी नहीं।"
              : "If a question requires judgment calls that traditional texts disagree on, the AI says so instead of presenting one interpretation as definitive. It does not diagnose health conditions, give financial or legal advice, or predict specific life events with false certainty — astrology here is offered as a traditional framework for reflection, not a guarantee."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "ज्योतिषी सत्यापन" : "Astrologer verification"}
          </h2>
          <p>
            {hi
              ? "CosmicGPT पर ज्योतिषी सूचीबद्ध होने से पहले समीक्षा से गुजरते हैं — दस्तावेज़ी प्रशिक्षण या वंश और वर्षों के अभ्यास के आधार पर। हम प्रत्येक प्रोफ़ाइल पर सत्यापित अनुभव और विशेषज्ञता स्पष्ट दिखाते हैं, केवल अविश्वसनीय स्टार रेटिंग के बजाय।"
              : "Astrologers on CosmicGPT are reviewed before being listed, based on documented training or lineage, and years of practice. We show verified experience and specialization clearly on every profile rather than unverifiable star-only ratings."}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "डेटा गोपनीयता" : "Data privacy"}
          </h2>
          <p>
            {hi ? (
              <>
                आपके जन्म विवरण केवल कुंडली गणना हेतु उपयोग होते हैं और तीसरे पक्षों —
                रत्न या उपाय विक्रेताओं सहित — को नहीं बेचे जाते। आप{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  संपर्क
                </Link>{" "}
                से कभी भी जन्म डेटा हटाने का अनुरोध कर सकते हैं।
              </>
            ) : (
              <>
                Your birth details are used only to calculate your chart and are
                not sold to third parties, including remedy or gemstone sellers.
                You can request deletion of your birth data at any time via{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Contact
                </Link>
                .
              </>
            )}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "सीमाएँ, ईमानदारी से"
              : "Limitations, honestly stated"}
          </h2>
          <p>
            {hi
              ? "किसी भी परंपरा में ज्योतिष भौतिकी या चिकित्सा जैसी भविष्यवाणी विज्ञान नहीं है। दो योग्य ज्योतिषी एक ही कुंडली अलग पढ़ सकते हैं। हम उपकरण गणना-सटीक और व्याख्या सामग्री परंपरा-आधारित बनाते हैं — पर कुंडली से आप जो अर्थ लेते हैं वह अंततः चिंतन का ढाँचा है, निश्चित परिणाम नहीं। महत्वपूर्ण जीवन निर्णय पूर्ण जानकारी से लिए जाएँ, केवल कुंडली मार्गदर्शन से नहीं।"
              : "Astrology, in any tradition, is not a predictive science in the way physics or medicine is. Two competent astrologers can read the same chart differently. We build our tools to be as calculation-accurate as possible and our interpretation content to be traditionally grounded — but the meaning you take from your chart is ultimately a framework for reflection, not a fixed outcome. Important life decisions should be made with full information, not chart guidance alone."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "हमारी पद्धति पर प्रश्न"
              : "Questions about our methodology"}
          </h2>
          <p>
            {hi ? (
              <>
                यदि किसी विशिष्ट गणना के तरीके पर तकनीकी प्रश्न हो, तो{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  {siteConfig.email}
                </a>{" "}
                पर लिखें — हम विस्तार से समझाने को तैयार हैं।
              </>
            ) : (
              <>
                If you have a technical question about how a specific calculation
                was made, contact us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  {siteConfig.email}
                </a>{" "}
                — we&apos;re glad to explain further.
              </>
            )}
          </p>
          <dl className="space-y-3">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-white/10 bg-surface px-4 py-3"
              >
                <dt className="font-semibold text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14px]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="border-t border-white/10 pt-6 text-sm">
          <Link
            href="/kundli"
            className="font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "मुफ्त कुंडली →" : "Free kundli →"}
          </Link>
        </p>
        </div>
      </article>
    </div>
  );
}
