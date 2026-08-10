import type { LearnGuide, LocaleText } from "@/lib/learn/types";

const L = (en: string, hi: string): LocaleText => ({ en, hi });

export const WESTERN_GUIDES: LearnGuide[] = [
  {
    slug: "western",
    category: "western",
    icon: "🌍",
    menuTitle: L("Western Astrology", "पश्चिमी ज्योतिष"),
    menuDescription: L(
      "A beginner overview of the tropical zodiac, planets, houses, and aspects.",
      "ट्रॉपिकल राशि, ग्रह, भाव और आस्पेक्ट्स का शुरुआती परिचय।"
    ),
    title: L("Western Astrology Overview", "पश्चिमी ज्योतिष का परिचय"),
    subtitle: L(
      "A clear beginner map of how Western astrology is commonly structured.",
      "पश्चिमी ज्योतिष आमतौर पर किस ढंग से संरचित है, इसका स्पष्ट शुरुआती मानचित्र।"
    ),
    description: L(
      "Understand the basics of Western astrology: tropical zodiac signs, planets, houses, and major aspects.",
      "पश्चिमी ज्योतिष की मूल बातें समझें: ट्रॉपिकल राशियाँ, ग्रह, भाव और प्रमुख आस्पेक्ट्स।"
    ),
    intro: [
      L(
        "Western astrology is commonly taught through the tropical zodiac, where the signs are tied to the seasons rather than the sidereal star background. Like Jyotish, it uses signs, planets, and houses, but it places far more visible emphasis on aspects between planets.",
        "पश्चिमी ज्योतिष सामान्यतः ट्रॉपिकल राशि चक्र के माध्यम से पढ़ाई जाती है, जहाँ राशियाँ नक्षत्र-पृष्ठभूमि के बजाय ऋतुओं से जुड़ी मानी जाती हैं। ज्योतिष की तरह इसमें भी राशियाँ, ग्रह और भाव होते हैं, लेकिन ग्रहों के बीच आस्पेक्ट्स पर विशेष जोर दिया जाता है।"
      ),
      L(
        "A beginner can think of Western astrology in four layers: the sign colors a style, the planet acts, the house gives the life area, and the aspect shows how planets cooperate or clash. This creates a readable personality and timing language, even before deeper techniques are added.",
        "एक शुरुआती विद्यार्थी पश्चिमी ज्योतिष को चार स्तरों में समझ सकता है: राशि शैली देती है, ग्रह कार्य करता है, भाव जीवन क्षेत्र देता है, और आस्पेक्ट बताता है कि ग्रह सहयोग कर रहे हैं या टकरा रहे हैं। इससे गहरी तकनीकों से पहले भी व्यक्तित्व और घटनाओं की एक समझ बनती है।"
      ),
    ],
    sections: [
      {
        heading: L("Tropical rather than sidereal", "साइडेरियल नहीं, ट्रॉपिकल"),
        paragraphs: [
          L(
            "The biggest structural difference from Vedic astrology is that mainstream Western charts usually use the tropical zodiac. This is why a person’s Western Sun sign can differ from their Vedic Sun sign. The interpretive logic also tends to lean more psychological in many modern schools.",
            "वैदिक ज्योतिष की तुलना में सबसे बड़ा संरचनात्मक अंतर यह है कि मुख्यधारा पश्चिमी कुंडलियाँ सामान्यतः ट्रॉपिकल राशि चक्र का उपयोग करती हैं। इसी कारण किसी व्यक्ति की पश्चिमी सूर्य राशि उसकी वैदिक सूर्य राशि से अलग हो सकती है। आधुनिक पद्धतियों में इसकी व्याख्या अधिक मनोवैज्ञानिक भी होती है।"
          ),
        ],
      },
      {
        heading: L("What Western readers focus on", "पश्चिमी ज्योतिष में क्या अधिक देखा जाता है"),
        paragraphs: [
          L(
            "Western readers often pay special attention to Sun, Moon, Rising sign, chart rulers, and the main aspects between personal planets. This creates a fast first impression of identity, emotion, communication style, relationship pattern, and conflict points.",
            "पश्चिमी ज्योतिषी अक्सर सूर्य, चंद्र, राइजिंग साइन, चार्ट रूलर और व्यक्तिगत ग्रहों के मुख्य आस्पेक्ट्स पर विशेष ध्यान देते हैं। इससे पहचान, भावनाएँ, संवाद शैली, संबंध पैटर्न और संघर्ष-बिंदुओं की प्रारंभिक तस्वीर जल्दी बन जाती है।"
          ),
        ],
      },
      {
        heading: L("Use it as a system, not a meme", "इसे मीम नहीं, एक पद्धति की तरह समझें"),
        paragraphs: [
          L(
            "Popular horoscope culture reduces Western astrology to Sun signs alone, but real chart reading is far wider than that. Signs, houses, and aspects must be read together for useful interpretation.",
            "लोकप्रिय राशिफल संस्कृति पश्चिमी ज्योतिष को केवल सूर्य राशियों तक सीमित कर देती है, जबकि वास्तविक कुंडली-पठन उससे कहीं व्यापक है। उपयोगी व्याख्या के लिए राशि, भाव और आस्पेक्ट्स को साथ में पढ़ना आवश्यक है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["western-zodiac", "western-planets", "western-houses", "western-aspects", "zodiac"],
    relatedCalculator: "sun-sign",
  },
  {
    slug: "western-zodiac",
    category: "western",
    icon: "♈",
    menuTitle: L("Western Zodiac", "पश्चिमी राशि चक्र"),
    menuDescription: L(
      "The twelve tropical signs and how Western astrology interprets them.",
      "बारह ट्रॉपिकल राशियाँ और पश्चिमी ज्योतिष में उनका अर्थ।"
    ),
    title: L("Western Zodiac Signs", "पश्चिमी राशि चक्र"),
    subtitle: L(
      "The twelve tropical signs from Aries to Pisces, read as styles of personality and expression.",
      "मेष से मीन तक बारह ट्रॉपिकल राशियाँ, जिन्हें व्यक्तित्व और अभिव्यक्ति की शैली के रूप में पढ़ा जाता है।"
    ),
    description: L(
      "Learn how Western astrology reads the 12 tropical zodiac signs as personality styles and life tendencies.",
      "जानें कि पश्चिमी ज्योतिष 12 ट्रॉपिकल राशियों को व्यक्तित्व शैली और जीवन-प्रवृत्ति के रूप में कैसे पढ़ता है।"
    ),
    intro: [
      L(
        "The Western zodiac begins with Aries at the spring equinox in the Northern Hemisphere and moves through twelve signs across the solar year. Each sign is usually interpreted as a style of expression, motivation, and temperament rather than a fixed fate statement.",
        "पश्चिमी राशि चक्र उत्तरी गोलार्ध के वसंत विषुव से मेष के साथ शुरू होता है और पूरे सौर वर्ष में बारह राशियों से गुजरता है। प्रत्येक राशि को सामान्यतः अभिव्यक्ति, प्रेरणा और स्वभाव की एक शैली के रूप में पढ़ा जाता है, न कि स्थिर भाग्य-वाक्य की तरह।"
      ),
      L(
        "Modern Western readers often start with Sun sign familiarity, but stronger interpretation comes from comparing the Sun, Moon, and Rising sign together. When a chart repeats the same element or modality, that pattern usually becomes more important than one sign alone.",
        "आधुनिक पश्चिमी पाठक अक्सर सूर्य राशि से शुरुआत करते हैं, लेकिन बेहतर समझ सूर्य, चंद्र और राइजिंग साइन को साथ में देखने से आती है। जब किसी कुंडली में एक ही तत्व या मोडैलिटी बार-बार दिखाई दे, तो वह पैटर्न एक राशि से अधिक महत्वपूर्ण हो जाता है।"
      ),
    ],
    sections: [
      {
        heading: L("Elements and modalities", "तत्व और मोडैलिटी"),
        paragraphs: [
          L(
            "Western astrology groups signs by element and modality. Fire signs energize, Earth signs ground, Air signs conceptualize, and Water signs feel deeply. Cardinal signs initiate, fixed signs stabilize, and mutable signs adapt.",
            "पश्चिमी ज्योतिष राशियों को तत्व और मोडैलिटी के आधार पर भी समूहित करता है। अग्नि प्रेरित करती है, पृथ्वी स्थिर करती है, वायु विचार बनाती है और जल गहराई से महसूस करता है। कार्डिनल राशियाँ शुरू करती हैं, फिक्स्ड राशियाँ स्थिर करती हैं, और म्यूटेबल राशियाँ अनुकूलन करती हैं।"
          ),
        ],
      },
      {
        heading: L("Sign meanings are refined by planets", "ग्रह राशियों के अर्थ को सूक्ष्म बनाते हैं"),
        paragraphs: [
          L(
            "A sign alone describes tone, but the planet placed there tells you what part of life is speaking in that tone. Aries Venus does not behave like Aries Mars, and Pisces Mercury does not think like Pisces Moon.",
            "राशि अकेले केवल स्वर बताती है, लेकिन उसमें स्थित ग्रह बताता है कि जीवन का कौन सा भाग उसी स्वर में बोल रहा है। मेष का शुक्र मेष के मंगल जैसा नहीं होता, और मीन का बुध मीन के चंद्र जैसा नहीं सोचता।"
          ),
        ],
      },
      {
        heading: L("A quick map of the signs", "राशियों का त्वरित मानचित्र"),
        paragraphs: [
          L(
            "Aries initiates, Taurus stabilizes, Gemini exchanges, Cancer protects, Leo radiates, Virgo refines, Libra balances, Scorpio intensifies, Sagittarius expands, Capricorn structures, Aquarius innovates, and Pisces dissolves and imagines. This shorthand is useful, but it should always be tested against the full chart.",
            "Aries आरंभ करता है, Taurus स्थिर करता है, Gemini संवाद करता है, Cancer सुरक्षा देता है, Leo चमकता है, Virgo सुधारता है, Libra संतुलन बनाता है, Scorpio तीव्रता लाता है, Sagittarius विस्तार करता है, Capricorn संरचना देता है, Aquarius नवाचार करता है, और Pisces घुलकर कल्पना जगाता है। यह संक्षेप उपयोगी है, पर इसे हमेशा पूरी कुंडली के साथ परखना चाहिए।"
          ),
        ],
      },
    ],
    relatedSlugs: ["western", "western-planets", "zodiac"],
    relatedCalculator: "sun-sign",
  },
  {
    slug: "western-planets",
    category: "western",
    icon: "🪐",
    menuTitle: L("Western Planets", "पश्चिमी ग्रह"),
    menuDescription: L(
      "Core meanings of the planets in a Western chart.",
      "पश्चिमी कुंडली में ग्रहों के मूल अर्थ।"
    ),
    title: L("Planets in Western Astrology", "पश्चिमी ज्योतिष में ग्रह"),
    subtitle: L(
      "From Sun and Moon to Saturn, planets show drives, needs, and expression patterns.",
      "सूर्य और चंद्र से लेकर शनि तक, ग्रह प्रेरणा, आवश्यकताएँ और अभिव्यक्ति-पैटर्न दिखाते हैं।"
    ),
    description: L(
      "A practical guide to planetary meanings in Western astrology, including personal drives and psychological themes.",
      "पश्चिमी ज्योतिष में ग्रहों के अर्थ, व्यक्तिगत प्रेरणाओं और मनोवैज्ञानिक विषयों का व्यावहारिक परिचय।"
    ),
    intro: [
      L(
        "Western astrology commonly treats planets as functions of the psyche and behavior. The Sun points to identity, the Moon to emotional needs, Mercury to communication, Venus to relating, and Mars to drive. The outer planets add longer collective themes in many modern approaches.",
        "पश्चिमी ज्योतिष में ग्रहों को अक्सर मनोवैज्ञानिक और व्यवहारिक कार्यों के रूप में देखा जाता है। सूर्य पहचान, चंद्र भावनात्मक आवश्यकता, बुध संवाद, शुक्र संबंध और मंगल प्रेरक शक्ति को दर्शाता है। आधुनिक पद्धतियों में बाह्य ग्रह सामूहिक और दीर्घकालिक विषय भी जोड़ते हैं।"
      ),
      L(
        "A planet’s sign shows how it behaves, and its house shows where that behavior appears. The aspects to other planets then reveal whether the function is integrated smoothly or works through tension and effort.",
        "किसी ग्रह की राशि बताती है कि वह कैसे व्यवहार करता है, और उसका भाव बताता है कि वह व्यवहार जीवन के किस क्षेत्र में प्रकट होगा। अन्य ग्रहों के साथ आस्पेक्ट्स यह दिखाते हैं कि वह कार्य सहजता से चल रहा है या तनाव और प्रयास के साथ।"
      ),
    ],
    sections: [
      {
        heading: L("Personal planets", "व्यक्तिगत ग्रह"),
        paragraphs: [
          L(
            "The Sun, Moon, Mercury, Venus, and Mars are often called the personal planets because they shape everyday identity, need, speech, attraction, and action. These planets create much of the familiar personality pattern people notice first.",
            "सूर्य, चंद्र, बुध, शुक्र और मंगल को अक्सर व्यक्तिगत ग्रह कहा जाता है, क्योंकि वे दैनिक पहचान, आवश्यकता, वाणी, आकर्षण और क्रिया को आकार देते हैं। लोगों को पहली नज़र में जो व्यक्तित्व-पैटर्न दिखता है, उसका बड़ा भाग इन्हीं से बनता है।"
          ),
        ],
      },
      {
        heading: L("Social and structural planets", "सामाजिक और संरचनात्मक ग्रह"),
        paragraphs: [
          L(
            "Jupiter and Saturn are frequently read as planets of growth and structure. Jupiter opens horizons, while Saturn tests what can endure. Together they show whether a person tends to expand first and consolidate later, or hold back until the structure feels safe.",
            "गुरु और शनि को प्रायः विस्तार और संरचना के ग्रहों के रूप में पढ़ा जाता है। गुरु क्षितिज खोलता है, जबकि शनि परखता है कि क्या टिक सकता है। दोनों मिलकर बताते हैं कि व्यक्ति पहले फैलता है और बाद में स्थिर करता है, या पहले सुरक्षा ढूँढता है।"
          ),
        ],
      },
      {
        heading: L("Aspects complete the picture", "आस्पेक्ट्स से चित्र पूरा होता है"),
        paragraphs: [
          L(
            "A Venus in Libra may prefer harmony, but if it squares Saturn the person may still feel guarded in relationships. This is why planetary meanings are only fully useful when the aspect pattern is included.",
            "तुला का शुक्र सामंजस्य पसंद कर सकता है, लेकिन यदि वह शनि से स्क्वेयर हो तो व्यक्ति संबंधों में फिर भी सतर्क या बंद महसूस कर सकता है। इसी कारण ग्रहों के अर्थ तब तक पूर्ण नहीं होते जब तक आस्पेक्ट-पैटर्न न जोड़ा जाए।"
          ),
        ],
      },
    ],
    relatedSlugs: ["western", "western-aspects", "planets"],
    relatedCalculator: "sun-sign",
  },
  {
    slug: "western-houses",
    category: "western",
    icon: "🏛️",
    menuTitle: L("Western Houses", "पश्चिमी भाव"),
    menuDescription: L(
      "The 12 houses and the life areas they describe.",
      "12 भाव और वे जीवन के कौन से क्षेत्र दिखाते हैं।"
    ),
    title: L("Houses in Western Astrology", "पश्चिमी ज्योतिष में भाव"),
    subtitle: L(
      "Houses show where the chart’s energies play out in lived life.",
      "भाव बताते हैं कि कुंडली की ऊर्जाएँ जीवन में कहाँ प्रकट होती हैं।"
    ),
    description: L(
      "A simple guide to the 12 houses in Western astrology and how they map personality, relationships, work, and inner life.",
      "पश्चिमी ज्योतिष के 12 भावों और उनके व्यक्तित्व, संबंध, कार्य और आंतरिक जीवन से संबंध का सरल परिचय।"
    ),
    intro: [
      L(
        "Western houses divide the sky around the time and place of birth into twelve life arenas. They overlap conceptually with house meanings found in Jyotish, but interpretive emphasis can differ depending on school, house system, and whether the reading is psychological or predictive.",
        "पश्चिमी भाव जन्म के समय और स्थान के अनुसार आकाश को बारह जीवन-क्षेत्रों में बाँटते हैं। इनके अर्थ वैदिक भावों से कई जगह मिलते हैं, लेकिन पद्धति, भाव-विभाजन और व्याख्या के उद्देश्य के अनुसार जोर अलग हो सकता है।"
      ),
      L(
        "A house does not act by itself. The sign on its cusp, the ruler of that sign, and any planets placed in the house all contribute. This layered reading prevents oversimplified statements such as '10th house equals career' without further context.",
        "कोई भाव अपने आप नहीं फल देता। उसके स्पर्श पर स्थित राशि, उस राशि का स्वामी और उस भाव में बैठे ग्रह सभी मिलकर फल बनाते हैं। यही बहु-स्तरीय दृष्टि ‘10वाँ भाव = केवल करियर’ जैसी सरल धारणाओं से बचाती है।"
      ),
    ],
    sections: [
      {
        heading: L("The angular houses", "कोण भाव"),
        paragraphs: [
          L(
            "The 1st, 4th, 7th, and 10th houses are angular and often prominent. They describe self, roots, partnership, and public life, and planets placed there usually become more visible in a reading.",
            "1, 4, 7 और 10 भाव कोण भाव माने जाते हैं और अक्सर प्रमुख रहते हैं। ये स्वयं, जड़ें, साझेदारी और सार्वजनिक जीवन को दर्शाते हैं, इसलिए इनमें स्थित ग्रह व्याख्या में अधिक स्पष्ट दिखाई देते हैं।"
          ),
        ],
      },
      {
        heading: L("Cadent and succedent houses", "कैडेंट और सक्सीडेंट भाव"),
        paragraphs: [
          L(
            "Succedent houses help stabilize and build on the angles, while cadent houses often process, adapt, and distribute what has already been initiated. This rhythm helps readers understand whether a theme is direct, consolidating, or transitional.",
            "सक्सीडेंट भाव कोणों पर शुरू हुई चीज़ों को स्थिर और विकसित करते हैं, जबकि कैडेंट भाव उन प्रक्रियाओं को समझने, ढालने और फैलाने का काम करते हैं। इस लय से समझ आता है कि कोई विषय सीधा है, स्थिर हो रहा है या परिवर्तनशील है।"
          ),
        ],
      },
      {
        heading: L("House systems vary", "भाव-विभाजन पद्धति बदल सकती है"),
        paragraphs: [
          L(
            "Different Western traditions may use Placidus, Whole Sign, Equal, or other house systems. The same planet can shift house from one system to another, so responsible reading requires consistency rather than mixing systems casually.",
            "पश्चिमी परंपराएँ प्लासिडस, होल साइन, इक्वल या अन्य भाव-विभाजन पद्धतियों का उपयोग कर सकती हैं। एक ही ग्रह अलग पद्धति में अलग भाव में जा सकता है, इसलिए जिम्मेदार व्याख्या के लिए एक ही पद्धति में निरंतरता आवश्यक है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["western", "western-zodiac", "houses", "kp-astrology"],
  },
  {
    slug: "western-aspects",
    category: "western",
    icon: "🔗",
    menuTitle: L("Western Aspects", "पश्चिमी आस्पेक्ट्स"),
    menuDescription: L(
      "Conjunction, opposition, trine, square, and sextile explained simply.",
      "कंजंक्शन, अपोज़िशन, ट्राइन, स्क्वेयर और सेक्स्टाइल का सरल अर्थ।"
    ),
    title: L("Major Aspects in Western Astrology", "पश्चिमी ज्योतिष के प्रमुख आस्पेक्ट्स"),
    subtitle: L(
      "Planet-to-planet geometry is one of the main engines of Western chart interpretation.",
      "ग्रहों के बीच कोणीय संबंध पश्चिमी कुंडली-पठन के मुख्य आधारों में से एक हैं।"
    ),
    description: L(
      "Learn the five major Western astrology aspects: conjunction, opposition, trine, square, and sextile.",
      "पश्चिमी ज्योतिष के पाँच प्रमुख आस्पेक्ट्स जानें: कंजंक्शन, अपोज़िशन, ट्राइन, स्क्वेयर और सेक्स्टाइल।"
    ),
    intro: [
      L(
        "An aspect is an angular relationship between planets. In Western astrology, aspects describe whether different functions of the personality support each other, challenge each other, or demand conscious integration. They are central to chart reading because they reveal pattern, not just isolated meaning.",
        "आस्पेक्ट ग्रहों के बीच कोणीय संबंध है। पश्चिमी ज्योतिष में आस्पेक्ट बताता है कि व्यक्तित्व के अलग-अलग कार्य एक-दूसरे को सहारा दे रहे हैं, चुनौती दे रहे हैं या सचेत एकीकरण की माँग कर रहे हैं। ये इसलिए केंद्रीय हैं क्योंकि ये अलग-अलग अर्थ नहीं, बल्कि संपूर्ण पैटर्न दिखाते हैं।"
      ),
      L(
        "The same aspect can feel very different depending on which planets are involved and how tightly the aspect is formed. A trine involving the Moon and Venus feels different from a trine involving Mars and Saturn, even though both are considered easier flows.",
        "एक ही आस्पेक्ट भी अलग अनुभव दे सकता है, यह इस पर निर्भर करता है कि उसमें कौन से ग्रह हैं और वह कितनी सटीकता से बना है। चंद्र-शुक्र का ट्राइन, मंगल-शनि के ट्राइन से भिन्न अनुभव देता है, भले ही दोनों अपेक्षाकृत सहज प्रवाह माने जाएँ।"
      ),
    ],
    sections: [
      {
        heading: L("Conjunction and opposition", "कंजंक्शन और अपोज़िशन"),
        paragraphs: [
          L(
            "A conjunction merges two planetary functions so they operate together, for better or worse. An opposition places two needs across from each other, often creating awareness through contrast, projection, or relationship dynamics.",
            "कंजंक्शन दो ग्रह-कार्य को एक साथ मिला देता है, अच्छे या कठिन दोनों रूपों में। अपोज़िशन दो आवश्यकताओं को आमने-सामने रखता है, जिससे विरोध, प्रक्षेपण या संबंधों के माध्यम से जागरूकता पैदा होती है।"
          ),
        ],
        bullets: [
          L("Conjunction: concentrated, fused, intensified.", "कंजंक्शन: केंद्रित, संयुक्त, तीव्र।"),
          L("Opposition: polarized, relational, balancing.", "अपोज़िशन: ध्रुवीकृत, संबंधपरक, संतुलनकारी।"),
        ],
      },
      {
        heading: L("Trine and sextile", "ट्राइन और सेक्स्टाइल"),
        paragraphs: [
          L(
            "Trines show easy compatibility, natural talent, or a flow that does not require much resistance. Sextiles are cooperative too, but they often need a deliberate step to activate. These are supportive aspects, though too much ease can sometimes reduce urgency.",
            "ट्राइन सहज अनुकूलता, प्राकृतिक प्रतिभा या ऐसा प्रवाह दिखाता है जिसमें अधिक रुकावट नहीं होती। सेक्स्टाइल भी सहयोगी है, लेकिन उसे सक्रिय करने के लिए अक्सर एक सचेत कदम चाहिए। ये सहायक आस्पेक्ट्स हैं, हालाँकि बहुत अधिक सहजता कभी-कभी तात्कालिकता कम कर सकती है।"
          ),
        ],
      },
      {
        heading: L("Square", "स्क्वेयर"),
        paragraphs: [
          L(
            "Squares create friction and action. They show inner or outer pressure where two planetary needs compete for space, timing, or method. Although difficult, squares are often highly productive because they force growth and adaptation.",
            "स्क्वेयर घर्षण और क्रिया पैदा करता है। यह दिखाता है कि दो ग्रह-आवश्यकताएँ स्थान, समय या तरीके के लिए प्रतिस्पर्धा कर रही हैं। कठिन होने के बावजूद, स्क्वेयर अक्सर बहुत उत्पादक होता है क्योंकि वही विकास और अनुकूलन को मजबूर करता है।"
          ),
        ],
      },
    ],
    relatedSlugs: ["western", "western-planets", "western-houses"],
  },
];
