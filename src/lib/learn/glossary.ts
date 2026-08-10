import type { LocaleText } from "@/lib/learn/types";

const L = (en: string, hi: string): LocaleText => ({ en, hi });

const TERMS = [
  {
    termEn: "Antardasha",
    termHi: "अंतर्दशा",
    defEn: "The sub-period operating within a Mahadasha. It shows the nearer chapter and modifies how the larger dasha is experienced.",
    defHi: "महादशा के भीतर चलने वाला उपकाल। यह निकट वर्तमान अध्याय दिखाता है और बड़ी दशा के अनुभव को संशोधित करता है।",
  },
  {
    termEn: "Arudha",
    termHi: "अरूढ़",
    defEn: "A reflected image or projection of a house used in Jaimini-based techniques. It often relates to appearance, perception, or how something is seen publicly.",
    defHi: "जैमिनी-आधारित पद्धतियों में प्रयुक्त किसी भाव की प्रतिबिंबित छवि। यह अक्सर छवि, धारणा या सार्वजनिक रूप से चीज़ों के दिखने के तरीके से जुड़ता है।",
  },
  {
    termEn: "Ashtakoot",
    termHi: "अष्टकूट",
    defEn: "The classical eight-factor framework used in kundli matching. It contributes to the 36-point Gun Milan system.",
    defHi: "कुंडली मिलान में उपयोग होने वाला शास्त्रीय आठ-आधार वाला ढाँचा। यही 36 अंकों के गुण मिलान का आधार बनता है।",
  },
  {
    termEn: "Atmakaraka",
    termHi: "आत्मकारक",
    defEn: "In Jaimini astrology, the planet with the highest degree in a sign among the main planets. It is linked with deep soul lessons and personal evolution.",
    defHi: "जैमिनी ज्योतिष में मुख्य ग्रहों में से किसी राशि में सर्वाधिक अंश वाला ग्रह। यह गहरे आत्म-पाठ और व्यक्तिगत विकास से जुड़ा होता है।",
  },
  {
    termEn: "Ayanamsa",
    termHi: "अयनांश",
    defEn: "The correction used to convert tropical positions to sidereal positions. Different ayanamsa choices can shift sign and divisional outcomes slightly.",
    defHi: "ट्रॉपिकल स्थिति को साइडेरियल स्थिति में बदलने के लिए उपयोग किया जाने वाला सुधार। अलग-अलग अयनांश चुनने से राशि और वर्ग-फल में थोड़ा अंतर आ सकता है।",
  },
  {
    termEn: "Bhava",
    termHi: "भाव",
    defEn: "A house in the horoscope. Bhavas describe life areas such as self, wealth, marriage, work, and spiritual release.",
    defHi: "कुंडली का भाव। भाव जीवन के क्षेत्रों जैसे स्वयं, धन, विवाह, कर्म और मोक्ष को दर्शाते हैं।",
  },
  {
    termEn: "Bhukti",
    termHi: "भुक्ति",
    defEn: "Another common name for Antardasha, the sub-period within a major dasha cycle.",
    defHi: "अंतर्दशा का दूसरा प्रचलित नाम, जो महादशा के भीतर चलने वाला उपकाल है।",
  },
  {
    termEn: "Chandra Lagna",
    termHi: "चंद्र लग्न",
    defEn: "A house framework counted from the Moon sign instead of the ascendant. It is useful for emotional and transit-based interpretation.",
    defHi: "लग्न के बजाय चंद्र राशि से गिने गए भावों का ढाँचा। यह मनोवैज्ञानिक और गोचर-आधारित व्याख्या में उपयोगी है।",
  },
  {
    termEn: "Chara Karaka",
    termHi: "चर कारक",
    defEn: "A Jaimini system of movable significators assigned by planetary degrees. Examples include Atmakaraka and Darakaraka.",
    defHi: "ग्रहों के अंशों के आधार पर निर्धारित जैमिनी के चल कारक। उदाहरण: आत्मकारक और दाराकारक।",
  },
  {
    termEn: "Choghadiya",
    termHi: "चौघड़िया",
    defEn: "A traditional time-selection method dividing day and night into segments rated for different kinds of activity.",
    defHi: "मुहूर्त चयन की पारंपरिक पद्धति, जिसमें दिन और रात को विभिन्न कार्यों के लिए शुभ-अशुभ खंडों में बाँटा जाता है।",
  },
  {
    termEn: "Dasha",
    termHi: "दशा",
    defEn: "A planetary period system used for timing life events and themes. It shows when different karmic promises become active.",
    defHi: "जीवन-घटनाओं और विषयों के समय-निर्णय के लिए उपयोग होने वाली ग्रहीय अवधि प्रणाली। यह बताती है कि कौन से कर्मगत संकेत कब सक्रिय होंगे।",
  },
  {
    termEn: "Dhana Yoga",
    termHi: "धन योग",
    defEn: "A wealth-producing combination formed by supportive links between houses and lords related to finance and gain.",
    defHi: "धन और लाभ से जुड़े भावों तथा स्वामियों के अनुकूल संबंध से बनने वाला संपत्ति-वर्धक योग।",
  },
  {
    termEn: "Dosha",
    termHi: "दोष",
    defEn: "A problematic or imbalancing pattern in a chart. Its result depends on intensity, context, and cancellation factors.",
    defHi: "कुंडली में असंतुलन या चुनौती दर्शाने वाला पैटर्न। इसका फल तीव्रता, संदर्भ और शमन-योगों पर निर्भर करता है।",
  },
  {
    termEn: "Drekkana",
    termHi: "द्रेष्काण",
    defEn: "A divisional scheme that splits each sign into three parts. It is often linked with courage, siblings, and finer chart analysis.",
    defHi: "प्रत्येक राशि को तीन भागों में बाँटने वाली वर्ग-पद्धति। यह पराक्रम, सहोदर और सूक्ष्म विश्लेषण से जुड़ी मानी जाती है।",
  },
  {
    termEn: "Gochara",
    termHi: "गोचर",
    defEn: "Planetary transit in the sky relative to the natal chart. Transits show temporary activation and environmental pressure or support.",
    defHi: "जन्म कुंडली के सापेक्ष आकाश में ग्रहों की वर्तमान चाल। गोचर अस्थायी सक्रियता, दबाव या सहयोग दिखाते हैं।",
  },
  {
    termEn: "Graha",
    termHi: "ग्रह",
    defEn: "A planetary force in Jyotish. Grahas are interpreted as carriers of karma and intelligence, not only as astronomical bodies.",
    defHi: "ज्योतिष में ग्रहीय शक्ति। ग्रहों को केवल खगोलीय पिंड नहीं, बल्कि कर्म और चेतना के वाहक के रूप में भी देखा जाता है।",
  },
  {
    termEn: "Gun Milan",
    termHi: "गुण मिलान",
    defEn: "The score-based compatibility assessment used in traditional marriage matching, usually calculated through Ashtakoot.",
    defHi: "पारंपरिक विवाह मिलान में प्रयुक्त गुणांक-आधारित अनुकूलता जाँच, जो सामान्यतः अष्टकूट से निकाली जाती है।",
  },
  {
    termEn: "Hora",
    termHi: "होरा",
    defEn: "A planetary hour system used in electional timing, and also the name of a divisional concept in some chart methods.",
    defHi: "मुहूर्त में उपयोग होने वाली ग्रह-घंटा प्रणाली, और कुछ पद्धतियों में एक वर्गीय अवधारणा का नाम भी।",
  },
  {
    termEn: "Janma Kundli",
    termHi: "जन्म कुंडली",
    defEn: "The birth chart cast for the date, time, and place of birth. It is the main map used for natal analysis.",
    defHi: "जन्म तिथि, समय और स्थान के आधार पर बनाई गई कुंडली। जन्म विश्लेषण का मुख्य मानचित्र यही होता है।",
  },
  {
    termEn: "Janma Nakshatra",
    termHi: "जन्म नक्षत्र",
    defEn: "The nakshatra occupied by the Moon at birth. It is important for mind, naming, and Vimshottari dasha starting point.",
    defHi: "जन्म के समय चंद्रमा जिस नक्षत्र में हो, वही जन्म नक्षत्र है। यह मन, नामकरण और विंशोत्तरी दशा के प्रारंभ बिंदु के लिए महत्वपूर्ण है।",
  },
  {
    termEn: "Karaka",
    termHi: "कारक",
    defEn: "A significator, or a planet that naturally represents a topic. For example, Venus is a karaka for relationships and comfort.",
    defHi: "सूचक या वह ग्रह जो किसी विषय का स्वाभाविक प्रतिनिधि हो। जैसे शुक्र संबंध और सुख का कारक माना जाता है।",
  },
  {
    termEn: "Karana",
    termHi: "करण",
    defEn: "One of the five limbs of Panchang. A karana is half of a tithi and is used in timing and ritual selection.",
    defHi: "पंचांग के पाँच अंगों में से एक। करण तिथि का आधा भाग है और मुहूर्त व कर्म-चयन में उपयोग होता है।",
  },
  {
    termEn: "Kendra",
    termHi: "केंद्र",
    defEn: "The angular houses: 1st, 4th, 7th, and 10th. They form the structural pillars of the chart.",
    defHi: "कोण भाव: 1, 4, 7 और 10। ये कुंडली की संरचनात्मक धुरी माने जाते हैं।",
  },
  {
    termEn: "Lagna",
    termHi: "लग्न",
    defEn: "The rising sign on the eastern horizon at birth. It sets the house structure and is a central anchor of chart interpretation.",
    defHi: "जन्म के समय पूर्व क्षितिज पर उदित राशि। यह भावों का ढाँचा तय करती है और कुंडली-पठन का प्रमुख आधार है।",
  },
  {
    termEn: "Lagnesh",
    termHi: "लग्नेश",
    defEn: "The lord of the ascendant sign. Its condition strongly influences health, direction, and how the whole chart operates.",
    defHi: "लग्न राशि का स्वामी ग्रह। इसकी स्थिति स्वास्थ्य, जीवन-दिशा और पूरी कुंडली की कार्यप्रणाली पर गहरा प्रभाव डालती है।",
  },
  {
    termEn: "Mahadasha",
    termHi: "महादशा",
    defEn: "The main planetary period in a dasha sequence. It defines the larger chapter active in a phase of life.",
    defHi: "दशा क्रम की मुख्य ग्रहीय अवधि। यह जीवन के किसी काल में चल रहे बड़े अध्याय को परिभाषित करती है।",
  },
  {
    termEn: "Muhurat",
    termHi: "मुहूर्त",
    defEn: "An auspicious or carefully chosen time for beginning an activity. Muhurat considers planetary and Panchang conditions.",
    defHi: "किसी कार्य के आरंभ के लिए चुना गया शुभ या सावधानीपूर्वक निर्धारित समय। मुहूर्त में ग्रहों और पंचांग की स्थिति देखी जाती है।",
  },
  {
    termEn: "Nakshatra",
    termHi: "नक्षत्र",
    defEn: "A lunar mansion in Vedic astrology. There are 27 main nakshatras, each adding a finer layer beyond the zodiac sign.",
    defHi: "वैदिक ज्योतिष का चंद्र-मंडल विभाजन। 27 मुख्य नक्षत्र माने जाते हैं, जो राशि से आगे की सूक्ष्म परत जोड़ते हैं।",
  },
  {
    termEn: "Navamsa",
    termHi: "नवमांश",
    defEn: "The D9 divisional chart. It is widely used for dharma, marriage, inner strength, and the deeper maturity of planets.",
    defHi: "डी9 वर्ग कुंडली। इसे धर्म, विवाह, आंतरिक बल और ग्रहों की गहरी परिपक्वता समझने के लिए व्यापक रूप से उपयोग किया जाता है।",
  },
  {
    termEn: "Neecha",
    termHi: "नीच",
    defEn: "Debilitation, or a sign position where a planet is considered weak or uncomfortable in classical dignity terms.",
    defHi: "नीचत्व, अर्थात वह राशि-स्थिति जहाँ शास्त्रीय दृष्टि से ग्रह को निर्बल या असहज माना जाता है।",
  },
  {
    termEn: "Panchang",
    termHi: "पंचांग",
    defEn: "The five-limbed Hindu calendar system comprising tithi, vara, nakshatra, yoga, and karana.",
    defHi: "पाँच अंगों वाला पारंपरिक हिंदू कालगणना तंत्र: तिथि, वार, नक्षत्र, योग और करण।",
  },
  {
    termEn: "Papa Graha",
    termHi: "पाप ग्रह",
    defEn: "A natural malefic planet such as Saturn, Mars, Rahu, or Ketu in many contexts. Their results still depend on chart function and strength.",
    defHi: "प्राकृतिक पाप ग्रह, जैसे कई संदर्भों में शनि, मंगल, राहु या केतु। फिर भी इनके फल कुंडली में उनके कार्य और बल पर निर्भर करते हैं।",
  },
  {
    termEn: "Pitra Dosha",
    termHi: "पितृ दोष",
    defEn: "A chart pattern associated with ancestral themes or obligations. It is judged through combinations, not by one factor alone.",
    defHi: "वंशगत या पितृ-विषयों से जुड़ा कुंडली-पैटर्न। इसे किसी एक कारक से नहीं, बल्कि संयोजनों से परखा जाता है।",
  },
  {
    termEn: "Purva Punya",
    termHi: "पूर्व पुण्य",
    defEn: "Merit carried from past actions, often discussed through the 5th house and supportive blessings in the chart.",
    defHi: "पूर्व कर्मों से आया पुण्य, जिसे प्रायः पंचम भाव और कुंडली के सहायक आशीर्वादों के माध्यम से देखा जाता है।",
  },
  {
    termEn: "Rahu Kaal",
    termHi: "राहु काल",
    defEn: "A daily period traditionally avoided for beginning important tasks. It is one of the common timing filters in everyday astrology.",
    defHi: "दैनिक समयखंड जिसे महत्वपूर्ण कार्य शुरू करने के लिए प्रायः टाला जाता है। यह दैनिक ज्योतिष में उपयोग होने वाले सामान्य समय-फिल्टरों में से एक है।",
  },
  {
    termEn: "Rashi",
    termHi: "राशि",
    defEn: "A zodiac sign. In Vedic astrology, the 12 rashis are usually read in a sidereal framework.",
    defHi: "राशि, अर्थात राशि चक्र का एक चिन्ह। वैदिक ज्योतिष में 12 राशियाँ सामान्यतः साइडेरियल पद्धति में पढ़ी जाती हैं।",
  },
  {
    termEn: "Sade Sati",
    termHi: "साढ़े साती",
    defEn: "A Saturn transit cycle around the Moon sign lasting roughly seven and a half years. Its effects vary widely by chart and timing.",
    defHi: "चंद्र राशि के आसपास शनि का लगभग साढ़े सात वर्ष का गोचर चक्र। इसके फल कुंडली और समयानुसार बहुत अलग हो सकते हैं।",
  },
  {
    termEn: "Shadbala",
    termHi: "षड्बल",
    defEn: "A classical sixfold strength system used to assess planetary power in a chart.",
    defHi: "कुंडली में ग्रहों की शक्ति मापने की शास्त्रीय छह-आधार वाली प्रणाली।",
  },
  {
    termEn: "Shubha Graha",
    termHi: "शुभ ग्रह",
    defEn: "A natural benefic planet such as Jupiter or Venus in many contexts. Even benefics must still be judged by chart function.",
    defHi: "प्राकृतिक शुभ ग्रह, जैसे कई संदर्भों में गुरु या शुक्र। फिर भी शुभ ग्रहों को भी कुंडली में उनके कार्य के अनुसार ही परखा जाता है।",
  },
  {
    termEn: "Tithi",
    termHi: "तिथि",
    defEn: "A lunar day measured by the angular distance between the Sun and Moon. It is one of the five limbs of Panchang.",
    defHi: "सूर्य और चंद्र के बीच कोणीय दूरी से मापी जाने वाली चंद्र-दिवस इकाई। यह पंचांग के पाँच अंगों में से एक है।",
  },
  {
    termEn: "Upaya",
    termHi: "उपाय",
    defEn: "A remedial measure suggested in response to chart imbalance, often involving prayer, discipline, charity, mantra, or ritual.",
    defHi: "कुंडली के असंतुलन के उत्तर में सुझाया गया उपाय, जिसमें प्रार्थना, अनुशासन, दान, मंत्र या अनुष्ठान शामिल हो सकते हैं।",
  },
  {
    termEn: "Vakri",
    termHi: "वक्री",
    defEn: "Retrograde motion as seen from Earth. Vakri planets are often interpreted as inward, delayed, unusual, or intensified in expression.",
    defHi: "पृथ्वी से देखी जाने वाली प्रतिगामी गति। वक्री ग्रहों को प्रायः भीतर की ओर, विलंबित, असामान्य या तीव्र अभिव्यक्ति वाला माना जाता है।",
  },
  {
    termEn: "Vimshottari",
    termHi: "विंशोत्तरी",
    defEn: "The most widely used dasha system in Jyotish, based on the Moon’s nakshatra at birth and a total cycle of 120 years.",
    defHi: "ज्योतिष की सर्वाधिक प्रचलित दशा प्रणाली, जो जन्म के समय चंद्र नक्षत्र पर आधारित होती है और कुल 120 वर्षों का चक्र रखती है।",
  },
  {
    termEn: "Yoga",
    termHi: "योग",
    defEn: "A planetary combination that creates a distinct pattern or result in the horoscope. Yogas can be supportive, obstructive, or mixed.",
    defHi: "कुंडली में कोई विशिष्ट पैटर्न या फल देने वाला ग्रह-संयोजन। योग शुभ, बाधक या मिश्रित हो सकते हैं।",
  },
  {
    termEn: "Yogakaraka",
    termHi: "योगकारक",
    defEn: "A planet that becomes especially auspicious for a particular ascendant by ruling a kendra and a trikona.",
    defHi: "ऐसा ग्रह जो किसी विशेष लग्न के लिए केंद्र और त्रिकोण का स्वामी होकर विशेष रूप से शुभ बन जाता है।",
  },
];

export const GLOSSARY_TERMS: { term: LocaleText; definition: LocaleText }[] = TERMS.map(
  ({ termEn, termHi, defEn, defHi }) => ({
    term: L(termEn, termHi),
    definition: L(defEn, defHi),
  })
);
