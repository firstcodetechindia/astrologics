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
  {
    q: {
      en: "Can I check numerology for a baby name before finalizing it?",
      hi: "क्या अंतिम नाम तय करने से पहले शिशु नाम की अंक ज्योतिष जाँच सकते हैं?",
    },
    a: {
      en: "Yes — enter the candidate name and the baby’s date of birth to see its Name Number and Bhagyank Vedic reading.",
      hi: "हाँ — उम्मीदवार नाम और शिशु की जन्म तिथि दर्ज करें; नाम अंक और भाग्यांक वैदिक रीडिंग दिखेगी।",
    },
  },
  {
    q: {
      en: "Is Chaldean or Pythagorean more accurate for Indian names?",
      hi: "भारतीय नामों हेतु कैल्डियन या पाइथागोरस अधिक सटीक है?",
    },
    a: {
      en: "Neither is objectively “more accurate” — they’re different traditions. Chaldean is more commonly used in Indian numerology practice; Pythagorean is more common in Western practice. We show both so you can compare rather than picking one silently.",
      hi: "कोई एक वस्तुनिष्ठ रूप से “अधिक सटीक” नहीं — अलग परंपराएँ हैं। भारत में कैल्डियन अधिक प्रचलित; पश्चिम में पाइथागोरस। हम दोनों दिखाते हैं ताकि चुपचाप एक चुनने के बजाय तुलना हो।",
    },
  },
  {
    q: {
      en: "Does changing my name change my numerology number?",
      hi: "क्या नाम बदलने से अंक ज्योतिष अंक बदलता है?",
    },
    a: {
      en: "Yes — a Name Number is recalculated from whatever spelling you enter, which is why numerologists sometimes recommend spelling adjustments (not full name changes) to shift a Name Number.",
      hi: "हाँ — नाम अंक आपके दर्ज वर्तनी से पुनः गणना होता है; इसलिए कभी-कभी पूर्ण नाम बदलने की जगह वर्तनी समायोजन सुझाया जाता है।",
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
      ? "अंक ज्योतिष कैलकुलेटर — मूलांक, भाग्यांक व नाम अंक"
      : "Numerology Calculator — Mulank, Bhagyank & Name Number",
    description: hi
      ? "मुफ़्त अंक ज्योतिष कैलकुलेटर — कैल्डियन, पाइथागोरस, वैदिक मूलांक/भाग्यांक व लो शू ग्रिड — हर प्रणाली स्पष्ट लेबल, बिना मिलावट।"
      : "Free numerology calculator with Chaldean, Pythagorean, Vedic Mulank/Bhagyank and Lo Shu Grid — every system clearly labelled, no mixing.",
    keywords: hi
      ? [
          "अंक ज्योतिष कैलकुलेटर",
          "मूलांक भाग्यांक कैलकुलेटर",
          "नाम अंक कैलकुलेटर",
          "कैल्डियन अंक ज्योतिष",
          "शिशु नाम अंक ज्योतिष",
          "बिज़नेस नाम अंक",
          "लो शू ग्रिड",
        ]
      : [
          "numerology calculator",
          "free numerology calculator online",
          "name numerology calculator",
          "life path number calculator",
          "Chaldean numerology calculator",
          "Pythagorean name number",
          "baby name numerology",
          "business name numerology",
          "numerology compatibility by name",
          "lucky mobile number numerology",
          "Mulank Bhagyank calculator",
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
    <div className="bg-cosmic-navy">
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
            ? "मूलांक, भाग्यांक, नाम अंक और लो शू ग्रिड — सिस्टम स्पष्ट लेबल।"
            : "Mulank, Bhagyank, name numbers and Lo Shu grid — systems clearly labelled.",
          url,
        })}
      />

      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "अंक ज्योतिष कैलकुलेटर" : "Numerology Calculator"}
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

      <div className="container-page py-10 sm:py-12">
        <div className="space-y-12">
        {/* AEO direct-answer */}
        <p className="rounded-2xl border border-saffron/15 bg-surface px-5 py-4 text-[15px] leading-relaxed text-ink">
          {hi ? (
            <>
              CosmicGPT का मुफ़्त अंक ज्योतिष कैलकुलेटर वैदिक मूलांक/भाग्यांक,
              कैल्डियन व पाइथागोरस नाम अंक, और लो शू ग्रिड एक ही स्थान पर
              गणना करता है — प्रत्येक प्रणाली स्पष्ट रूप से लेबल होती है, मिलाई
              नहीं जाती। गणना तर्क{" "}
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
              CosmicGPT’s free numerology calculator computes Vedic Mulank and
              Bhagyank, Chaldean and Pythagorean name numbers, and a Lo Shu Grid
              in one place — every system clearly labelled, never mixed. The
              maths follows labelled traditional formulas; see our{" "}
              <Link
                href="/methodology"
                className="font-semibold text-saffron-deep hover:underline"
              >
                Methodology
              </Link>{" "}
              page for how CosmicGPT separates calculation from interpretation.
            </>
          )}
        </p>

        <NumerologyClient locale={locale} />

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "चार प्रणालियाँ, एक पृष्ठ" : "Four systems, one page"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "अधिकांश ऐप्स बिना बताए सारणियाँ मिला देते हैं। CosmicGPT गणना को सिस्टम के अनुसार अलग रखता है — ताकि आप जाँच सकें कि कौन-सा अंक किस पद्धति से आया।"
              : "Most apps silently mix letter tables. CosmicGPT keeps calculation labelled by system — so you can verify which number came from which method."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SYSTEMS.map((s) => (
              <article
                key={s.title.en}
                className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5"
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
            {hi
              ? "अंक 1–9 अर्थ (वैदिक ग्रह)"
              : "Numbers 1–9 meanings (Vedic planets)"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "प्रत्येक अंक का शासक ग्रह, स्वभाव, शुभ रंग/दिन और अनुकूल अंक — रिपोर्ट में दोबारा उपयोग होने वाला लुकअप।"
              : "Each number’s ruling planet, temperament, lucky colour/day and compatible numbers — a reusable lookup shared by the report."}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
            <table className="w-full min-w-[40rem] text-left text-[13px]">
              <thead className="border-b border-white/10 bg-deep-indigo/80 text-[11px] uppercase tracking-wider text-ink-muted">
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
                  <tr key={p.number} className="border-b border-white/10">
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
            {hi
              ? "लोग अपनी अंक ज्योतिष क्यों जाँचते हैं"
              : "Why people check their numerology"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi ? (
              <>
                अंक ज्योतिष केवल एक बार व्यक्तित्व पढ़ने के लिए नहीं है। लोग
                विशिष्ट निर्णयों हेतु लौटते हैं: माता-पिता जन्म प्रमाणपत्र से
                पहले शिशु नाम का सहायक अंक जाँचते हैं, उद्यमी पंजीकरण से पहले
                बिज़नेस नाम परखते हैं, जोड़े संबंध मील से पहले मूलांक/भाग्यांक
                अनुकूलता देखते हैं, और लोग नया मोबाइल या मकान नंबर बदलने से पहले
                जाँचते हैं। यदि आप सामान्य जिज्ञासा से अधिक किसी नाम या नंबर के
                निर्णय हेतु जाँच रहे हैं, तो हमारे{" "}
                <Link
                  href="/calculators/name-numerology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  नाम अंक उपकरण
                </Link>{" "}
                और{" "}
                <Link
                  href="/calculators/lo-shu-grid"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  लो शू कैलकुलेटर
                </Link>{" "}
                उसी प्रणालियों पर बने हैं — एक नाम या नंबर पर लागू।
              </>
            ) : (
              <>
                Numerology is used for more than a one-time personality reading.
                People come back to it for specific decisions: parents checking
                whether a shortlisted baby name carries a supportive number
                before registering a birth certificate, entrepreneurs testing a
                business name before filing for registration, couples comparing
                Mulank or Bhagyank compatibility before a relationship
                milestone, and people evaluating a new mobile number or house
                number before making a switch. If you&apos;re checking a name or
                number for a specific decision rather than general curiosity,
                our{" "}
                <Link
                  href="/calculators/name-numerology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Name Number tool
                </Link>{" "}
                and{" "}
                <Link
                  href="/calculators/lo-shu-grid"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Lo Shu calculator
                </Link>{" "}
                are built for that — same underlying systems as this page,
                applied to a single name or number rather than your birth
                details.
              </>
            )}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi
              ? "नामकरण हेतु अंक ज्योतिष — शिशु व व्यवसाय"
              : "Numerology for naming — babies & businesses"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "नाम का अंक अक्षरों को अंकों में बदलकर घटाव से आता है — ऊपर उपयोग कैल्डियन या पाइथागोरस तर्क, पर उम्मीदवार नाम पर। शिशु नाम हेतु लक्ष्य प्रायः ऐसा नाम अंक होता है जो बच्चे के भाग्यांक (जन्म तिथि) से अनुकूल हो। बिज़नेस नाम हेतु वही तर्क संस्थापक या कंपनी पंजीकरण-तिथि भाग्यांक के विरुद्ध लागू होता है। इस पृष्ठ का कैलकुलेटर दोनों के लिए काम करता है — प्रतिबद्ध होने से पहले कोई भी नाम दर्ज कर परखें।"
              : "A name’s numerology value comes from converting its letters to numbers and reducing them — the same Chaldean or Pythagorean logic used above, applied to a candidate name instead of your existing one. For a baby name, the goal is usually a Name Number that’s compatible with the child’s Bhagyank (from their date of birth). For a business name, the same logic applies against the founder’s or the company’s registration-date Bhagyank. This page’s calculator works for either — enter any name, not just your own, to test it before you commit."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "अंक ज्योतिष अनुकूलता" : "Numerology compatibility"}
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            {hi
              ? "दो मूलांक या भाग्यांक की तुलना — विवाह, व्यापार साझेदारी या मित्रता हेतु — वैदिक ज्योतिष में प्रयुक्त ग्रह-मित्रता तर्क का अनुसरण करती है (उदाहरण: सूर्य और चंद्र स्वाभाविक मित्र; सूर्य और शनि स्वाभाविक प्रतिद्वंद्वी)। उच्च अनुकूलता जोड़ी अच्छे संबंध की गारंटी नहीं देती, न ही निम्न जोड़ी खराब संबंध की — इसे अनेक संकेतों में से एक मानें, अंतिम फैसला नहीं।"
              : "Comparing two Mulank or Bhagyank numbers against each other — for marriage, business partnership, or friendship — follows the same planetary-friendship logic used across Vedic astrology (Sun and Moon are natural allies, for instance, while Sun and Saturn are natural rivals). A high-compatibility pairing doesn’t guarantee a good relationship any more than a low one guarantees a bad one — treat it as one data point among many, not a verdict."}
          </p>
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
          <p className="text-[14px] text-ink-muted">
            {hi ? (
              <>
                गणना बनाम व्याख्या कैसे अलग होते हैं —{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  हमारी पद्धति →
                </Link>
              </>
            ) : (
              <>
                How calculation vs interpretation stays separate —{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  our Methodology →
                </Link>
              </>
            )}
          </p>
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
              <Link
                href="/calculators/love-compatibility-num"
                className="text-saffron-deep hover:underline"
              >
                {hi ? "अंक अनुकूलता →" : "Numerology compatibility →"}
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
    </div>
  );
}
