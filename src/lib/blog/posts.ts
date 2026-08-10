export interface BlogPost {
  slug: string;
  locale: "en" | "hi";
  title: string;
  description: string;
  date: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-vedic-kundli",
    locale: "en",
    title: "What is a Vedic Kundli?",
    description:
      "A clear introduction to birth chart, lagna, signs and why birth time matters.",
    date: "2026-03-01",
    content: [
      "A Vedic kundli is a map of the sky at your exact birth moment, based on the fixed stars.",
      "Unlike many Western sun-sign columns, Vedic calculation uses India’s standard correction method (Lahiri) so planet positions match the nakshatras.",
      "The Lagna (rising sign) changes roughly every two hours — that is why accurate birth time is essential for houses.",
      "Your free online chart covers lagna, planets, houses, yogas and life-period dasha. Deeper remedies and timing are best discussed personally.",
    ],
  },
  {
    slug: "what-is-vedic-kundli",
    locale: "hi",
    title: "वैदिक कुंडली क्या होती है?",
    description:
      "जन्म कुंडली, लग्न, राशियाँ और जन्म समय क्यों जरूरी है — सरल परिचय।",
    date: "2026-03-01",
    content: [
      "वैदिक कुंडली आपके जन्म के क्षण के आकाश का मानचित्र है — स्थिर नक्षत्रों के अनुसार।",
      "पाश्चात्य सूर्य-राशि स्तंभों से अलग, वैदिक गणना भारत में प्रचलित मानक पद्धति (लाहिरी) से ग्रह स्थिति नक्षत्रों से मिलाती है।",
      "लग्न लगभग हर दो घंटे में बदलता है — इसलिए भावों के लिए सही जन्म समय आवश्यक है।",
      "इस साइट की मुफ्त कुंडली लग्न, ग्रह, भाव, योग और जीवन काल दशा का स्पष्ट आरंभ बिंदु है। गहन उपाय व्यक्तिगत परामर्श में बेहतर हैं।",
    ],
  },
  {
    slug: "lagna-vs-rashi",
    locale: "en",
    title: "Lagna vs Moon sign — what to read first",
    description:
      "Understand rising sign, Moon sign and Sun sign in Vedic astrology.",
    date: "2026-03-08",
    content: [
      "Lagna shows how you meet the world — body, vitality and overall life approach.",
      "Moon sign reflects mind, emotions and the nakshatra that starts your life-period dasha.",
      "Sun sign relates to purpose and authority themes, but in Jyotish it is not the only headline.",
      "A balanced reading weaves lagna, Moon and dasha together — which our report shows before a deeper consultation.",
    ],
  },
  {
    slug: "lagna-vs-rashi",
    locale: "hi",
    title: "लग्न और चंद्र राशि — पहले क्या देखें",
    description: "वैदिक ज्योतिष में उदय लग्न, चंद्र राशि और सूर्य राशि समझें।",
    date: "2026-03-08",
    content: [
      "लग्न बताता है आप संसार से कैसे मिलते हैं — शरीर, ऊर्जा और जीवन दृष्टिकोण।",
      "चंद्र राशि मन, भावनाएँ और वह नक्षत्र दर्शाती है जहाँ से जीवन काल दशा शुरू होती है।",
      "सूर्य राशि उद्देश्य और अधिकार से जुड़ी है, पर ज्योतिष में अकेले अखबारी सूर्य-राशि जितनी नहीं।",
      "संतुलित समझ लग्न, चंद्र और दशा को जोड़ती है — हमारी कुंडली इसे परामर्श से पहले दिखाती है।",
    ],
  },
  {
    slug: "vimshottari-dasha-basics",
    locale: "en",
    title: "Life-period dasha basics",
    description:
      "How major and sub periods help with life timing in Jyotish.",
    date: "2026-03-15",
    content: [
      "The classic life-period system (Vimshottari) spans 120 years and starts from the Moon’s nakshatra at birth.",
      "The major period sets the broad chapter of life; the sub-period refines its tone.",
      "Current planet movements then color the present month or year — especially Saturn and Jupiter.",
      "Your online result shows current major and sub periods. For event timing and remedies, message us with birth details.",
    ],
  },
  {
    slug: "vimshottari-dasha-basics",
    locale: "hi",
    title: "जीवन काल दशा की मूल बातें",
    description: "महादशा और अंतरदशा जीवन का समय कैसे बताती हैं।",
    date: "2026-03-15",
    content: [
      "शास्त्रीय जीवन काल दशा लगभग 120 वर्ष की होती है और जन्म के चंद्र नक्षत्र से शुरू होती है।",
      "महादशा जीवन का बड़ा अध्याय तय करती है; अंतरदशा उस अध्याय का स्वर सूक्ष्म करती है।",
      "गोचर (वर्तमान ग्रह गति) फिर वर्तमान माह या वर्ष को रंग देता है — खासकर शनि और गुरु।",
      "आपके ऑनलाइन परिणाम में वर्तमान महादशा व अंतरदशा दिखते हैं। घटना समय और उपचार के लिए जन्म विवरण के साथ संदेश करें।",
    ],
  },
  {
    slug: "when-to-seek-upchaar",
    locale: "en",
    title: "When to seek remedies",
    description:
      "How to use remedies wisely — without fear or superstition overload.",
    date: "2026-03-22",
    content: [
      "Remedies in Jyotish can include mantra, charity, lifestyle changes and sometimes gemstones — always chart-specific.",
      "Remedies work best as support for effort, not as a substitute for action or medical care.",
      "If your online chart shows challenge yogas or a heavy period, a short consultation can prioritize what actually helps.",
      "Talk with us and share birth details for personalized guidance.",
    ],
  },
  {
    slug: "when-to-seek-upchaar",
    locale: "hi",
    title: "उपाय कब लें",
    description: "भय या अंधविश्वास के बिना उपाय कैसे समझें।",
    date: "2026-03-22",
    content: [
      "ज्योतिष में उपाय में मंत्र, दान, जीवनशैली और कभी-कभी रत्न शामिल हो सकते हैं — हमेशा कुंडली के अनुसार।",
      "उपाय प्रयास के सहायक होते हैं, कर्म या चिकित्सा का विकल्प नहीं।",
      "यदि ऑनलाइन कुंडली में चुनौती योग या भारी दशा दिखे, संक्षिप्त परामर्श प्राथमिकता तय कर सकता है।",
      "व्यक्तिगत मार्गदर्शन के लिए जन्म विवरण के साथ व्हाट्सऐप करें।",
    ],
  },
];
