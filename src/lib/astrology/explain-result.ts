/** Bilingual explained-result layer for calculator outputs. */

export type Loc = { en: string; hi: string };

export type ExplainedHighlight = {
  label: Loc;
  value: string | Loc;
  note?: Loc;
};

export type ExplainedSection = {
  title: Loc;
  body?: Loc;
  bullets?: Loc[];
};

export type ExplainedResult = {
  kind: "explained";
  slug: string;
  hero: {
    icon?: string;
    title: Loc;
    badge?: Loc;
    badgeTone?: "good" | "warn" | "neutral" | "alert";
    summary: Loc;
  };
  highlights: ExplainedHighlight[];
  sections: ExplainedSection[];
  tips?: Loc[];
  nextStep?: Loc;
};

function L(en: string, hi: string): Loc {
  return { en, hi };
}

function asLoc(v: unknown): Loc | null {
  if (v && typeof v === "object" && ("en" in v || "hi" in v)) {
    const o = v as { en?: string; hi?: string };
    return { en: o.en || o.hi || "", hi: o.hi || o.en || "" };
  }
  return null;
}

function str(v: unknown): string {
  if (v == null) return "—";
  const loc = asLoc(v);
  if (loc) return loc.en;
  if (typeof v === "number") return String(Math.round(v * 100) / 100);
  return String(v);
}

function signTraits(signIndex: number): Loc {
  const traits: Loc[] = [
    L("Initiative, courage, pioneering drive.", "पहल, साहस, अग्रणी ऊर्जा।"),
    L("Steady values, comfort, persistence.", "स्थिर मूल्य, आराम, दृढ़ता।"),
    L("Curiosity, communication, versatility.", "जिज्ञासा, संवाद, बहुमुखी प्रतिभा।"),
    L("Care, intuition, emotional memory.", "देखभाल, अंतर्ज्ञान, भावनात्मक स्मृति।"),
    L("Confidence, creativity, leadership warmth.", "आत्मविश्वास, रचनात्मकता, नेतृत्व।"),
    L("Analysis, service, practical skill.", "विश्लेषण, सेवा, व्यावहारिक कौशल।"),
    L("Balance, partnership, aesthetic sense.", "संतुलन, साझेदारी, सौंदर्य बोध।"),
    L("Depth, focus, transformative will.", "गहराई, फोकस, परिवर्तनशील इच्छा।"),
    L("Vision, belief, expansive growth.", "दृष्टि, विश्वास, विस्तार।"),
    L("Discipline, ambition, long climb.", "अनुशासन, महत्वाकांक्षा, लंबी चढ़ाई।"),
    L("Innovation, networks, reform mind.", "नवाचार, नेटवर्क, सुधार सोच।"),
    L("Compassion, imagination, subtle sensitivity.", "करुणा, कल्पना, सूक्ष्म संवेदनशीलता।"),
  ];
  return traits[signIndex] || L("See full kundli for nuance.", "बारीकी हेतु पूर्ण कुंडली देखें।");
}

export function explainCalculatorResult(
  slug: string,
  raw: Record<string, unknown>
): ExplainedResult | null {
  // Already explained / special UIs
  if (raw.kind === "lo-shu" || slug === "lo-shu-grid") return null;
  if (slug === "love-calculator") return null;

  switch (slug) {
    case "moon-sign": {
      const moon = raw.moonRashi as { en?: string; hi?: string; signIndex?: number };
      const nak = raw.nakshatra as {
        name?: Loc;
        pada?: number;
        lord?: Loc;
      };
      const si = moon?.signIndex ?? 0;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🌙",
          title: L(
            `Your Moon sign is ${moon?.en || "—"}`,
            `आपकी चंद्र राशि ${moon?.hi || moon?.en || "—"} है`
          ),
          badge: L("Rashi (Mind & emotions)", "राशि (मन व भाव)"),
          badgeTone: "good",
          summary: L(
            "In Vedic astrology the Moon sign (Rashi) describes your emotional nature, comfort needs and day-to-day mind — often felt more personally than the Sun sign.",
            "वैदिक ज्योतिष में चंद्र राशि भावनात्मक स्वभाव, आराम की ज़रूरत और दैनिक मन बताती है — अक्सर सूर्य राशि से अधिक व्यक्तिगत।"
          ),
        },
        highlights: [
          {
            label: L("Moon sign", "चंद्र राशि"),
            value: asLoc(moon) || str(moon?.en),
          },
          {
            label: L("Birth star", "जन्म नक्षत्र"),
            value: asLoc(nak?.name) || "—",
            note: nak?.pada
              ? L(`Pada (quarter) ${nak.pada}`, `पद ${nak.pada}`)
              : undefined,
          },
          {
            label: L("Star lord", "नक्षत्र स्वामी"),
            value: asLoc(nak?.lord) || "—",
          },
        ],
        sections: [
          {
            title: L("What this means for you", "आपके लिए इसका अर्थ"),
            body: signTraits(si),
            bullets: [
              L(
                "Use Rashi for emotional timing, remedies mood, and matching context with Moon nakshatra.",
                "भाव समय, उपचार मनोदशा और मिलान संदर्भ हेतु राशि व चंद्र नक्षत्र देखें।"
              ),
              L(
                "For career and outer personality, also check Lagna and Sun.",
                "करियर व बाहरी व्यक्तित्व हेतु लग्न और सूर्य भी देखें।"
              ),
            ],
          },
        ],
        tips: [
          L(
            "Open the Nakshatra and Lagna calculators for a fuller identity picture.",
            "पूर्ण पहचान हेतु नक्षत्र और लग्न कैलकुलेटर भी खोलें।"
          ),
        ],
        nextStep: L(
          "Generate a full kundli for houses, dasha and yogas.",
          "भाव, दशा और योग हेतु पूर्ण कुंडली बनाएँ।"
        ),
      };
    }

    case "sun-sign": {
      const vedic = raw.vedic as { en?: string; hi?: string; signIndex?: number };
      const western = raw.westernApprox as { en?: string; hi?: string };
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "☀️",
          title: L(
            `Vedic Sun: ${vedic?.en || "—"}`,
            `वैदिक सूर्य: ${vedic?.hi || vedic?.en || "—"}`
          ),
          badge: L("Soul purpose theme", "आत्मा उद्देश्य भाव"),
          badgeTone: "good",
          summary: L(
            "Vedic Sun uses the sidereal zodiac (Lahiri). Western Sun signs use a tropical frame — both can differ by about one sign. For Jyotish decisions, trust the Vedic Sun.",
            "वैदिक सूर्य नक्षत्र-आधारित राशि (लाहिरी) पर है। पश्चिमी सूर्य मौसमी ढाँचे पर — अक्सर एक राशि का अंतर। ज्योतिष निर्णयों में वैदिक सूर्य मानें।"
          ),
        },
        highlights: [
          { label: L("Vedic Sun", "वैदिक सूर्य"), value: asLoc(vedic) || "—" },
          {
            label: L("Western (approx.)", "पश्चिमी (सन्निकट)"),
            value: asLoc(western) || "—",
          },
          {
            label: L("Ayanamsa", "अयनांश"),
            value: `${Number(raw.ayanamsa || 0).toFixed(2)}°`,
          },
        ],
        sections: [
          {
            title: L("How to use this", "कैसे उपयोग करें"),
            bullets: [
              L(
                "Vedic Sun shows vitality, authority and father/soul themes in the chart.",
                "वैदिक सूर्य ऊर्जा, अधिकार और पिता/आत्मा विषयों को दर्शाता है।"
              ),
              L(
                "If apps disagree, check whether they use Lahiri or tropical settings.",
                "ऐप्स में अंतर हो तो लाहिरी या ट्रॉपिकल सेटिंग जाँचें।"
              ),
            ],
          },
        ],
        tips: [
          L(
            "Compare with Moon sign — mind vs will often tell different stories.",
            "चंद्र राशि से तुलना करें — मन और इच्छा अलग कहानियाँ बता सकते हैं।"
          ),
        ],
      };
    }

    case "nakshatra": {
      const nak = raw.nakshatra as {
        name?: Loc;
        pada?: number;
        lord?: Loc;
        index?: number;
      };
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "✨",
          title: L(
            `Birth star: ${asLoc(nak?.name)?.en || "—"}`,
            `जन्म नक्षत्र: ${asLoc(nak?.name)?.hi || asLoc(nak?.name)?.en || "—"}`
          ),
          badge: nak?.pada
            ? L(`Pada ${nak.pada} of 4`, `पद ${nak.pada} / 4`)
            : L("Lunar mansion", "चंद्र नक्षत्र"),
          badgeTone: "good",
          summary: L(
            "Nakshatra is the Moon’s finer address — more specific than Rashi alone. It guides naming syllables, dasha start, and temperament colour.",
            "नक्षत्र चंद्र का सूक्ष्म पता है — अकेले राशि से अधिक विशिष्ट। नाम अक्षर, दशा आरंभ और स्वभाव रंग इससे जुड़ते हैं।"
          ),
        },
        highlights: [
          { label: L("Nakshatra", "नक्षत्र"), value: asLoc(nak?.name) || "—" },
          {
            label: L("Pada", "पद"),
            value: String(nak?.pada ?? "—"),
          },
          { label: L("Lord", "स्वामी"), value: asLoc(nak?.lord) || "—" },
          {
            label: L("Moon sign", "चंद्र राशि"),
            value: asLoc(raw.moonRashi) || "—",
          },
        ],
        sections: [
          {
            title: L("Why pada matters", "पद क्यों ज़रूरी है"),
            body: L(
              "Each nakshatra has four padas. Pada shifts the Navamsa flavour and the starting letter group used in baby naming.",
              "प्रत्येक नक्षत्र के चार पद होते हैं। पद नवमांश रंग और शिशु नाम के आरंभ अक्षर समूह को बदलता है।"
            ),
          },
        ],
        tips: [
          L(
            "Open Baby Name Letters and Vimshottari Dasha next.",
            "अगले चरण: शिशु नाम अक्षर और विंशोत्तरी दशा।"
          ),
        ],
      };
    }

    case "lagna": {
      const lagna = raw.lagna as {
        sign?: Loc;
        degree?: number;
        signIndex?: number;
      };
      const si = lagna?.signIndex ?? 0;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🌅",
          title: L(
            `Lagna: ${asLoc(lagna?.sign)?.en || "—"}`,
            `लग्न: ${asLoc(lagna?.sign)?.hi || asLoc(lagna?.sign)?.en || "—"}`
          ),
          badge: L("Rising sign — your chart’s front door", "लग्न — कुंडली का मुख्य द्वार"),
          badgeTone: "good",
          summary: L(
            "Lagna is the sign rising at birth. It sets house lords and how the world meets you. Exact birth time is essential — Lagna can change in about two hours.",
            "लग्न जन्म पर उदय राशि है। इससे भाव स्वामी और बाहरी व्यक्तित्व तय होते हैं। सटीक समय ज़रूरी — लग्न लगभग दो घंटे में बदल सकता है।"
          ),
        },
        highlights: [
          { label: L("Lagna", "लग्न"), value: asLoc(lagna?.sign) || "—" },
          {
            label: L("Degree in sign", "राशि में अंश"),
            value: lagna?.degree != null ? `${Number(lagna.degree).toFixed(2)}°` : "—",
          },
          {
            label: L("Ayanamsa", "अयनांश"),
            value: `${Number(raw.ayanamsa || 0).toFixed(2)}°`,
          },
        ],
        sections: [
          {
            title: L("Personality flavour", "व्यक्तित्व रंग"),
            body: signTraits(si),
          },
          {
            title: L("Important", "ज़रूरी"),
            bullets: [
              L(
                "If birth time is uncertain, confirm with an astrologer before major decisions.",
                "जन्म समय अनिश्चित हो तो बड़े निर्णय से पहले ज्योतिषी से पुष्टि करें।"
              ),
            ],
          },
        ],
        nextStep: L(
          "Generate full kundli to see all twelve houses from this Lagna.",
          "इस लग्न से बारह भाव देखने हेतु पूर्ण कुंडली बनाएँ।"
        ),
      };
    }

    case "vimshottari-dasha": {
      const dasha = raw.dasha as {
        currentMaha?: { planet?: Loc; start?: string; end?: string };
        currentAntar?: { planet?: Loc; start?: string; end?: string };
        mahaList?: { planet?: Loc; start?: string; end?: string; isCurrent?: boolean }[];
      };
      const maha = dasha?.currentMaha;
      const antar = dasha?.currentAntar;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "⏳",
          title: L(
            `Current Mahadasha: ${asLoc(maha?.planet)?.en || "—"}`,
            `वर्तमान महादशा: ${asLoc(maha?.planet)?.hi || asLoc(maha?.planet)?.en || "—"}`
          ),
          badge: L("Life-period clock", "जीवन काल घड़ी"),
          badgeTone: "neutral",
          summary: L(
            "Vimshottari dasha times life chapters from the Moon nakshatra at birth. Mahadasha is the long chapter; Antardasha is the current sub-chapter colouring events.",
            "विंशोत्तरी दशा जन्म चंद्र नक्षत्र से जीवन अध्याय समयबद्ध करती है। महादशा लंबा अध्याय; अंतर्दशा वर्तमान उप-अध्याय का रंग।"
          ),
        },
        highlights: [
          {
            label: L("Mahadasha", "महादशा"),
            value: asLoc(maha?.planet) || "—",
            note:
              maha?.start && maha?.end
                ? L(`${maha.start.slice(0, 10)} → ${maha.end.slice(0, 10)}`, `${maha.start.slice(0, 10)} → ${maha.end.slice(0, 10)}`)
                : undefined,
          },
          {
            label: L("Antardasha", "अंतर्दशा"),
            value: asLoc(antar?.planet) || "—",
            note:
              antar?.start && antar?.end
                ? L(`${antar.start.slice(0, 10)} → ${antar.end.slice(0, 10)}`, `${antar.start.slice(0, 10)} → ${antar.end.slice(0, 10)}`)
                : undefined,
          },
          {
            label: L("Birth star", "जन्म नक्षत्र"),
            value: asLoc((raw.nakshatra as { name?: Loc })?.name) || "—",
          },
        ],
        sections: [
          {
            title: L("How to read this", "इसे कैसे पढ़ें"),
            bullets: [
              L(
                "Results depend on correct birth time mainly via Moon — still verify for precision.",
                "परिणाम मुख्यतः चंद्र पर निर्भर — फिर भी सटीकता हेतु समय जाँचें।"
              ),
              L(
                "Do not fear a dasha name alone; house ownership and transits matter.",
                "केवल दशा नाम से भय न करें; भाव स्वामित्व और गोचर मायने रखते हैं।"
              ),
            ],
          },
          ...(Array.isArray(dasha?.mahaList)
            ? [
                {
                  title: L("Mahadasha timeline", "महादशा समयरेखा"),
                  bullets: dasha!.mahaList!.slice(0, 9).map((p) =>
                    L(
                      `${asLoc(p.planet)?.en || "—"}: ${(p.start || "").slice(0, 10)} → ${(p.end || "").slice(0, 10)}${p.isCurrent ? " (now)" : ""}`,
                      `${asLoc(p.planet)?.hi || asLoc(p.planet)?.en || "—"}: ${(p.start || "").slice(0, 10)} → ${(p.end || "").slice(0, 10)}${p.isCurrent ? " (अभी)" : ""}`
                    )
                  ),
                },
              ]
            : []),
        ],
        nextStep: L(
          "For career or marriage timing, book a WhatsApp reading with full chart context.",
          "करियर या विवाह समय हेतु पूर्ण कुंडली संदर्भ के साथ व्हाट्सऐप परामर्श लें।"
        ),
      };
    }

    case "mangal-dosha": {
      const present = Boolean(raw.present);
      const level = String(raw.level || "none");
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "♂️",
          title: present
            ? L("Manglik indication present", "मंगलिक संकेत मौजूद")
            : L("No classic Manglik pattern", "शास्त्रीय मंगलिक पैटर्न नहीं"),
          badge:
            level === "strong"
              ? L("Needs careful review", "सावधानी से जाँचें")
              : level === "moderate"
                ? L("Moderate check", "मध्यम जाँच")
                : L("Clear on this test", "इस जाँच में स्पष्ट"),
          badgeTone: present ? (level === "strong" ? "alert" : "warn") : "good",
          summary: asLoc(raw.meaning) || L("", ""),
        },
        highlights: [
          {
            label: L("Mars house", "मंगल भाव"),
            value: String(raw.house ?? "—"),
          },
          { label: L("Mars sign", "मंगल राशि"), value: asLoc(raw.sign) || "—" },
          {
            label: L("Status", "स्थिति"),
            value: present
              ? L("Flagged for review", "समीक्षा हेतु चिह्नित")
              : L("Not in classic houses", "शास्त्रीय भावों में नहीं"),
          },
        ],
        sections: [
          {
            title: L("What Mangal dosha means", "मंगल दोष का अर्थ"),
            body: L(
              "Classical texts check Mars in houses 1, 2, 4, 7, 8 or 12 for marriage friction themes. Many charts have cancellations — a flag is not a final verdict.",
              "शास्त्र मंगल को 1, 2, 4, 7, 8 या 12 भाव में विवाह घर्षण हेतु जाँचते हैं। कई कुंडलियों में निवारण योग होते हैं — संकेत अंतिम फैसला नहीं।"
            ),
            bullets: Array.isArray(raw.exceptions)
              ? (raw.exceptions as Loc[])
              : [
                  L(
                    "Compare both partners’ charts and Navamsa before concluding.",
                    "निष्कर्ष से पहले दोनों कुंडली और नवमांश की तुलना करें।"
                  ),
                ],
          },
        ],
        tips: [
          L(
            "Run Kundli Matching and ask an expert about cancellations.",
            "कुंडली मिलान चलाएँ और निवारण योग विशेषज्ञ से पूछें।"
          ),
        ],
      };
    }

    case "kaal-sarp-dosha": {
      const present = Boolean(raw.present);
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🐍",
          title: present
            ? L("Kaal Sarp pattern detected", "काल सर्प पैटर्न मिला")
            : L("No full Kaal Sarp pattern", "पूर्ण काल सर्प पैटर्न नहीं"),
          badge: present
            ? L("All planets on one side of Rahu–Ketu", "राहु–केतु के एक ओर सभी ग्रह")
            : L("Planets are distributed", "ग्रह बिखरे हुए"),
          badgeTone: present ? "warn" : "good",
          summary: asLoc(raw.meaning) || L("", ""),
        },
        highlights: [
          { label: L("Rahu sign", "राहु राशि"), value: asLoc(raw.rahuSign) || "—" },
          { label: L("Ketu sign", "केतु राशि"), value: asLoc(raw.ketuSign) || "—" },
          {
            label: L("Type", "प्रकार"),
            value: asLoc(raw.type) || L("Not applicable", "लागू नहीं"),
          },
        ],
        sections: [
          {
            title: L("How to understand this", "इसे कैसे समझें"),
            bullets: [
              L(
                "Kaal Sarp is a popular modern label for Rahu–Ketu axis hemming. Intensity varies by house axis and dasha.",
                "काल सर्प राहु–केतु अक्ष का लोकप्रिय आधुनिक लेबल है। तीव्रता भाव अक्ष और दशा पर निर्भर।"
              ),
              L(
                "It does not mean life is blocked — use it as a focus theme, not fear.",
                "इसका अर्थ जीवन अवरुद्ध नहीं — भय नहीं, फोकस विषय मानें।"
              ),
            ],
          },
        ],
        nextStep: L(
          "Discuss remedies only after a full chart reading.",
          "उपचार केवल पूर्ण कुंडली पढ़ाई के बाद चर्चा करें।"
        ),
      };
    }

    case "sade-sati": {
      const active = Boolean(raw.active);
      const phase = String(raw.phase || "none");
      const cycle = Array.isArray(raw.fullCycle)
        ? (raw.fullCycle as {
            phase: number;
            start: string;
            end: string;
            label?: Loc;
          }[])
        : [];
      const window = raw.currentWindow as
        | { start?: string; end?: string }
        | null
        | undefined;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🪐",
          title: active
            ? L("Sade Sati is active now", "साढ़े साती अभी सक्रिय")
            : L("Not in Sade Sati right now", "अभी साढ़े साती नहीं"),
          badge: asLoc(raw.phaseLabel) || L("Saturn transit check", "शनि गोचर जाँच"),
          badgeTone: active ? (phase === "peak" ? "alert" : "warn") : "good",
          summary: L(
            "Sade Sati is Saturn’s transit over the 12th, 1st and 2nd signs from your Moon. It is a maturity cycle — challenging, but also structuring.",
            "साढ़े साती चंद्र से 12वें, 1रे और 2रे राशि पर शनि गोचर है। यह परिपक्वता चक्र है — चुनौतीपूर्ण, पर संरचना भी देता है।"
          ),
        },
        highlights: [
          {
            label: L("Your Moon sign", "आपकी चंद्र राशि"),
            value: asLoc(raw.moonSign) || "—",
          },
          {
            label: L("Saturn now", "शनि अभी"),
            value: asLoc(raw.saturnSign) || "—",
          },
          {
            label: L("Phase", "चरण"),
            value: asLoc(raw.phaseLabel) || "—",
          },
          ...(window?.start
            ? [
                {
                  label: L("Current window", "वर्तमान अवधि"),
                  value: `${window.start} → ${window.end || "—"}`,
                },
              ]
            : []),
        ],
        sections: [
          {
            title: L("Phase guide", "चरण गाइड"),
            bullets: [
              L("Rising (12th from Moon): preparation, endings, inner work.", "आरंभ (चंद्र से 12वाँ): तैयारी, समापन, आंतरिक कार्य।"),
              L("Peak (on Moon): visibility of lessons; patience pays.", "मध्य (चंद्र पर): पाठ स्पष्ट; धैर्य फल देता है।"),
              L("Setting (2nd from Moon): rebuilding stability and resources.", "अंतिम (चंद्र से 2रा): स्थिरता व संसाधन पुनर्निर्माण।"),
            ],
          },
          ...(cycle.length
            ? [
                {
                  title: L("Cycle timeline", "चक्र समयरेखा"),
                  bullets: cycle.map((c) =>
                    L(
                      `Phase ${c.phase}: ${c.start} → ${c.end}`,
                      `चरण ${c.phase}: ${c.start} → ${c.end}`
                    )
                  ),
                },
              ]
            : []),
        ],
        tips: [
          asLoc(raw.intensityHint) ||
            L(
              "Support with discipline, health routine and ethical work — avoid fear content.",
              "अनुशासन, स्वास्थ्य दिनचर्या और नैतिक कर्म से सहारा लें — भय सामग्री से बचें।"
            ),
          asLoc(raw.disclaimer) ||
            L(
              "Results vary with dasha — not destiny. Confirm with an astrologer for life decisions.",
              "परिणाम दशा से बदलते हैं — नियति नहीं। जीवन निर्णयों हेतु ज्योतिषी से पुष्टि करें।"
            ),
        ],
      };
    }

    case "pitra-dosha": {
      const present = Boolean(raw.present);
      const flags = Array.isArray(raw.flags) ? (raw.flags as Loc[]) : [];
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🪔",
          title: present
            ? L("Pitra-related flags found", "पितृ संबंधित संकेत मिले")
            : L("No strong Pitra flags on this check", "इस जाँच में स्पष्ट पितृ संकेत नहीं"),
          badge: L("Ancestral / 9th-house themes", "पैतृक / नवम भाव विषय"),
          badgeTone: present ? "warn" : "good",
          summary: asLoc(raw.meaning) || L("", ""),
        },
        highlights: [
          {
            label: L("Flags", "संकेत"),
            value: String(flags.length),
          },
        ],
        sections: [
          {
            title: L("Signals noted", "दर्ज संकेत"),
            bullets:
              flags.length > 0
                ? flags
                : [
                    L(
                      "Sun, 9th house and nodes look quiet on this simplified screen.",
                      "इस सरल स्क्रीन पर सूर्य, नवम और छाया ग्रह शांत दिखते हैं।"
                    ),
                  ],
          },
          {
            title: L("Keep perspective", "संतुलन रखें"),
            body: L(
              "Pitra themes are nuanced — family history and full chart matter more than one online flag.",
              "पितृ विषय सूक्ष्म हैं — एक ऑनलाइन संकेत से अधिक परिवार इतिहास और पूर्ण कुंडली मायने रखते हैं।"
            ),
          },
        ],
      };
    }

    case "gemstone":
    case "rudraksha": {
      const byLagna = raw.byLagna as Record<string, unknown>;
      const byMoon = raw.byMoon as Record<string, unknown>;
      const isGem = slug === "gemstone";
      const lucky = raw.lucky as
        | {
            method?: { en: string; hi: string };
            primary?: {
              label?: { en: string; hi: string };
              gem?: { en: string; hi: string; wear?: { en: string; hi: string } };
              planet?: { en: string; hi: string };
              sign?: { en: string; hi: string };
              benefits?: { en: string; hi: string };
              substitute?: { en: string; hi: string };
              wearing?: {
                finger?: { en: string; hi: string };
                metal?: { en: string; hi: string };
                day?: { en: string; hi: string };
              };
            };
            ascendant?: {
              label?: { en: string; hi: string };
              gem?: { en: string; hi: string };
              planet?: { en: string; hi: string };
              sign?: { en: string; hi: string };
              benefits?: { en: string; hi: string };
            } | null;
            chartNotes?: { note?: { en: string; hi: string } }[];
            mantraFirst?: { en: string; hi: string };
            purityNote?: { en: string; hi: string };
            consultNote?: { en: string; hi: string };
            tierNote?: { en: string; hi: string };
          }
        | undefined;

      if (isGem && lucky?.primary) {
        const p = lucky.primary;
        const asc = lucky.ascendant;
        return {
          kind: "explained",
          slug,
          hero: {
            icon: "💎",
            title: L("Find your lucky gemstone", "अपना शुभ रत्न खोजें"),
            badge: L("Confirm before wearing", "पहनने से पहले पुष्टि करें"),
            badgeTone: "warn",
            summary:
              asLoc(lucky.method) ||
              L(
                "Moon-sign lord method — the standard lucky-gemstone calculation.",
                "चंद्र राशि स्वामी विधि — मानक शुभ-रत्न गणना।"
              ),
          },
          highlights: [
            {
              label:
                asLoc(p.label) ||
                L("Your stone (Moon-sign lord)", "आपका रत्न (चंद्र राशि स्वामी)"),
              value: asLoc(p.gem) || "—",
              note: L(
                `Ruling planet: ${p.planet?.en || "—"}`,
                `शासक ग्रह: ${p.planet?.hi || "—"}`
              ),
            },
            ...(asc
              ? [
                  {
                    label:
                      asLoc(asc.label) ||
                      L("Ascendant stone (Lagna lord)", "लग्न रत्न (लग्न स्वामी)"),
                    value: asLoc(asc.gem) || "—",
                    note: L(
                      `Lagna ${asc.sign?.en || "—"} · ${asc.planet?.en || "—"}`,
                      `लग्न ${asc.sign?.hi || "—"} · ${asc.planet?.hi || "—"}`
                    ),
                  },
                ]
              : []),
          ],
          sections: [
            {
              title: L("About your stone", "आपके रत्न के बारे में"),
              bullets: [
                asLoc(p.benefits) ||
                  L("Supports the Moon-sign ruling planet.", "चंद्र राशि शासक ग्रह को सहारा।"),
                asLoc(p.gem?.wear) ||
                  (p.wearing
                    ? L(
                        `Set in ${p.wearing.metal?.en}, worn on the ${p.wearing.finger?.en} on ${p.wearing.day?.en}`,
                        `${p.wearing.metal?.hi} में जड़ें, ${p.wearing.finger?.hi} पर ${p.wearing.day?.hi} पहनें`
                      )
                    : L("See wearing guidance below.", "पहनने का मार्गदर्शन नीचे देखें।")),
                p.substitute
                  ? L(
                      `Budget-friendly substitutes: ${p.substitute.en}`,
                      `किफ़ायती विकल्प: ${p.substitute.hi}`
                    )
                  : L("Ask for natural untreated stone.", "प्राकृतिक अनुपचारित रत्न माँगें।"),
              ],
            },
            ...(asc
              ? [
                  {
                    title: L("Ascendant-based stone", "लग्न आधारित रत्न"),
                    bullets: [
                      asLoc(asc.benefits) ||
                        L(
                          "Lagna-lord gem for overall chart strength when birth time is reliable.",
                          "विश्वसनीय जन्म समय पर लग्न-स्वामी रत्न कुल बल हेतु।"
                        ),
                      L(
                        "Do not wear Moon-sign and Lagna stones together if they conflict — confirm with an astrologer.",
                        "चंद्र व लग्न रत्न यदि टकराएँ तो एक साथ न पहनें — ज्योतिषी से पूछें।"
                      ),
                    ],
                  },
                ]
              : []),
            ...(lucky.chartNotes?.length
              ? [
                  {
                    title: L("Chart cautions", "कुंडली सावधानियाँ"),
                    bullets: lucky.chartNotes.map(
                      (c) =>
                        asLoc(c.note) ||
                        L("See full chart before combining gems.", "रत्न मिलाने से पहले पूर्ण कुंडली देखें।")
                    ),
                  },
                ]
              : []),
            {
              title: L("Ethics & purity", "नैतिकता व शुद्धता"),
              bullets: [
                asLoc(lucky.mantraFirst) ||
                  L("Prefer mantra/lifestyle first.", "पहले मंत्र/जीवनशैली।"),
                asLoc(lucky.purityNote) ||
                  L("Natural untreated stones preferred.", "प्राकृतिक अनुपचारित बेहतर।"),
                asLoc(lucky.consultNote) ||
                  L("Confirm with an astrologer.", "ज्योतिषी से पुष्टि करें।"),
              ],
            },
          ],
          tips: [
            L(
              "Never wear Ruby (Sun) and Blue Sapphire (Saturn) together without an explicit caveat.",
              "बिना स्पष्ट चेतावनी माणिक (सूर्य) और नीलम (शनि) एक साथ न पहनें।"
            ),
          ],
        };
      }

      return {
        kind: "explained",
        slug,
        hero: {
          icon: isGem ? "💎" : "📿",
          title: isGem
            ? L("Gemstone suggestions (chart-based)", "रत्न सुझाव (कुंडली आधारित)")
            : L("Rudraksha suggestions", "रुद्राक्ष सुझाव"),
          badge: L("Confirm before wearing", "पहनने से पहले पुष्टि करें"),
          badgeTone: "warn",
          summary: L(
            "These are educational suggestions from lagna and Moon lords. Wrong gems can disturb — never wear blue sapphire or strong stones without a full reading.",
            "ये लग्न व चंद्र स्वामी से शैक्षिक सुझाव हैं। गलत रत्न हानि कर सकते हैं — नीलम आदि बिना पूर्ण पढ़ाई न पहनें।"
          ),
        },
        highlights: [
          {
            label: L("By Moon (lucky gem)", "चंद्र से (शुभ रत्न)"),
            value: isGem
              ? asLoc((byMoon?.gem as { en?: string; hi?: string }) || byMoon?.gem) ||
                str((byMoon?.gem as { en?: string })?.en)
              : asLoc((byMoon?.bead as { en?: string; hi?: string }) || byMoon?.bead) ||
                `${(byMoon?.bead as { mukhi?: number })?.mukhi || "—"} mukhi`,
            note: asLoc(byMoon?.sign) || undefined,
          },
          {
            label: L("By Lagna", "लग्न से"),
            value: isGem
              ? asLoc((byLagna?.gem as { en?: string; hi?: string }) || byLagna?.gem) ||
                str((byLagna?.gem as { en?: string })?.en)
              : asLoc((byLagna?.bead as { en?: string; hi?: string }) || byLagna?.bead) ||
                `${(byLagna?.bead as { mukhi?: number })?.mukhi || "—"} mukhi`,
            note: asLoc(byLagna?.sign) || undefined,
          },
        ],
        sections: [
          {
            title: L("How to proceed safely", "सुरक्षित आगे कैसे बढ़ें"),
            bullets: [
              L(
                "Prefer natural, tested stones/beads; follow metal and weekday only after advice.",
                "प्राकृतिक, जाँचे रत्न/मनके चुनें; धातु व वार केवल सलाह के बाद।"
              ),
              L(
                "If Lagna and Moon disagree, an astrologer chooses by chart priority.",
                "लग्न और चंद्र अलग हों तो ज्योतिषी कुंडली प्राथमिकता से चुनता है।"
              ),
            ],
          },
        ],
        tips: [
          asLoc(byLagna?.disclaimer) ||
            L("Educational only.", "केवल शैक्षिक।"),
        ],
      };
    }

    case "life-path": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🔢",
          title: L(
            `Life Path ${raw.lifePath}`,
            `लाइफ पाथ ${raw.lifePath}`
          ),
          badge: L(`Radical ${raw.radical}`, `रेडिकल ${raw.radical}`),
          badgeTone: "good",
          summary: L(
            "Life Path is reduced from your full date of birth — a core theme of talent and lessons. Radical (birth day reduced) colours personality style.",
            "लाइफ पाथ पूरी जन्म तिथि से घटित होता है — प्रतिभा व पाठ का मुख्य स्वर। रेडिकल (दिन अंक) व्यक्तित्व शैली रंगता है।"
          ),
        },
        highlights: [
          { label: L("Life Path", "लाइफ पाथ"), value: String(raw.lifePath) },
          { label: L("Radical", "रेडिकल"), value: String(raw.radical) },
          {
            label: L("Date", "तिथि"),
            value: String(raw.date || "—"),
          },
        ],
        sections: [
          {
            title: L("Next", "आगे"),
            bullets: [
              L("Open Lo Shu Grid for a visual map of the same digits.", "उन्हीं अंकों का दृश्य मानचित्र हेतु लो शू ग्रिड खोलें।"),
              L("Compare with Name Numerology for harmony checks.", "मेल जाँच हेतु नाम अंक ज्योतिष से तुलना करें।"),
            ],
          },
        ],
      };
    }

    case "name-numerology":
    case "business-name": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🔤",
          title: L(
            `Destiny number ${raw.destiny}`,
            `भाग्य अंक ${raw.destiny}`
          ),
          badge: L(
            `System: ${String(raw.system || "chaldean")}`,
            `पद्धति: ${String(raw.system || "chaldean")}`
          ),
          badgeTone: "good",
          summary: L(
            "Destiny (expression) comes from all letters; Soul Urge from vowels; Personality from consonants. Use as reflection — not a legal name-change command.",
            "भाग्य सभी अक्षरों से; आत्मा स्वरों से; व्यक्तित्व व्यंजनों से। चिंतन हेतु — कानूनी नाम-बदलाव आदेश नहीं।"
          ),
        },
        highlights: [
          { label: L("Name", "नाम"), value: String(raw.name || "—") },
          { label: L("Destiny", "भाग्य"), value: String(raw.destiny) },
          { label: L("Soul urge", "आत्मा"), value: String(raw.soulUrge) },
          {
            label: L("Personality", "व्यक्तित्व"),
            value: String(raw.personality),
          },
        ],
        sections: [
          {
            title: L("How to read", "कैसे पढ़ें"),
            bullets: [
              L("Destiny = outer path and skills you express.", "भाग्य = बाहरी मार्ग व व्यक्त कौशल।"),
              L("Soul urge = inner motivation.", "आत्मा = आंतरिक प्रेरणा।"),
              L("Personality = first impression others sense.", "व्यक्तित्व = पहला प्रभाव।"),
            ],
          },
        ],
      };
    }

    case "mobile-number":
    case "vehicle-number":
    case "house-number": {
      const n = Number(raw.number);
      const kindLabel =
        slug === "mobile-number"
          ? L("Mobile", "मोबाइल")
          : slug === "vehicle-number"
            ? L("Vehicle", "वाहन")
            : L("House", "मकान");
      const vibe =
        [1, 3, 5, 6].includes(n)
          ? L("Generally supportive vibration for growth and expression.", "विकास व अभिव्यक्ति हेतु सामान्यतः सहायक कंपन।")
          : [2, 4, 7].includes(n)
            ? L("Sensitive / structured vibration — use with awareness.", "संवेदनशील / संरचित कंपन — सचेत उपयोग।")
            : L("Strong karmic or intensity tone — balance with rest and ethics.", "प्रबल कर्म/तीव्र स्वर — विश्राम व नैतिकता से संतुलन।");
      return {
        kind: "explained",
        slug,
        hero: {
          icon: slug === "mobile-number" ? "📱" : slug === "vehicle-number" ? "🚗" : "🏠",
          title: L(
            `${asLoc(kindLabel)?.en} number reduces to ${n}`,
            `${asLoc(kindLabel)?.hi} अंक घटकर ${n}`
          ),
          badge: L("Numerology check", "अंक जाँच"),
          badgeTone: "neutral",
          summary: vibe,
        },
        highlights: [
          { label: L("Input", "इनपुट"), value: String(raw.input || raw.digits || "—") },
          { label: L("Compound", "संयुक्त"), value: String(raw.compound ?? "—") },
          { label: L("Reduced", "घटित"), value: String(n) },
        ],
        sections: [
          {
            title: L("Practical note", "व्यावहारिक नोट"),
            body: L(
              "Number checks are secondary to birth chart and real-life logistics. Change only if convenient — don’t force expensive swaps from fear.",
              "अंक जाँच जन्म कुंडली और व्यावहारिक ज़रूरत के बाद आती है। सुविधा हो तभी बदलें — भय से महँगा बदलाव न करें।"
            ),
          },
        ],
      };
    }

    case "personal-year": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "📅",
          title: L(
            `Personal Year ${raw.number} (${raw.year})`,
            `व्यक्तिगत वर्ष ${raw.number} (${raw.year})`
          ),
          badge: L("12-month theme", "12 महीने का स्वर"),
          badgeTone: "good",
          summary: asLoc(raw.theme) || L("", ""),
        },
        highlights: [
          { label: L("Year", "वर्ष"), value: String(raw.year) },
          { label: L("Number", "अंक"), value: String(raw.number) },
        ],
        sections: [
          {
            title: L("Use it like this", "ऐसे उपयोग करें"),
            bullets: [
              L("1–3: begin and express; 4–6: build and nurture; 7–9: refine, share, complete.", "1–3: आरंभ व अभिव्यक्ति; 4–6: निर्माण व पोषण; 7–9: परिष्कार, साझा, पूर्णता।"),
            ],
          },
        ],
      };
    }

    case "birth-panchang":
    case "daily-panchang":
    case "today-panchang": {
      const limbs = raw.limbs as
        | {
            tithi?: { name?: Loc };
            nakshatra?: { name?: Loc; pada?: number };
            yoga?: Loc;
            karana?: Loc;
            paksha?: Loc;
            weekday?: Loc;
          }
        | undefined;
      const tithi =
        (raw.tithi as { name?: Loc; index?: number } | undefined) ||
        limbs?.tithi;
      const yoga =
        (raw.yoga as { name?: Loc } | undefined)?.name ||
        limbs?.yoga ||
        (raw.yoga as Loc | undefined);
      const karana =
        (raw.karana as { name?: Loc } | undefined)?.name ||
        limbs?.karana ||
        (raw.karana as Loc | undefined);
      const nak =
        (raw.nakshatra as { name?: Loc; pada?: number } | undefined) ||
        limbs?.nakshatra;
      const timings = raw.timings as
        | { sunrise?: string; sunset?: string }
        | undefined;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "📜",
          title: L("Panchang snapshot", "पंचांग सार"),
          badge:
            asLoc((raw.weekday as Loc) || limbs?.weekday) ||
            L("Five limbs", "पाँच अंग"),
          badgeTone: "good",
          summary: L(
            "Panchang’s five limbs — weekday, tithi, nakshatra, yoga, karana — describe the day’s quality. Birth panchang colours the native’s lunar day imprint.",
            "पंचांग के पाँच अंग — वार, तिथि, नक्षत्र, योग, करण — दिन का गुण बताते हैं। जन्म पंचांग जातक की चंद्र-दिन छाप रंगता है।"
          ),
        },
        highlights: [
          {
            label: L("Paksha", "पक्ष"),
            value: asLoc((raw.paksha as Loc) || limbs?.paksha) || "—",
          },
          {
            label: L("Tithi", "तिथि"),
            value: asLoc(tithi?.name || (tithi as Loc)) || "—",
          },
          {
            label: L("Nakshatra", "नक्षत्र"),
            value: asLoc(nak?.name) || "—",
          },
          {
            label: L("Yoga", "योग"),
            value: asLoc(yoga as Loc) || "—",
          },
          {
            label: L("Karana", "करण"),
            value: asLoc(karana as Loc) || "—",
          },
          ...(timings?.sunrise
            ? [
                {
                  label: L("Sunrise", "सूर्योदय"),
                  value: timings.sunrise,
                },
              ]
            : []),
        ],
        sections: [
          {
            title: L("Quick meanings", "त्वरित अर्थ"),
            bullets: [
              L(
                "Tithi: lunar day energy (Shukla waxing / Krishna waning).",
                "तिथि: चंद्र दिन ऊर्जा (शुक्ल बढ़ता / कृष्ण घटता)।"
              ),
              L(
                "Nakshatra: stellar mood of the Moon.",
                "नक्षत्र: चंद्र का तारकीय मूड।"
              ),
              L(
                "Yoga & Karana: finer auspiciousness filters for muhurta.",
                "योग व करण: मुहूर्त हेतु सूक्ष्म शुभता फिल्टर।"
              ),
            ],
          },
        ],
      };
    }

    case "ayanamsa": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🌐",
          title: L(
            `Lahiri ayanamsa ≈ ${Number(raw.ayanamsa || 0).toFixed(4)}°`,
            `लाहिरी अयनांश ≈ ${Number(raw.ayanamsa || 0).toFixed(4)}°`
          ),
          badge: L("Sidereal correction", "नक्षत्र सुधार"),
          badgeTone: "neutral",
          summary: asLoc(raw.note) || L(
            "Ayanamsa bridges tropical astronomy and sidereal Vedic signs.",
            "अयनांश ट्रॉपिकल खगोल और वैदिक नक्षत्र राशियों को जोड़ता है।"
          ),
        },
        highlights: [
          { label: L("Date", "तिथि"), value: String(raw.date || "—") },
          {
            label: L("Ayanamsa", "अयनांश"),
            value: `${Number(raw.ayanamsa || 0).toFixed(4)}°`,
          },
        ],
        sections: [
          {
            title: L("Why it matters", "यह क्यों ज़रूरी"),
            body: L(
              "Without ayanamsa, planet longitudes stay tropical. Vedic charts subtract Lahiri (or another ayanamsa) to place planets in nakshatra-aligned signs.",
              "बिना अयनांश ग्रह ट्रॉपिकल रहते हैं। वैदिक कुंडली लाहिरी (या अन्य) घटाकर नक्षत्र-संरेखित राशि में रखती है।"
            ),
          },
        ],
      };
    }

    case "baby-name": {
      const letters = Array.isArray(raw.letters) ? (raw.letters as string[]) : [];
      const nak = raw.nakshatra as { name?: Loc; pada?: number };
      const moon = raw.moonRashi as Loc | { name?: Loc; en?: string; hi?: string } | undefined;
      const moonVal =
        asLoc(moon as Loc) ||
        asLoc((moon as { name?: Loc })?.name) ||
        "—";
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "👶",
          title: L("Auspicious starting sounds", "शुभ आरंभ ध्वनियाँ"),
          badge: asLoc(nak?.name) || L("From birth star", "जन्म नक्षत्र से"),
          badgeTone: "good",
          summary: L(
            "From the baby’s birth details we found the Moon sign and nakshatra, then mapped classical Namkaran starting syllables. Pick a meaningful name that begins with one of these sounds — family tradition still matters.",
            "शिशु के जन्म विवरण से चंद्र राशि और नक्षत्र निकाले, फिर शास्त्रीय नामकरण आरंभ अक्षर जोड़े। इनमें से किसी ध्वनि से शुरू अर्थपूर्ण नाम चुनें — परिवार परंपरा भी मायने रखती है।"
          ),
        },
        highlights: [
          { label: L("Moon sign (Rashi)", "चंद्र राशि"), value: moonVal },
          { label: L("Nakshatra", "नक्षत्र"), value: asLoc(nak?.name) || "—" },
          {
            label: L("Pada", "पद"),
            value: String(nak?.pada ?? "—"),
          },
          {
            label: L("Letters", "अक्षर"),
            value: letters.join(", ") || "—",
          },
        ],
        sections: [
          {
            title: L("How parents use this", "माता-पिता कैसे उपयोग करें"),
            bullets: [
              L("Pick a name whose first sound matches a suggested syllable.", "ऐसा नाम चुनें जिसका पहला स्वर सुझाए अक्षर से मेल खाए।"),
              L("Prefer easy pronunciation in your home language.", "घर की भाषा में आसान उच्चारण प्राथमिकता दें।"),
            ],
          },
        ],
      };
    }

    case "atmakaraka": {
      const karakas = Array.isArray(raw.karakas)
        ? (raw.karakas as { karaka?: Loc; planet?: Loc; degreeInSign?: number }[])
        : [];
      const atma = karakas[0];
      const dara = karakas[6];
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🕉️",
          title: L(
            `Atmakaraka: ${asLoc(atma?.planet)?.en || "—"}`,
            `आत्माकारक: ${asLoc(atma?.planet)?.hi || asLoc(atma?.planet)?.en || "—"}`
          ),
          badge: L("Jaimini chara karakas", "जामिनी चर कारक"),
          badgeTone: "good",
          summary: L(
            "Atmakaraka is the planet with highest degrees in any sign — the soul significator. Darakaraka (lowest degree of the seven) signifies spouse themes.",
            "आत्माकारक किसी भी राशि में सर्वाधिक अंश वाला ग्रह — आत्मा कारक। दाराकारक (सात में न्यूनतम अंश) जीवनसाथी विषय।"
          ),
        },
        highlights: [
          {
            label: L("Atmakaraka", "आत्माकारक"),
            value: asLoc(atma?.planet) || "—",
            note:
              atma?.degreeInSign != null
                ? L(`${atma.degreeInSign.toFixed(2)}° in sign`, `राशि में ${atma.degreeInSign.toFixed(2)}°`)
                : undefined,
          },
          {
            label: L("Darakaraka", "दाराकारक"),
            value: asLoc(dara?.planet) || "—",
          },
        ],
        sections: [
          {
            title: L("Full ranking", "पूर्ण क्रम"),
            bullets: karakas.map((k) =>
              L(
                `${asLoc(k.karaka)?.en}: ${asLoc(k.planet)?.en} (${(k.degreeInSign ?? 0).toFixed(2)}°)`,
                `${asLoc(k.karaka)?.hi || asLoc(k.karaka)?.en}: ${asLoc(k.planet)?.hi || asLoc(k.planet)?.en} (${(k.degreeInSign ?? 0).toFixed(2)}°)`
              )
            ),
          },
        ],
      };
    }

    case "ishta-devata": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🛕",
          title: L(
            `Suggested Ishta: ${asLoc(raw.deity)?.en || "—"}`,
            `सुझाए इष्ट: ${asLoc(raw.deity)?.hi || asLoc(raw.deity)?.en || "—"}`
          ),
          badge: L("From Karakamsa (simplified)", "कारकअंश से (सरलीकृत)"),
          badgeTone: "good",
          summary: asLoc(raw.note) || L("", ""),
        },
        highlights: [
          { label: L("Karakamsa sign", "कारकअंश राशि"), value: asLoc(raw.sign) || "—" },
          { label: L("Deity", "देवता"), value: asLoc(raw.deity) || "—" },
          {
            label: L("Atmakaraka", "आत्माकारक"),
            value: asLoc((raw.atmakaraka as { planet?: Loc })?.planet) || "—",
          },
        ],
        sections: [
          {
            title: L("Devotional use", "भक्ति उपयोग"),
            body: L(
              "Treat this as a contemplative pointer. Family tradition and a Jaimini-trained astrologer refine the final Ishta.",
              "इसे चिंतन संकेत मानें। परिवार परंपरा और जामिनी-प्रशिक्षित ज्योतिषी अंतिम इष्ट परिष्कृत करते हैं।"
            ),
          },
        ],
      };
    }

    case "kp-horary": {
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🔢",
          title: L(
            `Horary #${raw.number}`,
            `होररी #${raw.number}`
          ),
          badge: L("KP significators", "केपी कारक"),
          badgeTone: "neutral",
          summary: L(
            "KP horary maps a number 1–249 to sign, star-lord and sub-lord — used for yes/no style questions without birth data. Judgment still needs house rules.",
            "केपी होररी 1–249 को राशि, नक्षत्रेश व सब-लॉर्ड से जोड़ता है — बिना जन्म डेटा हाँ/नहीं शैली प्रश्नों हेतु। निर्णय हेतु भाव नियम अभी भी चाहिए।"
          ),
        },
        highlights: [
          { label: L("Sign", "राशि"), value: asLoc(raw.sign) || "—" },
          { label: L("Nakshatra", "नक्षत्र"), value: asLoc(raw.nakshatra) || "—" },
          { label: L("Star lord", "नक्षत्रेश"), value: asLoc(raw.starLord) || "—" },
          { label: L("Sub lord", "सब-लॉर्ड"), value: asLoc(raw.subLord) || "—" },
        ],
        sections: [
          {
            title: L("Remember", "याद रखें"),
            body: L(
              "This page gives the significator seed. A KP astrologer judges cusps and ruling planets for the final answer.",
              "यह पृष्ठ कारक बीज देता है। अंतिम उत्तर हेतु केपी ज्योतिषी कस्प व शासक ग्रह देखते हैं।"
            ),
          },
        ],
      };
    }

    case "kp-ruling-planets": {
      const moon = raw.moon as Record<string, unknown>;
      const asc = raw.ascendant as Record<string, unknown>;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🪐",
          title: L("KP ruling planets — now", "केपी शासक ग्रह — अभी"),
          badge: asLoc(raw.dayLord) || L("Day lord", "दिनेश"),
          badgeTone: "neutral",
          summary: L(
            "Ruling planets for this moment (day lord + Moon and Ascendant star/sub). Used in KP timing and horary judgment.",
            "इस क्षण के शासक (दिनेश + चंद्र व लग्न नक्षत्र/सब)। केपी समय व होररी निर्णय में उपयोग।"
          ),
        },
        highlights: [
          { label: L("Day lord", "दिनेश"), value: asLoc(raw.dayLord) || "—" },
          {
            label: L("Moon star / sub", "चंद्र नक्षत्र / सब"),
            value: L(
              `${asLoc(moon?.nakshatra)?.en || "—"} / ${asLoc(moon?.subLord)?.en || "—"}`,
              `${asLoc(moon?.nakshatra)?.hi || "—"} / ${asLoc(moon?.subLord)?.hi || "—"}`
            ),
          },
          {
            label: L("Asc star / sub", "लग्न नक्षत्र / सब"),
            value: L(
              `${asLoc(asc?.nakshatra)?.en || "—"} / ${asLoc(asc?.subLord)?.en || "—"}`,
              `${asLoc(asc?.nakshatra)?.hi || "—"} / ${asLoc(asc?.subLord)?.hi || "—"}`
            ),
          },
        ],
        sections: [
          {
            title: L("Use case", "उपयोग"),
            body: L(
              "Note these lords when asking a timed question, then apply KP house rules — or consult a KP reader.",
              "समयबद्ध प्रश्न पर इन स्वामियों को नोट करें, फिर केपी भाव नियम लागू करें — या केपी पाठक से पूछें।"
            ),
          },
        ],
      };
    }

    case "moon-phase": {
      const phase = (raw.phase || raw) as Record<string, unknown>;
      const p = (phase.phase ? phase : raw) as {
        phase?: Loc;
        illumination?: number;
        elongation?: number;
      };
      const inner = (raw.phase as Record<string, unknown>) || raw;
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🌗",
          title: L(
            `Moon phase: ${asLoc((inner as { phase?: Loc }).phase)?.en || asLoc(p.phase)?.en || "—"}`,
            `चंद्र कला: ${asLoc((inner as { phase?: Loc }).phase)?.hi || asLoc(p.phase)?.hi || "—"}`
          ),
          badge: L(
            `${(inner as { illumination?: number }).illumination ?? p.illumination ?? "—"}% lit`,
            `${(inner as { illumination?: number }).illumination ?? p.illumination ?? "—"}% प्रकाशित`
          ),
          badgeTone: "good",
          summary: L(
            "Birth Moon phase colours emotional style — new-moon beginnings vs full-moon culmination themes.",
            "जन्म चंद्र कला भावनात्मक शैली रंगती है — अमावस्या आरंभ बनाम पूर्णिमा परिणति विषय।"
          ),
        },
        highlights: [
          {
            label: L("Phase", "कला"),
            value: asLoc((inner as { phase?: Loc }).phase) || asLoc(p.phase) || "—",
          },
          {
            label: L("Illumination", "प्रकाश"),
            value: `${(inner as { illumination?: number }).illumination ?? p.illumination ?? "—"}%`,
          },
        ],
        sections: [
          {
            title: L("Reflect", "चिंतन"),
            bullets: [
              L("Waxing phases: building energy; waning: release and refine.", "शुक्ल पक्ष: ऊर्जा निर्माण; कृष्ण: मुक्ति व परिष्कार।"),
            ],
          },
        ],
      };
    }

    case "navamsa": {
      const lagna = raw.lagna as { sign?: Loc };
      const planets = Array.isArray(raw.planets)
        ? (raw.planets as { name?: Loc; sign?: Loc; vargottama?: boolean }[])
        : [];
      const vargs = planets.filter((p) => p.vargottama);
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🔯",
          title: L(
            `D9 Lagna: ${asLoc(lagna?.sign)?.en || "—"}`,
            `D9 लग्न: ${asLoc(lagna?.sign)?.hi || asLoc(lagna?.sign)?.en || "—"}`
          ),
          badge: L("Navamsa — inner / marriage chart", "नवमांश — आंतरिक / विवाह कुंडली"),
          badgeTone: "good",
          summary: L(
            "Navamsa (D9) refines dignity and marriage/inner strength themes. Vargottama planets (same sign in D1 and D9) gain special firmness.",
            "नवमांश (D9) गरिमा और विवाह/आंतरिक बल परिष्कृत करता है। वर्गोत्तम ग्रह (D1 व D9 समान राशि) विशेष दृढ़ता पाते हैं।"
          ),
        },
        highlights: [
          { label: L("D9 Lagna", "D9 लग्न"), value: asLoc(lagna?.sign) || "—" },
          {
            label: L("Vargottama planets", "वर्गोत्तम ग्रह"),
            value: vargs.length
              ? vargs.map((p) => asLoc(p.name)?.en || "").filter(Boolean).join(", ")
              : L("None flagged", "कोई नहीं"),
          },
        ],
        sections: [
          {
            title: L("Planet seats in D9", "D9 में ग्रह स्थान"),
            bullets: planets.slice(0, 9).map((p) =>
              L(
                `${asLoc(p.name)?.en}: ${asLoc(p.sign)?.en}${p.vargottama ? " (Vargottama)" : ""}`,
                `${asLoc(p.name)?.hi || asLoc(p.name)?.en}: ${asLoc(p.sign)?.hi || asLoc(p.sign)?.en}${p.vargottama ? " (वर्गोत्तम)" : ""}`
              )
            ),
          },
        ],
      };
    }

    case "name-correction": {
      const harmony = Boolean(raw.harmony);
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "✍️",
          title: harmony
            ? L("Name already resonates with birth numbers", "नाम जन्म अंकों से मेल खाता है")
            : L("Name and birth numbers differ", "नाम और जन्म अंक भिन्न हैं"),
          badge: harmony
            ? L("Harmonious", "सामंजस्य")
            : L("Review thoughtfully", "विचार से देखें"),
          badgeTone: harmony ? "good" : "warn",
          summary: asLoc(raw.advice) || L("", ""),
        },
        highlights: [
          {
            label: L("Life Path", "लाइफ पाथ"),
            value: String((raw.birth as { lifePath?: number })?.lifePath ?? "—"),
          },
          {
            label: L("Name destiny", "नाम भाग्य"),
            value: String((raw.current as { destiny?: number })?.destiny ?? "—"),
          },
        ],
        sections: [
          {
            title: L("Before changing a legal name", "कानूनी नाम बदलने से पहले"),
            bullets: [
              L("Numerology is one lens — identity, documents and family views matter more.", "अंक एक दृष्टि है — पहचान, दस्तावेज़ और परिवार अधिक मायने रखते हैं।"),
              L("Try spelling variants before major changes.", "बड़े बदलाव से पहले वर्तनी विकल्प आज़माएँ।"),
            ],
          },
        ],
      };
    }

    case "love-compatibility-num": {
      const a = raw.person1 as { lifePath?: number; radical?: number };
      const b = raw.person2 as { lifePath?: number; radical?: number };
      const harmony = String(raw.harmony || "moderate");
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "💞",
          title: L(
            `Numerology match: ${harmony}`,
            `अंक मिलान: ${harmony}`
          ),
          badge: L("Life Path comparison", "लाइफ पाथ तुलना"),
          badgeTone:
            harmony === "strong" ? "good" : harmony === "moderate" ? "neutral" : "warn",
          summary: L(
            "This compares Life Path numbers only — gentle guidance, not destiny. Prefer kundli matching for marriage.",
            "केवल लाइफ पाथ तुलना — नरम मार्गदर्शन, भाग्य नहीं। विवाह हेतु कुंडली मिलान बेहतर।"
          ),
        },
        highlights: [
          {
            label: L("Person 1 Life Path", "व्यक्ति 1 लाइफ पाथ"),
            value: String(a?.lifePath ?? "—"),
          },
          {
            label: L("Person 2 Life Path", "व्यक्ति 2 लाइफ पाथ"),
            value: String(b?.lifePath ?? "—"),
          },
        ],
        sections: [
          {
            title: L("Read kindly", "कोमलता से पढ़ें"),
            body: L(
              "Different Life Paths can complement. Use this as conversation fuel, not a veto.",
              "भिन्न लाइफ पाथ पूरक हो सकते हैं। इसे संवाद हेतु उपयोग करें, वीटो नहीं।"
            ),
          },
        ],
      };
    }

    case "prashna-kundli": {
      const lean = raw.lean as
        | { kind?: string; label?: Loc; basedOn?: Loc }
        | undefined;
      const kind = String(lean?.kind || "insufficient");
      const sigs = Array.isArray(raw.significators)
        ? (raw.significators as {
            house?: number;
            sign?: Loc;
            lord?: Loc;
            lordHouse?: number;
            basedOn?: Loc;
          }[])
        : [];
      const timing = raw.timingHint as
        | {
            maha?: Loc;
            antar?: Loc;
            window?: { start?: string; end?: string };
            basedOn?: Loc;
          }
        | undefined;
      const tone =
        kind === "strong_yes" ? "good" : kind === "caution" ? "warn" : "neutral";
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "❓",
          title: asLoc(raw.topicLabel) || L("Prashna chart", "प्रश्न कुंडली"),
          badge: asLoc(lean?.label) || L("Question-time sky", "प्रश्न-काल आकाश"),
          badgeTone: tone,
          summary: L(
            "Prashna reads the sky at the moment of asking for this topic — lean/caution only, not fate rewrite or %-odds.",
            "प्रश्न इस विषय हेतु पूछने के क्षण का आकाश पढ़ता है — केवल झुकाव/सावधानी, भाग्य पुनर्लेखन या %-संभावना नहीं।"
          ),
        },
        highlights: [
          {
            label: L("Prashna Lagna", "प्रश्न लग्न"),
            value: asLoc((raw.lagna as { sign?: Loc })?.sign) || "—",
          },
          {
            label: L("Moon / nakshatra", "चंद्र / नक्षत्र"),
            value: L(
              `${asLoc(raw.moonRashi)?.en || "—"} · ${asLoc((raw.nakshatra as { name?: Loc })?.name)?.en || "—"}`,
              `${asLoc(raw.moonRashi)?.hi || "—"} · ${asLoc((raw.nakshatra as { name?: Loc })?.name)?.hi || "—"}`
            ),
          },
          {
            label: L("Lean", "झुकाव"),
            value: asLoc(lean?.label) || "—",
          },
          {
            label: L("Significator houses", "कारक भाव"),
            value: Array.isArray(raw.significatorHouses)
              ? (raw.significatorHouses as number[]).join(", ")
              : "—",
          },
        ],
        sections: [
          {
            title: L("Significators", "कारक"),
            bullets: sigs.map((s) =>
              L(
                `H${s.house}: ${asLoc(s.sign)?.en} · lord ${asLoc(s.lord)?.en} in H${s.lordHouse}`,
                `भाव ${s.house}: ${asLoc(s.sign)?.hi || asLoc(s.sign)?.en} · स्वामी ${asLoc(s.lord)?.hi || asLoc(s.lord)?.en} भाव ${s.lordHouse}`
              )
            ),
          },
          {
            title: L("Why this lean", "यह झुकाव क्यों"),
            body: asLoc(lean?.basedOn) || L("—", "—"),
          },
          {
            title: L("Timing hint (Prashna Moon dasha)", "समय संकेत (प्रश्न चंद्र दशा)"),
            body: asLoc(timing?.basedOn) ||
              L(
                `${asLoc(timing?.maha)?.en}/${asLoc(timing?.antar)?.en}`,
                `${asLoc(timing?.maha)?.hi || asLoc(timing?.maha)?.en}/${asLoc(timing?.antar)?.hi || asLoc(timing?.antar)?.en}`
              ),
          },
          {
            title: L("Ethics", "नीति"),
            body: asLoc(raw.ethics as Loc) ||
              L(
                "Not medical diagnosis or legal verdict.",
                "चिकित्सकीय निदान या कानूनी फैसला नहीं।"
              ),
          },
        ],
        nextStep: asLoc(raw.disclaimer as Loc) ||
          L(
            "For life decisions, prefer a full birth kundli with dasha context.",
            "जीवन निर्णयों हेतु पूर्ण जन्म कुंडली व दशा संदर्भ बेहतर।"
          ),
      };
    }

    case "muhurta-electional": {
      const summary = raw.summary as
        | { pass?: number; caution?: number; avoid?: number }
        | undefined;
      const topPass = Array.isArray(raw.topPass)
        ? (raw.topPass as {
            date?: string;
            start?: string;
            end?: string;
            choghadiya?: Loc;
            score?: string;
          }[])
        : [];
      const avoidSample = Array.isArray(raw.windows)
        ? (raw.windows as { score?: string; date?: string; start?: string; end?: string; basedOn?: Loc }[])
            .filter((w) => w.score === "avoid")
            .slice(0, 6)
        : [];
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🕊️",
          title: asLoc(raw.activityLabel) || L("Muhurta windows", "मुहूर्त खिड़कियाँ"),
          badge: L(
            `${summary?.pass ?? 0} pass · ${summary?.caution ?? 0} caution · ${summary?.avoid ?? 0} avoid`,
            `${summary?.pass ?? 0} पास · ${summary?.caution ?? 0} सावधानी · ${summary?.avoid ?? 0} बचें`
          ),
          badgeTone: (summary?.pass ?? 0) > 0 ? "good" : "warn",
          summary: L(
            "Electional windows scored pass / caution / avoid from daytime Choghadiya + Panchang — traditional timing odds, not guaranteed outcomes.",
            "दिन चौघड़िया + पंचांग से पास / सावधानी / बचें — पारंपरिक समय-संभावना, गारंटी नहीं।",
          ),
        },
        highlights: [
          {
            label: L("Range", "सीमा"),
            value: `${String(raw.startDate)} → ${String(raw.endDate)} (${String(raw.daysScanned)}d)`,
          },
          {
            label: L("Place", "स्थान"),
            value: String(raw.place || "—"),
          },
          {
            label: L("Grain", "कण"),
            value: asLoc(raw.grain as Loc) || "—",
          },
          {
            label: L("Natal filter", "जन्म फ़िल्टर"),
            value: raw.natalFilter
              ? L("On (Moon 8th)", "चालू (चंद्र 8वाँ)")
              : L("Off", "बंद"),
          },
        ],
        sections: [
          {
            title: L("Top pass windows", "शीर्ष पास खिड़कियाँ"),
            bullets:
              topPass.length > 0
                ? topPass.map((w) =>
                    L(
                      `${w.date} ${w.start}–${w.end} · ${asLoc(w.choghadiya)?.en || ""}`,
                      `${w.date} ${w.start}–${w.end} · ${asLoc(w.choghadiya)?.hi || asLoc(w.choghadiya)?.en || ""}`
                    )
                  )
                : [
                    L(
                      "No pass windows in this range — try another activity or dates.",
                      "इस सीमा में पास खिड़की नहीं — गतिविधि या तिथियाँ बदलें।"
                    ),
                  ],
          },
          ...(avoidSample.length
            ? [
                {
                  title: L("Sample avoid windows", "नमूना बचें खिड़कियाँ"),
                  bullets: avoidSample.map((w) =>
                    L(
                      `${w.date} ${w.start}–${w.end}: ${asLoc(w.basedOn)?.en || "hard factor"}`,
                      `${w.date} ${w.start}–${w.end}: ${asLoc(w.basedOn)?.hi || asLoc(w.basedOn)?.en || ""}`
                    )
                  ),
                },
              ]
            : []),
          {
            title: L("Methodology", "पद्धति"),
            body: asLoc(raw.methodology as Loc) || L("—", "—"),
          },
        ],
        nextStep:
          asLoc(raw.disclaimer as Loc) ||
          L(
            "Not medical clearance. Pair with full kundli for life decisions.",
            "चिकित्सकीय स्वीकृति नहीं। जीवन निर्णयों हेतु पूर्ण कुंडली जोड़ें।"
          ),
      };
    }

    case "kp-sub-lord": {
      const planets = Array.isArray(raw.planets)
        ? (raw.planets as { name?: Loc; subLord?: Loc; nakshatra?: Loc }[])
        : [];
      return {
        kind: "explained",
        slug,
        hero: {
          icon: "🔭",
          title: L("KP sub-lords mapped", "केपी सब-लॉर्ड मानचित्र"),
          badge: L("Lagna + planets", "लग्न + ग्रह"),
          badgeTone: "neutral",
          summary: L(
            "Each planet’s star and sub-lord refine KP judgment. Sub-lord is often decisive for event timing.",
            "प्रत्येक ग्रह का नक्षत्र व सब-लॉर्ड केपी निर्णय परिष्कृत करते हैं। घटना समय हेतु सब-लॉर्ड अक्सर निर्णायक।"
          ),
        },
        highlights: [
          {
            label: L("Lagna sub", "लग्न सब"),
            value: asLoc((raw.lagna as { subLord?: Loc })?.subLord) || "—",
          },
        ],
        sections: [
          {
            title: L("Planet subs", "ग्रह सब"),
            bullets: planets.slice(0, 9).map((p) =>
              L(
                `${asLoc(p.name)?.en}: sub ${asLoc(p.subLord)?.en} (${asLoc(p.nakshatra)?.en})`,
                `${asLoc(p.name)?.hi || asLoc(p.name)?.en}: सब ${asLoc(p.subLord)?.hi || asLoc(p.subLord)?.en} (${asLoc(p.nakshatra)?.hi || asLoc(p.nakshatra)?.en})`
              )
            ),
          },
        ],
      };
    }

    default:
      // Kundli matching already has MatchResult — skip
      if ("total" in raw && "scores" in raw) return null;
      return null;
  }
}
