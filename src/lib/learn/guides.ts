import type { LearnGuide, LocaleText } from "@/lib/learn/types";

const L = (en: string, hi: string): LocaleText => ({ en, hi });

export const TOPIC_GUIDES: LearnGuide[] = [
  {
    slug: "life-insights",
    category: "guides",
    icon: "🌱",
    menuTitle: L("Life Insights", "जीवन मार्गदर्शन"),
    menuDescription: L(
      "How Jyotish turns chart factors into useful self-understanding.",
      "ज्योतिष कुंडली के संकेतों को उपयोगी आत्म-समझ में कैसे बदलता है।"
    ),
    title: L("Using Jyotish for Life Insights", "जीवन मार्गदर्शन के लिए ज्योतिष"),
    subtitle: L(
      "A practical way to read tendencies, timing, and choice without fatalism.",
      "प्रवृत्ति, समय और चुनाव को बिना भाग्यवाद के पढ़ने का व्यावहारिक तरीका।"
    ),
    description: L(
      "Learn how Vedic astrology can offer life insight through Lagna, Moon, houses, and dasha without reducing life to fixed fate.",
      "जानें कि वैदिक ज्योतिष लग्न, चंद्र, भाव और दशा के माध्यम से बिना भाग्यवाद के जीवन-मार्गदर्शन कैसे देता है।"
    ),
    intro: [
      L(
        "A useful Jyotish reading is not a list of labels. It is a structured way of seeing tendencies, strengths, repeating challenges, and the kinds of environments in which a person grows well. The chart does not remove free will, but it often shows where effort flows more naturally and where maturity is required.",
        "उपयोगी ज्योतिष-पठन केवल नामों की सूची नहीं होता। यह प्रवृत्तियों, शक्तियों, बार-बार आने वाली चुनौतियों और उन परिस्थितियों को देखने का एक व्यवस्थित तरीका है जिनमें व्यक्ति अच्छी तरह विकसित होता है। कुंडली स्वतंत्र इच्छा को समाप्त नहीं करती, लेकिन यह अवश्य दिखाती है कि कहाँ प्रयास सहज बहता है और कहाँ परिपक्वता चाहिए।"
      ),
      L(
        "For meaningful life insight, readers usually begin with Lagna for overall direction, the Moon for inner experience, the Sun for purpose, and the current dasha for timing. This combination turns isolated symbols into a coherent life narrative.",
        "सार्थक जीवन-मार्गदर्शन के लिए सामान्यतः लग्न से समग्र दिशा, चंद्र से आंतरिक अनुभव, सूर्य से उद्देश्य और वर्तमान दशा से समय देखा जाता है। यही संयोजन अलग-अलग प्रतीकों को एक सुसंगत जीवन-कथा में बदलता है।"
      ),
    ],
    sections: [
      {
        heading: L("Start with the big anchors", "मुख्य आधारों से शुरुआत करें"),
        paragraphs: [
          L(
            "Lagna shows how life is carried through the body, behavior, and personal style. The Moon reveals emotional processing and what the mind needs to feel safe. The Sun points toward self-respect and direction. When these three agree, life often feels internally coherent; when they clash, the person may feel pulled in different directions.",
            "लग्न बताता है कि जीवन शरीर, व्यवहार और व्यक्तित्व-शैली के माध्यम से कैसे वहन हो रहा है। चंद्र मन की प्रक्रिया और सुरक्षा की आवश्यकता दिखाता है। सूर्य आत्मसम्मान और दिशा की ओर संकेत करता है। जब ये तीनों एकमत हों, तो जीवन भीतर से संगत लगता है; विरोध होने पर व्यक्ति कई दिशाओं में खिंच सकता है।"
          ),
        ],
      },
      {
        heading: L("Read themes before events", "घटनाओं से पहले विषय समझें"),
        paragraphs: [
          L(
            "One of the healthiest uses of astrology is to identify the life themes that keep repeating: responsibility, mobility, service, teaching, partnership, finance, or inward growth. Once the theme is seen, the person can respond more intelligently instead of waiting passively for prediction to happen.",
            "ज्योतिष का सबसे स्वस्थ उपयोग यह है कि जीवन में बार-बार लौटने वाले विषय पहले पहचाने जाएँ: जिम्मेदारी, गतिशीलता, सेवा, शिक्षण, साझेदारी, धन या आंतरिक विकास। विषय स्पष्ट हो जाए तो व्यक्ति निष्क्रिय भविष्यवाणी की प्रतीक्षा करने के बजाय अधिक समझदारी से प्रतिक्रिया कर सकता है।"
          ),
        ],
      },
      {
        heading: L("Timing gives context", "समय संदर्भ देता है"),
        paragraphs: [
          L(
            "Even an accurate life theme can feel vague if timing is ignored. Dasha and major transits explain why one chapter emphasizes study, another marriage, another pressure, and another release. Life insight becomes most practical when timing and choice are read together.",
            "यदि समय की उपेक्षा हो, तो सही जीवन-विषय भी धुंधला लग सकता है। दशा और प्रमुख गोचर बताते हैं कि कब अध्ययन पर जोर है, कब विवाह पर, कब दबाव है और कब राहत। जीवन-मार्गदर्शन तब सबसे उपयोगी बनता है जब समय और चुनाव दोनों साथ पढ़े जाएँ।"
          ),
        ],
      },
    ],
    relatedSlugs: ["zodiac", "planets", "houses", "dasha"],
  },
  {
    slug: "dasha",
    category: "guides",
    icon: "⏳",
    menuTitle: L("Dasha Guide", "दशा मार्गदर्शिका"),
    menuDescription: L(
      "What Mahadasha and Antardasha really mean in a chart.",
      "महादशा और अंतर्दशा का वास्तविक अर्थ क्या है।"
    ),
    title: L("Understanding Dasha", "दशा को समझें"),
    subtitle: L(
      "Planetary time periods explain when different chart promises come forward.",
      "ग्रहीय समय-खंड बताते हैं कि कुंडली के कौन से संकेत कब आगे आते हैं।"
    ),
    description: L(
      "A practical introduction to Mahadasha, Antardasha, and how Vimshottari timing is used in Vedic astrology.",
      "महादशा, अंतर्दशा और वैदिक ज्योतिष में विंशोत्तरी समय-निर्णय का व्यावहारिक परिचय।"
    ),
    intro: [
      L(
        "Dasha is one of the most powerful ideas in Jyotish because it explains sequence. A birth chart may contain many possibilities, but dashas help show which planetary themes are being emphasized in a given period of life.",
        "दशा ज्योतिष की सबसे शक्तिशाली अवधारणाओं में से एक है क्योंकि यह क्रम बताती है। जन्म कुंडली में अनेक संभावनाएँ हो सकती हैं, पर दशाएँ दिखाती हैं कि जीवन के किसी विशेष काल में कौन से ग्रहीय विषय अधिक सक्रिय हैं।"
      ),
      L(
        "The most commonly used system is Vimshottari dasha, which begins from the Moon’s nakshatra at birth. The Mahadasha sets the larger chapter, while the Antardasha acts like a subchapter that modifies the immediate experience.",
        "सबसे प्रचलित प्रणाली विंशोत्तरी दशा है, जो जन्म के समय चंद्र नक्षत्र से शुरू होती है। महादशा बड़ा जीवन-अध्याय तय करती है, जबकि अंतर्दशा उसी अध्याय के भीतर उप-अध्याय की तरह वर्तमान अनुभव को रंग देती है।"
      ),
    ],
    sections: [
      {
        heading: L("Why dasha matters", "दशा क्यों महत्वपूर्ण है"),
        paragraphs: [
          L(
            "Without dasha, many chart promises remain theoretical. Dasha helps explain why one person studies intensely in one phase, marries in another, relocates in another, and turns inward in yet another. It gives order to experience.",
            "दशा के बिना कुंडली के अनेक संकेत केवल सैद्धांतिक रह जाते हैं। दशा समझाती है कि कोई व्यक्ति एक समय में गहन अध्ययन क्यों करता है, दूसरे में विवाह, तीसरे में स्थान परिवर्तन और किसी अन्य में भीतर की ओर मुड़ता है। यह अनुभव को क्रम देती है।"
          ),
        ],
      },
      {
        heading: L("Do not fear a planet name alone", "केवल ग्रह के नाम से न डरें"),
        paragraphs: [
          L(
            "A Saturn dasha is not automatically bad, and a Jupiter dasha is not automatically easy. The actual result depends on house ownership, placement, dignity, aspects, and the condition of the running subperiod lord. This is why mature dasha reading avoids simple slogans.",
            "शनि की दशा अपने आप बुरी नहीं होती, और गुरु की दशा अपने आप आसान नहीं होती। वास्तविक फल भाव-स्वामित्व, स्थिति, बल, दृष्टि और चल रहे उपकाल के स्वामी पर निर्भर करता है। इसलिए परिपक्व दशा-पठन सरल नारेबाज़ी से बचता है।"
          ),
        ],
      },
      {
        heading: L("Mahadasha and Antardasha together", "महादशा और अंतर्दशा साथ में"),
        paragraphs: [
          L(
            "Mahadasha describes the long climate; Antardasha describes the weather inside that climate. A supportive Mahadasha can still contain a testing Antardasha, and a difficult Mahadasha can hold a productive subperiod that opens opportunity.",
            "महादशा दीर्घकालीन जलवायु है; अंतर्दशा उसी जलवायु के भीतर का मौसम है। अच्छी महादशा में भी कठिन अंतर्दशा आ सकती है, और चुनौतीपूर्ण महादशा के भीतर भी कोई उपकाल अवसर खोल सकता है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["planets", "life-insights", "saturn", "kp-astrology"],
    relatedCalculator: "vimshottari-dasha",
  },
  {
    slug: "love-marriage",
    category: "guides",
    icon: "💞",
    menuTitle: L("Love & Marriage", "प्रेम और विवाह"),
    menuDescription: L(
      "How Jyotish approaches relationships, compatibility, and timing.",
      "ज्योतिष प्रेम, अनुकूलता और विवाह-समय को कैसे देखता है।"
    ),
    title: L("Love and Marriage in Jyotish", "ज्योतिष में प्रेम और विवाह"),
    subtitle: L(
      "Relationship reading goes beyond one house or one compatibility score.",
      "संबंध-विवाह का पठन केवल एक भाव या एक गुणांक पर आधारित नहीं होता।"
    ),
    description: L(
      "Learn how Vedic astrology studies love, marriage, compatibility, Navamsa, and relationship timing with nuance.",
      "जानें कि वैदिक ज्योतिष प्रेम, विवाह, अनुकूलता, नवमांश और संबंध-समय को संतुलित दृष्टि से कैसे पढ़ता है।"
    ),
    intro: [
      L(
        "Relationship astrology in Jyotish is deeper than asking whether a couple is simply 'good' or 'bad' together. It studies attraction, emotional temperament, family expectations, communication style, commitment patterns, and the timing of union or strain.",
        "ज्योतिष में संबंधों का अध्ययन केवल यह पूछना नहीं है कि दो लोग साथ में 'अच्छे' हैं या 'खराब'। इसमें आकर्षण, भावनात्मक स्वभाव, पारिवारिक अपेक्षाएँ, संवाद शैली, प्रतिबद्धता के पैटर्न और मिलन या तनाव के समय को भी देखा जाता है।"
      ),
      L(
        "The 7th house matters, but it is not the whole story. Venus, Jupiter, the condition of the 7th lord, Navamsa, and running dasha all shape how love and marriage unfold in real life.",
        "सप्तम भाव महत्वपूर्ण है, लेकिन वही पूरी कहानी नहीं है। शुक्र, गुरु, सप्तमेश की स्थिति, नवमांश और चल रही दशा - ये सभी तय करते हैं कि प्रेम और विवाह वास्तविक जीवन में किस तरह घटित होंगे।"
      ),
    ],
    sections: [
      {
        heading: L("What a relationship reading includes", "संबंध-पठन में क्या-क्या शामिल होता है"),
        paragraphs: [
          L(
            "A balanced reading considers the 7th house, 7th lord, Venus, Mars, Moon, and supporting houses such as the 2nd, 4th, 5th, 8th, and 11th. For marriage, Navamsa can add crucial refinement, especially when the birth chart gives mixed signals.",
            "संतुलित संबंध-पठन में सप्तम भाव, सप्तमेश, शुक्र, मंगल, चंद्र और 2, 4, 5, 8, 11 जैसे सहायक भाव भी देखे जाते हैं। विवाह के लिए नवमांश विशेष रूप से महत्वपूर्ण हो सकता है, खासकर जब जन्म कुंडली मिश्रित संकेत दे रही हो।"
          ),
        ],
      },
      {
        heading: L("Compatibility is useful, not absolute", "मिलान उपयोगी है, अंतिम सत्य नहीं"),
        paragraphs: [
          L(
            "Kundli matching can reveal emotional, sexual, practical, and family-level compatibility patterns, but no single score replaces full judgement. A moderate score with strong mutual support in other chart factors can work better than a high score with difficult timing and weak communication patterns.",
            "कुंडली मिलान भावनात्मक, शारीरिक, व्यावहारिक और पारिवारिक स्तर पर अनुकूलता के संकेत दे सकता है, पर कोई एक स्कोर अंतिम निर्णय नहीं होता। कई बार मध्यम गुणांक, यदि अन्य ग्रह-संकेत अच्छे हों, तो ऊँचे गुणांक से भी बेहतर चल सकता है जहाँ समय या संवाद कमजोर हो।"
          ),
        ],
      },
      {
        heading: L("Timing and maturity", "समय और परिपक्वता"),
        paragraphs: [
          L(
            "Dashas and transits often explain when relationships become serious, when marriage discussions move, or when strain surfaces for resolution. Astrology can help with timing, but emotional maturity, honesty, and practical effort still decide the quality of the bond.",
            "दशा और गोचर प्रायः बताते हैं कि संबंध कब गंभीर होते हैं, विवाह-चर्चा कब आगे बढ़ती है या तनाव कब सामने आता है। ज्योतिष समय बता सकता है, लेकिन भावनात्मक परिपक्वता, ईमानदारी और व्यावहारिक प्रयास ही संबंध की गुणवत्ता तय करते हैं।"
          ),
        ],
      },
    ],
    relatedSlugs: ["mangal-dosha", "dasha", "houses", "life-insights"],
    relatedCalculator: "kundli-matching",
  },
  {
    slug: "saturn",
    category: "guides",
    icon: "♄",
    menuTitle: L("Saturn Guide", "शनि मार्गदर्शिका"),
    menuDescription: L(
      "A practical and balanced understanding of Shani in life and charts.",
      "जीवन और कुंडली में शनि को समझने की संतुलित व्याख्या।"
    ),
    title: L("Understanding Saturn", "शनि को समझें"),
    subtitle: L(
      "Saturn represents time, accountability, endurance, and mature structure.",
      "शनि समय, जवाबदेही, धैर्य और परिपक्व संरचना का ग्रह है।"
    ),
    description: L(
      "A respectful guide to Saturn in Vedic astrology, including discipline, delays, Sade Sati, and long-term growth.",
      "वैदिक ज्योतिष में शनि पर संतुलित मार्गदर्शिका: अनुशासन, विलंब, साढ़े साती और दीर्घकालिक विकास।"
    ),
    intro: [
      L(
        "Saturn is often feared because it slows life down where people want immediate movement. Yet in Jyotish, Shani is also the great teacher of realism, patience, and honest labor. It does not always deny; very often it asks for maturity before granting stability.",
        "शनि से लोग अक्सर इसलिए डरते हैं क्योंकि जहाँ वे तत्काल गति चाहते हैं, वहाँ यह ग्रह धीमापन लाता है। पर ज्योतिष में शनि यथार्थ, धैर्य और ईमानदार श्रम का महान शिक्षक भी है। यह हर बार वंचित नहीं करता; प्रायः यह स्थिरता देने से पहले परिपक्वता मांगता है।"
      ),
      L(
        "A strong Saturn can build endurance, technical skill, boundaries, and serious achievement. A troubled Saturn may show fear, delay, isolation, burden, or self-doubt, especially until its lessons are consciously accepted.",
        "मजबूत शनि सहनशक्ति, तकनीकी कौशल, सीमाएँ और गंभीर उपलब्धि दे सकता है। पीड़ित शनि भय, विलंब, अकेलापन, बोझ या आत्म-संदेह दिखा सकता है, विशेषकर तब तक जब तक उसके पाठ सचेत रूप से स्वीकार न किए जाएँ।"
      ),
    ],
    sections: [
      {
        heading: L("What Saturn teaches", "शनि क्या सिखाता है"),
        paragraphs: [
          L(
            "Saturn teaches that not everything can be solved by enthusiasm. Some results require repetition, order, delayed gratification, and responsibility carried over time. This is why Saturn often rewards those who work steadily even when results are not immediate.",
            "शनि सिखाता है कि हर चीज़ केवल उत्साह से हल नहीं होती। कुछ परिणाम दोहराव, व्यवस्था, विलंबित संतोष और समय तक निभाई गई जिम्मेदारी से मिलते हैं। इसलिए शनि उन लोगों को फल देता है जो त्वरित परिणाम न होने पर भी निरंतर काम करते हैं।"
          ),
        ],
      },
      {
        heading: L("Saturn is not only suffering", "शनि केवल कष्ट नहीं है"),
        paragraphs: [
          L(
            "Because Saturn is linked with challenge, people often ignore its constructive side. It gives professionalism, stamina, sobriety, humility, and results that last. Many people later value Saturn periods because they build a stronger life foundation than easy phases did.",
            "चुनौती से जुड़ाव के कारण लोग शनि के रचनात्मक पक्ष को नज़रअंदाज़ कर देते हैं। यह पेशेवरता, टिकाऊ शक्ति, गंभीरता, विनम्रता और स्थायी परिणाम देता है। कई लोग बाद में शनि के काल को इसलिए महत्व देते हैं क्योंकि उसने आसान समय से अधिक मजबूत आधार बनाया।"
          ),
        ],
      },
      {
        heading: L("Sade Sati and context", "साढ़े साती और संदर्भ"),
        paragraphs: [
          L(
            "Sade Sati is an important Saturn transit cycle, but it should not be treated as automatic doom. The actual experience depends on the natal Moon, Saturn’s condition in the chart, house emphasis, age, and concurrent dasha. For some people it brings responsibility and restructuring more than loss.",
            "साढ़े साती शनि का महत्वपूर्ण गोचर चक्र है, लेकिन इसे स्वचालित विनाश की तरह नहीं देखना चाहिए। वास्तविक अनुभव जन्म चंद्र, कुंडली में शनि की स्थिति, भाव-प्रभाव, आयु और साथ चल रही दशा पर निर्भर करता है। कई लोगों के लिए यह हानि से अधिक जिम्मेदारी और पुनर्संरचना लाती है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["dasha", "life-insights", "raj-yoga", "planets"],
    relatedCalculator: "sade-sati",
  },
  {
    slug: "mangal-dosha",
    category: "guides",
    icon: "♂️",
    menuTitle: L("Mangal Dosha", "मंगल दोष"),
    menuDescription: L(
      "What Manglik status means, and what it does not mean.",
      "मांगलिक स्थिति का अर्थ क्या है और क्या नहीं।"
    ),
    title: L("Mangal Dosha Explained", "मंगल दोष समझें"),
    subtitle: L(
      "A balanced guide to Mars and relationship sensitivity in marriage readings.",
      "विवाह-पठन में मंगल और संबंध-संवेदनशीलता पर संतुलित मार्गदर्शिका।"
    ),
    description: L(
      "Understand Mangal Dosha with nuance: how it is checked, where it matters, and why one label never decides marriage.",
      "मंगल दोष को संतुलित ढंग से समझें: यह कैसे देखा जाता है, कहाँ महत्वपूर्ण है और क्यों एक लेबल विवाह तय नहीं करता।"
    ),
    intro: [
      L(
        "Mangal Dosha, or Manglik status, is one of the most discussed topics in marriage astrology. It is usually checked from specific houses for Mars because that planet can add heat, impatience, force, and conflict when relationship factors are already sensitive.",
        "मंगल दोष या मांगलिक स्थिति विवाह ज्योतिष के सबसे चर्चित विषयों में से एक है। इसे सामान्यतः मंगल के कुछ विशेष भावों से देखा जाता है, क्योंकि यह ग्रह वहाँ पहले से संवेदनशील संबंध-सूत्रों में उष्णता, अधैर्य, दबाव या टकराव जोड़ सकता है।"
      ),
      L(
        "At the same time, Mangal Dosha is frequently overstated. One placement never tells the whole story. The strength of Mars, the overall condition of the 7th house, mutual compatibility, and softening combinations all matter.",
        "साथ ही, मंगल दोष को कई बार आवश्यकता से अधिक बढ़ा-चढ़ाकर बताया जाता है। एक स्थान पूरी कहानी नहीं बताता। मंगल का बल, सप्तम भाव की स्थिति, पारस्परिक अनुकूलता और दोष-शमन के योग - सभी महत्वपूर्ण हैं।"
      ),
    ],
    sections: [
      {
        heading: L("What the dosha actually points to", "यह दोष वास्तव में किस ओर संकेत करता है"),
        paragraphs: [
          L(
            "At its best, this check is trying to measure relationship temperature and adjustment pressure, not to curse a person. It may reflect strong will, argument style, impatience, or the need for a partner who can handle direct energy constructively.",
            "अपने सही उपयोग में यह जाँच किसी व्यक्ति को अभिशप्त घोषित नहीं करती, बल्कि संबंधों के तापमान और समायोजन के दबाव को मापने का प्रयास करती है। यह प्रबल इच्छा, बहस का ढंग, अधैर्य या ऐसे साथी की आवश्यकता दिखा सकती है जो सीधे स्वभाव को रचनात्मक रूप से संभाल सके।"
          ),
        ],
      },
      {
        heading: L("Cancellation and moderation matter", "शमन और संतुलन देखना आवश्यक है"),
        paragraphs: [
          L(
            "Many traditions consider cancellation conditions, mutual Manglik matching, strong benefic support, maturity factors, or a well-placed Mars as important modifiers. This is why a serious marriage reading never stops at the word 'Manglik' alone.",
            "कई परंपराएँ शमन-योग, दोनों पक्षों में मांगलिक समानता, शुभ ग्रहों का समर्थन, परिपक्वता के कारक या शुभ स्थिति के मंगल को महत्वपूर्ण संशोधक मानती हैं। इसलिए गंभीर विवाह-पठन केवल 'मांगलिक' शब्द पर रुकता नहीं है।"
          ),
        ],
      },
      {
        heading: L("Use the dosha responsibly", "दोष का जिम्मेदारी से उपयोग करें"),
        paragraphs: [
          L(
            "The healthiest use of this concept is to bring awareness to anger, timing, ego clashes, and practical compatibility. It should guide better matching and conversation, not fear or social stigma.",
            "इस अवधारणा का सबसे स्वस्थ उपयोग यह है कि यह क्रोध, समय, अहं-टकराव और व्यावहारिक अनुकूलता के प्रति जागरूकता लाए। इसे भय या सामाजिक कलंक नहीं, बल्कि बेहतर मिलान और संवाद का साधन बनना चाहिए।"
          ),
        ],
      },
    ],
    relatedSlugs: ["love-marriage", "dasha", "kaal-sarp-dosha"],
    relatedCalculator: "mangal-dosha",
  },
  {
    slug: "kaal-sarp-dosha",
    category: "guides",
    icon: "🐍",
    menuTitle: L("Kaal Sarp Dosha", "काल सर्प दोष"),
    menuDescription: L(
      "A clear guide to this popular but often overstated chart condition.",
      "इस लोकप्रिय लेकिन अक्सर बढ़ा-चढ़ाकर बताए जाने वाले योग की स्पष्ट व्याख्या।"
    ),
    title: L("Kaal Sarp Dosha Explained", "काल सर्प दोष समझें"),
    subtitle: L(
      "A modern label that should be read with caution, nuance, and full-chart context.",
      "एक आधुनिक लोकप्रिय संज्ञा, जिसे संदर्भ और संतुलन के साथ पढ़ना चाहिए।"
    ),
    description: L(
      "Learn what Kaal Sarp Dosha refers to, why its intensity varies, and how to avoid fear-based chart reading.",
      "जानें कि काल सर्प दोष किसे कहते हैं, इसकी तीव्रता क्यों बदलती है और भय-आधारित व्याख्या से कैसे बचें।"
    ),
    intro: [
      L(
        "Kaal Sarp Dosha usually refers to a chart condition in which all the main planets fall within the Rahu-Ketu axis. It is very popular in public astrology discussions, but its interpretation varies across traditions and is often exaggerated in commercial settings.",
        "काल सर्प दोष सामान्यतः उस स्थिति को कहा जाता है जिसमें मुख्य ग्रह राहु-केतु अक्ष के भीतर आ जाते हैं। सार्वजनिक ज्योतिष चर्चा में यह बहुत लोकप्रिय है, लेकिन इसकी व्याख्या परंपराओं के अनुसार बदलती है और व्यावसायिक वातावरण में अक्सर बढ़ा-चढ़ाकर प्रस्तुत की जाती है।"
      ),
      L(
        "A mature astrologer does not judge this pattern in isolation. The houses involved, strength of the planets, yoga support, dasha timing, and actual life outcomes all matter before any conclusion is made.",
        "परिपक्व ज्योतिषी इस योग को अकेले नहीं परखता। संबंधित भाव, ग्रहों का बल, सहायक योग, दशा-समय और वास्तविक जीवन-परिणाम - ये सभी अंतिम निष्कर्ष से पहले देखे जाते हैं।"
      ),
    ],
    sections: [
      {
        heading: L("Why people worry about it", "लोग इससे क्यों चिंतित होते हैं"),
        paragraphs: [
          L(
            "Because Rahu and Ketu are connected with karmic intensity, unusual patterns, and inner restlessness, charts clustered around their axis can feel psychologically concentrated. Some people experience this as pressure, extremes, or delayed ease in certain life areas.",
            "राहु और केतु कर्मगत तीव्रता, असामान्य पैटर्न और भीतर की बेचैनी से जुड़े हैं, इसलिए इनके अक्ष पर केंद्रित कुंडलियाँ मनोवैज्ञानिक रूप से अधिक संकुचित या तीव्र अनुभव दे सकती हैं। कुछ लोग इसे दबाव, अतियों या कुछ क्षेत्रों में देर से सहजता के रूप में अनुभव करते हैं।"
          ),
        ],
      },
      {
        heading: L("Intensity is not uniform", "तीव्रता सभी में समान नहीं होती"),
        paragraphs: [
          L(
            "Not every chart with this pattern produces the same result. Strong benefics, powerful Lagna support, protective yogas, and favorable dashas can significantly soften or redirect the experience. In some charts the pattern may be more symbolic than disruptive.",
            "इस पैटर्न वाली हर कुंडली एक जैसा परिणाम नहीं देती। मजबूत शुभ ग्रह, सशक्त लग्न, रक्षात्मक योग और अनुकूल दशाएँ अनुभव को बहुत हद तक नरम या दिशा-परिवर्तित कर सकती हैं। कुछ कुंडलियों में यह योग व्यावहारिक बाधा से अधिक प्रतीकात्मक हो सकता है।"
          ),
        ],
      },
      {
        heading: L("Avoid fear-driven remedies", "भय-प्रेरित उपायों से बचें"),
        paragraphs: [
          L(
            "The right response is careful chart study, not instant panic. If remedies are considered, they should arise from the full chart and genuine spiritual intent, not from alarm created around one label.",
            "सही प्रतिक्रिया सावधानीपूर्वक कुंडली-पठन है, त्वरित भय नहीं। यदि उपायों पर विचार हो, तो वे पूरी कुंडली और सच्चे आध्यात्मिक उद्देश्य से निकलें, न कि एक नाम के चारों ओर बनाए गए डर से।"
          ),
        ],
      },
    ],
    relatedSlugs: ["raj-yoga", "pitra-dosha", "mangal-dosha"],
    relatedCalculator: "kaal-sarp-dosha",
  },
  {
    slug: "pitra-dosha",
    category: "guides",
    icon: "🪔",
    menuTitle: L("Pitra Dosha", "पितृ दोष"),
    menuDescription: L(
      "Ancestral themes, responsibility, and careful chart interpretation.",
      "पितृ विषय, उत्तरदायित्व और सावधानीपूर्ण कुंडली-पठन।"
    ),
    title: L("Pitra Dosha Explained", "पितृ दोष समझें"),
    subtitle: L(
      "A sensitive topic that should be approached with care, not superstition.",
      "एक संवेदनशील विषय, जिसे अंधविश्वास नहीं बल्कि सावधानी से समझना चाहिए।"
    ),
    description: L(
      "Understand Pitra Dosha in a balanced way, including ancestral themes, chart indicators, and responsible interpretation.",
      "पितृ दोष को संतुलित दृष्टि से समझें: पितृ विषय, कुंडली संकेत और जिम्मेदार व्याख्या सहित।"
    ),
    intro: [
      L(
        "Pitra Dosha is commonly discussed in relation to ancestral patterns, obligations, or unresolved family karma. In chart work it is usually inferred from combinations involving the Sun, the 9th house, Rahu or Ketu, and other supportive factors rather than from one single indication.",
        "पितृ दोष को प्रायः वंशगत पैटर्न, पारिवारिक दायित्व या अनसुलझे पितृ-कर्म से जोड़ा जाता है। कुंडली-पठन में इसे सामान्यतः सूर्य, नवम भाव, राहु-केतु और अन्य सहायक संकेतों के संयोजन से देखा जाता है, न कि केवल एक अकेले संकेत से।"
      ),
      L(
        "This is an especially sensitive topic because it touches grief, family memory, and tradition. Responsible interpretation should offer clarity and grounded action, not guilt or fear.",
        "यह विषय विशेष रूप से संवेदनशील है क्योंकि यह शोक, पारिवारिक स्मृति और परंपरा से जुड़ा है। जिम्मेदार व्याख्या में स्पष्टता और संतुलित दिशा होनी चाहिए, न कि अपराध-बोध या डर।"
      ),
    ],
    sections: [
      {
        heading: L("What readers are looking for", "ज्योतिषी वास्तव में क्या देखते हैं"),
        paragraphs: [
          L(
            "In practice, astrologers look for repeating indicators that may suggest strain around lineage, fatherly guidance, blessings, or inherited imbalance. These patterns can manifest emotionally, spiritually, or through recurring family responsibilities rather than through one dramatic event.",
            "व्यवहार में ज्योतिषी ऐसे दोहराए जाने वाले संकेत देखते हैं जो वंश, पितृ मार्गदर्शन, आशीर्वाद या विरासत में मिले असंतुलन के विषय में तनाव दिखा सकते हैं। ये पैटर्न भावनात्मक, आध्यात्मिक या पारिवारिक जिम्मेदारियों के रूप में प्रकट हो सकते हैं, केवल किसी एक नाटकीय घटना की तरह नहीं।"
          ),
        ],
      },
      {
        heading: L("Interpretation must stay compassionate", "व्याख्या करुणापूर्ण रहनी चाहिए"),
        paragraphs: [
          L(
            "Even if a chart shows ancestral weight, the goal is not to frighten a person. It is to understand the pattern and respond through responsibility, remembrance, family healing, or spiritual practices that suit the person’s tradition and conscience.",
            "यदि कुंडली में वंशगत भार दिखे भी, तो उद्देश्य व्यक्ति को डराना नहीं है। उद्देश्य उस पैटर्न को समझना और जिम्मेदारी, स्मरण, पारिवारिक सामंजस्य या व्यक्ति की परंपरा और श्रद्धा के अनुसार आध्यात्मिक अभ्यासों से उसका उत्तर देना है।"
          ),
        ],
      },
      {
        heading: L("The full chart still decides", "अंततः पूरी कुंडली ही निर्णय करती है"),
        paragraphs: [
          L(
            "No dosha exists in a vacuum. Strong dharma houses, benefic support, healthy Sun and Jupiter factors, and a constructive dasha can all reshape the lived experience. This is why mature astrologers avoid sensational language around Pitra Dosha.",
            "कोई भी दोष शून्य में नहीं होता। मजबूत धर्म भाव, शुभ ग्रहों का समर्थन, स्वस्थ सूर्य-गुरु संकेत और रचनात्मक दशा - ये सभी वास्तविक अनुभव को बदल सकते हैं। यही कारण है कि परिपक्व ज्योतिषी पितृ दोष के बारे में सनसनीखेज भाषा से बचते हैं।"
          ),
        ],
      },
    ],
    relatedSlugs: ["kaal-sarp-dosha", "dasha", "life-insights"],
    relatedCalculator: "pitra-dosha",
  },
  {
    slug: "raj-yoga",
    category: "guides",
    icon: "👑",
    menuTitle: L("Raj Yoga", "राज योग"),
    menuDescription: L(
      "How auspicious combinations are understood in real chart context.",
      "शुभ योगों को वास्तविक कुंडली-संदर्भ में कैसे समझें।"
    ),
    title: L("Raj Yoga in Vedic Astrology", "वैदिक ज्योतिष में राज योग"),
    subtitle: L(
      "Auspicious combinations suggest uplift, but only when supported by strength and timing.",
      "शुभ योग उन्नति का संकेत देते हैं, लेकिन तभी जब बल और समय उनका समर्थन करें।"
    ),
    description: L(
      "Learn what Raj Yoga means in Vedic astrology and why strength, house support, and dasha matter more than a name alone.",
      "जानें कि वैदिक ज्योतिष में राज योग का क्या अर्थ है और क्यों केवल नाम नहीं, बल्कि बल, भाव-सहयोग और दशा अधिक महत्वपूर्ण हैं।"
    ),
    intro: [
      L(
        "Raj Yoga is a broad term used for combinations that can elevate status, achievement, influence, or meaningful progress. In classical Jyotish this often arises through strong links between trinal and angular houses, powerful lords, or other supportive yogas.",
        "राज योग एक व्यापक शब्द है जो उन्नति, प्रतिष्ठा, उपलब्धि, प्रभाव या सार्थक प्रगति देने वाले संयोजनों के लिए उपयोग होता है। शास्त्रीय ज्योतिष में यह प्रायः त्रिकोण और केंद्र भावों के मजबूत संबंध, बलवान स्वामी ग्रह या अन्य सहायक योगों से बनता है।"
      ),
      L(
        "People are often excited to hear that a chart has Raj Yoga, but the mature question is whether the yoga is strong, active, and capable of delivering results. A yoga on paper is not the same as a yoga expressing clearly in life.",
        "लोग यह सुनकर उत्साहित हो जाते हैं कि उनकी कुंडली में राज योग है, लेकिन परिपक्व प्रश्न यह है कि वह योग कितना मजबूत, सक्रिय और फलदायी है। कागज़ पर बना योग और जीवन में स्पष्ट रूप से फलित योग - दोनों अलग बातें हैं।"
      ),
    ],
    sections: [
      {
        heading: L("Yoga needs strength", "योग को बल चाहिए"),
        paragraphs: [
          L(
            "A Raj Yoga becomes meaningful when the involved planets are strong by sign, house, dignity, and freedom from heavy affliction. If the yogakaraka or key lords are weak, combust, badly placed, or trapped in difficult dashas, the yoga may underperform.",
            "राज योग तब सार्थक बनता है जब उसमें जुड़े ग्रह राशि, भाव, बल और कम पीड़ा की दृष्टि से समर्थ हों। यदि योगकारक या मुख्य स्वामी निर्बल, अस्त, प्रतिकूल स्थिति में हों या कठिन दशाओं में फँसे हों, तो योग पूरा फल नहीं दे पाता।"
          ),
        ],
      },
      {
        heading: L("Success takes timing", "सफलता को समय चाहिए"),
        paragraphs: [
          L(
            "Even a strong yoga may stay quiet until the relevant dasha or transit activates it. This is why some people feel their promise very early, while others reach its visible expression later after effort and seasoning.",
            "मजबूत योग भी तब तक शांत रह सकता है जब तक संबंधित दशा या गोचर उसे सक्रिय न करे। इसी कारण कुछ लोग अपने योग का फल जल्दी अनुभव करते हैं, जबकि कुछ को वह प्रयास और समय के बाद देर से दिखाई देता है।"
          ),
        ],
      },
      {
        heading: L("Raj Yoga is not only fame", "राज योग केवल प्रसिद्धि नहीं है"),
        paragraphs: [
          L(
            "In modern imagination, Raj Yoga is often reduced to celebrity or luxury. In practice it can mean professional authority, educational rise, stable respect, or the ability to use one’s gifts in a more elevated way. Its expression depends on the whole chart and the person’s path.",
            "आधुनिक कल्पना में राज योग को अक्सर केवल प्रसिद्धि या वैभव तक सीमित कर दिया जाता है। व्यवहार में यह पेशेवर अधिकार, शैक्षिक उन्नति, स्थिर सम्मान या अपनी क्षमता का अधिक ऊँचे स्तर पर उपयोग करने की योग्यता भी हो सकता है। इसका फल पूरी कुंडली और व्यक्ति के मार्ग पर निर्भर करता है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["saturn", "life-insights", "houses", "planets"],
  },
  {
    slug: "gemstone",
    category: "guides",
    icon: "💎",
    menuTitle: L("Gemstone Guide", "रत्न मार्गदर्शिका"),
    menuDescription: L(
      "How gemstones are chosen carefully in Jyotish.",
      "ज्योतिष में रत्नों का चयन सावधानी से कैसे किया जाता है।"
    ),
    title: L("Gemstones in Jyotish", "ज्योतिष में रत्न"),
    subtitle: L(
      "Gemstones are traditional supports, but they should be matched to the chart with care.",
      "रत्न पारंपरिक सहायक माने जाते हैं, पर इन्हें कुंडली के अनुसार सावधानी से चुनना चाहिए।"
    ),
    description: L(
      "A practical guide to gemstone use in Vedic astrology, including caution, chart matching, and why not every gem suits everyone.",
      "वैदिक ज्योतिष में रत्न-उपयोग पर व्यावहारिक मार्गदर्शिका: सावधानी, कुंडली-मिलान और क्यों हर रत्न सभी के लिए उपयुक्त नहीं।"
    ),
    intro: [
      L(
        "Gemstones are traditionally used in Jyotish as supportive remedies connected to planetary strength. The basic idea is not decoration alone, but resonance: a gem is thought to strengthen the influence of a relevant planet when that planet is beneficial for the chart.",
        "रत्नों का उपयोग पारंपरिक ज्योतिष में ग्रह-बल से जुड़े सहायक उपाय के रूप में किया जाता है। मूल विचार केवल आभूषण नहीं, बल्कि अनुनाद है: माना जाता है कि उचित रत्न उस ग्रह के प्रभाव को सहारा देता है जो कुंडली के लिए हितकारी हो।"
      ),
      L(
        "This is why gemstone guidance should be cautious. A planet may be naturally benefic yet functionally difficult for a given ascendant, and strengthening it blindly can be unhelpful. Chart-specific judgment is more important than generic lists.",
        "इसी कारण रत्न-सुझाव में सावधानी आवश्यक है। कोई ग्रह स्वभाव से शुभ होते हुए भी किसी विशेष लग्न के लिए कार्यात्मक रूप से कठिन हो सकता है, और उसे बिना सोचे मजबूत करना लाभकारी नहीं होगा। सामान्य सूचियों से अधिक महत्वपूर्ण कुंडली-विशिष्ट निर्णय है।"
      ),
    ],
    sections: [
      {
        heading: L("Why chart-specific choice matters", "कुंडली-विशिष्ट चयन क्यों आवश्यक है"),
        paragraphs: [
          L(
            "The first question is not 'Which gem is lucky in general?' but 'Which planet is worth strengthening in this chart?' That depends on Lagna, house rulership, planetary condition, and the person’s present goals and dasha.",
            "पहला प्रश्न यह नहीं होना चाहिए कि 'सामान्य रूप से कौन सा रत्न शुभ है?', बल्कि यह कि 'इस कुंडली में किस ग्रह को मजबूत करना उचित है?' यह लग्न, भाव-स्वामित्व, ग्रह की स्थिति, वर्तमान लक्ष्य और दशा पर निर्भर करता है।"
          ),
        ],
      },
      {
        heading: L("Gemstones are support, not magic", "रत्न सहायक हैं, जादू नहीं"),
        paragraphs: [
          L(
            "A gemstone cannot replace medical care, financial planning, communication work, or ethical action. At best it is one supportive measure among others such as mantra, charity, discipline, and better decisions aligned with the chart’s lessons.",
            "रत्न चिकित्सा, वित्तीय योजना, संवाद-सुधार या नैतिक कर्म का स्थान नहीं ले सकता। सर्वोत्तम स्थिति में यह केवल एक सहायक उपाय है, जैसे मंत्र, दान, अनुशासन और कुंडली के पाठों के अनुरूप बेहतर निर्णय।"
          ),
        ],
      },
      {
        heading: L("Wear with clarity, not fear", "रत्न स्पष्टता से पहनें, भय से नहीं"),
        paragraphs: [
          L(
            "People sometimes wear gems out of anxiety rather than understanding. A better approach is to know what the gem is meant to support, how it fits the chart, and whether the person is actually ready to strengthen that planetary principle in life.",
            "कई लोग समझ से अधिक चिंता के कारण रत्न पहन लेते हैं। बेहतर तरीका यह है कि स्पष्ट हो कि रत्न किस ग्रह-सिद्धांत को सहारा देने के लिए है, वह कुंडली में कैसे बैठता है, और क्या व्यक्ति वास्तव में उस ग्रह-शक्ति को जीवन में मजबूत करने के लिए तैयार है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["planets", "saturn", "life-insights"],
    relatedCalculator: "gemstone",
  },
  {
    slug: "videsh-yoga",
    category: "guides",
    icon: "✈️",
    menuTitle: L("Videsh Yoga", "विदेश योग"),
    menuDescription: L(
      "How astrologers read travel, relocation, and foreign settlement themes.",
      "यात्रा, स्थान परिवर्तन और विदेश निवास के संकेत कैसे पढ़े जाते हैं।"
    ),
    title: L("Videsh Yoga in Jyotish", "ज्योतिष में विदेश योग"),
    subtitle: L(
      "Foreign travel or settlement is judged through combinations, not a single sign or house.",
      "विदेश यात्रा या निवास एक ही राशि या भाव से नहीं, बल्कि संयोजनों से देखा जाता है।"
    ),
    description: L(
      "Learn how Videsh Yoga is read in Vedic astrology through houses, Rahu, dasha, and relocation patterns.",
      "जानें कि वैदिक ज्योतिष में विदेश योग को भावों, राहु, दशा और स्थान-परिवर्तन संकेतों से कैसे पढ़ा जाता है।"
    ),
    intro: [
      L(
        "In popular astrology, Videsh Yoga refers to combinations that support foreign travel, study abroad, relocation, or long-term settlement away from one’s birthplace. The topic attracts strong interest, but it should be read carefully because short travel and permanent migration are not the same thing.",
        "लोकप्रिय ज्योतिष में विदेश योग उन संयोजनों को कहा जाता है जो विदेश यात्रा, विदेश में शिक्षा, स्थान परिवर्तन या जन्मभूमि से दूर दीर्घकालिक निवास का समर्थन करें। यह विषय बहुत आकर्षक है, लेकिन इसे सावधानी से पढ़ना चाहिए क्योंकि छोटी यात्रा और स्थायी प्रवास एक ही बात नहीं हैं।"
      ),
      L(
        "Astrologers usually examine the 12th house, 9th house, 7th house, 4th house, Rahu, and relevant dashas. The chart must show both movement away and the ability to build life in a new place if foreign settlement is the question.",
        "ज्योतिषी सामान्यतः 12वाँ, 9वाँ, 7वाँ और 4था भाव, राहु तथा संबंधित दशाओं को देखते हैं। यदि प्रश्न स्थायी विदेश निवास का है, तो कुंडली में केवल बाहर जाने का ही नहीं, बल्कि नए स्थान पर जीवन बनाने का भी संकेत होना चाहिए।"
      ),
    ],
    sections: [
      {
        heading: L("Travel and settlement are different", "यात्रा और स्थायी निवास अलग हैं"),
        paragraphs: [
          L(
            "A chart may show frequent travel without showing migration. Another chart may show one decisive relocation that changes the whole life course. The difference usually emerges through house combinations, strength of the 4th and 12th houses, and timing support.",
            "किसी कुंडली में बार-बार यात्रा का संकेत हो सकता है, पर स्थायी प्रवास का नहीं। दूसरी कुंडली में एक निर्णायक स्थान परिवर्तन पूरा जीवन बदल सकता है। यह अंतर सामान्यतः भाव-संयोजन, 4थे और 12वें भाव के बल तथा समय-सहयोग से स्पष्ट होता है।"
          ),
        ],
      },
      {
        heading: L("Rahu often plays a role", "राहु अक्सर भूमिका निभाता है"),
        paragraphs: [
          L(
            "Because Rahu is linked with foreignness, unconventional environments, and crossing boundaries, it often appears in relocation themes. But Rahu alone does not confirm settlement; the rest of the chart must show support for continuity and adaptation.",
            "राहु विदेश, असामान्य वातावरण और सीमाएँ पार करने से जुड़ा होने के कारण स्थान परिवर्तन के विषय में अक्सर दिखता है। लेकिन अकेला राहु स्थायी प्रवास की पुष्टि नहीं करता; बाकी कुंडली में निरंतरता और अनुकूलन का समर्थन भी होना चाहिए।"
          ),
        ],
      },
      {
        heading: L("Timing determines movement", "आवागमन का निर्णय समय करता है"),
        paragraphs: [
          L(
            "A person may carry foreign settlement potential for years without acting on it until the right dasha or transit opens the path. Timing is what turns a symbolic possibility into a visa process, a move, or a new home abroad.",
            "कई वर्षों तक किसी व्यक्ति की कुंडली में विदेश-निवास की संभावना हो सकती है, पर सही दशा या गोचर आने तक वह सक्रिय नहीं होती। समय ही प्रतीकात्मक संभावना को वीज़ा प्रक्रिया, वास्तविक स्थानांतरण या विदेश में नए घर में बदलता है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["dasha", "life-insights", "kp-astrology"],
  },
];
