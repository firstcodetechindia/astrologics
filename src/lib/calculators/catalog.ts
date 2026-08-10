export type CalcCategory =
  | "signs"
  | "dosha"
  | "matching"
  | "kp"
  | "remedies"
  | "panchang"
  | "numerology";

export type CalcInputType =
  | "birth"
  | "birth-optional-time"
  | "dual-birth"
  | "names"
  | "number"
  | "date"
  | "date-year"
  | "name-date"
  | "value"
  | "dual-date"
  | "place-date"
  | "none";

export interface CalculatorMeta {
  slug: string;
  category: CalcCategory;
  input: CalcInputType;
  icon: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
}

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "moon-sign",
    category: "signs",
    input: "birth-optional-time",
    icon: "🌙",
    title: { en: "Moon Sign Calculator", hi: "चंद्र राशि कैलकुलेटर" },
    description: {
      en: "Find your Rashi — the zodiac sign the Moon occupied at birth.",
      hi: "अपनी राशि जानें — जन्म पर चंद्र की राशि।",
    },
  },
  {
    slug: "sun-sign",
    category: "signs",
    input: "birth-optional-time",
    icon: "☀️",
    title: { en: "Sun Sign Calculator", hi: "सूर्य राशि कैलकुलेटर" },
    description: {
      en: "See Vedic and approximate Western Sun signs side by side.",
      hi: "वैदिक और पश्चिमी सूर्य राशि साथ में देखें।",
    },
  },
  {
    slug: "nakshatra",
    category: "signs",
    input: "birth-optional-time",
    icon: "✨",
    title: { en: "Nakshatra Calculator", hi: "नक्षत्र कैलकुलेटर" },
    description: {
      en: "Birth star, pada and dasha-starting planet.",
      hi: "जन्म नक्षत्र, पद और दशा आरंभ ग्रह।",
    },
  },
  {
    slug: "lagna",
    category: "signs",
    input: "birth",
    icon: "🌅",
    title: { en: "Lagna Calculator", hi: "लग्न कैलकुलेटर" },
    description: {
      en: "Rising sign on the eastern horizon at birth.",
      hi: "जन्म पर पूर्व क्षितिज की लग्न राशि।",
    },
  },
  {
    slug: "navamsa",
    category: "signs",
    input: "birth",
    icon: "🔯",
    title: { en: "Navamsa (D9) Calculator", hi: "नवमांश (D9) कैलकुलेटर" },
    description: {
      en: "Marriage and inner-strength chart with vargottama marks.",
      hi: "विवाह व आंतरिक बल का नवमांश — वर्गोत्तम सहित।",
    },
  },
  {
    slug: "moon-phase",
    category: "signs",
    input: "birth-optional-time",
    icon: "🌗",
    title: { en: "Moon Phase Calculator", hi: "चंद्र कला कैलकुलेटर" },
    description: {
      en: "Moon phase at birth (optional second date).",
      hi: "जन्म की चंद्र कला (वैकल्पिक दूसरी तिथि)।",
    },
  },
  {
    slug: "mangal-dosha",
    category: "dosha",
    input: "birth",
    icon: "♂️",
    title: { en: "Mangal Dosha Calculator", hi: "मंगल दोष कैलकुलेटर" },
    description: {
      en: "Check Manglik status and softening exceptions.",
      hi: "मंगलिक जाँच और संभावित निवारण संकेत।",
    },
  },
  {
    slug: "kaal-sarp-dosha",
    category: "dosha",
    input: "birth",
    icon: "🐍",
    title: { en: "Kaal Sarp Dosha", hi: "काल सर्प दोष" },
    description: {
      en: "Are all planets between Rahu and Ketu?",
      hi: "क्या सभी ग्रह राहु–केतु के बीच हैं?",
    },
  },
  {
    slug: "sade-sati",
    category: "dosha",
    input: "birth-optional-time",
    icon: "🪐",
    title: { en: "Sade Sati Calculator", hi: "साढ़े साती कैलकुलेटर" },
    description: {
      en: "Is Saturn transit in Sade Sati for your Moon sign?",
      hi: "क्या शनि आपकी चंद्र राशि पर साढ़े साती में है?",
    },
  },
  {
    slug: "vimshottari-dasha",
    category: "dosha",
    input: "birth-optional-time",
    icon: "⏳",
    title: { en: "Vimshottari Dasha", hi: "विंशोत्तरी दशा" },
    description: {
      en: "Major and current sub life-period timeline.",
      hi: "महादशा और वर्तमान अंतर्दशा समयरेखा।",
    },
  },
  {
    slug: "pitra-dosha",
    category: "dosha",
    input: "birth",
    icon: "🪔",
    title: { en: "Pitra Dosha Calculator", hi: "पितृ दोष कैलकुलेटर" },
    description: {
      en: "Sun / 9th / node flags for ancestral themes.",
      hi: "सूर्य / नवम / छाया ग्रह — पितृ विषय संकेत।",
    },
  },
  {
    slug: "kundli-matching",
    category: "matching",
    input: "dual-birth",
    icon: "💞",
    title: { en: "Kundli Matching", hi: "कुंडली मिलान" },
    description: {
      en: "Classical 36-point Ashtakoot Gun Milan.",
      hi: "शास्त्रीय 36 अंक अष्टकूट गुण मिलान।",
    },
  },
  {
    slug: "love-calculator",
    category: "matching",
    input: "names",
    icon: "❤️",
    title: { en: "Love Calculator", hi: "लव कैलकुलेटर" },
    description: {
      en: "Name-based love percentage (fun only).",
      hi: "नाम से प्रेम प्रतिशत (केवल मनोरंजन)।",
    },
  },
  {
    slug: "atmakaraka",
    category: "matching",
    input: "birth",
    icon: "🕉️",
    title: { en: "Atmakaraka & Darakaraka", hi: "आत्माकारक व दाराकारक" },
    description: {
      en: "Jaimini chara karaka ranking from degrees.",
      hi: "जामिनी चर कारक — अंश के अनुसार क्रम।",
    },
  },
  {
    slug: "ishta-devata",
    category: "matching",
    input: "birth",
    icon: "🛕",
    title: { en: "Ishta Devata Calculator", hi: "इष्ट देवता कैलकुलेटर" },
    description: {
      en: "Personal deity from Karakamsa (simplified).",
      hi: "कारकअंश से व्यक्तिगत देवता (सरलीकृत)।",
    },
  },
  {
    slug: "kp-horary",
    category: "kp",
    input: "number",
    icon: "🔢",
    title: { en: "KP Horary Number", hi: "केपी होररी संख्या" },
    description: {
      en: "Pick 1–249 for sign, star-lord and sub-lord.",
      hi: "1–249 चुनें — राशि, नक्षत्रेश व सूक्ष्म स्वामी।",
    },
  },
  {
    slug: "kp-sub-lord",
    category: "kp",
    input: "birth",
    icon: "🔭",
    title: { en: "KP Sub-Lord Finder", hi: "केपी सब-लॉर्ड" },
    description: {
      en: "Sub-lord of lagna and every planet.",
      hi: "लग्न और प्रत्येक ग्रह का सब-लॉर्ड।",
    },
  },
  {
    slug: "kp-ruling-planets",
    category: "kp",
    input: "none",
    icon: "🪐",
    title: { en: "KP Ruling Planets Now", hi: "केपी शासक ग्रह (अभी)" },
    description: {
      en: "Day-lord and Moon/Asc sub-lords for this moment.",
      hi: "इस क्षण के दिनेश व चंद्र/लग्न सब-लॉर्ड।",
    },
  },
  {
    slug: "gemstone",
    category: "remedies",
    input: "birth",
    icon: "💎",
    title: { en: "Gemstone Recommender", hi: "रत्न सुझाव" },
    description: {
      en: "Lucky gem by lagna and Moon sign.",
      hi: "लग्न व चंद्र राशि के अनुसार रत्न।",
    },
  },
  {
    slug: "rudraksha",
    category: "remedies",
    input: "birth",
    icon: "📿",
    title: { en: "Rudraksha Recommender", hi: "रुद्राक्ष सुझाव" },
    description: {
      en: "Mukhi bead for ruling planet.",
      hi: "स्वामी ग्रह के अनुसार मुखी रुद्राक्ष।",
    },
  },
  {
    slug: "baby-name",
    category: "panchang",
    input: "birth",
    icon: "👶",
    title: { en: "Baby Name Suggestions", hi: "शिशु नाम सुझाव" },
    description: {
      en: "Find Moon sign & auspicious starting letters from birth details.",
      hi: "जन्म विवरण से चंद्र राशि और शुभ आरंभ अक्षर।",
    },
  },
  {
    slug: "today-panchang",
    category: "panchang",
    input: "place-date",
    icon: "📅",
    title: { en: "Daily Panchang", hi: "दैनिक पंचांग" },
    description: {
      en: "Sunrise, moonrise, tithi, nakshatra & muhurat for any city.",
      hi: "किसी भी शहर के सूर्योदय, चंद्रोदय, तिथि, नक्षत्र व मुहूर्त।",
    },
  },
  {
    slug: "choghadiya",
    category: "panchang",
    input: "place-date",
    icon: "⏱️",
    title: { en: "Choghadiya Today", hi: "आज की चौघड़िया" },
    description: {
      en: "Day & night auspicious time windows for your city.",
      hi: "आपके शहर के दिन-रात शुभ समय खंड।",
    },
  },
  {
    slug: "gowri-panchangam",
    category: "panchang",
    input: "place-date",
    icon: "🪔",
    title: { en: "Gowri Panchangam", hi: "गौरी पंचांगम" },
    description: {
      en: "South-Indian Nalla Neram style day & night windows.",
      hi: "दक्षिण भारतीय नल्ला नेरम शैली के समय खंड।",
    },
  },
  {
    slug: "rahu-kaal",
    category: "panchang",
    input: "place-date",
    icon: "🌑",
    title: { en: "Rahu Kaal", hi: "राहु काल" },
    description: {
      en: "Daily inauspicious Rahu Kaal for your city.",
      hi: "आपके शहर का दैनिक राहु काल।",
    },
  },
  {
    slug: "hora",
    category: "panchang",
    input: "place-date",
    icon: "🪐",
    title: { en: "Hora", hi: "होरा" },
    description: {
      en: "Planetary hours through the day and night.",
      hi: "दिन-रात की ग्रहीय होरा।",
    },
  },
  {
    slug: "birth-panchang",
    category: "panchang",
    input: "birth",
    icon: "📜",
    title: { en: "Birth Panchang", hi: "जन्म पंचांग" },
    description: {
      en: "Tithi, nakshatra, yoga and karana at birth.",
      hi: "जन्म क्षण की तिथि, नक्षत्र, योग व करण।",
    },
  },
  {
    slug: "ayanamsa",
    category: "panchang",
    input: "date",
    icon: "🌐",
    title: { en: "Ayanamsa Calculator", hi: "अयनांश कैलकुलेटर" },
    description: {
      en: "Lahiri ayanamsa for any date.",
      hi: "किसी भी तिथि का लाहिरी अयनांश।",
    },
  },
  {
    slug: "life-path",
    category: "numerology",
    input: "date",
    icon: "🔢",
    title: { en: "Life Path Calculator", hi: "लाइफ पाथ कैलकुलेटर" },
    description: {
      en: "Radical and Life Path from date of birth.",
      hi: "जन्म तिथि से रेडिकल व लाइफ पाथ अंक।",
    },
  },
  {
    slug: "name-numerology",
    category: "numerology",
    input: "names",
    icon: "🔤",
    title: { en: "Name Numerology", hi: "नाम अंक ज्योतिष" },
    description: {
      en: "Destiny, soul-urge and personality numbers.",
      hi: "भाग्य, आत्मा व व्यक्तित्व अंक।",
    },
  },
  {
    slug: "mobile-number",
    category: "numerology",
    input: "value",
    icon: "📱",
    title: { en: "Mobile Number", hi: "मोबाइल नंबर" },
    description: {
      en: "Is your phone number favourable?",
      hi: "क्या आपका मोबाइल नंबर अनुकूल है?",
    },
  },
  {
    slug: "vehicle-number",
    category: "numerology",
    input: "value",
    icon: "🚗",
    title: { en: "Vehicle Number", hi: "वाहन नंबर" },
    description: {
      en: "Vehicle registration number vibration.",
      hi: "वाहन रजिस्ट्रेशन अंक विश्लेषण।",
    },
  },
  {
    slug: "house-number",
    category: "numerology",
    input: "value",
    icon: "🏠",
    title: { en: "House Number", hi: "मकान नंबर" },
    description: {
      en: "Home or flat number favourability.",
      hi: "घर / फ्लैट नंबर अनुकूलता।",
    },
  },
  {
    slug: "business-name",
    category: "numerology",
    input: "names",
    icon: "🏢",
    title: { en: "Business Name", hi: "व्यवसाय नाम" },
    description: {
      en: "Brand or business name number.",
      hi: "ब्रांड या व्यवसाय नाम का अंक।",
    },
  },
  {
    slug: "personal-year",
    category: "numerology",
    input: "date-year",
    icon: "📅",
    title: { en: "Personal Year", hi: "व्यक्तिगत वर्ष" },
    description: {
      en: "Theme number for a chosen calendar year.",
      hi: "चुने हुए वर्ष का थीम अंक।",
    },
  },
  {
    slug: "lo-shu-grid",
    category: "numerology",
    input: "date",
    icon: "#️⃣",
    title: { en: "Lo Shu Grid", hi: "लो शू ग्रिड" },
    description: {
      en: "3×3 birth grid — present, missing, repeating.",
      hi: "3×3 जन्म ग्रिड — मौजूद, अनुपस्थित, दोहराव।",
    },
  },
  {
    slug: "love-compatibility-num",
    category: "numerology",
    input: "dual-date",
    icon: "💞",
    title: { en: "Numerology Love Match", hi: "अंक ज्योतिष प्रेम मिलान" },
    description: {
      en: "Compare two birth dates by Life Path.",
      hi: "दो जन्म तिथियों का लाइफ पाथ मिलान।",
    },
  },
  {
    slug: "name-correction",
    category: "numerology",
    input: "name-date",
    icon: "✍️",
    title: { en: "Name Correction", hi: "नाम सुधार" },
    description: {
      en: "Does your name number harmonize with birth numbers?",
      hi: "क्या नाम अंक जन्म अंकों से मेल खाता है?",
    },
  },
];

export const CATEGORY_LABELS: Record<
  CalcCategory,
  { en: string; hi: string }
> = {
  signs: { en: "Signs & Birth Chart", hi: "राशि व कुंडली" },
  dosha: { en: "Dosha & Dasha", hi: "दोष व दशा" },
  matching: { en: "Matching & Jaimini", hi: "मिलान व जामिनी" },
  kp: { en: "KP Astrology", hi: "केपी ज्योतिष" },
  remedies: { en: "Remedies", hi: "उपचार" },
  panchang: { en: "Panchang & Lifestyle", hi: "पंचांग व जीवन" },
  numerology: { en: "Numerology", hi: "अंक ज्योतिष" },
};

export function getCalculator(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function calculatorsByCategory() {
  const map = new Map<CalcCategory, CalculatorMeta[]>();
  for (const c of CALCULATORS) {
    const list = map.get(c.category) || [];
    list.push(c);
    map.set(c.category, list);
  }
  return map;
}
