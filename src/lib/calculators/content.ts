export type LocaleText = { en: string; hi: string };

export type CalcPageContent = {
  h1: LocaleText;
  intro: LocaleText;
  /** Optional SERP title (without brand / tool suffix). */
  seoTitle?: LocaleText;
  /** Optional SERP description (140–160 chars ideal). */
  seoDescription?: LocaleText;
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
      en: `${topic.en} — get a clear Lahiri sidereal result in seconds on CosmicTalks. Then open your full janam kundali or ask AI Guru for chart-specific guidance in English or Hindi.`,
      hi: `${topic.hi} — CosmicTalks पर लाहिरी निरयण परिणाम सेकंडों में। फिर पूर्ण जन्म कुंडली खोलें या एआई गुरु से चार्ट-विशिष्ट मार्गदर्शन लें।`,
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
          en: `People search ${topic.en} online for instant clarity before a consultation. CosmicTalks keeps tools free, bilingual (EN & HI), and linked to panchang, moon sign, gun milan, mangal dosha, sade sati and more.`,
          hi: `लोग परामर्श से पहले तुरंत स्पष्टता हेतु ${topic.hi} खोजते हैं। CosmicTalks उपकरण मुफ़्त, द्विभाषी हैं और पंचांग, चंद्र राशि, गुण मिलान, मंगल दोष, साढ़े साती से जुड़े हैं।`,
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
          en: `Yes. CosmicTalks ${topic.en} tools are free online. Optional personal readings are available via AI Guru chat or WhatsApp.`,
          hi: `हाँ। CosmicTalks ${topic.hi} उपकरण ऑनलाइन मुफ़्त हैं। वैकल्पिक व्यक्तिगत पढ़ाई एआई गुरु चैट या व्हाट्सऐप पर उपलब्ध है।`,
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
  "birth-time-rectification": {
    h1: {
      en: "Birth Time Rectification — Candidate Time from Life Events",
      hi: "जन्म समय सुधार — जीवन घटनाओं से उम्मीदवार समय",
    },
    seoTitle: {
      en: "Birth Time Rectification Calculator Free",
      hi: "जन्म समय सुधार कैलकुलेटर मुफ्त",
    },
    seoDescription: {
      en: "Estimate a candidate birth time from dated life events using Vimshottari dasha alignment. Heuristic aid — not certificate-grade proof.",
      hi: "दिनांकित जीवन घटनाओं व विंशोत्तरी दशा संरेखण से उम्मीदवार जन्म समय। अनुमानित सहायता — प्रमाण-पत्र स्तर नहीं।",
    },
    intro: {
      en: "Unsure of your exact birth time? CosmicTalks sweeps around your approximate time and scores how well Vimshottari dasha lords align with dated life events (career, marriage, childbirth, and more). Results show confidence and event-match ratio — never a fake “% true birth time.” Prefer hospital records when available.",
      hi: "सटीक जन्म समय नहीं पता? CosmicTalks आपके अनुमानित समय के आसपास खोजता है और विंशोत्तरी दशा स्वामियों का दिनांकित घटनाओं से मेल अंकित करता है। विश्वसनीयता व घटना-मेल अनुपात — गढ़ा “सही जन्म समय %” नहीं। उपलब्ध हो तो अस्पताल अभिलेख प्राथमिक।",
    },
    promo: {
      text: {
        en: "Ready to generate a full chart with a confirmed time?",
        hi: "पुष्टि समय से पूर्ण कुंडली बनानी है?",
      },
      cta: { en: "Open Free Kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "How rectification works here", hi: "यहाँ सुधार कैसे काम करता है" },
        body: {
          en: "Enter approximate birth date, time and place, plus at least three dated events with domains. We sweep ±60 minutes (adjustable) in small steps, cast each candidate, and count how many events fall when maha/antar lords occupy or rule the domain’s houses. Best match, Lagna, confidence, and per-event basedOn citations are returned.",
          hi: "अनुमानित जन्म तिथि-समय-स्थान और कम से कम तीन दिनांकित घटनाएँ भरें। हम ±60 मिनट (समायोज्य) छोटे चरणों में खोजते हैं; प्रत्येक उम्मीदवार पर दशा स्वामी घटना भावों से मेल खाते हैं या नहीं गिनते हैं। सर्वोत्तम समय, लग्न, विश्वसनीयता और प्रति-घटना basedOn मिलते हैं।",
        },
      },
      {
        title: { en: "What this is not", hi: "यह क्या नहीं है" },
        body: {
          en: "Not certificate-grade proof of birth time, not medical/legal/forensic timing, and not a silent overwrite of your kundli. If top candidates flip Lagna with near-equal scores, we show a caution. Always confirm before applying the suggested time to Free Kundli.",
          hi: "जन्म समय का प्रमाण-पत्र नहीं, चिकित्सकीय/कानूनी/फोरेंसिक समय नहीं, और कुंडली का चुपचाप ओवरराइट नहीं। शीर्ष उम्मीदवारों की लग्न स्कोर-समान भिन्न हो तो सावधानी दिखती है। मुफ्त कुंडली पर लागू करने से पहले पुष्टि करें।",
        },
      },
    ],
    faqs: [
      {
        q: {
          en: "How many events do I need?",
          hi: "कितनी घटनाएँ चाहिए?",
        },
        a: {
          en: "At least three dated events. Five or more can raise confidence when the match ratio is strong.",
          hi: "कम से कम तीन दिनांकित घटनाएँ। पाँच या अधिक मजबूत मेल पर विश्वसनीयता बढ़ा सकते हैं।",
        },
      },
      {
        q: {
          en: "Is the score my true birth-time probability?",
          hi: "क्या स्कोर सही जन्म समय की संभावना है?",
        },
        a: {
          en: "No. It is the share of your listed events that aligned under that candidate time — an event-match ratio, not “% true birth time.”",
          hi: "नहीं। यह उस उम्मीदवार समय पर मेल खाने वाली घटनाओं का अनुपात है — “सही जन्म समय %” नहीं।",
        },
      },
      {
        q: {
          en: "Should I trust this over a birth certificate?",
          hi: "क्या जन्म प्रमाण पत्र से अधिक भरोसा करें?",
        },
        a: {
          en: "No. Prefer hospital or official records whenever they exist. Use rectification only when time is missing or clearly approximate.",
          hi: "नहीं। जहाँ उपलब्ध हों अस्पताल/आधिकारिक अभिलेख प्राथमिक। सुधार केवल जब समय गायब या स्पष्टतः अनुमानित हो।",
        },
      },
    ],
    references: [
      {
        en: "Methodology — birth-time rectification",
        hi: "मेथडोलॉजी — जन्म समय सुधार",
      },
    ],
    disclaimer: {
      en: "Heuristic alignment aid only — not proof of birth time, and not medical, legal or forensic advice.",
      hi: "केवल अनुमानित संरेखण — जन्म समय का प्रमाण नहीं; चिकित्सकीय, कानूनी या फोरेंसिक सलाह नहीं।",
    },
  },
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
      en: "Kundli Matching — Ashtakoot Gun Milan Calculator",
      hi: "कुंडली मिलान — अष्टकूट गुण मिलान कैलकुलेटर",
    },
    seoTitle: {
      en: "Free Kundli Matching — 36 Point Gun Milan Calculator",
      hi: "मुफ्त कुंडली मिलान — 36 अंक गुण मिलान कैलकुलेटर",
    },
    seoDescription: {
      en: "Check marriage compatibility with free Kundli matching. Classical 36-point Ashtakoot Gun Milan, Mangal Dosha check & Nadi analysis.",
      hi: "मुफ्त कुंडली मिलान से विवाह अनुकूलता जाँचें। शास्त्रीय 36 अंक अष्टकूट गुण मिलान, मंगल दोष व नाड़ी विश्लेषण।",
    },
    intro: {
      en: "Kundli matching (Gun Milan) scores eight Ashtakoot factors from both Moon nakshatras (max 36). Enter both birth details for a free breakdown and verdict — then refine with a full chart reading.",
      hi: "कुंडली मिलान (गुण मिलान) दोनों चंद्र नक्षत्रों से अष्टकूट के आठ अंक (अधिकतम 36) जोड़ता है। दोनों जन्म विवरण से मुफ्त विवरण व निष्कर्ष पाएँ — फिर पूर्ण कुंडली से परिष्कृत करें।",
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
          en: "Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi are scored from Moon nakshatras. A total of 18+ out of 36 is traditionally discussed as workable; many families prefer 24+. Low Nadi or Bhakoot still needs careful review even when the total looks strong.",
          hi: "वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट और नाड़ी चंद्र नक्षत्रों से अंकित होते हैं। 36 में 18+ पारंपरिक रूप से चर्चा योग्य; कई परिवार 24+ पसंद करते हैं। कम नाड़ी/भकूट पर कुल अंक ऊँचा होने पर भी पूर्ण कुंडली से जाँच ज़रूरी।",
        },
      },
      {
        title: { en: "The eight Kootas in brief", hi: "आठ कूट संक्षेप में" },
        body: {
          en: "Varna looks at spiritual/temperament class affinity. Vashya relates to mutual influence. Tara assesses birth-star compatibility. Yoni reflects instinctive nature pairing. Graha Maitri checks planetary friendship between Moon lords. Gana compares divine/human/demonic temperament groups. Bhakoot weighs Moon-sign pairings for harmony or strain. Nadi examines physiological/lineage factors — Nadi dosha is often treated as critical and may override a high total if not cancelled by other chart factors.",
          hi: "वर्ण आध्यात्मिक/स्वभाव वर्ग देखता है। वश्य पारस्परिक प्रभाव। तारा जन्म नक्षत्र अनुकूलता। योनि सहज स्वभाव जोड़। ग्रह मैत्री चंद्र स्वामियों की मित्रता। गण दैव/मनुष्य/राक्षस स्वभाव। भकूट चंद्र राशि जोड़ से सामंजस्य। नाड़ी शारीरिक/वंशीय पक्ष — नाड़ी दोष अक्सर महत्वपूर्ण माना जाता है और बिना निवारण के ऊँचे कुल अंक पर भी भारी पड़ सकता है।",
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
  "moon-sign": {
    h1: { en: "Moon Sign (Rashi) Calculator", hi: "चंद्र राशि कैलकुलेटर" },
    seoTitle: {
      en: "Moon Sign Calculator — Find Your Rashi Instantly",
      hi: "चंद्र राशि कैलकुलेटर — तुरंत राशि जानें",
    },
    seoDescription: {
      en: "Find your Vedic Moon sign (Rashi) free by date, time and place of birth. Understand what your Moon sign means for emotions and mind.",
      hi: "जन्म तिथि, समय और स्थान से मुफ्त वैदिक चंद्र राशि जानें। मन और भावनाओं के लिए चंद्र राशि का अर्थ समझें।",
    },
    intro: {
      en: "Your Moon sign (Chandra Rashi) is the sidereal sign the Moon occupied at birth — used for emotions, naming customs and dasha start. Enter birth details for a free Lahiri result.",
      hi: "चंद्र राशि (राशि) जन्म के समय चंद्र की निरयण राशि है — भावनाएँ, नामकरण और दशा आरंभ के लिए। जन्म विवरण भरकर मुफ्त लाहिरी परिणाम पाएँ।",
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
        title: { en: "What the Moon sign governs", hi: "चंद्र राशि क्या दर्शाती है" },
        body: {
          en: "In Jyotish, the Moon reflects mind, emotions, mother and home comfort. Unlike the Western newspaper Sun sign, Vedic Rashi is the Moon’s sidereal sign at birth. Lagna shows how you meet the world; Moon shows how you feel and process experience. Dasha timing also begins from the Moon’s Nakshatra.",
          hi: "ज्योतिष में चंद्र मन, भावनाएँ, माता और घर का सुख दर्शाता है। पश्चिमी अखबारी सूर्य राशि से अलग, वैदिक राशि जन्म के समय चंद्र की निरयण राशि है। लग्न बताता है आप संसार से कैसे मिलते हैं; चंद्र बताता है आप कैसे महसूस करते हैं। दशा भी चंद्र नक्षत्र से शुरू होती है।",
        },
      },
      {
        title: { en: "Quick Rashi themes", hi: "राशि संकेत संक्षेप" },
        body: {
          en: "Mesha (Aries) initiative; Vrishabha (Taurus) steadiness; Mithuna (Gemini) curiosity; Karka (Cancer) nurture; Simha (Leo) dignity; Kanya (Virgo) analysis; Tula (Libra) balance; Vrischika (Scorpio) intensity; Dhanu (Sagittarius) meaning; Makara (Capricorn) duty; Kumbha (Aquarius) networks; Meena (Pisces) empathy. Explore fuller sign guides under Learn → Zodiac.",
          hi: "मेष पहल; वृषभ स्थिरता; मिथुन जिज्ञासा; कर्क पालन; सिंह गरिमा; कन्या विश्लेषण; तुला संतुलन; वृश्चिक तीव्रता; धनु अर्थ; मकर कर्तव्य; कुंभ नेटवर्क; मीन सहानुभूति। विस्तृत गाइड: सीखें → राशि।",
        },
      },
      {
        title: { en: "How to use this calculator", hi: "यह कैलकुलेटर कैसे उपयोग करें" },
        body: {
          en: "Enter birth date, time and place. We compute the Moon’s Lahiri longitude and map it to the sidereal Rashi.",
          hi: "जन्म तिथि, समय और स्थान भरें। हम चंद्र का लाहिरी देशांतर निकालकर निरयण राशि बताते हैं।",
        },
        steps: [
          { en: "Add accurate birth details.", hi: "सटीक जन्म विवरण भरें।" },
          { en: "Generate to see your Moon sign.", hi: "जनरेट कर चंद्र राशि देखें।" },
          { en: "Open full kundli for houses and dasha.", hi: "भाव व दशा हेतु पूर्ण कुंडली खोलें।" },
        ],
      },
    ],
    faqs: [
      {
        q: {
          en: "Is Moon sign the same as Western Sun sign?",
          hi: "क्या चंद्र राशि पश्चिमी सूर्य राशि है?",
        },
        a: {
          en: "No. Vedic Rashi is the Moon’s sidereal sign; Western Sun signs use a tropical frame.",
          hi: "नहीं। वैदिक राशि चंद्र की नक्षत्र आधारित राशि है; पश्चिमी सूर्य राशि मौसमी ढाँचे पर है।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  "sun-sign": genericContent(
    { en: "Sun Sign Calculator", hi: "सूर्य राशि कैलकुलेटर" },
    { en: "Sun sign", hi: "सूर्य राशि" }
  ),
  nakshatra: {
    h1: { en: "Nakshatra Calculator", hi: "नक्षत्र कैलकुलेटर" },
    seoTitle: {
      en: "Nakshatra Calculator — Find Birth Star Free",
      hi: "नक्षत्र कैलकुलेटर — मुफ्त जन्म नक्षत्र",
    },
    seoDescription: {
      en: "Find your Vedic birth Nakshatra free by date, time and place. See pada, ruling planet and how it starts Vimshottari dasha.",
      hi: "जन्म तिथि-समय-स्थान से मुफ्त वैदिक जन्म नक्षत्र जानें। पद, स्वामी ग्रह और विंशोत्तरी दशा आरंभ समझें।",
    },
    intro: {
      en: "A birth Nakshatra is the 13°20′ lunar mansion the Moon occupied at birth (27 in all). CosmicTalks returns the star, pada and dasha-starting planet from Lahiri Moon longitude.",
      hi: "जन्म नक्षत्र जन्म के समय चंद्र की 13°20′ नक्षत्र मंज़िल है (कुल 27)। CosmicTalks लाहिरी चंद्र देशांतर से नक्षत्र, पद और दशा-आरंभ ग्रह बताता है।",
    },
    promo: {
      text: { en: "Want a full birth chart with houses, yogas and dasha?", hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?" },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "What Nakshatras are", hi: "नक्षत्र क्या हैं" },
        body: {
          en: "Nakshatras are 27 lunar mansions that divide the sidereal zodiac more finely than the 12 signs. Each has a deity, symbolism and ruling planet used in naming traditions, muhurta and personality nuance.",
          hi: "नक्षत्र 27 चंद्र मंज़िलें हैं जो निरयण राशिचक्र को 12 राशियों से सूक्ष्म विभाजित करती हैं। प्रत्येक का देवता, प्रतीक और स्वामी ग्रह नामकरण, मुहूर्त व स्वभाव में उपयोग होता है।",
        },
      },
      {
        title: { en: "Pada and dasha link", hi: "पद और दशा संबंध" },
        body: {
          en: "Each Nakshatra has four padas (quarters). The Moon’s Nakshatra at birth also determines which planet’s Mahadasha begins your Vimshottari timeline — a key timing tool in Jyotish.",
          hi: "प्रत्येक नक्षत्र के चार पद होते हैं। जन्म चंद्र नक्षत्र तय करता है कि विंशोत्तरी महादशा किस ग्रह से शुरू होगी — ज्योतिष की प्रमुख समय प्रणाली।",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Is birth Nakshatra always from the Moon?", hi: "क्या जन्म नक्षत्र हमेशा चंद्र से होता है?" },
        a: {
          en: "Yes in most classical contexts — Moon Nakshatra is the standard birth star for dasha and many naming customs.",
          hi: "अधिकांश शास्त्रीय संदर्भ में हाँ — चंद्र नक्षत्र दशा और कई नामकरण परंपराओं का मानक जन्म नक्षत्र है।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  lagna: {
    h1: { en: "Lagna (Ascendant) Calculator", hi: "लग्न कैलकुलेटर" },
    seoTitle: {
      en: "Lagna Calculator — Find Your Ascendant Free",
      hi: "लग्न कैलकुलेटर — मुफ्त उदय राशि जानें",
    },
    seoDescription: {
      en: "Find your Vedic Lagna (Ascendant) free by birth date, time and place. See why rising sign sets your whole-sign house chart.",
      hi: "जन्म तिथि, समय और स्थान से मुफ्त वैदिक लग्न जानें। उदय राशि पूरी भाव कुंडली कैसे तय करती है, समझें।",
    },
    intro: {
      en: "Lagna is the zodiac sign rising on the eastern horizon at birth. It sets the first house in whole-sign Jyotish and frames how every other house is read. Enter accurate birth time for a free Lahiri result.",
      hi: "लग्न जन्म के समय पूर्व क्षितिज पर उदय राशि है। पूर्ण-राशि ज्योतिष में यही प्रथम भाव तय करती है। सटीक जन्म समय से मुफ्त लाहिरी परिणाम पाएँ।",
    },
    promo: {
      text: { en: "Want a full birth chart with houses, yogas and dasha?", hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?" },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "What Lagna means", hi: "लग्न का अर्थ" },
        body: {
          en: "Lagna (Ascendant) describes how you meet the world — vitality, body, first impressions and the lens for the rest of the chart. In CosmicTalks whole-sign charts, the Lagna sign becomes the entire first house; the next sign is the second house, and so on through twelve.",
          hi: "लग्न बताता है आप संसार से कैसे मिलते हैं — जीवन शक्ति, शरीर, प्रथम प्रभाव और शेष कुंडली का दृष्टिकोण। CosmicTalks पूर्ण-राशि चार्ट में लग्न राशि पूरा प्रथम भाव बनती है।",
        },
      },
      {
        title: { en: "Why birth time is essential", hi: "जन्म समय क्यों ज़रूरी है" },
        body: {
          en: "The Ascendant moves through all twelve signs in about a day — roughly two hours per sign on average. A 20–30 minute error near a sign boundary can change Lagna and every house assignment. Use a birth certificate or hospital record when possible.",
          hi: "उदय राशि लगभग एक दिन में बारह राशियों से गुजरती है — औसतन दो घंटे प्रति राशि। सीमा के निकट 20–30 मिनट की गलती लग्न और सभी भाव बदल सकती है। संभव हो तो जन्म प्रमाणपत्र उपयोग करें।",
        },
      },
      {
        title: { en: "Lagna vs Moon vs Sun", hi: "लग्न बनाम चंद्र बनाम सूर्य" },
        body: {
          en: "Lagna frames the body and life approach. Moon (Rashi) reflects mind and emotions and starts Vimshottari dasha. Sun relates to vitality and purpose. A balanced reading weaves all three — generate Lagna here, then open full kundli for the complete picture.",
          hi: "लग्न शरीर और जीवन दृष्टिकोण। चंद्र (राशि) मन-भावनाएँ और विंशोत्तरी दशा आरंभ। सूर्य जीवन शक्ति व उद्देश्य। संतुलित पढ़ाई तीनों को जोड़ती है — यहाँ लग्न जानें, फिर पूर्ण कुंडली खोलें।",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Why is birth time required?", hi: "जन्म समय क्यों ज़रूरी?" },
        a: {
          en: "Lagna changes roughly every two hours — exact time and place are essential.",
          hi: "लग्न लगभग हर दो घंटे बदलता है — सटीक समय और स्थान आवश्यक।",
        },
      },
      {
        q: { en: "Is Lagna the same as Moon sign?", hi: "क्या लग्न और चंद्र राशि एक हैं?" },
        a: {
          en: "No. Lagna is the rising sign; Moon sign is where the Moon sat at birth.",
          hi: "नहीं। लग्न उदय राशि है; चंद्र राशि जन्म के समय चंद्र की राशि है।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  navamsa: {
    h1: { en: "Navamsa (D9) Calculator", hi: "नवमांश (D9) कैलकुलेटर" },
    seoTitle: {
      en: "Navamsa Chart Calculator — Free D9 Kundli Online",
      hi: "नवमांश चार्ट कैलकुलेटर — मुफ्त D9 कुंडली",
    },
    seoDescription: {
      en: "Generate your free Navamsa (D9) chart online. See how the ninth-division chart refines marriage themes and planetary strength.",
      hi: "मुफ्त नवमांश (D9) चार्ट ऑनलाइन बनाएँ। विवाह विषय और ग्रह बल कैसे परिष्कृत होते हैं, देखें।",
    },
    intro: {
      en: "Navamsa (D9) divides each sign into nine parts. It is traditionally studied for marriage themes and deeper planetary dignity — it refines the main birth chart; it does not replace it.",
      hi: "नवमांश (D9) प्रत्येक राशि को नौ भागों में बाँटता है। पारंपरिक रूप से विवाह विषय और गहरे ग्रह बल के लिए देखा जाता है — यह मुख्य कुंडली का परिष्कार है, विकल्प नहीं।",
    },
    promo: {
      text: { en: "Want a full birth chart with houses, yogas and dasha?", hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?" },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "What Navamsa is used for", hi: "नवमांश किस लिए" },
        body: {
          en: "Astrologers examine D9 for marriage/partnership nuance and to judge whether a planet’s promise in the main chart is supported. A planet strong in Rashi but weak in Navamsa may express unevenly — context and dasha still matter.",
          hi: "ज्योतिषी D9 को विवाह/साझेदारी सूक्ष्मता और मुख्य कुंडली के ग्रह वचन के समर्थन हेतु देखते हैं। राशि में बलवान पर नवमांश में कमजोर ग्रह असमान फल दे सकता है — दशा संदर्भ आवश्यक।",
        },
      },
      {
        title: { en: "How to read results calmly", hi: "परिणाम शांति से कैसे पढ़ें" },
        body: {
          en: "Treat Navamsa as a second lens, not a fear trigger. Pair it with your Lagna chart, gun milan if relevant, and a human reading for sensitive decisions.",
          hi: "नवमांश को दूसरी दृष्टि मानें, भय का कारण नहीं। लग्न कुंडली, आवश्यकता हो तो गुण मिलान, और संवेदनशील निर्णयों हेतु मानव परामर्श जोड़ें।",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Does Navamsa replace the birth chart?", hi: "क्या नवमांश जन्म कुंडली का विकल्प है?" },
        a: {
          en: "No. D9 refines specific themes; the main janam kundli remains primary.",
          hi: "नहीं। D9 विशिष्ट विषयों को परिष्कृत करता है; मुख्य जन्म कुंडली प्राथमिक रहती है।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  "moon-phase": genericContent(
    { en: "Moon Phase Calculator", hi: "चंद्र कला कैलकुलेटर" },
    { en: "Moon phase", hi: "चंद्र कला" }
  ),
  "mangal-dosha": {
    h1: { en: "Mangal Dosha (Manglik) Calculator", hi: "मंगल दोष (मंगलिक) कैलकुलेटर" },
    seoTitle: {
      en: "Mangal Dosha Calculator — Check Manglik Status Free",
      hi: "मंगल दोष कैलकुलेटर — मुफ्त मंगलिक जाँच",
    },
    seoDescription: {
      en: "Check your Mangal Dosha (Manglik) status free by birth details. Understand cancellation rules, exceptions and remedies clearly explained.",
      hi: "जन्म विवरण से मुफ्त मंगल दोष (मंगलिक) जाँचें। निवारण नियम, अपवाद और उपाय स्पष्ट भाषा में।",
    },
    intro: {
      en: "Mangal (Manglik) dosha checks Mars in key houses from Lagna or Moon. Get a free Lahiri-based flag in seconds, then review cancellations with a full kundli or consultation.",
      hi: "मंगल (मंगलिक) दोष लग्न या चंद्र से प्रमुख भावों में मंगल की जाँच है। मुफ्त लाहिरी संकेत सेकंडों में पाएँ, फिर पूर्ण कुंडली या परामर्श से निवारण देखें।",
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
        title: { en: "Which houses create Mangal Dosha?", hi: "मंगल दोष किन भावों से बनता है?" },
        body: {
          en: "Classical checks look for Mars in the 1st, 2nd, 4th, 7th, 8th or 12th house from Lagna — and often also from the Moon. Exact school rules vary slightly; this tool follows a clear, transparent house checklist so you can see why a flag appears.",
          hi: "शास्त्रीय जाँच में लग्न से 1, 2, 4, 7, 8 या 12वें भाव में मंगल देखा जाता है — और अक्सर चंद्र से भी। परंपरा में थोड़ा अंतर हो सकता है; यह उपकरण स्पष्ट भाव-सूची से बताता है कि संकेत क्यों आया।",
        },
      },
      {
        title: { en: "Cancellations and exceptions", hi: "निवारण और अपवाद" },
        body: {
          en: "Texts list cancellations such as Mars in certain signs, mutual Manglik status, or strong benefic influences. A dosha flag is a traditional indicator for deeper chart study — not a fixed life verdict. CosmicTalks explains results without fear-based jargon; for marriage decisions, review full charts and speak with a qualified astrologer.",
          hi: "शास्त्रों में कुछ राशियों में मंगल, पारस्परिक मंगलिक स्थिति या शुभ प्रभाव जैसे निवारण बताए गए हैं। दोष संकेत गहन अध्ययन का पारंपरिक संकेत है — निश्चित जीवन फैसला नहीं। CosmicTalks भयभीत भाषा के बिना समझाता है; विवाह निर्णय हेतु पूर्ण कुंडली और योग्य ज्योतिषी से बात करें।",
        },
      },
      {
        title: { en: "How to use", hi: "उपयोग कैसे करें" },
        body: {
          en: "Enter birth details for a Lahiri-based Mangal check, then open kundli matching or a consultation for context.",
          hi: "जन्म विवरण से लाहिरी आधारित मंगल जाँच करें, फिर मिलान या परामर्श से संदर्भ लें।",
        },
        steps: [
          { en: "Enter date, time and place of birth.", hi: "जन्म तिथि, समय और स्थान भरें।" },
          { en: "Review the Manglik flag and house notes.", hi: "मंगलिक संकेत और भाव नोट्स देखें।" },
          { en: "Cross-check with matching and full kundli.", hi: "मिलान व पूर्ण कुंडली से क्रॉस-चेक करें।" },
        ],
      },
    ],
    faqs: [
      {
        q: {
          en: "Does Manglik always block marriage?",
          hi: "क्या मंगलिक हमेशा विवाह रोकता है?",
        },
        a: {
          en: "No. Classical texts list cancellations. Confirm with full charts and an expert.",
          hi: "नहीं। शास्त्रों में निवारण योग हैं। पूर्ण कुंडली और विशेषज्ञ से पुष्टि करें।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  "kaal-sarp-dosha": genericContent(
    { en: "Kaal Sarp Dosha Calculator", hi: "काल सर्प दोष कैलकुलेटर" },
    { en: "Kaal Sarp pattern", hi: "काल सर्प पैटर्न" }
  ),
  "sade-sati": {
    h1: { en: "Sade Sati Calculator", hi: "साढ़े साती कैलकुलेटर" },
    seoTitle: {
      en: "Sade Sati Calculator — Check Saturn Phase Free",
      hi: "साढ़े साती कैलकुलेटर — मुफ्त शनि चरण जाँच",
    },
    seoDescription: {
      en: "Check your Saturn Sade Sati phase free by Moon sign. Understand rising, peak and setting stages without fear-based jargon.",
      hi: "चंद्र राशि से मुफ्त शनि साढ़े साती चरण जाँचें। आरंभ, मध्य व अंत चरण भय-मुक्त भाषा में समझें।",
    },
    intro: {
      en: "Sade Sati is Saturn’s ~7.5-year transit over your Moon sign (and adjacent signs). Check your current phase free with Lahiri positions — then read dasha context for timing.",
      hi: "साढ़े साती चंद्र राशि (और पड़ोसी राशियों) पर शनि का लगभग 7.5 वर्ष का गोचर है। लाहिरी स्थिति से वर्तमान चरण मुफ्त जाँचें — समय के लिए दशा संदर्भ भी देखें।",
    },
    promo: {
      text: { en: "Want a full birth chart with houses, yogas and dasha?", hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?" },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "What Sade Sati is", hi: "साढ़े साती क्या है" },
        body: {
          en: "Sade Sati refers to Saturn transiting the sign before your Moon, your Moon sign, and the sign after — about 2.5 years each, ~7.5 years total. It is a timing framework for responsibility, restructuring and patience — not a guaranteed crisis.",
          hi: "साढ़े साती का अर्थ है शनि का गोचर आपकी चंद्र राशि से पहले, उसी राशि में, और अगली राशि में — लगभग 2.5×3 वर्ष। यह जिम्मेदारी, पुनर्गठन और धैर्य का समय ढाँचा है — निश्चित संकट नहीं।",
        },
      },
      {
        title: { en: "Read with dasha context", hi: "दशा संदर्भ से पढ़ें" },
        body: {
          en: "The same Saturn transit feels different under supportive vs challenging Mahadasha. Pair this calculator with Vimshottari dasha and full kundli before drawing life conclusions.",
          hi: "सहायक बनाम चुनौतीपूर्ण महादशा में वही शनि गोचर अलग लगता है। जीवन निष्कर्ष से पहले विंशोत्तरी दशा और पूर्ण कुंडली जोड़ें।",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Is Sade Sati always negative?", hi: "क्या साढ़े साती हमेशा नकारात्मक है?" },
        a: {
          en: "No. Many people experience growth, discipline and clarity. Outcomes depend on chart, dasha and choices.",
          hi: "नहीं। कई लोग विकास, अनुशासन और स्पष्टता अनुभव करते हैं। फल कुंडली, दशा और विकल्पों पर निर्भर करते हैं।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
  "vimshottari-dasha": {
    h1: { en: "Vimshottari Dasha Calculator", hi: "विंशोत्तरी दशा कैलकुलेटर" },
    seoTitle: {
      en: "Vimshottari Dasha Calculator — Free Timeline",
      hi: "विंशोत्तरी दशा कैलकुलेटर — मुफ्त समयरेखा",
    },
    seoDescription: {
      en: "Calculate your Vimshottari Mahadasha and Antardasha free from birth Nakshatra. See current life-period timing in clear English or Hindi.",
      hi: "जन्म नक्षत्र से मुफ्त विंशोत्तरी महादशा व अंतरदशा जानें। वर्तमान जीवन काल समय स्पष्ट हिंदी/अंग्रेज़ी में।",
    },
    intro: {
      en: "Vimshottari dasha is a ~120-year planetary period system starting from the Moon’s Nakshatra at birth. See your current Mahadasha and finer Antardasha for timing context — calm guidance, not fear.",
      hi: "विंशोत्तरी दशा जन्म चंद्र नक्षत्र से शुरू ~120 वर्ष की ग्रहीय अवधि प्रणाली है। वर्तमान महादशा व अंतरदशा समय संदर्भ के लिए देखें — शांत मार्गदर्शन, भय नहीं।",
    },
    promo: {
      text: { en: "Want a full birth chart with houses, yogas and dasha?", hi: "भाव, योग और दशा सहित पूरी जन्म कुंडली चाहिए?" },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "How Vimshottari works", hi: "विंशोत्तरी कैसे काम करती है" },
        body: {
          en: "Each planet rules a fixed-length Mahadasha (e.g. Venus 20 years, Saturn 19, Rahu 18). Within it, Antardashas refine the chapter. The sequence is fixed; your starting point comes from the Moon’s birth Nakshatra.",
          hi: "प्रत्येक ग्रह निश्चित अवधि की महादशा चलाता है (जैसे शुक्र 20, शनि 19, राहु 18 वर्ष)। भीतर अंतरदशा अध्याय परिष्कृत करती है। क्रम निश्चित; आरंभ बिंदु जन्म चंद्र नक्षत्र से आता है।",
        },
      },
      {
        title: { en: "Using results wisely", hi: "परिणाम समझदारी से" },
        body: {
          en: "Dasha shows seasons of emphasis — career, relationships, study, health rhythms — not a fixed fate. Pair with transits and full kundli; for sensitive decisions, speak with a verified astrologer.",
          hi: "दशा जोर के मौसम दिखाती है — करियर, संबंध, अध्ययन, स्वास्थ्य लय — निश्चित भाग्य नहीं। गोचर व पूर्ण कुंडली जोड़ें; संवेदनशील निर्णय हेतु सत्यापित ज्योतिषी से बात करें।",
        },
      },
    ],
    faqs: [
      {
        q: { en: "Do I need exact birth time for dasha?", hi: "दशा हेतु सटीक जन्म समय ज़रूरी?" },
        a: {
          en: "Moon Nakshatra is mainly date-sensitive, but precise time improves the full chart used alongside dasha.",
          hi: "चंद्र नक्षत्र मुख्यतः तिथि पर निर्भर, पर सटीक समय दशा के साथ पूर्ण कुंडली सुधारता है।",
        },
      },
    ],
    disclaimer: DEFAULT_DISCLAIMER,
  },
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
  "prashna-kundli": {
    h1: { en: "Prashna Kundli Calculator", hi: "प्रश्न कुंडली कैलकुलेटर" },
    seoTitle: {
      en: "Prashna Kundli Calculator — Free Horary Chart",
      hi: "प्रश्न कुंडली कैलकुलेटर — मुफ्त होररी चार्ट",
    },
    seoDescription: {
      en: "Cast a free Prashna (horary) chart for the moment you ask. Topic significators with lean/caution flags — Lahiri whole-sign, no %-odds.",
      hi: "पूछने के क्षण की मुफ्त प्रश्न (होररी) कुंडली। विषय कारक भाव व झुकाव/सावधानी — लाहिरी पूर्ण-राशि, %-संभावना नहीं।",
    },
    intro: {
      en: "Prashna Kundli is a Vedic horary chart cast for the exact time and place you ask a question. CosmicTalks maps your topic to classical houses, shows significator lords, and returns lean / caution / insufficient clarity — each with basedOn citations. It is not a yes/no percentage oracle and does not replace a birth kundli.",
      hi: "प्रश्न कुंडली उस क्षण और स्थान की वैदिक होररी कुंडली है जब आप प्रश्न पूछते हैं। CosmicTalks विषय को शास्त्रीय भावों से जोड़ता है, कारक स्वामी दिखाता है, और झुकाव / सावधानी / अपर्याप्त स्पष्टता देता है — प्रत्येक basedOn सहित। यह हाँ/नहीं प्रतिशत ऑरेकल नहीं और जन्म कुंडली का विकल्प नहीं।",
    },
    promo: {
      text: {
        en: "Want birth-chart context with dasha timing?",
        hi: "दशा समय सहित जन्म कुंडली संदर्भ चाहिए?",
      },
      cta: { en: "Open free kundli →", hi: "मुफ्त कुंडली खोलें →" },
      href: "/kundli",
    },
    sections: [
      {
        title: { en: "What Prashna calculates", hi: "प्रश्न क्या गणना करता है" },
        body: {
          en: "We compute Lagna and planets at the asking instant (Lahiri sidereal, whole-sign houses), then attach your topic’s significator houses (e.g. marriage → 7th; money/job → 2, 10, 11). Lords in kendra/trikona without malefic contact lean supportive; dusthana, combustion, or malefic contact lean caution. Timing hints use Vimshottari from the Prashna Moon.",
          hi: "हम पूछने के क्षण पर लग्न व ग्रह (लाहिरी सायन, पूर्ण-राशि भाव) गणना करते हैं, फिर विषय के कारक भाव जोड़ते हैं (जैसे विवाह → 7; धन/नौकरी → 2, 10, 11)। केन्द्र/त्रिकोण में पाप-मुक्त स्वामी सकारात्मक झुकाव; 6/8/12, अस्त या पाप युति सावधानी। समय संकेत प्रश्न चंद्र की विंशोत्तरी से।",
        },
      },
      {
        title: { en: "How to read the result", hi: "परिणाम कैसे पढ़ें" },
        body: {
          en: "Use lean / caution / insufficient as a moment-sky screen — not fate rewrite. For health or litigation topics, CosmicTalks explicitly refuses medical diagnosis and legal win/lose claims. Prefer full janam kundli + dasha for life decisions; see Methodology for engine defaults.",
          hi: "झुकाव / सावधानी / अपर्याप्त को क्षण-आकाश स्क्रीन मानें — भाग्य पुनर्लेखन नहीं। स्वास्थ्य या मुकदमा विषयों पर चिकित्सकीय निदान व कानूनी जीत/हार स्पष्ट रूप से अस्वीकार। जीवन निर्णयों हेतु जन्म कुंडली + दशा प्राथमिक; इंजन डिफ़ॉल्ट हेतु मेथडोलॉजी देखें।",
        },
        steps: [
          {
            en: "Choose a topic tag (self/health, money/job, marriage, travel, etc.).",
            hi: "विषय टैग चुनें (स्वयं/स्वास्थ्य, धन/नौकरी, विवाह, यात्रा आदि)।",
          },
          {
            en: "Enter the date, time and place of asking (IANA timezone when place is selected).",
            hi: "पूछने की तिथि, समय और स्थान भरें (स्थान चुनने पर IANA टाइमज़ोन)।",
          },
          {
            en: "Read significators, lean basedOn, and the Prashna Moon dasha hint.",
            hi: "कारक, झुकाव basedOn, और प्रश्न चंद्र दशा संकेत पढ़ें।",
          },
        ],
      },
      {
        title: { en: "Prashna vs KP horary", hi: "प्रश्न बनाम केपी होररी" },
        body: {
          en: "This page is Parashari Prashna (question-time chart + house significators). KP horary (1–249 number) is a separate CosmicTalks tool under the KP category — do not mix the two judgment systems silently.",
          hi: "यह पृष्ठ पारंपरिक प्रश्न (प्रश्न-काल कुंडली + भाव कारक) है। केपी होररी (1–249) अलग उपकरण है — दोनों निर्णयन प्रणालियाँ चुपचाप न मिलाएँ।",
        },
      },
    ],
    faqs: [
      {
        q: {
          en: "Is Prashna the same as KP horary?",
          hi: "क्या प्रश्न और केपी होररी एक हैं?",
        },
        a: {
          en: "No. Prashna here is a Parashari question-time chart with house significators. KP horary uses the 1–249 number system separately.",
          hi: "नहीं। यहाँ प्रश्न पारंपरिक प्रश्न-काल कुंडली है। केपी होररी 1–249 संख्या प्रणाली अलग है।",
        },
      },
      {
        q: {
          en: "Does it give a yes/no percentage?",
          hi: "क्या यह हाँ/नहीं प्रतिशत देता है?",
        },
        a: {
          en: "No. CosmicTalks only shows lean, caution, or insufficient clarity — each with chart-based citations.",
          hi: "नहीं। केवल झुकाव, सावधानी या अपर्याप्त स्पष्टता — प्रत्येक चार्ट आधारित citation के साथ।",
        },
      },
      {
        q: {
          en: "Do I need my birth details for Prashna?",
          hi: "प्रश्न हेतु जन्म विवरण ज़रूरी?",
        },
        a: {
          en: "No for v1 math — only the asking time and place. Birth chart comparison is optional and not mixed into Prashna calculation.",
          hi: "v1 गणित हेतु नहीं — केवल पूछने का समय और स्थान। जन्म कुंडली तुलना वैकल्पिक है और प्रश्न गणना में नहीं मिलती।",
        },
      },
      {
        q: {
          en: "Where is the calculation methodology documented?",
          hi: "गणना पद्धति कहाँ दर्ज है?",
        },
        a: {
          en: "See CosmicTalks Methodology (Lahiri, whole-sign, IANA at instant) and the Prashna section describing topic→house maps and lean screens.",
          hi: "CosmicTalks मेथडोलॉजी (लाहिरी, पूर्ण-राशि, क्षण पर IANA) और प्रश्न अनुभाग देखें — विषय→भाव मानचित्र व झुकाव स्क्रीन।",
        },
      },
    ],
    references: [
      {
        en: "Methodology — Prashna Kundli rules",
        hi: "मेथडोलॉजी — प्रश्न कुंडली नियम",
      },
      {
        en: "Related: KP Horary Number calculator",
        hi: "संबंधित: केपी होररी संख्या कैलकुलेटर",
      },
    ],
    disclaimer: {
      en: "Prashna is guidance for this moment’s sky — not medical, legal or financial advice, and not a guarantee of outcomes.",
      hi: "प्रश्न इस क्षण के आकाश हेतु मार्गदर्शन है — चिकित्सकीय, कानूनी या वित्तीय सलाह नहीं, और परिणाम की गारंटी नहीं।",
    },
  },
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
  "muhurta-electional": {
    h1: { en: "Muhurta Finder", hi: "मुहूर्त खोज" },
    seoTitle: {
      en: "Muhurta Finder — Pass/Caution/Avoid Windows",
      hi: "मुहूर्त खोज — पास/सावधानी/बचें खिड़कियाँ",
    },
    seoDescription: {
      en: "Find auspicious Muhurta windows for travel, marriage talk, house entry or business — daytime Choghadiya + Panchang, no luck percentages.",
      hi: "यात्रा, विवाह चर्चा, गृह प्रवेश या व्यवसाय हेतु मुहूर्त — दिन चौघड़िया + पंचांग, भाग्य प्रतिशत नहीं।",
    },
    intro: {
      en: "Muhurta Finder scores daytime Choghadiya segments over up to 14 days as pass, caution, or avoid for your activity — using Rahu Kaal, Vishti karana, Rikta tithis, yoga and hora rules. CosmicTalks does not invent luck percentages; every window carries basedOn citations.",
      hi: "मुहूर्त खोज 14 दिनों तक दिन चौघड़िया खंडों को आपकी गतिविधि हेतु पास, सावधानी या बचें में अंकित करता है — राहु काल, विष्टि करण, रिक्त तिथि, योग व होरा नियमों से। भाग्य प्रतिशत नहीं; प्रत्येक खिड़की basedOn सहित।",
    },
    promo: {
      text: {
        en: "Need single-day Choghadiya or Rahu Kaal only?",
        hi: "केवल एक दिन की चौघड़िया या राहु काल?",
      },
      cta: { en: "Open Choghadiya →", hi: "चौघड़िया खोलें →" },
      href: "/calculators/choghadiya",
    },
    sections: [
      {
        title: { en: "How windows are scored", hi: "खिड़कियाँ कैसे अंकित होती हैं" },
        body: {
          en: "Hard avoid: Rahu Kaal overlap or Vishti (Bhadra) karana. Soft caution: Rikta tithis, harsh yogas, Rog/Udveg/Kaal Choghadiya, malefic hora. Support: Amrit/Shubh/Labh, supportive yoga/nakshatra/hora for the activity. Aggregate: any hard → avoid; soft without support → caution; support ≥ soft → pass.",
          hi: "कठोर बचें: राहु काल ओवरलैप या विष्टि करण। नरम सावधानी: रिक्त तिथि, कठोर योग, रोग/उद्वेग/काल, पाप होरा। सहायक: अमृत/शुभ/लाभ व गतिविधि-अनुकूल नक्षत्र/होरा। योग: कोई कठोर → बचें; बिना सहायक नरम → सावधानी; सहायक ≥ नरम → पास।",
        },
      },
      {
        title: { en: "Optional natal filter", hi: "वैकल्पिक जन्म फ़िल्टर" },
        body: {
          en: "Off by default. When enabled, windows where transit Moon sits in the 8th sign from your natal Moon are marked avoid and labeled natal filter — never applied silently.",
          hi: "डिफ़ॉल्ट बंद। चालू होने पर गोचर चंद्र जन्म चंद्र से 8वीं राशि में हो तो बचें + जन्म फ़िल्टर लेबल — चुपचाप नहीं।",
        },
        steps: [
          {
            en: "Choose activity, city, and start/end dates (max 14 days).",
            hi: "गतिविधि, शहर, आरंभ/अंत तिथि चुनें (अधिकतम 14 दिन)।",
          },
          {
            en: "Optionally enable natal Moon 8th filter and pick natal Moon sign.",
            hi: "वैकल्पिक जन्म चंद्र 8वाँ फ़िल्टर व राशि चुनें।",
          },
          {
            en: "Read top pass windows and sample avoid reasons.",
            hi: "शीर्ष पास खिड़कियाँ और बचें कारण पढ़ें।",
          },
        ],
      },
      {
        title: { en: "Related day-part tools", hi: "संबंधित दिन-खंड उपकरण" },
        body: {
          en: "Single-day Choghadiya, Hora, Rahu Kaal and Gowri remain available separately. This page composes them into multi-day electional scoring. See Methodology for engine defaults.",
          hi: "एक-दिन चौघड़िया, होरा, राहु काल और गौरी अलग उपलब्ध हैं। यह पृष्ठ उन्हें बहु-दिवसीय मुहूर्त स्कोर में जोड़ता है। इंजन डिफ़ॉल्ट हेतु मेथडोलॉजी देखें।",
        },
      },
    ],
    faqs: [
      {
        q: {
          en: "Does Muhurta guarantee success?",
          hi: "क्या मुहूर्त सफलता की गारंटी देता है?",
        },
        a: {
          en: "No. It improves traditional timing odds. Outcomes still depend on effort, context and full chart factors.",
          hi: "नहीं। यह पारंपरिक समय-संभावना सुधारता है। फल प्रयास, संदर्भ और पूर्ण कुंडली पर भी निर्भर।",
        },
      },
      {
        q: {
          en: "Why no percentage score?",
          hi: "प्रतिशत स्कोर क्यों नहीं?",
        },
        a: {
          en: "CosmicTalks uses pass / caution / avoid with cited factors instead of invented luck percentages.",
          hi: "CosmicTalks गढ़े भाग्य-% के बजाय basedOn कारकों सहित पास / सावधानी / बचें उपयोग करता है।",
        },
      },
      {
        q: {
          en: "Is this for medical procedures?",
          hi: "क्या यह चिकित्सा प्रक्रियाओं के लिए है?",
        },
        a: {
          en: "No. CosmicTalks does not clear medical or surgical timing — consult qualified professionals.",
          hi: "नहीं। CosmicTalks चिकित्सकीय/सर्जिकल समय स्वीकृत नहीं करता — योग्य पेशेवरों से परामर्श लें।",
        },
      },
    ],
    references: [
      {
        en: "Methodology — Muhurta electional rules",
        hi: "मेथडोलॉजी — मुहूर्त नियम",
      },
      {
        en: "Related: Choghadiya / Rahu Kaal / Hora",
        hi: "संबंधित: चौघड़िया / राहु काल / होरा",
      },
    ],
    disclaimer: {
      en: "Traditional timing guidance only — not guaranteed outcomes, and not medical, legal or financial advice.",
      hi: "केवल पारंपरिक समय मार्गदर्शन — गारंटी नहीं; चिकित्सकीय, कानूनी या वित्तीय सलाह नहीं।",
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
