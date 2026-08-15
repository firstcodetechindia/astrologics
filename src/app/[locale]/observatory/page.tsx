import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ObservatoryView } from "@/components/observatory/ObservatoryView";
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
      en: "Are these planet positions calculated or illustrated?",
      hi: "क्या ये ग्रह स्थितियाँ गणना हैं या चित्र?",
    },
    a: {
      en: "Calculated. The scene uses the same astronomy-engine library as CosmicTalks Kundli, queried for 3D ecliptic coordinates. It is not a decorative orrery with hardcoded orbits.",
      hi: "गणना। दृश्य उसी astronomy-engine लाइब्रेरी का उपयोग करता है जो कुंडली में है — 3D क्रांतिवृत्त निर्देशांक के लिए। यह हार्डकोडेड कक्षाओं वाला सजावटी मॉडल नहीं है।",
    },
  },
  {
    q: {
      en: "Why isn’t the scale 1:1?",
      hi: "पैमाना 1:1 क्यों नहीं है?",
    },
    a: {
      en: "At true scale the inner planets would sit on the Sun and outer orbits would leave the screen. Distances are compressed with a logarithmic artistic scale; angles (ecliptic longitude and latitude) stay real.",
      hi: "वास्तविक पैमाने पर भीतरी ग्रह सूर्य पर चिपक जाते और बाहरी कक्षाएँ स्क्रीन से बाहर चली जातीं। दूरियाँ लघुगणकीय कलात्मक पैमाने से संकुचित हैं; कोण (क्रांतिवृत्त देशांतर-अक्षांश) वास्तविक रहते हैं।",
    },
  },
  {
    q: {
      en: "What is the difference between Sun-centered and Earth-centered?",
      hi: "सूर्य-केंद्र और पृथ्वी-केंद्र में क्या अंतर है?",
    },
    a: {
      en: "Sun-centered (heliocentric) is the true solar-system layout. Earth-centered (geocentric) matches how a natal chart is computed — planets as seen from Earth. Toggle both for the same date and time.",
      hi: "सूर्य-केंद्र वास्तविक सौर मंडल है। पृथ्वी-केंद्र जन्म कुंडली जैसी दृष्टि है — पृथ्वी से दिखते ग्रह। एक ही तिथि-समय पर दोनों टॉगल करें।",
    },
  },
  {
    q: {
      en: "Are Uranus and Neptune Vedic grahas?",
      hi: "क्या अरुण और वरुण वैदिक ग्रह हैं?",
    },
    a: {
      en: "No. Classical Jyotish uses nine grahas (Sun through Saturn plus Rahu and Ketu). Uranus and Neptune are optional astronomy-only bodies, off by default and visually distinct.",
      hi: "नहीं। शास्त्रीय ज्योतिष नौ ग्रह उपयोग करता है (सूर्य से शनि तथा राहु-केतु)। अरुण-वरुण वैकल्पिक खगोलीय पिंड हैं, डिफ़ॉल्ट रूप से बंद, और दृश्य रूप से अलग।",
    },
  },
    {
      q: {
        en: "Do the planets actually move?",
        hi: "क्या ग्रह सच में चलते हैं?",
      },
      a: {
        en: "Yes, automatically. The scene starts at the live instant and keeps advancing — a gentle ambient drift so Mercury, Venus and the Moon visibly creep within about 10–20 seconds of watching, with faint orbit trails. There is no play button. Jump to now returns to the real current instant. Pick a birth date and the same drift continues from there.",
        hi: "हाँ, अपने आप। दृश्य वर्तमान क्षण से शुरू होता है और चलता रहता है — हल्की सतत गति ताकि बुध, शुक्र और चंद्र 10–20 सेकंड में खिसकते दिखें, हल्की कक्षा-रेखाओं के साथ। चलाएँ बटन नहीं है। ‘अभी जाएँ’ वास्तविक वर्तमान क्षण पर लौटाता है। जन्म तिथि चुनें तो वही गति वहीं से जारी रहती है।",
      },
    },
  {
    q: {
      en: "How do I look at one planet?",
      hi: "एक ग्रह कैसे देखूँ?",
    },
    a: {
      en: "Tap a planet, its name, or a chip below the scene. The camera flies to it (close enough to read size and Saturn’s rings) and the knowledge panel opens with chart placement and astronomical facts. Full view pulls the camera back to the whole solar mandal.",
      hi: "ग्रह, उसका नाम, या नीचे चिप टैप करें। कैमरा पास उड़कर आता है (आकार और शनि के छल्ले दिखें) और ज्ञान पैनल खुलता है — कुंडली स्थान और खगोलीय तथ्य। ‘पूरा सौर मंडल’ कैमरा पूरे दृश्य पर लौटाता है।",
    },
  },
  {
    q: {
      en: "Is this a Kundli or a prediction?",
      hi: "क्या यह कुंडली या भविष्यवाणी है?",
    },
    a: {
      en: "Neither. This page shows where bodies are in space. It does not interpret houses, dasha, or yogas. For a birth chart use Kundli; method details are on Methodology.",
      hi: "कोई नहीं। यह पृष्ठ पिंडों की स्थिति दिखाता है। भाव, दशा या योग की व्याख्या नहीं करता। जन्म कुंडली के लिए कुंडली पृष्ठ देखें; विधि पद्धति पर है।",
    },
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/observatory",
    title: hi
      ? "लाइव 3D सौर मंडल — CosmicTalks ऑब्ज़र्वेटरी"
      : "Live 3D Solar System | CosmicTalks Observatory",
    description: hi
      ? "वास्तविक गणना से लाइव 3D ग्रह स्थिति देखें — सूर्य या पृथ्वी केंद्र, कोई भी तिथि। चित्र नहीं, इंजन आउटपुट।"
      : "Watch live 3D planet positions from CosmicTalks’ astronomy engine. Heliocentric or Earth-centered, any date — calculated, not illustrated.",
    keywords: hi
      ? [
          "लाइव 3D सौर मंडल",
          "ग्रह स्थिति अभी",
          "हेलियोसेंट्रिक",
          "जियोसेंट्रिक सौर मंडल",
          "लाइव सौर मंडल",
          "3D ऑरेरी",
          "जन्म के समय आकाश",
        ]
      : [
          "live 3D solar system",
          "planet positions now",
          "interactive orrery",
          "heliocentric vs geocentric",
          "live solar system",
          "3D solar system vedic",
          "what did the sky look like when I was born",
          "real-time planet positions",
        ],
  });
}

export default async function ObservatoryPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const url = absoluteUrl(locale, "/observatory");
  const name = hi ? "कॉस्मिक ऑब्ज़र्वेटरी" : "Cosmic Observatory";
  const intro = hi
    ? "कॉस्मिक ऑब्ज़र्वेटरी वास्तविक गणना से सौर मंडल का 3D दृश्य है — वही astronomy-engine जो कुंडली ग्रह देशांतर निकालता है, यहाँ पूर्ण निर्देशांक के लिए।"
    : "Cosmic Observatory is a 3D solar-system view from real computed positions — the same astronomy-engine that produces Kundli longitudes, queried here for full coordinates.";

  const faqs = FAQS.map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <>
      <JsonLd
        data={softwareAppJsonLd({
          name,
          description: intro,
          url,
        })}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: hi ? "ऑब्ज़र्वेटरी" : "Observatory", path: "/observatory" },
        ])}
      />
      <div className="min-h-screen bg-cosmic-navy">
        <PageHero
          eyebrow={hi ? "खगोल दृश्य" : "Live sky"}
          title={hi ? "कॉस्मिक ऑब्ज़र्वेटरी" : "Cosmic Observatory"}
          description={intro}
          crumbs={[
            { label: hi ? "होम" : "Home", href: "/" },
            { label: hi ? "ऑब्ज़र्वेटरी" : "Observatory" },
          ]}
        />
        <div className="container-page py-6 sm:py-8">
          <ObservatoryView hi={hi} />

          <article className="mx-auto mt-10 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted">
            <h2 className="font-display text-xl font-bold text-ink">
              {hi
                ? "यह दृश्य क्या दिखाता है"
                : "What this view shows"}
            </h2>
            <p>
              {hi
                ? "कॉस्मिक ऑब्ज़र्वेटरी चुनी हुई तिथि और समय पर सूर्य, चंद्र और सात शास्त्रीय ग्रहों की वास्तविक स्थिति दिखाता है। डिफ़ॉल्ट अभी है; अतीत या भविष्य चुनकर देखें कि जन्म के क्षण आकाश कैसा था। स्थितियाँ astronomy-engine से आती हैं — वही लाइब्रेरी जो जन्म कुंडली के ग्रह देशांतर निकालती है। कुंडली पथ केवल क्रांतिवृत्त देशांतर रखता है; यह पृष्ठ अलग हेल्पर से दूरी और अक्षांश भी पढ़ता है। NASA Horizons यहाँ कॉल नहीं होता।"
                : "Cosmic Observatory places the Sun, Moon and seven classical planets at their real positions for a date and time you choose. The default is now; pick a past or future instant to see the sky as it was at birth. Positions come from astronomy-engine — the same library that produces sidereal longitudes on a janam kundali. The chart path stores ecliptic longitude only; this page reads distance and latitude through a separate helper. NASA Horizons is never called here."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "सूर्य-केंद्र बनाम पृथ्वी-केंद्र" : "Sun-centered vs Earth-centered"}
            </h2>
            <p>
              {hi
                ? "सूर्य-केंद्र (हेलियोसेंट्रिक) सौर मंडल का खगोलीय लेआउट है — ग्रह सूर्य की परिक्रमा करते दिखते हैं। पृथ्वी-केंद्र (जियोसेंट्रिक) वही ज्यामिति है जिससे वैदिक कुंडली बनती है: ग्रह पृथ्वी से देखे जाते हैं, चंद्र निकट, सूर्य लगभग एक खगोलीय इकाई दूर। दोनों एक ही क्षण के हैं। पद्धति पृष्ठ गणना को व्याख्या से अलग रखता है; यह दृश्य केवल गणना है।"
                : "Sun-centered (heliocentric) is the astronomical layout of the solar system — planets orbit the Sun. Earth-centered (geocentric) is the geometry a Vedic chart uses: bodies as seen from Earth, Moon nearby, Sun about one astronomical unit away. Both frames share the same instant. The Methodology page separates calculation from interpretation; this view is calculation only."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "लघुगणकीय पैमाना क्यों" : "Why the scale is logarithmic"}
            </h2>
            <p>
              {hi
                ? "नेपच्यून सूर्य से लगभग 30 खगोलीय इकाई दूर है, बुध लगभग 0.4। 1:1 पर भीतरी ग्रह गायब हो जाते। हम दूरी को लघुगणकीय कलात्मक पैमाने पर रखते हैं ताकि कक्षाएँ एक स्क्रीन पर दिखें, जबकि कोण वास्तविक रहें। यह दूरबीन-शैली का दृश्य है, न कि मिशन-प्लानिंग मॉडल।"
                : "Neptune sits near 30 astronomical units from the Sun; Mercury near 0.4. At 1:1 the inner planets vanish. Distances are compressed on a logarithmic artistic scale so orbits fit one screen while angles stay real. This is a telescope-style view, not a mission-planning model."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "आकाश अपने आप चलता है" : "The sky keeps moving"}
            </h2>
            <p>
              {hi
                ? "डिफ़ॉल्ट अभी है, और दृश्य रुकता नहीं — हल्की सतत गति से भीतरी ग्रह कुछ सेकंड में खिसकते दिखते हैं, कक्षा-रेखाओं के साथ। कोई चलाएँ या गति बटन नहीं। तिथि चुनकर जन्म के आकाश से वही गति जारी रहती है। ‘अभी जाएँ’ वास्तविक वर्तमान क्षण पर लौटाता है। स्थितियाँ प्रत्येक फ्रेम पर उसी ऑब्ज़र्वेटरी हेल्पर से आती हैं।"
                : "The default is now, and the scene never pauses — a gentle continuous drift lets the inner planets creep within seconds, with faint orbit trails. There is no play or speed control. Pick a date to start from a birth sky; the same drift continues. Jump to now returns to the live instant. Positions are recomputed each frame from the same observatory helper."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "दूरबीन की तरह देखें" : "Look through it like a telescope"}
            </h2>
            <p>
              {hi
                ? "ग्रह टैप करें: कैमरा उसके पास उड़ता है और ज्ञान पैनल खुलता है — कुंडली स्थान और खगोलीय तथ्य, व्याख्या नहीं। ‘पूरा सौर मंडल’ पूरे दृश्य पर लौटाता है। सूर्य-केंद्र और पृथ्वी-केंद्र देखने के दो तरीके हैं, समय नियंत्रण नहीं।"
                : "Tap a planet: the camera flies to it and the knowledge panel opens — chart placement and astronomical facts, not interpretation. Full view returns to the whole mandal. Sun-centered and Earth-centered are ways of looking, not time controls."}
            </p>
            <h2 className="font-display text-xl font-bold text-ink">
              {hi ? "वैदिक ग्रह बनाम बाहरी ग्रह" : "Vedic grahas vs outer planets"}
            </h2>
            <p>
              {hi
                ? "शास्त्रीय ज्योतिष नौ ग्रह पढ़ता है: सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु। अरुण और वरुण वैदिक ग्रह नहीं हैं — टॉगल से खगोल के लिए चालू होते हैं, रंग से अलग। राहु-केतु कक्षा बिंदु हैं, पिंड नहीं; इस चरण में वे दृश्य में नहीं हैं। व्याख्या या एआई टिप्पणी यहाँ नहीं है — कुंडली और एआई गुरु उसके लिए हैं।"
                : "Classical Jyotish reads nine grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Uranus and Neptune are not Vedic grahas — they stay off until you toggle them, in cooler colours. Rahu and Ketu are orbital nodes, not bodies; they are not in this phase. There is no interpretive or AI commentary here — use Kundli and AI Guru for that."}
            </p>
            <p>
              {hi ? (
                <>
                  आगे:{" "}
                  <Link href="/kundli" className="text-cosmic-gold underline-offset-2 hover:underline">
                    जन्म कुंडली
                  </Link>
                  ,{" "}
                  <Link href="/panchang" className="text-cosmic-gold underline-offset-2 hover:underline">
                    आज का पंचांग
                  </Link>
                  ,{" "}
                  <Link href="/methodology" className="text-cosmic-gold underline-offset-2 hover:underline">
                    पद्धति
                  </Link>
                  ,{" "}
                  <Link href="/horoscope" className="text-cosmic-gold underline-offset-2 hover:underline">
                    राशिफल
                  </Link>
                  ,{" "}
                  <Link href="/learn/western" className="text-cosmic-gold underline-offset-2 hover:underline">
                    पश्चिमी ज्योतिष गाइड
                  </Link>
                  ।
                </>
              ) : (
                <>
                  Continue with a{" "}
                  <Link href="/kundli" className="text-cosmic-gold underline-offset-2 hover:underline">
                    birth kundli
                  </Link>
                  ,{" "}
                  <Link href="/panchang" className="text-cosmic-gold underline-offset-2 hover:underline">
                    today’s Panchang
                  </Link>
                  , the{" "}
                  <Link href="/methodology" className="text-cosmic-gold underline-offset-2 hover:underline">
                    Methodology
                  </Link>{" "}
                  page,{" "}
                  <Link href="/horoscope" className="text-cosmic-gold underline-offset-2 hover:underline">
                    horoscope
                  </Link>
                  , or the{" "}
                  <Link href="/learn/western" className="text-cosmic-gold underline-offset-2 hover:underline">
                    Western astrology guide
                  </Link>
                  .
                </>
              )}
            </p>
            <div className="space-y-3 pt-4">
              <h2 className="font-display text-xl font-bold text-ink">
                {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
              </h2>
              {FAQS.map((f) => (
                <div key={f.q.en}>
                  <h3 className="font-semibold text-ink">{hi ? f.q.hi : f.q.en}</h3>
                  <p className="mt-1">{hi ? f.a.hi : f.a.en}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
