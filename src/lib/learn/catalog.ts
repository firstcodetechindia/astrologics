import type {
  LearnCategory,
  LearnGuide,
  LocaleText,
} from "@/lib/learn/types";
import { TOPIC_GUIDES } from "@/lib/learn/guides";
import { VEDIC_GUIDES } from "@/lib/learn/vedic";
import { WESTERN_GUIDES } from "@/lib/learn/western";

const L = (en: string, hi: string): LocaleText => ({ en, hi });

export const GLOSSARY_GUIDE: LearnGuide = {
  slug: "glossary",
  category: "reference",
  icon: "📖",
  menuTitle: L("Glossary", "शब्दावली"),
  menuDescription: L(
    "A quick reference for common Jyotish and Panchang terms.",
    "सामान्य ज्योतिष और पंचांग शब्दों की त्वरित संदर्भ सूची।"
  ),
  title: L("Jyotish Glossary", "ज्योतिष शब्दावली"),
  subtitle: L(
    "A bilingual reference page for the Sanskrit and astrological vocabulary used across the site.",
    "साइट पर प्रयुक्त संस्कृत और ज्योतिषीय शब्दावली की द्विभाषी संदर्भ सूची।"
  ),
  description: L(
    "Browse a bilingual glossary of common Jyotish, Panchang, and chart-reading terms used throughout the learn section.",
    "सीखें अनुभाग में प्रयुक्त सामान्य ज्योतिष, पंचांग और कुंडली-पठन शब्दों की द्विभाषी शब्दावली देखें।"
  ),
  intro: [
    L(
      "Jyotish uses a technical vocabulary that becomes much easier once the core words are familiar. This glossary gives short working definitions so readers can move from confusion to confident reading more quickly.",
      "ज्योतिष की अपनी तकनीकी शब्दावली है, जो मूल शब्दों से परिचित होते ही काफी आसान हो जाती है। यह शब्दावली छोटे-छोटे कामचलाऊ अर्थ देती है ताकि पाठक जल्दी भ्रम से स्पष्ट समझ तक पहुँच सकें।"
    ),
    L(
      "Use it as a companion while reading the guides, calculators, or kundli results. Most terms are explained in plain language first, while still respecting the traditional meaning behind the word.",
      "गाइड, कैलकुलेटर या कुंडली-परिणाम पढ़ते समय इसे साथ रखें। अधिकांश शब्दों को पहले सरल भाषा में समझाया गया है, साथ ही उनके पारंपरिक अर्थ का सम्मान भी रखा गया है।"
    ),
  ],
  sections: [
    {
      heading: L("How to use this glossary", "इस शब्दावली का उपयोग कैसे करें"),
      paragraphs: [
        L(
          "Look up unfamiliar terms as you read, then return to the larger guide. Over time, repeated words such as Lagna, Rashi, Dasha, Yoga, and Nakshatra become intuitive, and full chart reading becomes much easier to follow.",
          "पढ़ते समय अपरिचित शब्द देखें, फिर मूल गाइड पर लौट जाएँ। समय के साथ लग्न, राशि, दशा, योग और नक्षत्र जैसे शब्द स्वाभाविक लगने लगते हैं और पूरी कुंडली को समझना आसान हो जाता है।"
        ),
      ],
    },
    {
      heading: L("Reference, not rigid doctrine", "यह संदर्भ है, कठोर सिद्धांत नहीं"),
      paragraphs: [
        L(
          "Some terms are used slightly differently by different schools. The glossary definitions here aim to be practical and accurate for site-wide use, while leaving room for deeper study in classical texts and advanced traditions.",
          "कुछ शब्द अलग-अलग परंपराओं में थोड़ा भिन्न अर्थों में भी प्रयुक्त होते हैं। यहाँ दी गई परिभाषाएँ पूरे साइट उपयोग के लिए व्यावहारिक और सटीक रखी गई हैं, साथ ही शास्त्रीय ग्रंथों और उन्नत परंपराओं के लिए गहराई की जगह भी छोड़ी गई है।"
        ),
      ],
    },
  ],
  relatedSlugs: ["zodiac", "planets", "houses", "dasha"],
};

export const LEARN_GUIDES: LearnGuide[] = [
  ...VEDIC_GUIDES,
  ...WESTERN_GUIDES,
  ...TOPIC_GUIDES,
  GLOSSARY_GUIDE,
];

export const LEARN_GUIDE_SLUGS = LEARN_GUIDES.map((guide) => guide.slug);

export function getLearnGuide(slug: string) {
  return LEARN_GUIDES.find((guide) => guide.slug === slug);
}

export function getGuidesByCategory(category: LearnCategory) {
  return LEARN_GUIDES.filter((guide) => guide.category === category);
}

export type LearnHubSection = {
  category: LearnCategory;
  icon: string;
  title: LocaleText;
  description: LocaleText;
  guides: LearnGuide[];
};

export const LEARN_HUB_SECTIONS: LearnHubSection[] = [
  {
    category: "vedic",
    icon: "🕉️",
    title: L("Vedic Basics", "वैदिक मूल बातें"),
    description: L(
      "Core Jyotish foundations: rashis, grahas, bhavas, numerology, and KP basics.",
      "मुख्य ज्योतिष आधार: राशियाँ, ग्रह, भाव, अंक ज्योतिष और केपी की मूल बातें।"
    ),
    guides: getGuidesByCategory("vedic"),
  },
  {
    category: "western",
    icon: "🌍",
    title: L("Western Astrology", "पश्चिमी ज्योतिष"),
    description: L(
      "A structured introduction to tropical signs, planetary meanings, houses, and aspects.",
      "ट्रॉपिकल राशियों, ग्रहों, भावों और आस्पेक्ट्स का व्यवस्थित परिचय।"
    ),
    guides: getGuidesByCategory("western"),
  },
  {
    category: "guides",
    icon: "🪔",
    title: L("Practical Topics", "व्यावहारिक विषय"),
    description: L(
      "Applied guides on dasha, marriage, doshas, Saturn, gemstones, and foreign-settlement themes.",
      "दशा, विवाह, दोष, शनि, रत्न और विदेश योग जैसे उपयोगी विषयों पर मार्गदर्शिकाएँ।"
    ),
    guides: getGuidesByCategory("guides"),
  },
  {
    category: "reference",
    icon: "📖",
    title: L("Reference", "संदर्भ"),
    description: L(
      "Fast lookups for Sanskrit and Jyotish vocabulary used across the site.",
      "साइट पर प्रयुक्त संस्कृत और ज्योतिषीय शब्दों के लिए त्वरित संदर्भ।"
    ),
    guides: getGuidesByCategory("reference"),
  },
];
