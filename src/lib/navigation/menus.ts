import {
  CALCULATORS,
  CATEGORY_LABELS,
  type CalcCategory,
  type CalculatorMeta,
} from "@/lib/calculators/catalog";

export type MegaLink = {
  href: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  icon?: string;
};

export type MegaColumn = {
  heading: { en: string; hi: string };
  links: MegaLink[];
};

function calcLink(c: CalculatorMeta): MegaLink {
  return {
    href: `/calculators/${c.slug}`,
    title: c.title,
    description: c.description,
    icon: c.icon,
  };
}

function byCat(cat: CalcCategory) {
  return CALCULATORS.filter((c) => c.category === cat).map(calcLink);
}

export const FEATURES_MENU: MegaColumn[] = [
  {
    heading: { en: "Core product", hi: "मुख्य उत्पाद" },
    links: [
      {
        href: "/kundli",
        icon: "📜",
        title: { en: "Full Birth Chart", hi: "पूर्ण जन्म कुंडली" },
        description: {
          en: "Lagna, planets, houses, yogas and dasha.",
          hi: "लग्न, ग्रह, भाव, योग और दशा।",
        },
      },
      {
        href: "/chat",
        icon: "🤖",
        title: { en: "AI Chart Chat", hi: "एआई कुंडली चैट" },
        description: {
          en: "Ask follow-ups on your chart in EN/HI.",
          hi: "कुंडली पर हिंदी/अंग्रेज़ी में प्रश्न।",
        },
      },
      {
        href: "/calculators/kundli-matching",
        icon: "💞",
        title: { en: "Kundli Matching", hi: "कुंडली मिलान" },
        description: {
          en: "36-point Ashtakoot Gun Milan.",
          hi: "36 अंक अष्टकूट गुण मिलान।",
        },
      },
    ],
  },
  {
    heading: { en: "More", hi: "और" },
    links: [
      {
        href: "/features",
        icon: "⭐",
        title: { en: "All features", hi: "सभी विशेषताएँ" },
        description: {
          en: "Platform overview in one place.",
          hi: "प्लेटफ़ॉर्म का पूरा अवलोकन।",
        },
      },
      {
        href: "/pricing",
        icon: "💳",
        title: { en: "Pricing", hi: "मूल्य सूची" },
        description: {
          en: "Free tools and consultation plans.",
          hi: "मुफ्त उपकरण और परामर्श पैकेज।",
        },
      },
      {
        href: "/services",
        icon: "🪔",
        title: { en: "Consultation", hi: "परामर्श" },
        description: {
          en: "WhatsApp / call for remedies.",
          hi: "उपचार हेतु व्हाट्सऐप / कॉल।",
        },
      },
    ],
  },
];

export const FREE_TOOLS_MENU: MegaColumn[] = [
  {
    heading: { en: "Daily & timing", hi: "दैनिक व समय" },
    links: [
      {
        href: "/calculators/today-panchang",
        icon: "📅",
        title: { en: "Panchang", hi: "पंचांग" },
        description: {
          en: "Daily tithi, nakshatra & muhurat.",
          hi: "दैनिक तिथि, नक्षत्र व मुहूर्त।",
        },
      },
      {
        href: "/calculators/choghadiya",
        icon: "⏱️",
        title: { en: "Choghadiya", hi: "चौघड़िया" },
        description: {
          en: "Day & night auspicious windows.",
          hi: "दिन-रात शुभ समय खंड।",
        },
      },
      {
        href: "/calculators/gowri-panchangam",
        icon: "🪔",
        title: { en: "Gowri Panchangam", hi: "गौरी पंचांगम" },
        description: {
          en: "Nalla Neram good & bad windows.",
          hi: "नल्ला नेरम शुभ-अशुभ खंड।",
        },
      },
      {
        href: "/calculators/rahu-kaal",
        icon: "🌑",
        title: { en: "Rahu Kaal", hi: "राहु काल" },
        description: {
          en: "Daily inauspicious time to avoid.",
          hi: "दिन का अशुभ समय — बचें।",
        },
      },
      {
        href: "/calculators/hora",
        icon: "🪐",
        title: { en: "Hora", hi: "होरा" },
        description: {
          en: "Planetary hours for the day.",
          hi: "दिन की ग्रहीय होरा।",
        },
      },
      {
        href: "/calculators/baby-name",
        icon: "👶",
        title: { en: "Baby name suggestions", hi: "शिशु नाम सुझाव" },
        description: {
          en: "Letters from birth Moon star.",
          hi: "जन्म चंद्र नक्षत्र से अक्षर।",
        },
      },
    ],
  },
  {
    heading: { en: "Quick checks", hi: "त्वरित जाँच" },
    links: [
      {
        href: "/calculators/moon-sign",
        icon: "🌙",
        title: { en: "Moon sign", hi: "चंद्र राशि" },
        description: {
          en: "Find your Rashi instantly.",
          hi: "अपनी राशि तुरंत जानें।",
        },
      },
      {
        href: "/calculators/love-calculator",
        icon: "❤️",
        title: { en: "Love calculator", hi: "लव कैलकुलेटर" },
        description: {
          en: "Name-based compatibility %.",
          hi: "नाम से अनुकूलता प्रतिशत।",
        },
      },
      {
        href: "/chat",
        icon: "🤖",
        title: { en: "AI Chat", hi: "एआई चैट" },
        description: {
          en: "Ask anything about your chart.",
          hi: "कुंडली पर कुछ भी पूछें।",
        },
      },
    ],
  },
];


export function calculatorsMegaMenu(): MegaColumn[] {
  const order: CalcCategory[] = [
    "signs",
    "dosha",
    "matching",
    "kp",
    "remedies",
    "panchang",
    "numerology",
  ];
  return order.map((cat) => ({
    heading: CATEGORY_LABELS[cat],
    links: byCat(cat),
  }));
}

/** 3-column mega layout for Calculators (KundliGPT-style grid, our labels). */
export type MegaColumnStack = { groups: MegaColumn[] };

const NUM_CORE = [
  "life-path",
  "name-numerology",
  "personal-year",
  "lo-shu-grid",
  "name-correction",
] as const;
const NUM_LUCKY = [
  "mobile-number",
  "vehicle-number",
  "house-number",
  "business-name",
] as const;
const NUM_LOVE = ["love-compatibility-num"] as const;

function linksBySlugs(slugs: readonly string[]): MegaLink[] {
  return slugs
    .map((slug) => CALCULATORS.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => calcLink(c!));
}

export function calculatorsMegaColumns(): MegaColumnStack[] {
  return [
    {
      groups: [
        { heading: CATEGORY_LABELS.signs, links: byCat("signs") },
        { heading: CATEGORY_LABELS.dosha, links: byCat("dosha") },
      ],
    },
    {
      groups: [
        { heading: CATEGORY_LABELS.matching, links: byCat("matching") },
        { heading: CATEGORY_LABELS.kp, links: byCat("kp") },
        { heading: CATEGORY_LABELS.remedies, links: byCat("remedies") },
        { heading: CATEGORY_LABELS.panchang, links: byCat("panchang") },
      ],
    },
    {
      groups: [
        {
          heading: { en: "Core Numerology", hi: "मुख्य अंक ज्योतिष" },
          links: linksBySlugs(NUM_CORE),
        },
        {
          heading: { en: "Lucky Number Checks", hi: "शुभ अंक जाँच" },
          links: linksBySlugs(NUM_LUCKY),
        },
        {
          heading: { en: "Love & Names", hi: "प्रेम व नाम" },
          links: linksBySlugs(NUM_LOVE),
        },
      ],
    },
  ];
}

function learnLink(
  slug: string,
  icon: string,
  title: { en: string; hi: string },
  description: { en: string; hi: string }
): MegaLink {
  return { href: `/learn/${slug}`, icon, title, description };
}

/** Learn mega — Vedic / Western / Report guides (matches education hub). */
export const LEARN_MENU: MegaColumn[] = [
  {
    heading: { en: "Vedic", hi: "वैदिक" },
    links: [
      learnLink("zodiac", "♈", { en: "Zodiac Signs", hi: "राशियाँ" }, {
        en: "The 12 rashis.",
        hi: "बारह राशियाँ।",
      }),
      learnLink("planets", "🪐", { en: "Planets", hi: "ग्रह" }, {
        en: "The nine grahas.",
        hi: "नवग्रह।",
      }),
      learnLink("houses", "🏠", { en: "Houses", hi: "भाव" }, {
        en: "The 12 bhavas.",
        hi: "बारह भाव।",
      }),
      learnLink("numerology", "🔢", { en: "Numerology", hi: "अंक ज्योतिष" }, {
        en: "Numbers 1–9 & meaning.",
        hi: "संख्या 1–9 और अर्थ।",
      }),
      learnLink("kp-astrology", "🔭", { en: "KP Astrology", hi: "केपी ज्योतिष" }, {
        en: "Krishnamurti Paddhati.",
        hi: "कृष्णमूर्ति पद्धति।",
      }),
    ],
  },
  {
    heading: { en: "Western", hi: "पश्चिमी" },
    links: [
      learnLink("western", "🌐", { en: "Overview", hi: "परिचय" }, {
        en: "Western sun-sign system.",
        hi: "पश्चिमी सूर्य-राशि पद्धति।",
      }),
      learnLink("western-zodiac", "♈", { en: "Zodiac Signs", hi: "राशियाँ" }, {
        en: "Sun-sign personalities.",
        hi: "सूर्य-राशि व्यक्तित्व।",
      }),
      learnLink("western-planets", "🪐", { en: "Planets", hi: "ग्रह" }, {
        en: "Inner & outer planets.",
        hi: "आंतरिक व बाहरी ग्रह।",
      }),
      learnLink("western-houses", "🏠", { en: "Houses", hi: "भाव" }, {
        en: "The 12 chart houses.",
        hi: "चार्ट के 12 भाव।",
      }),
      learnLink("western-aspects", "📐", { en: "Aspects", hi: "दृष्टियाँ" }, {
        en: "Angles between planets.",
        hi: "ग्रहों के बीच कोण।",
      }),
    ],
  },
  {
    heading: { en: "Report guides", hi: "विषय गाइड" },
    links: [
      learnLink("life-insights", "🪷", { en: "Life Insights", hi: "जीवन अंतर्दृष्टि" }, {
        en: "Your complete kundli story.",
        hi: "पूरी कुंडली की कहानी।",
      }),
      learnLink("love-marriage", "💕", { en: "Love & Marriage", hi: "प्रेम व विवाह" }, {
        en: "Compatibility & timing.",
        hi: "मिलान और समय।",
      }),
      learnLink("mangal-dosha", "♂️", { en: "Mangal Dosha", hi: "मंगल दोष" }, {
        en: "Mars & marriage themes.",
        hi: "मंगल और विवाह।",
      }),
      learnLink("pitra-dosha", "🪔", { en: "Pitra Dosha", hi: "पितृ दोष" }, {
        en: "Ancestral karma patterns.",
        hi: "पितृ कर्म के संकेत।",
      }),
      learnLink("gemstone", "💎", { en: "Gemstone", hi: "रत्न" }, {
        en: "Lucky stones for your chart.",
        hi: "कुंडली अनुसार रत्न।",
      }),
      learnLink("dasha", "⏳", { en: "Dasha", hi: "दशा" }, {
        en: "Planetary time periods.",
        hi: "ग्रहीय काल खंड।",
      }),
      learnLink("saturn", "🪐", { en: "Saturn", hi: "शनि" }, {
        en: "Sade Sati & lessons.",
        hi: "साढ़े साती और शिक्षा।",
      }),
      learnLink("kaal-sarp-dosha", "🐍", { en: "Kaal Sarp Dosha", hi: "काल सर्प दोष" }, {
        en: "Rahu–Ketu axis themes.",
        hi: "राहु–केतु अक्ष।",
      }),
      learnLink("raj-yoga", "👑", { en: "Raj Yoga", hi: "राज योग" }, {
        en: "Yogas for rise & status.",
        hi: "उन्नति के योग।",
      }),
      learnLink("videsh-yoga", "✈️", { en: "Videsh Yoga", hi: "विदेश योग" }, {
        en: "Travel & foreign settlement.",
        hi: "यात्रा व विदेश बसना।",
      }),
    ],
  },
];

/** Three-column learn mega with report guides split for easier scanning. */
export function learnMegaColumns(): MegaColumnStack[] {
  const [vedic, western, reports] = LEARN_MENU;
  const mid = Math.ceil(reports.links.length / 2);
  return [
    { groups: [vedic] },
    { groups: [western] },
    {
      groups: [
        {
          heading: { en: "Report guides", hi: "विषय गाइड" },
          links: reports.links.slice(0, mid),
        },
        {
          heading: { en: "Timing & yogas", hi: "समय व योग" },
          links: reports.links.slice(mid),
        },
      ],
    },
  ];
}

export function sidebarGroups(excludeSlug?: string) {
  const order: CalcCategory[] = [
    "signs",
    "dosha",
    "matching",
    "kp",
    "remedies",
    "panchang",
    "numerology",
  ];
  return order.map((cat) => ({
    heading: CATEGORY_LABELS[cat],
    items: CALCULATORS.filter(
      (c) => c.category === cat && c.slug !== excludeSlug
    ),
  }));
}
