export type LocaleText = { en: string; hi: string };

export type CalcPageContent = {
  h1: LocaleText;
  intro: LocaleText;
  promo?: {
    text: LocaleText;
    cta: LocaleText;
    href: string;
  };
  sections: { title: LocaleText; body: LocaleText; steps?: LocaleText[] }[];
  faqs: { q: LocaleText; a: LocaleText }[];
  references?: LocaleText[];
  disclaimer?: LocaleText;
};

const DEFAULT_DISCLAIMER: LocaleText = {
  en: "For guidance and self-reflection. Not a substitute for medical, legal or financial advice. For serious decisions, consult a qualified astrologer.",
  hi: "मार्गदर्शन हेतु। चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं। गंभीर निर्णयों के लिए योग्य ज्योतिषी से परामर्श लें।",
};

function genericContent(
  title: LocaleText,
  topic: LocaleText,
  extraFaqs: { q: LocaleText; a: LocaleText }[] = []
): CalcPageContent {
  return {
    h1: title,
    intro: {
      en: `Free online ${topic.en} calculator for Vedic astrology (Jyotish). Get a clear Lahiri-based result in seconds — then open your full janam kundali or ask Astrologics AI Guru for chart-specific guidance in English or Hindi.`,
      hi: `वैदिक ज्योतिष हेतु मुफ़्त ऑनलाइन ${topic.hi} कैलकुलेटर। लाहिरी आधारित स्पष्ट परिणाम सेकंडों में — फिर पूर्ण जन्म कुंडली खोलें या Astrologics एआई गुरु से चार्ट-विशिष्ट मार्गदर्शन लें।`,
    },
    promo: {
      text: {
        en: "Want a full birth chart with houses, yogas and dasha?",
        hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?",
      },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: {
          en: `What this ${topic.en} calculator shows`,
          hi: `यह ${topic.hi} कैलकुलेटर क्या दिखाता है`,
        },
        body: {
          en: `This ${topic.en} page is for searchers who want fast, trustworthy Vedic answers. Results use Lahiri ayanamsa and whole-sign houses where birth time matters. Treat the reading as a starting map — deepen with kundli, dasha timing and AI chat for career, marriage or remedies.`,
          hi: `यह ${topic.hi} पृष्ठ तेज़ और विश्वसनीय वैदिक उत्तर चाहने वालों के लिए है। परिणाम लाहिरी अयनांश और जहाँ समय ज़रूरी हो वहाँ एक-राशि भाव पर हैं। इसे आरंभिक मानचित्र मानें — करियर, विवाह या उपाय हेतु कुंडली, दशा और एआई चैट से गहराई लें।`,
        },
      },
      {
        title: {
          en: `Why use an online ${topic.en} calculator?`,
          hi: `ऑनलाइन ${topic.hi} कैलकुलेटर क्यों?`,
        },
        body: {
          en: `People search ${topic.en} online for instant clarity before a consultation. Astrologics keeps tools free, bilingual (EN & HI), and linked to panchang, moon sign, gun milan, mangal dosha, sade sati and more.`,
          hi: `लोग परामर्श से पहले तुरंत स्पष्टता हेतु ${topic.hi} खोजते हैं। Astrologics उपकरण मुफ़्त, द्विभाषी हैं और पंचांग, चंद्र राशि, गुण मिलान, मंगल दोष, साढ़े साती से जुड़े हैं।`,
        },
      },
      {
        title: { en: "How to use this page", hi: "इस पृष्ठ का उपयोग कैसे करें" },
        body: {
          en: "Fill the form carefully. Exact birth time improves lagna-based tools. After calculating, read FAQs and related calculators in the sidebar.",
          hi: "फ़ॉर्म ध्यान से भरें। सटीक जन्म समय लग्न उपकरणों की सटीकता बढ़ाता है। गणना के बाद FAQ और साइडबार के कैलकुलेटर देखें।",
        },
        steps: [
          {
            en: "Enter the requested name, date, time or place fields.",
            hi: "माँगे गए नाम, तिथि, समय या स्थान भरें।",
          },
          {
            en: "Tap Calculate and read the structured result.",
            hi: "गणना करें और संरचित परिणाम पढ़ें।",
          },
          {
            en: "Open related tools from the sidebar or book WhatsApp guidance.",
            hi: "साइडबार से संबंधित उपकरण खोलें या व्हाट्सऐप मार्गदर्शन लें।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: {
          en: "Is this calculator free?",
          hi: "क्या यह कैलकुलेटर मुफ्त है?",
        },
        a: {
          en: `Yes. Astrologics ${topic.en} tools are free online. Optional personal readings are available via AI Guru chat or WhatsApp.`,
          hi: `हाँ। Astrologics ${topic.hi} उपकरण ऑनलाइन मुफ़्त हैं। वैकल्पिक व्यक्तिगत पढ़ाई एआई गुरु चैट या व्हाट्सऐप पर उपलब्ध है।`,
        },
      },
      {
        q: {
          en: "Is this Vedic astrology or Western sun-sign astrology?",
          hi: "यह वैदिक ज्योतिष है या पश्चिमी सूर्य-राशि?",
        },
        a: {
          en: "Vedic (Jyotish) with Lahiri ayanamsa. Moon sign is often preferred for daily life; Sun sign adds context. Full kundli needs exact birth time and place.",
          hi: "वैदिक ज्योतिष — लाहिरी अयनांश। दैनिक जीवन हेतु अक्सर चंद्र राशि; सूर्य राशि सहायक। पूर्ण कुंडली हेतु सटीक जन्म समय-स्थान।",
        },
      },
      {
        q: {
          en: "Do you store my birth details?",
          hi: "क्या आप मेरे जन्म विवरण संग्रहित करते हैं?",
        },
        a: {
          en: "Your chart is calculated while you use the tool. We do not keep a permanent birth record from these free calculators.",
          hi: "गणना आपके उपयोग के समय होती है। इन मुफ्त कैलकुलेटर से स्थायी जन्म-रिकॉर्ड नहीं रखा जाता।",
        },
      },
      {
        q: {
          en: "English or Hindi — which should I use?",
          hi: "अंग्रेज़ी या हिंदी — क्या चुनूँ?",
        },
        a: {
          en: "Either. Switch language anytime; explanations stay clear in both where possible.",
          hi: "दोनों ठीक हैं। भाषा कभी भी बदलें; जहाँ संभव हो स्पष्टीकरण दोनों में मिलते हैं।",
        },
      },
      ...extraFaqs,
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

export const CALC_CONTENT: Record<string, CalcPageContent> = {
  "love-calculator": {
    h1: {
      en: "Love Calculator — Compatibility by Name",
      hi: "लव कैलकुलेटर — नाम से अनुकूलता",
    },
    intro: {
      en: "Just two names — no birth details — and you get a Vedic-style compatibility score. Classical name matching links name syllables to nakshatra ideas, then presents a clear love percentage. When you have birth dates and times, prefer full Kundli Matching.",
      hi: "केवल दो नाम — जन्म विवरण नहीं — और वैदिक शैली की अनुकूलता। शास्त्रीय नाम मिलान अक्षरों को नक्षत्र भाव से जोड़ता है और स्पष्ट प्रेम प्रतिशत दिखाता है। जन्म तिथि-समय हो तो पूर्ण कुंडली मिलान बेहतर है।",
    },
    promo: {
      text: {
        en: "Looking for the detailed 36-guna Kundli Matching?",
        hi: "विस्तृत 36 गुण कुंडली मिलान चाहिए?",
      },
      cta: { en: "Open Kundli Matching →", hi: "कुंडली मिलान खोलें →" },
      href: "/calculators/kundli-matching",
    },
    sections: [
      {
        title: { en: "How matching by name works", hi: "नाम से मिलान कैसे काम करता है" },
        body: {
          en: "Classical astrology associates name syllables with nakshatra padas (Avakahada tradition), the same idea used in Namkaran. Name matching runs a friendly score when birth time is unknown. It is a traditional first check — not a replacement for Moon-based Gun Milan from real birth details.",
          hi: "शास्त्रीय ज्योतिष नाम के अक्षरों को नक्षत्र पदों से जोड़ता है (अवकहड़ा परंपरा), वही भाव नामकरण में भी। जन्म समय अज्ञात हो तो यह पारंपरिक प्रथम जाँच है — वास्तविक जन्म विवरण से चंद्र आधारित गुण मिलान का विकल्प नहीं।",
        },
      },
      {
        title: {
          en: "Name matching vs birth-detail matching",
          hi: "नाम मिलान बनाम जन्म-विवरण मिलान",
        },
        body: {
          en: "Name method is the traditional approximation. Birth-detail matching computes the Moon’s true nakshatra from date, time and place — the score an astrologer would prefer for marriage decisions. Use this page for a quick reading; switch to Kundli Matching when details are available.",
          hi: "नाम विधि पारंपरिक सन्निकटन है। जन्म-विवरण मिलान तिथि, समय और स्थान से चंद्र का वास्तविक नक्षत्र निकालता है — विवाह निर्णय के लिए यही बेहतर। त्वरित पढ़ाई हेतु यह पृष्ठ; विवरण हों तो कुंडली मिलान खोलें।",
        },
      },
      {
        title: { en: "How to use the love calculator", hi: "लव कैलकुलेटर कैसे उपयोग करें" },
        body: {
          en: "Type the spellings you actually use day to day.",
          hi: "वे वर्तनी लिखें जो आप रोज़ उपयोग करते हैं।",
        },
        steps: [
          {
            en: "Type your name — Hindi spelling is often more precise for syllables.",
            hi: "अपना नाम लिखें — अक्षर मिलान हेतु हिंदी वर्तनी अक्सर सटीक होती है।",
          },
          {
            en: "Type your partner’s name the same way.",
            hi: "साथी का नाम भी उसी तरह लिखें।",
          },
          {
            en: "Tap Calculate — see love %, guidance badge, and try another pair anytime.",
            hi: "गणना दबाएँ — प्रेम %, मार्गदर्शन बैज देखें, और दूसरा जोड़ा आज़माएँ।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Is matching by name real astrology?", hi: "क्या नाम से मिलान वास्तविक ज्योतिष है?" },
        a: {
          en: "Yes — it follows classical name–nakshatra custom used when birth details aren’t known. Birth-detail matching remains more precise.",
          hi: "हाँ — यह शास्त्रीय नाम–नक्षत्र रीति है जब जन्म विवरण न हों। जन्म-विवरण मिलान अधिक सटीक रहता है।",
        },
      },
      {
        q: { en: "What’s the difference vs Kundli Matching?", hi: "कुंडली मिलान से क्या अंतर है?" },
        a: {
          en: "Same spirit of compatibility scoring; Kundli Matching uses Moon from birth data. Prefer that when you have date, time and place.",
          hi: "अनुकूलता का भाव समान; कुंडली मिलान जन्म डेटा से चंद्र लेता है। तिथि-समय-स्थान हों तो वही चुनें।",
        },
      },
      {
        q: { en: "Hindi or English names?", hi: "हिंदी या अंग्रेज़ी नाम?" },
        a: {
          en: "Both work. Devanagari can distinguish syllables that share one English spelling.",
          hi: "दोनों चलते हैं। देवनागरी उन अक्षरों को अलग करती है जो अंग्रेज़ी में एक जैसे लगते हैं।",
        },
      },
      {
        q: { en: "Is my data private?", hi: "क्या मेरा डेटा निजी है?" },
        a: {
          en: "Your result is calculated while you use the page. No account is required for this free tool.",
          hi: "परिणाम आपके उपयोग के समय बनता है। इस मुफ्त उपकरण हेतु खाता आवश्यक नहीं।",
        },
      },
      {
        q: { en: "My name wasn’t chosen by nakshatra — still useful?", hi: "नाम नक्षत्र से नहीं रखा — फिर भी उपयोगी?" },
        a: {
          en: "Treat it as a traditional reading of the name you carry. For decisions, match by birth details.",
          hi: "इसे आपके नाम की पारंपरिक पढ़ाई मानें। निर्णय हेतु जन्म विवरण से मिलान करें।",
        },
      },
      {
        q: { en: "Can I try another pair?", hi: "क्या दूसरा जोड़ा आज़मा सकते हैं?" },
        a: {
          en: "Yes — clear the form or edit names and calculate again as often as you like.",
          hi: "हाँ — फ़ॉर्म साफ़ करें या नाम बदलकर जितनी बार चाहें गणना करें।",
        },
      },
    ],
    references: [
      {
        en: "Avakahada / Namkaran syllable tradition — classical name–nakshatra custom",
        hi: "अवकहड़ा / नामकरण अक्षर परंपरा — शास्त्रीय नाम–नक्षत्र रीति",
      },
      {
        en: "Ashtakoot spirit in Brihat Parashara Hora Shastra — for full birth matching",
        hi: "बृहत् पराशर होरा शास्त्र में अष्टकूट भाव — पूर्ण जन्म मिलान हेतु",
      },
    ],
    disclaimer: {
      en: "Name matching is the traditional approximation when birth details aren’t known. For serious decisions use Kundli Matching and consult a qualified astrologer.",
      hi: "नाम मिलान तब पारंपरिक सन्निकटन है जब जन्म विवरण न हों। गंभीर निर्णय हेतु कुंडली मिलान और योग्य ज्योतिषी परामर्श लें।",
    },
  },
  "kundli-matching": {
    h1: {
      en: "Kundli Matching — 36 Guna Ashtakoot",
      hi: "कुंडली मिलान — 36 गुण अष्टकूट",
    },
    intro: {
      en: "Enter both partners’ birth details for classical Gun Milan across eight kootas (max 36). Review the total, each koota score, and the clear verdict — then deepen with a human reading for marriage timing and exceptions.",
      hi: "दोनों साथियों के जन्म विवरण से शास्त्रीय गुण मिलान (अधिकतम 36)। कुल अंक, प्रत्येक कूट और स्पष्ट निष्कर्ष देखें — विवाह समय व अपवादों हेतु व्यक्तिगत पढ़ाई लें।",
    },
    promo: {
      text: {
        en: "Only have names? Try the quick Love Calculator first.",
        hi: "केवल नाम हैं? पहले त्वरित लव कैलकुलेटर आज़माएँ।",
      },
      cta: { en: "Open Love Calculator →", hi: "लव कैलकुलेटर खोलें →" },
      href: "/calculators/love-calculator",
    },
    sections: [
      {
        title: { en: "What Ashtakoot measures", hi: "अष्टकूट क्या मापता है" },
        body: {
          en: "Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi are scored from Moon nakshatras. A higher total is traditionally preferred; low Nadi or Bhakoot needs careful review with full charts.",
          hi: "वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट और नाड़ी चंद्र नक्षत्रों से अंकित होते हैं। अधिक कुल पारंपरिक रूप से अनुकूल; कम नाड़ी/भकूट पर पूर्ण कुंडली से जाँच ज़रूरी।",
        },
      },
      {
        title: { en: "How to use", hi: "उपयोग कैसे करें" },
        body: { en: "Accurate birth times improve Moon and supporting chart context.", hi: "सटीक जन्म समय चंद्र व सहायक संदर्भ सुधारते हैं।" },
        steps: [
          { en: "Enter Partner A (traditionally boy) details.", hi: "साथी A (परंपरा में वर) का विवरण भरें।" },
          { en: "Enter Partner B (girl) details with place.", hi: "साथी B (वधू) का स्थान सहित विवरण भरें।" },
          { en: "Read total gunas, koota breakdown and verdict.", hi: "कुल गुण, कूट विवरण और निष्कर्ष पढ़ें।" },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Is 18 gunas enough?", hi: "क्या 18 गुण पर्याप्त हैं?" },
        a: {
          en: "Many families treat ~18+ as workable, but exceptions and full charts matter more than a single cutoff.",
          hi: "कई परिवार ~18+ को चलने योग्य मानते हैं, पर अपवाद और पूर्ण कुंडली एक कटऑफ से ज़्यादा मायने रखते हैं।",
        },
      },
      {
        q: { en: "What if Nadi score is zero?", hi: "नाड़ी शून्य हो तो?" },
        a: {
          en: "Same-nadi is a classical caution. Ask an astrologer about cancellations before deciding.",
          hi: "समान नाड़ी शास्त्रीय सावधानी है। निर्णय से पहले निवारण योग विशेषज्ञ से पूछें।",
        },
      },
      {
        q: { en: "Do we need exact birth time?", hi: "क्या सटीक जन्म समय ज़रूरी है?" },
        a: {
          en: "Moon nakshatra is mainly date-sensitive but time and place refine the whole matching consultation.",
          hi: "चंद्र नक्षत्र मुख्यतः तिथि पर निर्भर, पर समय-स्थान पूरी मिलान सलाह को परिष्कृत करते हैं।",
        },
      },
      {
        q: { en: "Love % vs gunas?", hi: "प्रेम % बनाम गुण?" },
        a: {
          en: "Love Calculator is name-based. This page is birth-based Gun Milan — prefer it for marriage talks.",
          hi: "लव कैलकुलेटर नाम आधारित है। यह पृष्ठ जन्म आधारित गुण मिलान है — विवाह चर्चा हेतु यही बेहतर।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  "moon-sign": genericContent(
    { en: "Moon Sign Calculator", hi: "चंद्र राशि कैलकुलेटर" },
    { en: "Moon sign (Rashi)", hi: "चंद्र राशि" },
    [
      {
        q: { en: "Is Moon sign the same as Western Sun sign?", hi: "क्या चंद्र राशि पश्चिमी सूर्य राशि है?" },
        a: {
          en: "No. Vedic Rashi is the Moon’s sidereal sign; Western Sun signs use a tropical frame.",
          hi: "नहीं। वैदिक राशि चंद्र की नक्षत्र आधारित राशि है; पश्चिमी सूर्य राशि मौसमी ढाँचे पर है।",
        },
      },
    ]
  ),
  "sun-sign": genericContent(
    { en: "Sun Sign Calculator", hi: "सूर्य राशि कैलकुलेटर" },
    { en: "Sun sign", hi: "सूर्य राशि" }
  ),
  nakshatra: genericContent(
    { en: "Nakshatra Calculator", hi: "नक्षत्र कैलकुलेटर" },
    { en: "birth nakshatra", hi: "जन्म नक्षत्र" }
  ),
  lagna: genericContent(
    { en: "Lagna Calculator", hi: "लग्न कैलकुलेटर" },
    { en: "ascendant / Lagna", hi: "लग्न" },
    [
      {
        q: { en: "Why is birth time required?", hi: "जन्म समय क्यों ज़रूरी?" },
        a: {
          en: "Lagna changes roughly every two hours — exact time and place are essential.",
          hi: "लग्न लगभग हर दो घंटे बदलता है — सटीक समय और स्थान आवश्यक।",
        },
      },
    ]
  ),
  navamsa: genericContent(
    { en: "Navamsa (D9) Calculator", hi: "नवमांश (D9) कैलकुलेटर" },
    { en: "Navamsa chart", hi: "नवमांश कुंडली" }
  ),
  "moon-phase": genericContent(
    { en: "Moon Phase Calculator", hi: "चंद्र कला कैलकुलेटर" },
    { en: "Moon phase", hi: "चंद्र कला" }
  ),
  "mangal-dosha": genericContent(
    { en: "Mangal Dosha Calculator", hi: "मंगल दोष कैलकुलेटर" },
    { en: "Mangal / Manglik dosha", hi: "मंगल दोष" },
    [
      {
        q: { en: "Does Manglik always block marriage?", hi: "क्या मंगलिक हमेशा विवाह रोकता है?" },
        a: {
          en: "No. Classical texts list cancellations. Confirm with full charts and an expert.",
          hi: "नहीं। शास्त्रों में निवारण योग हैं। पूर्ण कुंडली और विशेषज्ञ से पुष्टि करें।",
        },
      },
    ]
  ),
  "kaal-sarp-dosha": genericContent(
    { en: "Kaal Sarp Dosha Calculator", hi: "काल सर्प दोष कैलकुलेटर" },
    { en: "Kaal Sarp pattern", hi: "काल सर्प पैटर्न" }
  ),
  "sade-sati": genericContent(
    { en: "Sade Sati Calculator", hi: "साढ़े साती कैलकुलेटर" },
    { en: "Saturn Sade Sati", hi: "शनि साढ़े साती" }
  ),
  "vimshottari-dasha": genericContent(
    { en: "Vimshottari Dasha Calculator", hi: "विंशोत्तरी दशा कैलकुलेटर" },
    { en: "Vimshottari dasha", hi: "विंशोत्तरी दशा" }
  ),
  "pitra-dosha": genericContent(
    { en: "Pitra Dosha Calculator", hi: "पितृ दोष कैलकुलेटर" },
    { en: "Pitra dosha flags", hi: "पितृ दोष संकेत" }
  ),
  atmakaraka: genericContent(
    { en: "Atmakaraka & Darakaraka", hi: "आत्माकारक व दाराकारक" },
    { en: "Jaimini chara karakas", hi: "जामिनी चर कारक" }
  ),
  "ishta-devata": genericContent(
    { en: "Ishta Devata Calculator", hi: "इष्ट देवता कैलकुलेटर" },
    { en: "Ishta Devata", hi: "इष्ट देवता" }
  ),
  "kp-horary": genericContent(
    { en: "KP Horary Number Calculator", hi: "केपी होररी संख्या" },
    { en: "KP horary number", hi: "केपी होररी संख्या" }
  ),
  "kp-sub-lord": genericContent(
    { en: "KP Sub-Lord Finder", hi: "केपी सब-लॉर्ड" },
    { en: "KP sub-lords", hi: "केपी सब-लॉर्ड" }
  ),
  "kp-ruling-planets": genericContent(
    { en: "KP Ruling Planets Now", hi: "केपी शासक ग्रह (अभी)" },
    { en: "KP ruling planets", hi: "केपी शासक ग्रह" }
  ),
  gemstone: genericContent(
    { en: "Gemstone Recommender", hi: "रत्न सुझाव" },
    { en: "gemstone suggestion", hi: "रत्न सुझाव" },
    [
      {
        q: { en: "Should I wear a stone immediately?", hi: "क्या तुरंत रत्न पहनूँ?" },
        a: {
          en: "No. Gems can strengthen or disturb. Confirm with a full chart reading first.",
          hi: "नहीं। रत्न लाभ या हानि दोनों कर सकते हैं। पहले पूर्ण कुंडली पुष्टि लें।",
        },
      },
    ]
  ),
  rudraksha: genericContent(
    { en: "Rudraksha Recommender", hi: "रुद्राक्ष सुझाव" },
    { en: "Rudraksha mukhi", hi: "रुद्राक्ष मुखी" }
  ),
  "baby-name": {
    ...genericContent(
      { en: "Baby Name Suggestions", hi: "शिशु नाम सुझाव" },
      { en: "baby name syllables", hi: "शिशु नाम अक्षर" }
    ),
    intro: {
      en: "In Vedic tradition, a child’s name is often chosen from the Moon sign (Rashi) and birth star (nakshatra). Enter the baby’s birth date, time and place — we find the Rashi first, then suggest auspicious starting letters. No name is required.",
      hi: "वैदिक परंपरा में बच्चे का नाम अक्सर चंद्र राशि और जन्म नक्षत्र से चुना जाता है। जन्म तिथि, समय और स्थान भरें — पहले राशि निकलती है, फिर शुभ आरंभ अक्षर। नाम भरने की ज़रूरत नहीं।",
    },
  },
  "today-panchang": {
    h1: {
      en: "Today Panchang — Daily Panchangam with Sun & Moon timings",
      hi: "आज का पंचांग — सूर्य-चंद्र समय सहित दैनिक पंचांग",
    },
    intro: {
      en: "See today’s Panchang for any city: sunrise, sunset, moonrise, moonset, tithi, nakshatra, yoga, karana, ashubha muhurat and planetary positions. Change date or location anytime.",
      hi: "किसी भी शहर का आज का पंचांग देखें: सूर्योदय-अस्त, चंद्रोदय-अस्त, तिथि, नक्षत्र, योग, करण, अशुभ मुहूर्त और ग्रह स्थिति। तिथि या स्थान कभी भी बदलें।",
    },
    sections: [
      {
        title: { en: "What you get", hi: "आपको क्या मिलता है" },
        body: {
          en: "A full daily Panchangam with five limbs plus practical day timing — sun and moon rise/set for your place, Rahu Kaal and related ashubha windows, tarabalam, chandrabalam, and a noon lagna snapshot.",
          hi: "पाँच अंगों के साथ व्यावहारिक दिन-समय — आपके स्थान के सूर्य-चंद्र उदय/अस्त, राहु काल व अशुभ खंड, ताराबल, चंद्रबल, और दोपहर लग्न स्नैपशॉट।",
        },
      },
    ],
    faqs: [
      {
        q: {
          en: "Is this for today’s date by default?",
          hi: "क्या डिफ़ॉल्ट आज की तिथि है?",
        },
        a: {
          en: "Yes. Open the page and today’s Panchang for New Delhi loads immediately. Change the date or city and tap Get Panchang.",
          hi: "हाँ। पृष्ठ खोलते ही नई दिल्ली का आज का पंचांग दिखता है। तिथि या शहर बदलकर पंचांग देखें दबाएँ।",
        },
      },
      {
        q: {
          en: "Can I change date and location?",
          hi: "क्या तिथि और स्थान बदल सकते हैं?",
        },
        a: {
          en: "Yes — pick any date and search a city. All timings recalculate for that place.",
          hi: "हाँ — कोई भी तिथि चुनें और शहर खोजें। सभी समय उसी स्थान के अनुसार बदलते हैं।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  choghadiya: {
    h1: { en: "Daily Choghadiya", hi: "दैनिक चौघड़िया" },
    intro: {
      en: "Eight day and eight night windows from sunrise to the next sunrise — pick an auspicious Choghadiya for your city before you start anything important. No birth chart needed.",
      hi: "सूर्योदय से अगले सूर्योदय तक आठ दिन और आठ रात के खंड — महत्वपूर्ण कार्य से पहले अपने शहर की शुभ चौघड़िया चुनें। जन्म कुंडली की ज़रूरत नहीं।",
    },
    promo: {
      text: {
        en: "Also check Rahu Kaal and Hora before fixing an important hour.",
        hi: "महत्वपूर्ण समय तय करने से पहले राहु काल और होरा भी देखें।",
      },
      cta: { en: "Open Rahu Kaal →", hi: "राहु काल खोलें →" },
      href: "/calculators/rahu-kaal",
    },
    sections: [
      {
        title: { en: "What is Choghadiya?", hi: "चौघड़िया क्या है?" },
        body: {
          en: "Choghadiya is a popular western-Indian muhurat system. Daylight from sunrise to sunset is split into eight equal parts, and night from sunset to the next sunrise into eight more. Each window is ruled by a planet and carries a fixed quality — good, neutral, or harsh — so you can quickly choose or avoid a slot for everyday work.",
          hi: "चौघड़िया पश्चिमी भारत की लोकप्रिय मुहूर्त पद्धति है। सूर्योदय से सूर्यास्त तक के दिन को आठ समान भागों में, और सूर्यास्त से अगले सूर्योदय तक की रात को आठ भागों में बाँटा जाता है। प्रत्येक खंड का स्वामी एक ग्रह होता है और उसकी गुणवत्ता निश्चित रहती है — शुभ, सामान्य या कठोर — ताकि रोज़मर्रा के काम के लिए समय जल्दी चुना जा सके।",
        },
      },
      {
        title: {
          en: "The seven names and what they mean",
          hi: "सात नाम और उनका अर्थ",
        },
        body: {
          en: "Amrit, Shubh and Labh are auspicious — use them for new work, ceremonies, study and business. Chal is neutral and fine for travel or routine tasks. Udveg, Rog and Kaal are best avoided for anything important. Even a good Choghadiya is usually dropped if it overlaps Rahu Kaal.",
          hi: "अमृत, शुभ और लाभ शुभ हैं — नए कार्य, संस्कार, अध्ययन और व्यापार के लिए। चल सामान्य है — यात्रा या नियमित काम के लिए ठीक। उद्वेग, रोग और काल से महत्वपूर्ण कार्यों में बचें। अच्छा चौघड़िया खंड भी राहु काल से टकराए तो आमतौर पर छोड़ दिया जाता है।",
        },
        steps: [
          {
            en: "Amrit / Shubh / Labh — prefer for starts that should last.",
            hi: "अमृत / शुभ / लाभ — टिकाऊ आरंभ के लिए चुनें।",
          },
          {
            en: "Chal — travel and ordinary movement.",
            hi: "चल — यात्रा और सामान्य आवागमन।",
          },
          {
            en: "Udveg / Rog / Kaal — wait them out when you can.",
            hi: "उद्वेग / रोग / काल — जहाँ संभव हो, इन्हें टालें।",
          },
        ],
      },
      {
        title: { en: "How timings are calculated", hi: "समय कैसे निकाले जाते हैं" },
        body: {
          en: "Windows are built only from local sunrise, sunset and the weekday — never from a birth chart. The first day window depends on the weekday’s lord; then the seven names cycle in a fixed order to fill eight slots. Because sunrise shifts by city and season, the clock times change when you switch place or date.",
          hi: "खंड केवल स्थानीय सूर्योदय, सूर्यास्त और वार से बनते हैं — जन्म कुंडली से नहीं। दिन का पहला खंड वार-स्वामी पर निर्भर करता है; फिर सात नाम निश्चित क्रम में आठ स्थान भरते हैं। सूर्योदय शहर और ऋतु से बदलता है, इसलिए स्थान या तिथि बदलते ही घड़ी का समय बदल जाता है।",
        },
      },
      {
        title: {
          en: "Day vs night Choghadiya",
          hi: "दिन बनाम रात चौघड़िया",
        },
        body: {
          en: "Day Choghadiya runs sunrise to sunset; night Choghadiya runs sunset to the next sunrise. Each set has eight windows but different starting points, so quality and clock time are read separately for day and night.",
          hi: "दिन की चौघड़िया सूर्योदय से सूर्यास्त तक चलती है; रात की सूर्यास्त से अगले सूर्योदय तक। दोनों में आठ खंड होते हैं, पर आरंभ भिन्न होता है — इसलिए गुणवत्ता और समय दिन-रात अलग पढ़े जाते हैं।",
        },
      },
    ],
    faqs: [
      {
        q: {
          en: "Which Choghadiya is good?",
          hi: "कौन-सी चौघड़िया शुभ है?",
        },
        a: {
          en: "Amrit, Shubh and Labh are auspicious. Chal is neutral. Udveg, Rog and Kaal are best avoided for important work.",
          hi: "अमृत, शुभ और लाभ शुभ हैं। चल सामान्य है। उद्वेग, रोग और काल से महत्वपूर्ण कार्य में बचें।",
        },
      },
      {
        q: {
          en: "Why do times change when I switch city?",
          hi: "शहर बदलने पर समय क्यों बदलता है?",
        },
        a: {
          en: "Choghadiya is anchored to local sunrise and sunset. A different city means different sun times, so every window is recomputed.",
          hi: "चौघड़िया स्थानीय सूर्योदय–सूर्यास्त पर टिकी होती है। दूसरे शहर का सूर्य समय भिन्न होता है, इसलिए सभी खंड फिर से निकलते हैं।",
        },
      },
      {
        q: {
          en: "Is Choghadiya the same as Rahu Kaal?",
          hi: "क्या चौघड़िया और राहु काल एक हैं?",
        },
        a: {
          en: "No. Rahu Kaal is one inauspicious stretch each day. Choghadiya divides the whole day and night into sixteen quality-rated windows. Many people check both.",
          hi: "नहीं। राहु काल दिन का एक अशुभ खंड है। चौघड़िया पूरे दिन-रात को सोलह गुणवत्ता-खंडों में बाँटती है। कई लोग दोनों देखते हैं।",
        },
      },
      {
        q: {
          en: "Do I need my birth details?",
          hi: "क्या जन्म विवरण चाहिए?",
        },
        a: {
          en: "No. This page only needs a city and a date.",
          hi: "नहीं। इस पृष्ठ के लिए केवल शहर और तिथि पर्याप्त हैं।",
        },
      },
    ],
    disclaimer: {
      en: "Choghadiya is a quick everyday ready-reckoner, not a full muhurat for weddings or major ceremonies. For milestone events, consult a qualified Jyotishi.",
      hi: "चौघड़िया रोज़मर्रा का त्वरित संकेत है, विवाह या बड़े संस्कारों का पूर्ण मुहूर्त नहीं। बड़े अवसरों पर योग्य ज्योतिषी से परामर्श लें।",
    },
  },
  "gowri-panchangam": genericContent(
    { en: "Gowri Panchangam", hi: "गौरी पंचांगम" },
    { en: "gowri windows", hi: "गौरी खंड" }
  ),
  "rahu-kaal": genericContent(
    { en: "Rahu Kaal", hi: "राहु काल" },
    { en: "rahu kaal", hi: "राहु काल" }
  ),
  hora: genericContent(
    { en: "Hora", hi: "होरा" },
    { en: "planetary hora", hi: "ग्रहीय होरा" }
  ),
  "birth-panchang": genericContent(
    { en: "Birth Panchang", hi: "जन्म पंचांग" },
    { en: "birth panchang", hi: "जन्म पंचांग" }
  ),
  ayanamsa: genericContent(
    { en: "Ayanamsa Calculator", hi: "अयनांश कैलकुलेटर" },
    { en: "Lahiri ayanamsa", hi: "लाहिरी अयनांश" }
  ),
  "life-path": genericContent(
    { en: "Life Path Calculator", hi: "लाइफ पाथ कैलकुलेटर" },
    { en: "life path number", hi: "लाइफ पाथ अंक" }
  ),
  "name-numerology": genericContent(
    { en: "Name Numerology", hi: "नाम अंक ज्योतिष" },
    { en: "name numbers", hi: "नाम अंक" }
  ),
  "mobile-number": genericContent(
    { en: "Mobile Number Numerology", hi: "मोबाइल नंबर अंक" },
    { en: "mobile number", hi: "मोबाइल नंबर" }
  ),
  "vehicle-number": genericContent(
    { en: "Vehicle Number Numerology", hi: "वाहन नंबर अंक" },
    { en: "vehicle number", hi: "वाहन नंबर" }
  ),
  "house-number": genericContent(
    { en: "House Number Numerology", hi: "मकान नंबर अंक" },
    { en: "house number", hi: "मकान नंबर" }
  ),
  "business-name": genericContent(
    { en: "Business Name Numerology", hi: "व्यवसाय नाम अंक" },
    { en: "business name number", hi: "व्यवसाय नाम अंक" }
  ),
  "personal-year": genericContent(
    { en: "Personal Year Calculator", hi: "व्यक्तिगत वर्ष" },
    { en: "personal year", hi: "व्यक्तिगत वर्ष" }
  ),
  "lo-shu-grid": {
    h1: {
      en: "Lo Shu Grid — Birth Number Map Explained",
      hi: "लो शू ग्रिड — जन्म अंक मानचित्र स्पष्ट व्याख्या सहित",
    },
    intro: {
      en: "Plot your date of birth on the classic 3×3 Lo Shu square. You don’t just see empty cells — you get Life Path context, mind–heart–action planes, and plain-language meaning for every present and missing number.",
      hi: "अपनी जन्म तिथि को शास्त्रीय 3×3 लो शू वर्ग पर देखें। खाली खाने नहीं — लाइफ पाथ संदर्भ, मन–हृदय–कर्म तल, और हर उपस्थित/अनुपस्थित अंक का सरल अर्थ मिलता है।",
    },
    promo: {
      text: {
        en: "Want name vibration with your birth numbers?",
        hi: "जन्म अंकों के साथ नाम कंपन भी देखना है?",
      },
      cta: { en: "Open Name Numerology →", hi: "नाम अंक ज्योतिष खोलें →" },
      href: "/calculators/name-numerology",
    },
    sections: [
      {
        title: {
          en: "How to read your Lo Shu result",
          hi: "अपना लो शू परिणाम कैसे पढ़ें",
        },
        body: {
          en: "Each cell has a fixed seat (4-9-2 / 3-5-7 / 8-1-6). The large number is how often that digit appears in your birth date (plus Life Path). Filled seats are strengths; open seats are practice themes — not curses.",
          hi: "हर खाने की निश्चित सीट है (4-9-2 / 3-5-7 / 8-1-6)। बड़ा अंक बताता है जन्म तिथि में वह अंक कितनी बार आया (लाइफ पाथ सहित)। भरे स्थान शक्ति; खुले स्थान अभ्यास के विषय — श्राप नहीं।",
        },
      },
      {
        title: {
          en: "Planes: mind, heart and action",
          hi: "तल: मन, हृदय और कर्म",
        },
        body: {
          en: "Horizontal rows map Mental (4-9-2), Emotional (3-5-7) and Practical (8-1-6) planes. Vertical columns map Thought, Will and Action. Our result cards label each plane Strong, Balanced, Developing or Quiet so you can act on it.",
          hi: "क्षैतिज पंक्तियाँ मानसिक (4-9-2), भावनात्मक (3-5-7) और व्यावहारिक (8-1-6) तल बताती हैं। ऊर्ध्व स्तंभ सोच, संकल्प और कर्म। हमारे परिणाम कार्ड प्रत्येक तल को मजबूत/संतुलित/विकसित/शांत चिह्नित करते हैं।",
        },
      },
      {
        title: { en: "How to use this calculator", hi: "यह कैलकुलेटर कैसे उपयोग करें" },
        body: {
          en: "Use the Gregorian date you use on official documents.",
          hi: "वही ग्रेगोरियन तिथि लिखें जो आधिकारिक दस्तावेज़ों पर है।",
        },
        steps: [
          {
            en: "Enter your date of birth and calculate.",
            hi: "जन्म तिथि भरें और गणना करें।",
          },
          {
            en: "Read the snapshot, then the grid, then plane cards.",
            hi: "पहले सार, फिर ग्रिड, फिर तल कार्ड पढ़ें।",
          },
          {
            en: "Scroll active vs open numbers for personal guidance lines.",
            hi: "व्यक्तिगत मार्गदर्शन हेतु सक्रिय व खुले अंक देखें।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "What if a number is missing?", hi: "कोई अंक अनुपस्थित हो तो?" },
        a: {
          en: "It marks a growth door. Build that quality through habits — the page suggests a gentle practice for each open number.",
          hi: "यह विकास का द्वार है। आदतों से वह गुण बनाएँ — पृष्ठ हर खुले अंक के लिए सरल अभ्यास सुझाता है।",
        },
      },
      {
        q: { en: "Why is a number repeated?", hi: "अंक दोहरा क्यों है?" },
        a: {
          en: "Repeats raise volume. The gift is strong; overuse can feel like pressure. Balance with rest and the complementary plane.",
          hi: "दोहराव वॉल्यूम बढ़ाता है। वरदान प्रबल है; अति दबाव बन सकती है। विश्राम और पूरक तल से संतुलन बनाएँ।",
        },
      },
      {
        q: { en: "Is Lo Shu Vedic astrology?", hi: "क्या लो शू वैदिक ज्योतिष है?" },
        a: {
          en: "It is a numerology map often used alongside Jyotish. For marriage and dasha timing, use kundli tools too.",
          hi: "यह अंक मानचित्र है जिसे ज्योतिष के साथ भी देखा जाता है। विवाह और दशा समय हेतु कुंडली उपकरण भी उपयोग करें।",
        },
      },
      {
        q: { en: "Do you store my date?", hi: "क्या मेरी तिथि संग्रहित होती है?" },
        a: {
          en: "Calculation happens while you use the page. No account is required for this free tool.",
          hi: "गणना आपके उपयोग के समय होती है। इस मुफ्त उपकरण हेतु खाता आवश्यक नहीं।",
        },
      },
    ],
    disclaimer: {
      en: "Lo Shu is reflective numerology guidance, not medical or financial advice.",
      hi: "लो शू चिंतन हेतु अंक मार्गदर्शन है — चिकित्सा या वित्तीय सलाह नहीं।",
    },
  },
  "love-compatibility-num": genericContent(
    { en: "Numerology Love Match", hi: "अंक ज्योतिष प्रेम मिलान" },
    { en: "numerology love match", hi: "अंक प्रेम मिलान" }
  ),
  "name-correction": genericContent(
    { en: "Name Correction Guide", hi: "नाम सुधार मार्गदर्शिका" },
    { en: "name correction", hi: "नाम सुधार" }
  ),
};

export function getCalcContent(slug: string): CalcPageContent {
  return (
    CALC_CONTENT[slug] ||
    genericContent(
      { en: "Astrology Calculator", hi: "ज्योतिष कैलकुलेटर" },
      { en: "astrology", hi: "ज्योतिष" }
    )
  );
}
