type LocaleText = { en: string; hi: string };

export const KUNDLI_PAGE_FAQS: { q: LocaleText; a: LocaleText }[] = [
  {
    q: {
      en: "What details do I need to generate a Kundli?",
      hi: "कुंडली बनाने के लिए क्या विवरण चाहिए?",
    },
    a: {
      en: "Date of birth, exact time of birth, and place of birth. Name and gender are optional helpers for presentation.",
      hi: "जन्म तिथि, यथासंभव सटीक जन्म समय और जन्म स्थान। नाम व लिंग प्रस्तुति के लिए वैकल्पिक हैं।",
    },
  },
  {
    q: {
      en: "Which calculation method does CosmicTalks use?",
      hi: "CosmicTalks कौन-सी गणना पद्धति उपयोग करता है?",
    },
    a: {
      en: "India’s standard Lahiri (sidereal) ayanamsa with whole-sign houses.",
      hi: "भारत का मानक लाहिरी (निरयण) अयनांश और पूर्ण-राशि भाव पद्धति।",
    },
  },
  {
    q: {
      en: "Can I generate a Kundli without exact birth time?",
      hi: "क्या बिना सटीक जन्म समय के कुंडली बन सकती है?",
    },
    a: {
      en: "Yes, but house placements (including Lagna) won’t be fully accurate — Nakshatra and planetary signs can still be useful.",
      hi: "हाँ, पर भाव व लग्न पूर्णतः सटीक नहीं होंगे — नक्षत्र और ग्रह राशियाँ फिर भी सहायक हो सकती हैं।",
    },
  },
  {
    q: {
      en: "Is this Kundli free?",
      hi: "क्या यह कुंडली मुफ्त है?",
    },
    a: {
      en: "Yes. Chart generation on CosmicTalks is completely free.",
      hi: "हाँ। CosmicTalks पर कुंडली बनाना पूरी तरह मुफ्त है।",
    },
  },
];
