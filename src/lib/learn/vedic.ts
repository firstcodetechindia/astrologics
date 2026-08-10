import type { LearnGuide, LocaleText } from "@/lib/learn/types";

const L = (en: string, hi: string): LocaleText => ({ en, hi });

export const VEDIC_GUIDES: LearnGuide[] = [
  {
    slug: "zodiac",
    category: "vedic",
    icon: "🕉️",
    menuTitle: L("Vedic Zodiac", "वैदिक राशि चक्र"),
    menuDescription: L(
      "Twelve sidereal rashis with rulers, elements, and practical meaning.",
      "बारह साइडेरियल राशियाँ, उनके स्वामी, तत्व और व्यावहारिक अर्थ।"
    ),
    title: L("Vedic Zodiac Signs", "वैदिक राशि चक्र"),
    subtitle: L(
      "Understand the twelve rashis from Mesha to Meena in the sidereal Jyotish tradition.",
      "साइडेरियल ज्योतिष परंपरा में मेष से मीन तक बारह राशियों को समझें।"
    ),
    description: L(
      "Learn all 12 Vedic zodiac signs with ruling planets, elements, approximate sidereal dates, and chart-reading guidance.",
      "12 वैदिक राशियों के स्वामी ग्रह, तत्व, अनुमानित साइडेरियल तिथियाँ और कुंडली-पठन के उपयोग समझें।"
    ),
    intro: [
      L(
        "In Vedic astrology, the zodiac is usually read in a sidereal framework, so the sign boundaries are different from the popular tropical dates used in much Western astrology. A rashi gives a field of expression: it colors how a planet behaves, how a house functions, and how a person approaches experience.",
        "वैदिक ज्योतिष में राशि चक्र सामान्यतः साइडेरियल पद्धति से पढ़ा जाता है, इसलिए इसकी तिथियाँ पश्चिमी ट्रॉपिकल ज्योतिष की लोकप्रिय तिथियों से अलग होती हैं। राशि अभिव्यक्ति का एक क्षेत्र देती है: यह बताती है कि कोई ग्रह कैसे काम करेगा, कोई भाव कैसे फल देगा, और व्यक्ति अनुभवों को किस ढंग से जीएगा।"
      ),
      L(
        "A sign should not be judged alone. Jyotish becomes accurate when you connect the rashi with the house it occupies, the planet that rules it, the dignity of any planets placed there, and the running dasha.",
        "किसी राशि को अकेले नहीं परखना चाहिए। ज्योतिष तब सटीक बनता है जब आप राशि को उसके भाव, उसके स्वामी ग्रह, उसमें बैठे ग्रहों की स्थिति और चल रही दशा के साथ जोड़कर देखते हैं।"
      ),
    ],
    sections: [
      {
        heading: L("How to read a rashi", "राशि को कैसे पढ़ें"),
        paragraphs: [
          L(
            "Start with Lagna, because the rising sign sets the house framework for the whole chart. Then compare the Moon sign for emotional tendencies and the Sun sign for vitality and purpose. When the same sign repeats across Lagna, Moon, or important houses, its themes become louder in life.",
            "सबसे पहले लग्न देखें, क्योंकि वही पूरी कुंडली के भाव-ढांचे को तय करता है। फिर मनोवृत्ति के लिए चंद्र राशि और तेज व उद्देश्य के लिए सूर्य राशि देखें। जब एक ही राशि लग्न, चंद्र या महत्वपूर्ण भावों में बार-बार आती है, तो उसके विषय जीवन में अधिक प्रबल हो जाते हैं।"
          ),
        ],
        bullets: [
          L("Sign = style of expression, house = life area, planet = actor.", "राशि = अभिव्यक्ति की शैली, भाव = जीवन क्षेत्र, ग्रह = कर्ता।"),
          L("The ruler of a sign tells you how that sign’s promises are delivered.", "राशि का स्वामी बताता है कि उस राशि के फल कैसे प्रकट होंगे।"),
          L("Dasha and transit decide when a sign becomes active.", "दशा और गोचर तय करते हैं कि कोई राशि कब सक्रिय होगी।"),
        ],
      },
      {
        heading: L("Elements and temperament", "तत्व और स्वभाव"),
        paragraphs: [
          L(
            "Fire signs tend to move first, Earth signs consolidate, Air signs connect ideas, and Water signs respond through feeling. In Jyotish, these elemental tones are practical rather than abstract: they often show how a person handles stress, relationships, money, and decision-making.",
            "अग्नि राशियाँ पहले कदम उठाती हैं, पृथ्वी राशियाँ स्थिरता बनाती हैं, वायु राशियाँ विचार जोड़ती हैं, और जल राशियाँ भावना के माध्यम से प्रतिक्रिया देती हैं। ज्योतिष में ये तत्व केवल सिद्धांत नहीं हैं; ये दिखाते हैं कि व्यक्ति तनाव, संबंध, धन और निर्णयों को कैसे संभालता है।"
          ),
        ],
      },
      {
        heading: L("Approximate sidereal dates", "अनुमानित साइडेरियल तिथियाँ"),
        paragraphs: [
          L(
            "The date ranges below are approximate and can shift slightly by year and ayanamsa choice. For an exact sign, always calculate from birth details rather than relying on a general calendar date.",
            "नीचे दी गई तिथियाँ अनुमानित हैं और वर्ष तथा अयनांश के अनुसार थोड़ी बदल सकती हैं। सटीक राशि जानने के लिए केवल सामान्य कैलेंडर तिथि पर नहीं, बल्कि जन्म विवरण पर आधारित गणना करनी चाहिए।"
          ),
        ],
      },
    ],
    cards: [
      {
        icon: "♈",
        title: L("Mesha (Aries)", "मेष"),
        subtitle: L("Mars | Fire | Approx. Apr 14 - May 14", "मंगल | अग्नि | लगभग 14 अप्रैल - 14 मई"),
        body: L(
          "Mesha begins the zodiac with movement, courage, and the urge to act directly. In a chart, it often shows how a person starts new tasks, responds to pressure, and faces competition. When Mars is disciplined, Mesha gives brave initiative instead of avoidable haste.",
          "मेष राशि आरंभ, साहस और सीधे कार्य करने की प्रेरणा देती है। कुंडली में यह बताती है कि व्यक्ति नए काम कैसे शुरू करता है, दबाव में कैसे प्रतिक्रिया देता है और प्रतिस्पर्धा का सामना कैसे करता है। जब मंगल संतुलित हो, तो मेष जल्दबाजी नहीं बल्कि साहसी पहल देता है।"
        ),
        tags: [L("Movable sign", "चर राशि"), L("Ruler: Mars", "स्वामी: मंगल")],
      },
      {
        icon: "♉",
        title: L("Vrishabha (Taurus)", "वृषभ"),
        subtitle: L("Venus | Earth | Approx. May 15 - Jun 14", "शुक्र | पृथ्वी | लगभग 15 मई - 14 जून"),
        body: L(
          "Vrishabha stabilizes what Mesha begins. It values security, comfort, resources, and a measured pace, so it can show patience in finance and commitment in relationships. If afflicted, its strength can harden into stubbornness or over-attachment.",
          "वृषभ मेष द्वारा शुरू की गई ऊर्जा को स्थिर करता है। यह सुरक्षा, सुख, संसाधन और संतुलित गति को महत्व देता है, इसलिए धन और संबंधों में धैर्य व टिकाऊपन दिखाता है। यदि पीड़ित हो, तो यही स्थिरता जिद या अधिक आसक्ति में बदल सकती है।"
        ),
        tags: [L("Fixed sign", "स्थिर राशि"), L("Ruler: Venus", "स्वामी: शुक्र")],
      },
      {
        icon: "♊",
        title: L("Mithuna (Gemini)", "मिथुन"),
        subtitle: L("Mercury | Air | Approx. Jun 15 - Jul 16", "बुध | वायु | लगभग 15 जून - 16 जुलाई"),
        body: L(
          "Mithuna is curious, verbal, and flexible. It often points to learning style, conversation, trade, writing, and the ability to handle two tracks at once. Strong Mercury makes this sign skillful and adaptive, while weakness can scatter attention.",
          "मिथुन जिज्ञासु, संवादप्रिय और लचीला स्वभाव देता है। यह सीखने के तरीके, बातचीत, व्यापार, लेखन और एक साथ दो दिशाओं को संभालने की क्षमता को दिखाता है। मजबूत बुध इसे कुशल और अनुकूल बनाता है, जबकि कमजोरी ध्यान को बिखेर सकती है।"
        ),
        tags: [L("Dual sign", "द्विस्वभाव राशि"), L("Ruler: Mercury", "स्वामी: बुध")],
      },
      {
        icon: "♋",
        title: L("Karka (Cancer)", "कर्क"),
        subtitle: L("Moon | Water | Approx. Jul 17 - Aug 16", "चंद्र | जल | लगभग 17 जुलाई - 16 अगस्त"),
        body: L(
          "Karka is protective, receptive, and strongly tied to emotional memory. In practice it often speaks through home life, nourishment, belonging, and how a person seeks safety. A healthy Moon gives care and sensitivity; a troubled Moon can make mood and security concerns dominate choices.",
          "कर्क संरक्षण, ग्रहणशीलता और भावनात्मक स्मृति से जुड़ी राशि है। व्यवहार में यह घर, पोषण, अपनापन और व्यक्ति सुरक्षा कैसे खोजता है, इसे दिखाती है। स्वस्थ चंद्र देखभाल और संवेदनशीलता देता है, जबकि पीड़ित चंद्र मनोदशा और असुरक्षा को निर्णयों पर हावी कर सकता है।"
        ),
        tags: [L("Movable sign", "चर राशि"), L("Ruler: Moon", "स्वामी: चंद्र")],
      },
      {
        icon: "♌",
        title: L("Simha (Leo)", "सिंह"),
        subtitle: L("Sun | Fire | Approx. Aug 17 - Sep 16", "सूर्य | अग्नि | लगभग 17 अगस्त - 16 सितंबर"),
        body: L(
          "Simha seeks dignity, visibility, and centered leadership. It often reflects self-respect, authority, creative confidence, and the wish to act from the heart. When the Sun is steady, Simha inspires others; when imbalanced, it may seek recognition before substance.",
          "सिंह गरिमा, दृश्यता और केंद्रित नेतृत्व चाहता है। यह आत्मसम्मान, अधिकार, रचनात्मक आत्मविश्वास और हृदय से कार्य करने की इच्छा को दर्शाता है। जब सूर्य संतुलित हो, तो सिंह प्रेरणा देता है; असंतुलित होने पर यह सार से पहले प्रशंसा चाह सकता है।"
        ),
        tags: [L("Fixed sign", "स्थिर राशि"), L("Ruler: Sun", "स्वामी: सूर्य")],
      },
      {
        icon: "♍",
        title: L("Kanya (Virgo)", "कन्या"),
        subtitle: L("Mercury | Earth | Approx. Sep 17 - Oct 17", "बुध | पृथ्वी | लगभग 17 सितंबर - 17 अक्टूबर"),
        body: L(
          "Kanya refines, organizes, and corrects. It is linked with craft, health routines, analysis, and the practical intelligence needed to improve a system piece by piece. Strong Kanya serves through precision, but stress can turn that precision into worry or over-criticism.",
          "कन्या सुधार, व्यवस्था और शुद्धि की राशि है। यह कौशल, स्वास्थ्य दिनचर्या, विश्लेषण और किसी व्यवस्था को धीरे-धीरे बेहतर बनाने वाली व्यावहारिक बुद्धि से जुड़ी है। मजबूत कन्या सूक्ष्मता से सेवा करती है, पर तनाव में यही सूक्ष्मता चिंता या अति-आलोचना बन सकती है।"
        ),
        tags: [L("Dual sign", "द्विस्वभाव राशि"), L("Ruler: Mercury", "स्वामी: बुध")],
      },
      {
        icon: "♎",
        title: L("Tula (Libra)", "तुला"),
        subtitle: L("Venus | Air | Approx. Oct 18 - Nov 16", "शुक्र | वायु | लगभग 18 अक्टूबर - 16 नवंबर"),
        body: L(
          "Tula weighs balance, exchange, and fairness. It often becomes important in charts where partnership, negotiation, design, or public dealing play a large role. A strong Venus gives grace and social intelligence here, while weakness may produce indecision or dependence on approval.",
          "तुला संतुलन, आदान-प्रदान और न्याय को तौलती है। जिन कुंडलियों में साझेदारी, समझौता, सौंदर्यबोध या सार्वजनिक व्यवहार महत्वपूर्ण हो, वहाँ यह राशि प्रमुख बनती है। मजबूत शुक्र इसे आकर्षण और सामाजिक बुद्धि देता है, जबकि कमजोरी निर्णयहीनता या दूसरों की स्वीकृति पर निर्भरता ला सकती है।"
        ),
        tags: [L("Movable sign", "चर राशि"), L("Ruler: Venus", "स्वामी: शुक्र")],
      },
      {
        icon: "♏",
        title: L("Vrishchika (Scorpio)", "वृश्चिक"),
        subtitle: L("Mars | Water | Approx. Nov 17 - Dec 15", "मंगल | जल | लगभग 17 नवंबर - 15 दिसंबर"),
        body: L(
          "Vrishchika goes beneath the surface. It is associated with secrecy, resilience, healing, crisis-management, and deep emotional intensity. When handled well, this sign transforms pain into strength; when disturbed, it can hold suspicion long after a situation has passed.",
          "वृश्चिक सतह के नीचे उतरने वाली राशि है। यह गोपनीयता, सहनशक्ति, उपचार, संकट-प्रबंधन और गहरी भावनात्मक तीव्रता से जुड़ी है। सही दिशा मिले तो यह पीड़ा को शक्ति में बदलती है; बाधित होने पर लंबे समय तक संदेह पकड़े रख सकती है।"
        ),
        tags: [L("Fixed sign", "स्थिर राशि"), L("Ruler: Mars", "स्वामी: मंगल")],
      },
      {
        icon: "♐",
        title: L("Dhanu (Sagittarius)", "धनु"),
        subtitle: L("Jupiter | Fire | Approx. Dec 16 - Jan 13", "गुरु | अग्नि | लगभग 16 दिसंबर - 13 जनवरी"),
        body: L(
          "Dhanu seeks meaning, direction, and a larger moral horizon. It often shows up in education, philosophy, faith, travel, teaching, and the desire to live by principles. Strong Jupiter gives wisdom and generosity, while weakness can make conviction outrun judgment.",
          "धनु अर्थ, दिशा और व्यापक जीवन-दृष्टि की खोज करता है। यह शिक्षा, दर्शन, धर्म, यात्रा, शिक्षण और सिद्धांतों के अनुसार जीने की इच्छा में प्रकट होता है। मजबूत गुरु इसे ज्ञान और उदारता देता है, जबकि कमजोरी में मान्यता विवेक से आगे निकल सकती है।"
        ),
        tags: [L("Dual sign", "द्विस्वभाव राशि"), L("Ruler: Jupiter", "स्वामी: गुरु")],
      },
      {
        icon: "♑",
        title: L("Makara (Capricorn)", "मकर"),
        subtitle: L("Saturn | Earth | Approx. Jan 14 - Feb 12", "शनि | पृथ्वी | लगभग 14 जनवरी - 12 फरवरी"),
        body: L(
          "Makara climbs slowly and steadily. It is linked with responsibility, structure, endurance, work hierarchy, and results that come through time. A strong Saturn here gives realism and stamina; if pressured, the same sign may feel burdened or overly cautious.",
          "मकर धीमे लेकिन स्थिर कदमों से ऊपर बढ़ती है। यह जिम्मेदारी, संरचना, धैर्य, कार्य-व्यवस्था और समय के साथ मिलने वाले परिणामों से जुड़ी है। मजबूत शनि यहाँ यथार्थवाद और सहनशक्ति देता है; दबाव में यही राशि बोझ या अति-सावधानी का अनुभव करा सकती है।"
        ),
        tags: [L("Movable sign", "चर राशि"), L("Ruler: Saturn", "स्वामी: शनि")],
      },
      {
        icon: "♒",
        title: L("Kumbha (Aquarius)", "कुंभ"),
        subtitle: L("Saturn | Air | Approx. Feb 13 - Mar 14", "शनि | वायु | लगभग 13 फरवरी - 14 मार्च"),
        body: L(
          "Kumbha thinks in systems, communities, and long-range patterns. It can describe social awareness, reforming instinct, unusual networks, and the ability to detach from personal drama in order to study the bigger structure. When imbalanced, that detachment can become emotional distance.",
          "कुंभ व्यवस्था, समुदाय और दीर्घकालिक पैटर्न में सोचती है। यह सामाजिक समझ, सुधार की प्रवृत्ति, असामान्य समूहों और व्यक्तिगत नाटक से थोड़ा अलग होकर बड़ी संरचना देखने की क्षमता को दर्शा सकती है। असंतुलित होने पर यही दूरी भावनात्मक अलगाव बन सकती है।"
        ),
        tags: [L("Fixed sign", "स्थिर राशि"), L("Ruler: Saturn", "स्वामी: शनि")],
      },
      {
        icon: "♓",
        title: L("Meena (Pisces)", "मीन"),
        subtitle: L("Jupiter | Water | Approx. Mar 15 - Apr 13", "गुरु | जल | लगभग 15 मार्च - 13 अप्रैल"),
        body: L(
          "Meena softens boundaries and opens imagination, empathy, and spiritual longing. It often speaks through compassion, artistic feeling, faith, and the need to withdraw at times from a noisy world. Strong Jupiter brings grace and trust here; weak grounding can make direction unclear.",
          "मीन सीमाओं को कोमल बनाकर कल्पना, सहानुभूति और आध्यात्मिक आकांक्षा खोलती है। यह करुणा, कलात्मक भाव, श्रद्धा और कभी-कभी शोर से दूर हटने की आवश्यकता में प्रकट होती है। मजबूत गुरु यहाँ अनुग्रह और विश्वास देता है; कमजोर आधार दिशा को धुंधला कर सकता है।"
        ),
        tags: [L("Dual sign", "द्विस्वभाव राशि"), L("Ruler: Jupiter", "स्वामी: गुरु")],
      },
    ],
    relatedSlugs: ["planets", "houses", "western-zodiac"],
    relatedCalculator: "moon-sign",
  },
  {
    slug: "planets",
    category: "vedic",
    icon: "🪐",
    menuTitle: L("Navagraha", "नवग्रह"),
    menuDescription: L(
      "The nine grahas and what they signify in Jyotish.",
      "ज्योतिष में नौ ग्रह और उनके प्रमुख अर्थ।"
    ),
    title: L("Navagraha in Vedic Astrology", "वैदिक ज्योतिष में नवग्रह"),
    subtitle: L(
      "Read the natural significations of the nine grahas before judging any placement.",
      "किसी भी स्थिति का फल देखने से पहले नौ ग्रहों के स्वाभाविक अर्थ समझें।"
    ),
    description: L(
      "Study Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu with practical Jyotish meanings.",
      "सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु और केतु के व्यावहारिक ज्योतिषीय अर्थ जानें।"
    ),
    intro: [
      L(
        "In Jyotish, grahas are not just astronomical bodies. They are intelligences that seize attention and deliver karma through specific life themes. A planet’s results depend on sign, house, dignity, aspects, lordship, and dasha.",
        "ज्योतिष में ग्रह केवल खगोलीय पिंड नहीं हैं। वे ऐसी शक्तियाँ हैं जो ध्यान को पकड़कर जीवन के विशिष्ट क्षेत्रों में कर्मफल देती हैं। किसी ग्रह का फल उसकी राशि, भाव, बल, दृष्टि, स्वामित्व और दशा पर निर्भर करता है।"
      ),
      L(
        "Begin by learning natural significations first: the Sun for identity and authority, the Moon for mind, Mars for action, and so on. This foundation prevents simplistic readings and helps you connect planetary themes with lived experience.",
        "सबसे पहले ग्रहों के स्वाभाविक कारकत्व समझें: सूर्य पहचान और अधिकार, चंद्र मन, मंगल क्रिया, आदि। यही आधार सतही व्याख्या से बचाता है और ग्रहों के विषयों को वास्तविक जीवन से जोड़ने में मदद करता है।"
      ),
    ],
    sections: [
      {
        heading: L("Natural karakatwa", "स्वाभाविक कारकत्व"),
        paragraphs: [
          L(
            "Each graha has natural domains. These are not enough on their own, but they tell you what kind of material a planet tends to carry. For example, Jupiter naturally supports wisdom and counsel, while Saturn brings duty, delay, and endurance.",
            "हर ग्रह के कुछ स्वाभाविक क्षेत्र होते हैं। अकेले वही अंतिम फल नहीं बताते, पर वे यह अवश्य दिखाते हैं कि ग्रह किस प्रकार की सामग्री लेकर आता है। जैसे गुरु ज्ञान और मार्गदर्शन देता है, जबकि शनि कर्तव्य, विलंब और धैर्य लाता है।"
          ),
        ],
      },
      {
        heading: L("Strength matters more than labels", "सिर्फ नाम नहीं, बल अधिक महत्वपूर्ण है"),
        paragraphs: [
          L(
            "A so-called benefic can underperform when weak, afflicted, or ruling difficult houses, and a natural malefic can produce excellent results when strong and functionally supportive. Jyotish rewards context, not shortcuts.",
            "यदि कोई शुभ ग्रह निर्बल, पीड़ित या कठिन भावों का स्वामी हो, तो उसका फल कमज़ोर हो सकता है; वहीं प्राकृतिक पाप ग्रह भी मजबूत और कार्यात्मक रूप से सहायक होने पर बहुत अच्छे परिणाम दे सकता है। ज्योतिष में संदर्भ ही मुख्य है, शॉर्टकट नहीं।"
          ),
        ],
      },
      {
        heading: L("Planet + house + dasha", "ग्रह + भाव + दशा"),
        paragraphs: [
          L(
            "The cleanest way to read a graha is to ask three questions: what does this planet naturally signify, what house topics is it carrying in this chart, and is its dasha or transit active now? This turns textbook meanings into timing-based interpretation.",
            "किसी ग्रह को पढ़ने का सबसे साफ तरीका तीन प्रश्न पूछना है: यह ग्रह स्वभाव से क्या दर्शाता है, इस कुंडली में किन भावों के विषय साथ ला रहा है, और क्या अभी इसकी दशा या गोचर सक्रिय है? इसी से पुस्तक-ज्ञान समयबद्ध व्याख्या में बदलता है।"
          ),
        ],
      },
    ],
    cards: [
      {
        icon: "☀️",
        title: L("Sun", "सूर्य"),
        subtitle: L("Authority, vitality, father, purpose", "अधिकार, तेज, पिता, उद्देश्य"),
        body: L(
          "The Sun shows core identity, self-respect, visibility, and the capacity to lead from the center. A healthy Sun gives steadiness and dignity; an afflicted Sun may struggle with ego, validation, or relationship with authority.",
          "सूर्य मूल पहचान, आत्मसम्मान, तेज और केंद्र से नेतृत्व करने की क्षमता को दिखाता है। स्वस्थ सूर्य स्थिरता और गरिमा देता है; पीड़ित सूर्य अहं, मान्यता की चाह या अधिकार से टकराव दिखा सकता है।"
        ),
        tags: [L("Royal planet", "राजस ग्रह"), L("Soul principle", "आत्मिक सिद्धांत")],
      },
      {
        icon: "🌙",
        title: L("Moon", "चंद्र"),
        subtitle: L("Mind, emotion, mother, memory", "मन, भावना, माता, स्मृति"),
        body: L(
          "The Moon reflects how the mind receives life and how it seeks comfort and bonding. Its condition strongly shapes mood, adaptability, public response, and the felt sense of security. It also anchors the starting point of Vimshottari dasha.",
          "चंद्र बताता है कि मन जीवन को कैसे ग्रहण करता है और सुकून व संबंध कैसे खोजता है। इसकी स्थिति मनोदशा, अनुकूलन, जन-प्रतिक्रिया और सुरक्षा की अनुभूति पर गहरा प्रभाव डालती है। विंशोत्तरी दशा का प्रारंभिक आधार भी यही है।"
        ),
        tags: [L("Fast-moving", "तीव्रगामी"), L("Mind", "मन")],
      },
      {
        icon: "♂️",
        title: L("Mars", "मंगल"),
        subtitle: L("Action, courage, heat, conflict", "क्रिया, साहस, उष्णता, संघर्ष"),
        body: L(
          "Mars brings the will to act, defend, compete, repair, and cut through resistance. Well-placed Mars supports disciplined courage; poorly directed Mars can show haste, injury, quarrel, or impatience in relationships.",
          "मंगल कार्य करने, रक्षा करने, प्रतिस्पर्धा करने, सुधारने और बाधा काटने की शक्ति देता है। शुभ स्थिति में मंगल अनुशासित साहस देता है; गलत दिशा में यह जल्दबाजी, चोट, झगड़ा या संबंधों में अधैर्य दिखा सकता है।"
        ),
        tags: [L("Energy", "ऊर्जा"), L("Technical skill", "तकनीकी कौशल")],
      },
      {
        icon: "☿️",
        title: L("Mercury", "बुध"),
        subtitle: L("Speech, analysis, commerce, skill", "वाणी, विश्लेषण, व्यापार, कौशल"),
        body: L(
          "Mercury governs communication, classification, humor, learning, and trade. A strong Mercury sharpens logic and adaptability, while affliction can produce nervousness, mixed signals, or overthinking without clear judgment.",
          "बुध संवाद, वर्गीकरण, विनोद, सीखने और व्यापार का ग्रह है। मजबूत बुध तर्क और अनुकूलनशीलता बढ़ाता है, जबकि पीड़ा होने पर बेचैनी, उलझी वाणी या निर्णयहीन सोच दिख सकती है।"
        ),
        tags: [L("Intellect", "बुद्धि"), L("Youthful planet", "युव ग्रह")],
      },
      {
        icon: "♃",
        title: L("Jupiter", "गुरु"),
        subtitle: L("Wisdom, dharma, guidance, expansion", "ज्ञान, धर्म, मार्गदर्शन, विस्तार"),
        body: L(
          "Jupiter supports faith, ethics, teaching, children, counsel, and meaningful growth. When strong, it gives perspective and protection; when weakened, hope may remain but practical judgment can become inconsistent.",
          "गुरु श्रद्धा, नीति, शिक्षा, संतान, परामर्श और सार्थक विस्तार का ग्रह है। मजबूत गुरु दृष्टि और संरक्षण देता है; निर्बल होने पर आशा तो रहती है, पर व्यावहारिक निर्णय अस्थिर हो सकते हैं।"
        ),
        tags: [L("Guru tattva", "गुरु तत्व"), L("Grace", "कृपा")],
      },
      {
        icon: "♀️",
        title: L("Venus", "शुक्र"),
        subtitle: L("Love, comfort, art, agreement", "प्रेम, सुख, कला, सामंजस्य"),
        body: L(
          "Venus signifies attraction, pleasure, aesthetics, diplomacy, and the ability to harmonize. In strong condition it refines taste and relationship capacity; when afflicted, it can lean toward excess, compromise without boundaries, or pleasure that lacks balance.",
          "शुक्र आकर्षण, सुख, सौंदर्य, कूटनीति और सामंजस्य बनाने की क्षमता को दर्शाता है। अच्छा शुक्र रुचि और संबंधों की गुणवत्ता बढ़ाता है; पीड़ित होने पर यह अति-भोग, सीमाहीन समझौता या असंतुलित सुख की ओर ले जा सकता है।"
        ),
        tags: [L("Refinement", "परिष्कार"), L("Relationship planet", "संबंध ग्रह")],
      },
      {
        icon: "♄",
        title: L("Saturn", "शनि"),
        subtitle: L("Duty, time, discipline, endurance", "कर्तव्य, समय, अनुशासन, धैर्य"),
        body: L(
          "Saturn slows processes so that effort, accountability, and realism can mature. Its lessons are rarely fast, but they often produce durable skill and humility. Fear of Saturn usually reduces when its purpose is understood: to make a life structure honest and sustainable.",
          "शनि प्रक्रियाओं को धीमा करता है ताकि प्रयास, जवाबदेही और यथार्थवाद परिपक्व हो सकें। इसके पाठ तेज नहीं होते, पर टिकाऊ कौशल और विनम्रता देते हैं। शनि का भय तब घटता है जब उसका उद्देश्य समझ आता है: जीवन की संरचना को ईमानदार और स्थायी बनाना।"
        ),
        tags: [L("Time", "समय"), L("Karma", "कर्म")],
      },
      {
        icon: "☊",
        title: L("Rahu", "राहु"),
        subtitle: L("Desire, ambition, disruption, foreignness", "इच्छा, महत्वाकांक्षा, विघटन, विदेश"),
        body: L(
          "Rahu amplifies appetite and pushes attention toward unusual, worldly, or boundary-crossing experiences. It can bring breakthroughs and obsession together, so it must be read carefully with sign, house, and dasha context.",
          "राहु इच्छा को बढ़ाता है और ध्यान को असामान्य, सांसारिक या सीमा-पार अनुभवों की ओर ले जाता है। यह प्रगति और आसक्ति दोनों ला सकता है, इसलिए इसे राशि, भाव और दशा के संदर्भ में बहुत सावधानी से पढ़ना चाहिए।"
        ),
        tags: [L("Amplifier", "वर्धक"), L("Worldly hunger", "सांसारिक भूख")],
      },
      {
        icon: "☋",
        title: L("Ketu", "केतु"),
        subtitle: L("Detachment, insight, loss, liberation", "वैराग्य, अंतर्दृष्टि, क्षय, मुक्ति"),
        body: L(
          "Ketu cuts attachment and turns awareness inward. It can show precision, spiritual intensity, old mastery, and areas where worldly satisfaction feels incomplete. Its gifts often appear after a person accepts that control is limited.",
          "केतु आसक्ति काटकर चेतना को भीतर मोड़ता है। यह सूक्ष्मता, आध्यात्मिक तीव्रता, पुराना कौशल और वे क्षेत्र दिखाता है जहाँ सांसारिक संतोष अधूरा लगता है। इसके वरदान प्रायः तब खुलते हैं जब व्यक्ति नियंत्रण की सीमाएँ स्वीकार करता है।"
        ),
        tags: [L("Moksha impulse", "मोक्ष प्रवृत्ति"), L("Separation", "वियोग")],
      },
    ],
    relatedSlugs: ["zodiac", "houses", "saturn", "western-planets"],
    relatedCalculator: "kp-sub-lord",
  },
  {
    slug: "houses",
    category: "vedic",
    icon: "🏠",
    menuTitle: L("Twelve Houses", "बारह भाव"),
    menuDescription: L(
      "What each bhava covers in a Vedic birth chart.",
      "वैदिक जन्म कुंडली में प्रत्येक भाव किन विषयों को दर्शाता है।"
    ),
    title: L("Bhavas in Vedic Astrology", "वैदिक ज्योतिष में भाव"),
    subtitle: L(
      "The twelve houses describe where karma unfolds in practical life.",
      "बारह भाव बताते हैं कि कर्म जीवन के किन क्षेत्रों में प्रकट होगा।"
    ),
    description: L(
      "Learn the meaning of all 12 houses in Vedic astrology, from self and wealth to marriage, karma, and liberation.",
      "वैदिक ज्योतिष के 12 भावों का अर्थ जानें, आत्म, धन, विवाह, कर्म और मोक्ष तक।"
    ),
    intro: [
      L(
        "If signs describe style and planets describe actors, houses describe the life arenas where those actors perform. The ascendant fixes the first house, and from that point every bhava receives its own topics, ruler, and timing.",
        "यदि राशियाँ शैली बताती हैं और ग्रह कर्ता हैं, तो भाव वे जीवन-क्षेत्र हैं जहाँ वे कर्ता काम करते हैं। लग्न प्रथम भाव को स्थिर करता है, और वहीं से हर भाव को अपने विषय, स्वामी और समय-फल मिलते हैं।"
      ),
      L(
        "A house must be read through three layers: the house itself, the lord of that house, and any planets occupying or aspecting it. This is why two people can share the same Lagna but live very different versions of a house theme.",
        "किसी भाव को तीन स्तरों पर पढ़ना चाहिए: स्वयं भाव, उस भाव का स्वामी, और उसमें स्थित या दृष्टि देने वाले ग्रह। इसी कारण दो लोगों का लग्न समान होने पर भी किसी भाव का फल बहुत अलग हो सकता है।"
      ),
    ],
    sections: [
      {
        heading: L("Angular, trinal, and difficult houses", "केंद्र, त्रिकोण और कठिन भाव"),
        paragraphs: [
          L(
            "The kendras (1, 4, 7, 10) are structural pillars of life. The trikonas (1, 5, 9) often carry support, purpose, and blessings. The dusthanas (6, 8, 12) bring challenge, but they also teach service, transformation, and surrender.",
            "केंद्र भाव (1, 4, 7, 10) जीवन के आधार-स्तंभ हैं। त्रिकोण भाव (1, 5, 9) प्रायः सहयोग, उद्देश्य और कृपा लाते हैं। दुष्थान भाव (6, 8, 12) चुनौती देते हैं, पर सेवा, रूपांतरण और समर्पण भी सिखाते हैं।"
          ),
        ],
      },
      {
        heading: L("Do not isolate one house", "किसी एक भाव को अलग न देखें"),
        paragraphs: [
          L(
            "Marriage is not just the 7th house, career is not just the 10th, and money is not just the 2nd. Good readings connect supporting houses, relevant karakas, divisional charts when needed, and the active dasha.",
            "विवाह केवल 7वाँ भाव नहीं है, करियर केवल 10वाँ नहीं, और धन केवल 2रा भाव नहीं। अच्छी व्याख्या में सहायक भाव, संबंधित कारक ग्रह, आवश्यक होने पर वर्ग कुंडलियाँ और सक्रिय दशा सब जोड़े जाते हैं।"
          ),
        ],
      },
      {
        heading: L("House results need timing", "भावों के फल में समय महत्वपूर्ण है"),
        paragraphs: [
          L(
            "A strong house can stay quiet until its lord’s dasha or a major transit activates it. Timing is what turns potential into event, which is why house promises and planetary periods should always be read together.",
            "मजबूत भाव भी तब तक शांत रह सकता है जब तक उसके स्वामी की दशा या कोई प्रमुख गोचर उसे सक्रिय न करे। समय ही संभावना को घटना में बदलता है, इसलिए भाव-फल और ग्रहों की दशा को साथ में पढ़ना चाहिए।"
          ),
        ],
      },
    ],
    cards: [
      {
        icon: "1️⃣",
        title: L("1st House", "प्रथम भाव"),
        subtitle: L("Self, body, temperament, direction", "स्वयं, शरीर, स्वभाव, दिशा"),
        body: L(
          "The 1st house shows how life begins through you: appearance, vitality, instinct, and orientation. Its strength affects confidence, health tone, and how strongly you can carry the rest of the chart.",
          "प्रथम भाव बताता है कि जीवन आपके माध्यम से कैसे प्रारंभ होता है: रूप, जीवनशक्ति, सहज स्वभाव और दिशा। इसकी शक्ति आत्मविश्वास, स्वास्थ्य की मूल धारा और पूरी कुंडली को वहन करने की क्षमता पर असर डालती है।"
        ),
      },
      {
        icon: "2️⃣",
        title: L("2nd House", "द्वितीय भाव"),
        subtitle: L("Wealth, speech, family, stored value", "धन, वाणी, परिवार, संचित मूल्य"),
        body: L(
          "The 2nd house covers accumulated resources, food habits, speech, and family culture. It often shows what a person preserves and how they build material and verbal worth over time.",
          "द्वितीय भाव संचित धन, भोजन की आदतें, वाणी और पारिवारिक संस्कार को दर्शाता है। यह बताता है कि व्यक्ति क्या बचाकर रखता है और समय के साथ भौतिक तथा वाचिक मूल्य कैसे बनाता है।"
        ),
      },
      {
        icon: "3️⃣",
        title: L("3rd House", "तृतीय भाव"),
        subtitle: L("Effort, courage, skills, siblings", "पराक्रम, साहस, कौशल, सहोदर"),
        body: L(
          "The 3rd house is the house of effort and repetition. It shows initiative, writing, media, short travel, practical skill-building, and the way courage grows through doing rather than waiting.",
          "तृतीय भाव प्रयास और दोहराव का भाव है। यह पहल, लेखन, संचार, छोटी यात्राएँ, व्यावहारिक कौशल और वह साहस दिखाता है जो इंतज़ार से नहीं बल्कि कार्य से बनता है।"
        ),
      },
      {
        icon: "4️⃣",
        title: L("4th House", "चतुर्थ भाव"),
        subtitle: L("Home, mother, inner peace, property", "घर, माता, मानसिक शांति, संपत्ति"),
        body: L(
          "The 4th house relates to one’s seat of comfort: home, roots, emotional grounding, and land or property matters. A strong 4th supports contentment; a stressed 4th can make outer success feel inwardly unsettled.",
          "चतुर्थ भाव जीवन के सुखासन से जुड़ा है: घर, जड़ें, मानसिक आधार और भूमि या संपत्ति के विषय। मजबूत चतुर्थ भाव संतोष देता है; अशांत चतुर्थ भाव में बाहरी सफलता के बीच भी भीतर बेचैनी रह सकती है।"
        ),
      },
      {
        icon: "5️⃣",
        title: L("5th House", "पंचम भाव"),
        subtitle: L("Children, intelligence, mantra, creativity", "संतान, बुद्धि, मंत्र, रचनात्मकता"),
        body: L(
          "The 5th house carries refined intelligence, creativity, romance, children, and purva punya themes. It is also important for mantra practice and the quality of one’s inspired thinking.",
          "पंचम भाव सूक्ष्म बुद्धि, रचनात्मकता, प्रेम, संतान और पूर्व पुण्य से जुड़ा है। मंत्र साधना और प्रेरित सोच की गुणवत्ता देखने में भी यह भाव महत्वपूर्ण है।"
        ),
      },
      {
        icon: "6️⃣",
        title: L("6th House", "षष्ठ भाव"),
        subtitle: L("Work, service, debt, disease, enemies", "कार्य, सेवा, ऋण, रोग, शत्रु"),
        body: L(
          "The 6th house shows the friction that requires discipline. It covers service, routines, health imbalances, debts, conflict, and the ability to improve life by handling what is inconvenient but necessary.",
          "षष्ठ भाव वह घर्षण दिखाता है जहाँ अनुशासन चाहिए। यह सेवा, दिनचर्या, स्वास्थ्य असंतुलन, ऋण, संघर्ष और जीवन को बेहतर बनाने के लिए आवश्यक कठिन काम संभालने की क्षमता को दर्शाता है।"
        ),
      },
      {
        icon: "7️⃣",
        title: L("7th House", "सप्तम भाव"),
        subtitle: L("Marriage, partnership, agreements, public", "विवाह, साझेदारी, समझौते, जनसंपर्क"),
        body: L(
          "The 7th house describes the field of the other: spouse, partners, clients, and formal agreements. It shows how a person meets equals and what kind of balance or tension appears in close bonds.",
          "सप्तम भाव दूसरे व्यक्ति का क्षेत्र है: जीवनसाथी, भागीदार, ग्राहक और औपचारिक समझौते। यह बताता है कि व्यक्ति समान स्तर के लोगों से कैसे मिलता है और घनिष्ठ संबंधों में कैसा संतुलन या तनाव आता है।"
        ),
      },
      {
        icon: "8️⃣",
        title: L("8th House", "अष्टम भाव"),
        subtitle: L("Longevity, secrets, upheaval, transformation", "आयु, रहस्य, उथल-पुथल, रूपांतरण"),
        body: L(
          "The 8th house deals with what is hidden, inherited, unstable, or transformative. It is important for longevity, research, sudden change, occult depth, and the life lessons that arrive through surrender and renewal.",
          "अष्टम भाव उन विषयों से जुड़ा है जो छिपे, विरासत में मिले, अस्थिर या रूपांतरकारी हों। आयु, शोध, अचानक परिवर्तन, गूढ़ता और समर्पण के बाद आने वाले नए जीवन-पाठ इसी भाव से देखे जाते हैं।"
        ),
      },
      {
        icon: "9️⃣",
        title: L("9th House", "नवम भाव"),
        subtitle: L("Dharma, fortune, teacher, blessings", "धर्म, भाग्य, गुरु, आशीर्वाद"),
        body: L(
          "The 9th house is the house of higher order: dharma, ethics, gurus, blessings, pilgrimage, and worldview. It often shows what gives life meaning beyond immediate gain.",
          "नवम भाव उच्च व्यवस्था का भाव है: धर्म, नीति, गुरु, आशीर्वाद, तीर्थ और जीवन-दृष्टि। यह बताता है कि तात्कालिक लाभ से आगे जीवन को अर्थ क्या देता है।"
        ),
      },
      {
        icon: "🔟",
        title: L("10th House", "दशम भाव"),
        subtitle: L("Career, karma, status, responsibility", "कर्म, पेशा, प्रतिष्ठा, जिम्मेदारी"),
        body: L(
          "The 10th house is one of the clearest indicators of public action and duty. It shows profession, reputation, achievement, and the kind of work through which a person becomes visible in society.",
          "दशम भाव सार्वजनिक कर्म और जिम्मेदारी का प्रमुख सूचक है। यह पेशा, प्रतिष्ठा, उपलब्धि और उस कार्यक्षेत्र को दर्शाता है जिसके माध्यम से व्यक्ति समाज में दिखाई देता है।"
        ),
      },
      {
        icon: "1️⃣1️⃣",
        title: L("11th House", "एकादश भाव"),
        subtitle: L("Gains, networks, fulfilment of desires", "लाभ, नेटवर्क, इच्छापूर्ति"),
        body: L(
          "The 11th house relates to gains, social circles, patrons, large networks, and outcomes of sustained effort. It often shows how aspirations become measurable results.",
          "एकादश भाव लाभ, मित्र-मंडली, सहायक लोग, बड़े नेटवर्क और दीर्घ प्रयास के फल को दर्शाता है। यह बताता है कि इच्छाएँ किस प्रकार वास्तविक परिणामों में बदलती हैं।"
        ),
      },
      {
        icon: "1️⃣2️⃣",
        title: L("12th House", "द्वादश भाव"),
        subtitle: L("Loss, retreat, sleep, moksha, foreign stay", "व्यय, एकांत, निद्रा, मोक्ष, विदेश निवास"),
        body: L(
          "The 12th house dissolves boundaries. It rules expenses, retreat, hospitals or ashrams, sleep, foreign residence, and spiritual release. Its lessons are often about letting go with awareness rather than fear.",
          "द्वादश भाव सीमाओं को विलीन करता है। यह व्यय, एकांत, अस्पताल या आश्रम, नींद, विदेश निवास और आध्यात्मिक मुक्ति से जुड़ा है। इसके पाठ प्रायः डर से नहीं बल्कि जागरूक त्याग से पूरे होते हैं।"
        ),
      },
    ],
    relatedSlugs: ["zodiac", "planets", "life-insights", "western-houses"],
    relatedCalculator: "lagna",
  },
  {
    slug: "numerology",
    category: "vedic",
    icon: "🔢",
    menuTitle: L("Numerology Basics", "अंक ज्योतिष की मूल बातें"),
    menuDescription: L(
      "Life path, name number, and the meanings of numbers 1 to 9.",
      "लाइफ पाथ, नामांक और 1 से 9 तक अंकों के अर्थ।"
    ),
    title: L("Numerology in Practice", "व्यावहारिक अंक ज्योतिष"),
    subtitle: L(
      "A simple guide to core numbers and how people commonly use them alongside Jyotish.",
      "मुख्य अंकों और ज्योतिष के साथ उनके सामान्य उपयोग की सरल मार्गदर्शिका।"
    ),
    description: L(
      "Understand life path and name number basics, plus the practical meanings of numerology numbers 1 through 9.",
      "लाइफ पाथ और नामांक की मूल बातें, तथा अंक 1 से 9 तक के व्यावहारिक अर्थ समझें।"
    ),
    intro: [
      L(
        "Many people use numerology as a supportive tool beside Jyotish rather than a replacement for it. Birth-based numbers are often read for life direction and temperament, while name-based numbers are used for expression, branding, and day-to-day resonance.",
        "कई लोग अंक ज्योतिष को ज्योतिष के साथ सहायक साधन के रूप में उपयोग करते हैं, उसके स्थान पर नहीं। जन्मतिथि से निकले अंक जीवन-दिशा और स्वभाव के लिए देखे जाते हैं, जबकि नाम से निकले अंक अभिव्यक्ति, ब्रांडिंग और दैनिक अनुकूलता के लिए उपयोग होते हैं।"
      ),
      L(
        "Life path is usually calculated from the full birth date and points to the larger route a person keeps returning to. Name number is derived from letters and is often discussed for public identity, business names, or whether a name feels supportive to the person’s goals.",
        "लाइफ पाथ सामान्यतः पूरी जन्मतिथि से निकाला जाता है और उस बड़े मार्ग को दिखाता है जिसकी ओर व्यक्ति बार-बार लौटता है। नामांक अक्षरों से निकाला जाता है और इसे सार्वजनिक पहचान, व्यवसाय नाम या किसी नाम की अनुकूलता के संदर्भ में देखा जाता है।"
      ),
    ],
    sections: [
      {
        heading: L("Life path vs name number", "लाइफ पाथ बनाम नामांक"),
        paragraphs: [
          L(
            "Life path is considered more foundational because it comes from the birth date, which is fixed. Name number is more adjustable and is often treated as an outer interface. In practice, readers compare both to see whether a person’s inner route and outer presentation feel aligned or strained.",
            "लाइफ पाथ को अधिक मूलभूत माना जाता है क्योंकि वह जन्मतिथि से आता है, जो स्थिर होती है। नामांक अपेक्षाकृत परिवर्तनीय है और इसे बाहरी अभिव्यक्ति की तरह देखा जाता है। व्यवहार में दोनों की तुलना करके देखा जाता है कि व्यक्ति का भीतर का मार्ग और बाहर की प्रस्तुति एक-दूसरे का सहयोग कर रहे हैं या नहीं।"
          ),
        ],
      },
      {
        heading: L("Use numerology with proportion", "अंक ज्योतिष का संतुलित उपयोग करें"),
        paragraphs: [
          L(
            "Numerology can offer helpful patterns, but it does not replace a full chart for marriage, health, dasha timing, or major remedies. It works best as a clarifying lens for personal rhythm, naming, and broad self-understanding.",
            "अंक ज्योतिष उपयोगी संकेत दे सकता है, पर विवाह, स्वास्थ्य, दशा-समय या बड़े उपचार के लिए यह पूरी कुंडली का स्थान नहीं लेता। यह व्यक्तिगत लय, नामकरण और व्यापक आत्म-समझ के लिए सबसे अच्छा सहायक दृष्टिकोण है।"
          ),
        ],
      },
      {
        heading: L("Single-digit meanings", "एकल अंकों के अर्थ"),
        paragraphs: [
          L(
            "The classic reading reduces numbers to a core digit from 1 to 9. That base digit is then interpreted for temperament, motivation, and style. Compound numbers can add nuance, but the single digit remains the anchor.",
            "शास्त्रीय पद्धति में अंकों को 1 से 9 के मूल अंक तक घटाया जाता है। फिर उसी मूल अंक से स्वभाव, प्रेरणा और शैली को पढ़ा जाता है। संयुक्त अंक अतिरिक्त बारीकी दे सकते हैं, पर आधार वही एकल अंक रहता है।"
          ),
        ],
      },
    ],
    cards: [
      {
        icon: "1️⃣",
        title: L("Number 1", "अंक 1"),
        subtitle: L("Initiation, independence, leadership", "आरंभ, स्वतंत्रता, नेतृत्व"),
        body: L(
          "Number 1 is associated with originality, direction, and the wish to stand on one’s own feet. When balanced, it helps a person begin strongly and lead clearly. When strained, it can become impatient or too identified with being first.",
          "अंक 1 मौलिकता, दिशा और अपने पैरों पर खड़े होने की इच्छा से जुड़ा है। संतुलित होने पर यह व्यक्ति को मजबूत शुरुआत और स्पष्ट नेतृत्व देता है। तनाव में यही अंक अधैर्य या हर हाल में आगे रहने की जिद दे सकता है।"
        ),
      },
      {
        icon: "2️⃣",
        title: L("Number 2", "अंक 2"),
        subtitle: L("Sensitivity, cooperation, receptivity", "संवेदनशीलता, सहयोग, ग्रहणशीलता"),
        body: L(
          "Number 2 is often linked with emotional awareness, diplomacy, and the ability to respond rather than force. It supports partnership and nuance, though too much of it can lead to hesitation or mood-led choices.",
          "अंक 2 भावनात्मक समझ, कूटनीति और दबाव से अधिक प्रतिक्रिया की क्षमता से जुड़ा माना जाता है। यह साझेदारी और सूक्ष्मता को सहारा देता है, पर अत्यधिक होने पर निर्णयों में झिझक या मनोदशा का प्रभाव बढ़ सकता है।"
        ),
      },
      {
        icon: "3️⃣",
        title: L("Number 3", "अंक 3"),
        subtitle: L("Expression, growth, learning", "अभिव्यक्ति, विस्तार, शिक्षा"),
        body: L(
          "Number 3 usually favors communication, optimism, teaching, and visible creativity. It brings movement and outward expression, but needs discipline to convert ideas into lasting results.",
          "अंक 3 संवाद, आशावाद, शिक्षा और प्रकट रचनात्मकता को बढ़ाता है। यह गति और बाहरी अभिव्यक्ति देता है, पर स्थायी परिणामों के लिए अनुशासन की आवश्यकता रहती है।"
        ),
      },
      {
        icon: "4️⃣",
        title: L("Number 4", "अंक 4"),
        subtitle: L("Structure, order, persistence", "संरचना, व्यवस्था, निरंतरता"),
        body: L(
          "Number 4 prefers systems, routines, and dependable effort. It can build strong foundations and handle practical responsibilities well. If rigid, however, it may resist change even when adjustment is necessary.",
          "अंक 4 व्यवस्था, दिनचर्या और भरोसेमंद प्रयास को पसंद करता है। यह मजबूत आधार बनाता है और व्यावहारिक जिम्मेदारियाँ अच्छी तरह निभा सकता है। लेकिन कठोर होने पर आवश्यक परिवर्तन का भी विरोध कर सकता है।"
        ),
      },
      {
        icon: "5️⃣",
        title: L("Number 5", "अंक 5"),
        subtitle: L("Movement, adaptability, exchange", "गति, अनुकूलन, आदान-प्रदान"),
        body: L(
          "Number 5 likes variety, experience, travel, and fast learning. It helps in communication-heavy and changeable environments, though without focus it can keep a person busy without depth.",
          "अंक 5 विविधता, अनुभव, यात्रा और तेज सीखने की प्रवृत्ति देता है। यह संचारप्रधान और बदलते वातावरण में सहायक होता है, पर ध्यान न हो तो व्यक्ति गहराई के बिना केवल व्यस्त रह सकता है।"
        ),
      },
      {
        icon: "6️⃣",
        title: L("Number 6", "अंक 6"),
        subtitle: L("Care, beauty, duty, relationship", "देखभाल, सौंदर्य, कर्तव्य, संबंध"),
        body: L(
          "Number 6 is commonly linked with family concern, nurturing, harmony, and aesthetic sense. It often supports service through care, but can overextend when responsibility turns into control.",
          "अंक 6 परिवार, पोषण, सामंजस्य और सौंदर्यबोध से जुड़ा माना जाता है। यह देखभाल के माध्यम से सेवा करने में सहायक होता है, पर जिम्मेदारी नियंत्रण में बदल जाए तो व्यक्ति अधिक बोझ उठा सकता है।"
        ),
      },
      {
        icon: "7️⃣",
        title: L("Number 7", "अंक 7"),
        subtitle: L("Inquiry, reflection, inner depth", "खोज, मनन, आंतरिक गहराई"),
        body: L(
          "Number 7 turns attention inward and often seeks meaning beyond surface success. It supports research, contemplation, and spiritual curiosity, but may prefer solitude more than social momentum.",
          "अंक 7 ध्यान को भीतर ले जाता है और सतही सफलता से आगे अर्थ खोजता है। यह शोध, चिंतन और आध्यात्मिक जिज्ञासा को सहारा देता है, पर सामाजिक गति की तुलना में एकांत को अधिक पसंद कर सकता है।"
        ),
      },
      {
        icon: "8️⃣",
        title: L("Number 8", "अंक 8"),
        subtitle: L("Power, karma, endurance, material mastery", "शक्ति, कर्म, धैर्य, भौतिक साधना"),
        body: L(
          "Number 8 is associated with long effort, accountability, ambition, and lessons around power and consequence. It can create durable success, but usually through patience rather than quick reward.",
          "अंक 8 दीर्घ प्रयास, जवाबदेही, महत्वाकांक्षा और शक्ति-फल के पाठों से जुड़ा है। यह टिकाऊ सफलता दे सकता है, पर सामान्यतः तेज लाभ के बजाय धैर्यपूर्ण यात्रा से।"
        ),
      },
      {
        icon: "9️⃣",
        title: L("Number 9", "अंक 9"),
        subtitle: L("Completion, courage, service, intensity", "पूर्णता, साहस, सेवा, तीव्रता"),
        body: L(
          "Number 9 often carries passion, generosity, and the urge to finish what matters. It can be deeply protective and idealistic, though it must learn not to burn energy faster than purpose requires.",
          "अंक 9 में उत्साह, उदारता और महत्वपूर्ण कार्यों को पूरा करने की तीव्र इच्छा रहती है। यह रक्षक और आदर्शवादी हो सकता है, पर इसे यह भी सीखना होता है कि उद्देश्य से अधिक तेजी से अपनी ऊर्जा न जलाए।"
        ),
      },
    ],
    relatedSlugs: ["life-insights", "zodiac", "western"],
    relatedCalculator: "life-path",
  },
  {
    slug: "kp-astrology",
    category: "vedic",
    icon: "🔭",
    menuTitle: L("KP Astrology", "केपी ज्योतिष"),
    menuDescription: L(
      "A clear introduction to Krishnamurti Paddhati and its sub-lord method.",
      "कृष्णमूर्ति पद्धति और सब-लॉर्ड विधि का स्पष्ट परिचय।"
    ),
    title: L("KP Astrology Basics", "केपी ज्योतिष की मूल बातें"),
    subtitle: L(
      "Understand sub-lords, the 249 horary system, and how KP differs from traditional Jyotish.",
      "सब-लॉर्ड, 249 होररी प्रणाली और पारंपरिक ज्योतिष से केपी के अंतर को समझें।"
    ),
    description: L(
      "Learn the basics of KP astrology, including sub-lords, 1-249 horary numbers, Placidus houses, and core differences from classical Jyotish.",
      "केपी ज्योतिष की मूल बातें जानें: सब-लॉर्ड, 1-249 होररी संख्या, प्लासिडस भाव और शास्त्रीय ज्योतिष से मुख्य अंतर।"
    ),
    intro: [
      L(
        "Krishnamurti Paddhati, or KP astrology, is a modern predictive system that grew out of Indian astrology while adopting a different level of precision. Its language still includes signs, houses, nakshatras, and dashas, but it gives exceptional importance to stellar division and the sub-lord.",
        "कृष्णमूर्ति पद्धति या केपी ज्योतिष भारतीय ज्योतिष से विकसित हुई एक आधुनिक भविष्यवाणी प्रणाली है, जो सूक्ष्मता के एक अलग स्तर पर काम करती है। इसमें राशि, भाव, नक्षत्र और दशा की भाषा बनी रहती है, लेकिन नक्षत्र-विभाजन और सब-लॉर्ड को विशेष महत्व दिया जाता है।"
      ),
      L(
        "Students often meet KP through practical questions such as marriage timing, job change, property, or horary judgment. The method is valued because it tries to separate promise from non-promise with sharper event logic.",
        "कई विद्यार्थी केपी से पहली बार विवाह-समय, नौकरी परिवर्तन, संपत्ति या होररी प्रश्नों के माध्यम से परिचित होते हैं। यह पद्धति इसलिए लोकप्रिय है क्योंकि यह घटना-फल में केवल संभावना नहीं, बल्कि स्पष्ट संकेतक देने का प्रयास करती है।"
      ),
    ],
    sections: [
      {
        heading: L("Why the sub-lord matters", "सब-लॉर्ड क्यों महत्वपूर्ण है"),
        paragraphs: [
          L(
            "KP reads a cusp or planet through three layers: sign lord, star-lord, and sub-lord. The sub-lord is treated as the decisive filter, because it narrows down whether a promised event is likely to materialize, delay, or deny. This is one of the biggest differences from broad textbook readings.",
            "केपी किसी भाव-स्पर्श या ग्रह को तीन स्तरों पर पढ़ती है: राशि स्वामी, नक्षत्र स्वामी और सब-लॉर्ड। सब-लॉर्ड को निर्णायक माना जाता है, क्योंकि वही यह संकुचित करता है कि कोई संभावित घटना वास्तव में होगी, रुकेगी या टलेगी। यही बात इसे सामान्य पुस्तक-आधारित व्याख्या से अलग बनाती है।"
          ),
        ],
        bullets: [
          L("Sign lord gives the general field.", "राशि स्वामी सामान्य क्षेत्र बताता है।"),
          L("Star-lord shows the house results carried by the planet.", "नक्षत्र स्वामी बताता है कि ग्रह कौन से भाव-फल साथ ला रहा है।"),
          L("Sub-lord refines the final judgement.", "सब-लॉर्ड अंतिम निर्णय को सूक्ष्म बनाता है।"),
        ],
      },
      {
        heading: L("The 1 to 249 horary system", "1 से 249 होररी प्रणाली"),
        paragraphs: [
          L(
            "KP horary uses a number from 1 to 249, each mapped to a precise sign, nakshatra, and sub division. Instead of relying only on the querent’s birth details, the system allows a focused question to be judged through the chart derived from that selected number and the moment of judgment.",
            "केपी होररी में 1 से 249 तक की संख्या ली जाती है, जिनमें प्रत्येक एक सूक्ष्म राशि, नक्षत्र और सब-विभाजन से जुड़ी होती है। केवल जन्म विवरण पर निर्भर रहने के बजाय, यह पद्धति चुनी हुई संख्या और प्रश्न के क्षण से बने चार्ट द्वारा विशेष प्रश्न का निर्णय करने देती है।"
          ),
        ],
      },
      {
        heading: L("Placidus houses, not equal houses", "प्लासिडस भाव, समभाव नहीं"),
        paragraphs: [
          L(
            "A practical difference in KP is the preference for Placidus house division rather than the simple one-sign-one-house model used in many introductory Vedic readings. KP students therefore pay close attention to exact cuspal degrees, because a cusp shifting by a small amount can change the chain of significators.",
            "केपी की एक व्यावहारिक विशेषता यह है कि यह कई प्रारंभिक वैदिक पद्धतियों के समभाव मॉडल के बजाय प्लासिडस भाव-विभाजन को महत्व देती है। इसलिए केपी विद्यार्थी भाव-स्पर्श के सटीक अंशों पर ध्यान देते हैं, क्योंकि थोड़ा सा परिवर्तन भी संकेतक श्रृंखला बदल सकता है।"
          ),
        ],
      },
      {
        heading: L("KP and traditional Jyotish", "केपी और पारंपरिक ज्योतिष"),
        paragraphs: [
          L(
            "Traditional Jyotish gives deep philosophical structure through rashi lords, yogas, divisional charts, and classical combinations. KP narrows its attention toward event judgment and yes-or-no clarity. Many practitioners use classical Jyotish for character and life context, then KP for sharper timing and question-based prediction.",
            "पारंपरिक ज्योतिष राशि स्वामी, योग, वर्ग कुंडली और शास्त्रीय संयोजनों के माध्यम से गहरी दार्शनिक संरचना देता है। केपी अपनी दृष्टि को घटना-निर्णय और हाँ-ना की स्पष्टता पर अधिक केंद्रित करती है। कई आचार्य व्यक्तित्व और जीवन-संदर्भ के लिए शास्त्रीय ज्योतिष, तथा सूक्ष्म समय-निर्णय के लिए केपी का सहारा लेते हैं।"
          ),
        ],
      },
    ],
    relatedSlugs: ["planets", "houses", "dasha"],
    relatedCalculator: "kp-sub-lord",
  },
];
