export type HomeFaqItem = {
  q: { en: string; hi: string };
  a: { en: string; hi: string };
};

/** Homepage FAQ — also used for FAQPage structured data. */
export const HOME_FAQ: HomeFaqItem[] = [
  {
    q: {
      en: "What is a Kundli?",
      hi: "कुंडली क्या है?",
    },
    a: {
      en: "A Kundli (Janam Kundali) is a birth chart that maps planetary positions at your birth into signs, houses, Nakshatras and related factors used in traditional Indian astrology.",
      hi: "कुंडली (जन्म कुंडली) एक जन्म-चार्ट है जिसमें जन्म के समय ग्रहों की स्थिति को राशि, भाव, नक्षत्र और अन्य पारंपरिक भारतीय ज्योतिषीय घटकों में व्यवस्थित किया जाता है।",
    },
  },
  {
    q: {
      en: "Which astrology systems does Astrologics cover?",
      hi: "Astrologics किन ज्योतिष प्रणालियों को कवर करता है?",
    },
    a: {
      en: "Multiple traditions: free Janam Kundli (Lahiri sidereal), Western learning guides, KP calculators, numerology tools, daily horoscope and Panchang. Each area is labelled so you know which system you are using.",
      hi: "कई परंपराएँ: मुफ्त जन्म कुंडली (लाहिरी निरयण), पश्चिमी गाइड, केपी कैलकुलेटर, अंक ज्योतिष, दैनिक राशिफल और पंचांग। प्रत्येक क्षेत्र स्पष्ट रूप से बताया जाता है।",
    },
  },
  {
    q: {
      en: "How is a Janam Kundli calculated?",
      hi: "जन्म कुंडली की गणना कैसे होती है?",
    },
    a: {
      en: "Astrologics converts your birth date, time and place into planetary longitudes using sidereal methods (Lahiri/Chitrapaksha ayanamsa), then places them in whole-sign houses with Nakshatras, dashas and related charts.",
      hi: "Astrologics आपकी जन्म तिथि, समय और स्थान से निरयण पद्धति (लाहिरी/चित्रापक्ष अयनांश) से ग्रहीय देशांतर निकालता है, फिर उन्हें पूर्ण-राशि भावों, नक्षत्रों, दशा और संबंधित वर्ग चार्ट में रखता है।",
    },
  },
  {
    q: {
      en: "What details are needed to generate a Kundli?",
      hi: "कुंडली बनाने के लिए क्या विवरण चाहिए?",
    },
    a: {
      en: "Date of birth, exact birth time (as accurate as possible), and birth place. Name and gender are optional helpers for presentation.",
      hi: "जन्म तिथि, यथासंभव सटीक जन्म समय, और जन्म स्थान। नाम व लिंग प्रस्तुति के लिए वैकल्पिक हैं।",
    },
  },
  {
    q: {
      en: "Why is birth time important?",
      hi: "जन्म समय क्यों महत्वपूर्ण है?",
    },
    a: {
      en: "Birth time helps determine the Lagna (Ascendant) and the house sequence. When the Ascendant is near a sign boundary, even a small difference can change house-based interpretation.",
      hi: "जन्म समय लग्न (उदय राशि) और भाव-क्रम तय करने में मदद करता है। जब लग्न राशि की सीमा के निकट हो, तो थोड़ा अंतर भी भाव-आधारित व्याख्या बदल सकता है।",
    },
  },
  {
    q: {
      en: "What is Lagna?",
      hi: "लग्न क्या है?",
    },
    a: {
      en: "Lagna is the zodiac sign rising on the eastern horizon at birth. In whole-sign houses it becomes the first house and sets the sequence of the remaining eleven houses.",
      hi: "लग्न वह राशि है जो जन्म के समय पूर्व क्षितिज पर उदय हो रही होती है। पूर्ण-राशि भाव पद्धति में यह प्रथम भाव बनती है और शेष ग्यारह भावों का क्रम तय करती है।",
    },
  },
  {
    q: {
      en: "What is Moon Sign?",
      hi: "चंद्र राशि क्या है?",
    },
    a: {
      en: "Your Moon sign (Chandra Rashi) is the sidereal zodiac sign occupied by the Moon at birth. It is widely used for emotional patterns, naming traditions and dasha starting points.",
      hi: "चंद्र राशि वह निरयण राशि है जिसमें जन्म के समय चंद्रमा स्थित था। इसे भावनात्मक प्रवृत्ति, नामकरण परंपरा और दशा आरंभ बिंदु के लिए व्यापक रूप से देखा जाता है।",
    },
  },
  {
    q: {
      en: "What is Nakshatra?",
      hi: "नक्षत्र क्या है?",
    },
    a: {
      en: "Nakshatras are the 27 lunar mansions that divide the zodiac more finely than signs. Your birth Nakshatra (usually from the Moon) adds nuance to temperament and starts the Vimshottari dasha sequence.",
      hi: "नक्षत्र 27 चंद्र-मंडल हैं जो राशि से अधिक सूक्ष्म विभाजन देते हैं। जन्म नक्षत्र (सामान्यतः चंद्र से) स्वभाव की बारीकी और विंशोत्तरी दशा क्रम दोनों से जुड़ा होता है।",
    },
  },
  {
    q: {
      en: "What is Vimshottari Dasha?",
      hi: "विंशोत्तरी दशा क्या है?",
    },
    a: {
      en: "Vimshottari is a major traditional timing system spanning about 120 years. It divides life into planetary Mahadashas and finer Antardasha/Pratyantar periods based on the Moon’s Nakshatra at birth.",
      hi: "विंशोत्तरी लगभग 120 वर्षों का प्रमुख पारंपरिक समय-तंत्र है। यह जन्म के चंद्र-नक्षत्र के आधार पर जीवन को ग्रहीय महादशा और सूक्ष्म अंतर्दशा/प्रत्यंतर अवधियों में बाँटता है।",
    },
  },
  {
    q: {
      en: "Do you offer Western astrology?",
      hi: "क्या पश्चिमी ज्योतिष भी है?",
    },
    a: {
      en: "Yes. Learn guides cover Western signs, planets, houses and aspects, and the Sun Sign calculator can show an approximate tropical Sun beside the sidereal one. Full tropical Western birth-chart engine is not the same as the Janam Kundli report.",
      hi: "हाँ। सीखें गाइड में पश्चिमी राशि, ग्रह, भाव और दृष्टि हैं, और सूर्य राशि कैलकुलेटर सन्निकट ट्रॉपिकल सूर्य भी दिखा सकता है। पूर्ण ट्रॉपिकल पश्चिमी जन्म-चार्ट इंजन जन्म कुंडली रिपोर्ट से अलग है।",
    },
  },
  {
    q: {
      en: "What is KP astrology here?",
      hi: "यहाँ केपी ज्योतिष क्या है?",
    },
    a: {
      en: "KP tools include horary number, sub-lord and ruling-planet helpers, plus a KP learning guide — a separate toolkit from the main Janam Kundli report.",
      hi: "केपी उपकरणों में प्रश्न संख्या, उपस्वामी और शासक-ग्रह सहायक हैं, साथ में केपी गाइड — यह मुख्य जन्म कुंडली रिपोर्ट से अलग टूलकिट है।",
    },
  },
  {
    q: {
      en: "What is a Navamsa chart?",
      hi: "नवमांश चार्ट क्या है?",
    },
    a: {
      en: "Navamsa (D9) is a divisional chart traditionally examined for marriage themes and deeper planetary strength. It does not replace the main birth chart; it refines how certain factors are read.",
      hi: "नवमांश (D9) एक वर्ग चार्ट है जिसे परंपरा में विशेषकर विवाह विषयों और ग्रहों की गहन शक्ति के लिए देखा जाता है। यह मुख्य जन्म कुंडली का विकल्प नहीं, बल्कि पूरक दृष्टि है।",
    },
  },
  {
    q: {
      en: "Is Astrologics Kundli free?",
      hi: "क्या Astrologics कुंडली मुफ्त है?",
    },
    a: {
      en: "Yes. You can generate a free Janam Kundli and use free calculators. Optional human consultation is available separately if you want personal guidance.",
      hi: "हाँ। आप मुफ्त जन्म कुंडली बना सकते हैं और मुफ्त कैलकुलेटर उपयोग कर सकते हैं। व्यक्तिगत मार्गदर्शन के लिए वैकल्पिक परामर्श अलग उपलब्ध है।",
    },
  },
  {
    q: {
      en: "How does AI Astrology work?",
      hi: "एआई ज्योतिष कैसे काम करता है?",
    },
    a: {
      en: "AI Guru answers questions about your calculated chart in plain language. It interprets results that the calculation engine already produced.",
      hi: "एआई गुरु आपकी गणना की गई कुंडली पर सरल भाषा में प्रश्न का उत्तर देता है। यह उन परिणामों की व्याख्या करता है जिन्हें गणना इंजन पहले निकाल चुका होता है।",
    },
  },
  {
    q: {
      en: "Does AI calculate my planetary positions?",
      hi: "क्या एआई मेरे ग्रहों की स्थिति स्वयं निकालता है?",
    },
    a: {
      en: "No. Planetary positions, houses and dashas are calculated first by the astrology engine. AI does not invent planetary positions.",
      hi: "नहीं। ग्रह स्थिति, भाव और दशा पहले ज्योतिष गणना इंजन से निकलती हैं। एआई ग्रहीय स्थितियाँ गढ़ता नहीं है।",
    },
  },
  {
    q: {
      en: "Can astrology predict the future?",
      hi: "क्या ज्योतिष भविष्य निश्चित रूप से बता सकता है?",
    },
    a: {
      en: "Astrology offers a traditional framework for reflection on tendencies and timing. It should support your judgement—not replace medical, legal, financial or personal decisions.",
      hi: "ज्योतिष प्रवृत्तियों और समय पर चिंतन का पारंपरिक ढाँचा देता है। यह आपके निर्णय का सहायक हो सकता है—चिकित्सा, कानूनी, वित्तीय या व्यक्तिगत निर्णयों का विकल्प नहीं।",
    },
  },
  {
    q: {
      en: "What if I don’t know my exact birth time?",
      hi: "यदि सटीक जन्म समय न पता हो तो?",
    },
    a: {
      en: "You can still explore Moon sign, Nakshatra, numerology and some transit themes. House-based readings (Lagna, houses, many yogas) become less reliable with approximate birth time.",
      hi: "आप फिर भी चंद्र राशि, नक्षत्र, अंक ज्योतिष और कुछ गोचर विषय देख सकते हैं। भाव-आधारित पठन (लग्न, भाव, कई योग) अनुमानित समय पर कम विश्वसनीय होते हैं।",
    },
  },
];

export function faqForLocale(locale: string) {
  const hi = locale === "hi";
  return HOME_FAQ.map((item) => ({
    question: hi ? item.q.hi : item.q.en,
    answer: hi ? item.a.hi : item.a.en,
  }));
}
