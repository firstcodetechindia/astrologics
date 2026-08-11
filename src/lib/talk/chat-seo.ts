export type ChatFaqItem = { q: { en: string; hi: string }; a: { en: string; hi: string } };

export const CHAT_ASTROLOGER_FAQ: ChatFaqItem[] = [
  {
    q: {
      en: "How does online chat with an astrologer work?",
      hi: "ऑनलाइन ज्योतिषी चैट कैसे काम करती है?",
    },
    a: {
      en: "Browse verified astrologers by category, language or skill. Select an expert, start a chat session and ask questions about your chart, timing or life decisions. Sessions are billed per minute on listed rates.",
      hi: "श्रेणी, भाषा या कौशल से सत्यापित ज्योतिषी चुनें। विशेषज्ञ चुनकर चैट शुरू करें और कुंडली, समय या जीवन निर्णय पर प्रश्न पूछें। सत्र सूचीबद्ध दर पर प्रति मिनट बिल होते हैं।",
    },
  },
  {
    q: {
      en: "When should I chat with a live astrologer instead of AI Guru?",
      hi: "एआई गुरु के बजाय लाइव ज्योतिषी से कब बात करें?",
    },
    a: {
      en: "Use AI Guru for quick chart explanations on calculated results. Choose a live astrologer when you need nuanced timing, relationship context, remedy prioritisation or a human second opinion on sensitive decisions.",
      hi: "गणना परिणामों की त्वरित व्याख्या के लिए एआई गुरु उपयोगी है। सूक्ष्म समय, संबंध संदर्भ, उपाय प्राथमिकता या संवेदनशील निर्णय पर मानवीय दृष्टि चाहिए तो लाइव ज्योतिषी चुनें।",
    },
  },
  {
    q: {
      en: "What topics can I discuss in a consultation?",
      hi: "परामर्श में किन विषयों पर बात कर सकते हैं?",
    },
    a: {
      en: "Common topics include marriage and relationship timing, career direction, finance cycles, health tendencies (not medical diagnosis), family matters, dosha analysis and classical remedies such as mantra or charity.",
      hi: "सामान्य विषय: विवाह व संबंध समय, करियर दिशा, वित्त चक्र, स्वास्थ्य प्रवृत्ति (चिकित्सा निदान नहीं), पारिवारिक मामले, दोष विश्लेषण और मंत्र या दान जैसे शास्त्रीय उपाय।",
    },
  },
  {
    q: {
      en: "Are the astrologers on Astrologics verified?",
      hi: "क्या Astrologics के ज्योतिषी सत्यापित हैं?",
    },
    a: {
      en: "Profiles show experience years, ratings, languages and a verified badge where applicable. We highlight specialists in Vedic chart reading, KP, numerology and related areas so you can match expertise to your question.",
      hi: "प्रोफ़ाइल में अनुभव वर्ष, रेटिंग, भाषाएँ और जहाँ लागू हो सत्यापन बैज दिखता है। वैदिक कुंडली, केपी, अंक ज्योतिष आदि में विशेषज्ञता दिखाई जाती है ताकि आप प्रश्न के अनुसार चुन सकें।",
    },
  },
  {
    q: {
      en: "Is the first chat free?",
      hi: "क्या पहली चैट मुफ्त है?",
    },
    a: {
      en: "Select experts display a first-chat-free offer on their profile card. Availability varies by astrologer — check the listing before you start. Other sessions follow the per-minute rate shown.",
      hi: "कुछ विशेषज्ञों की प्रोफ़ाइल पर पहली चैट मुफ्त का विकल्प दिखता है। उपलब्धता ज्योतिषी के अनुसार अलग होती है — शुरू करने से पहले सूची देखें। अन्य सत्र कार्ड पर दिखाई दर पर बिल होते हैं।",
    },
  },
  {
    q: {
      en: "What birth details should I share before chatting?",
      hi: "चैट से पहले कौन से जन्म विवरण साझा करें?",
    },
    a: {
      en: "Share date of birth, as-accurate birth time and birth place for house-based readings. If time is approximate, mention that so the astrologer can focus on Moon sign, Nakshatra and dasha themes reliably.",
      hi: "भाव-आधारित पठन के लिए जन्म तिथि, यथासंभव सटीक समय और जन्म स्थान साझा करें। समय अनुमानित हो तो बताएँ — ज्योतिषी चंद्र राशि, नक्षत्र और दशा विषयों पर ध्यान केंद्रित कर सकता है।",
    },
  },
];

export function chatFaqForLocale(locale: string) {
  const hi = locale === "hi";
  return CHAT_ASTROLOGER_FAQ.map((item) => ({
    q: hi ? item.q.hi : item.q.en,
    a: hi ? item.a.hi : item.a.en,
  }));
}
