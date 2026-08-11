#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Replace three blog post slug groups in posts.ts (en + hi)."""

import re
from pathlib import Path

POSTS_PATH = Path("/Volumes/My Work/Development/vedic/src/lib/blog/posts.ts")

# fmt: off
POSTS = [
  {
    "slug": "lagna-vs-rashi",
    "locale": "en",
    "title": "Lagna vs Moon Sign: What Each Reveals in Vedic Charts",
    "description": "Lagna vs Moon sign in Vedic astrology: how Ascendant and Chandra rashi differ, what each reveals about body and mind, and how to read them together calmly.",
    "date": "2026-03-08",
    "content": [
      "Lagna vs Moon sign is one of the first distinctions worth learning in Vedic astrology. Both are calculated from your birth data — not guessed from a magazine column — yet they describe different layers of the chart. Lagna (Ascendant) is the sign rising on the eastern horizon at birth; Moon sign (Chandra rashi) is the sidereal sign occupied by the Moon at that same moment. Understanding both calmly prevents the common mistake of treating one label as your entire identity.",
      "Lagna is the anchor of the house system in whole-sign Jyotish. It sets the first house and therefore assigns every planet to a life domain: career, marriage, health, wealth and so on. Physically and temperamentally, Lagna relates to the body, vitality, first impressions and the default lens through which you meet new situations. Because the Ascendant moves through all twelve signs in roughly twenty-four hours, it is the most time-sensitive point in the chart — which is why birth time accuracy matters so much.",
      "Moon sign describes the mind (manas): emotional habits, memory, nourishment, instinctive reactions and how you process experience inwardly. In daily life many people recognise their Moon sign qualities more quickly than Lagna themes, because feelings arrive before abstract purpose. Your Moon's nakshatra also starts the Vimshottari dasha sequence, linking Moon sign to life-period timing even when house-based topics are read from Lagna.",
      "Sun sign (Surya rashi) is a third reference point — the sidereal sign of the Sun — relating to purpose, authority and consistent identity themes. This article focuses on Lagna vs Moon sign, but skilled reading weaves all three together. None replaces the others; each answers a different question about the same birth moment calculated with Lahiri ayanamsa on a reputable platform.",
      "How Lagna is calculated: software converts your local birth time and place into sidereal coordinates, finds the degree on the eastern horizon, and maps that to a sign. The entire house grid follows. A shift of twenty or thirty minutes near a sign boundary can change Lagna, which in turn reassigns every house placement. That is calculated precision — not intuition — and it is why hospitals record birth time to the minute.",
      "How Moon sign is calculated: the Moon's sidereal longitude at birth falls within one of twelve signs, each spanning thirty degrees. The Moon moves faster than the Ascendant — roughly two and a half days per sign — so Moon sign is less sensitive to small time errors than Lagna, though nakshatra position still benefits from accurate time. When birth time is uncertain, astrologers may lean more on Moon and Sun positions while noting that house analysis is provisional.",
      "In practice, begin a full-chart reading with Lagna because houses derive from it. Examine Lagna lord condition: the planet ruling the Ascendant sign, its house, dignity and aspects. A steady Lagna and Lagna lord support the entire chart the way a strong foundation supports a building. Then layer Moon sign for emotional patterns and dasha starting point, and Sun sign for purpose and authority themes.",
      "When reading Moon sign, ask how you feel, react and recover. Moon in earth signs may seek stability; Moon in fire signs may need movement and expression; Moon in air signs may process through dialogue; Moon in water signs may need emotional depth and retreat. Combine this with house placement: Moon in the fourth emphasises home and mother themes; Moon in the tenth may publicise emotional life through career visibility.",
      "Transits affect both anchors differently. Saturn transiting the Moon sign (including Sade Sati phases) is watched for emotional restructuring — not as a verdict of doom, but as a season that invites patience and honest self-care. Jupiter crossing Lagna often correlates with expansion, learning and renewed confidence in how you present yourself. Reading transits alongside your active dasha keeps timing grounded in the full chart.",
      "Compatibility discussions use Moon sign heavily — Ashtakoot matching compares Moon nakshatras — while marriage house analysis uses each person's Lagna chart. A high gun milan score complements but does not replace examining seventh-house lords, Venus condition and Navamsa (D9). For relationships, integrate Lagna (life structure), Moon (emotional fit) and dasha (timing of themes).",
      "What not to conclude: do not rank Moon sign as \"more true\" because it feels familiar, and do not ignore birth time and treat Moon sign as your only sign. Without accurate time, house-based predictions — career from the tenth, marriage from the seventh, children from the fifth — become unreliable. Also avoid fatalism: Lagna vs Moon sign differences describe tendencies, not fixed destiny.",
      "Another common error is comparing Vedic Moon sign to a Western tropical Sun sign from a horoscope column. They are different systems. Your Vedic chart is calculated sidereally; a newspaper Sun sign is often tropical and Sun-based only. Comparing labels across systems without conversion creates confusion that has nothing to do with your actual kundli.",
      "A balanced self-study session names Lagna, Moon sign and Sun sign, notes the active Mahadasha and Antardasha, and checks one or two relevant transits. That layered approach respects tradition and gives you actionable language — not a single label to carry as fate. Jyotish works best when it clarifies choices and timing, not when it triggers fear.",
      "Ready to see your own Lagna and Moon sign together? Generate a free Vedic Kundli with your date, time and place of birth at /en/kundli — calculated with Lahiri ayanamsa, not guessed. For deeper study of the Ascendant, visit /en/learn/lagna. Bring your chart to /en/chat-with-astrologer when you want a calm second opinion on how Lagna and Moon sign interact in your life.",
      "Q: Which is more important — Lagna or Moon sign? A: Neither replaces the other. Lagna drives houses and physical life structure; Moon sign drives mind, emotions and dasha starting point. Full-chart reading uses both, plus Sun sign, dasha and transits. Treating one as supreme oversimplifies Jyotish.",
      "Q: Can my Lagna and Moon sign be the same? A: Yes. When they match, body and mind themes may express more uniformly — though house placements of planets still diversify the picture. When they differ, you may feel an inner contrast between how you appear (Lagna) and how you feel (Moon), which is normal and readable in the chart.",
      "Q: Why does my Vedic Moon sign differ from my Western sign? A: Vedic astrology uses the sidereal zodiac with ayanamsa correction; Western tropical astrology ties signs to seasons. The systems have drifted apart over centuries. Your Vedic Moon sign is calculated from actual star positions — compare like with like when learning.",
    ],
  },
  {
    "slug": "lagna-vs-rashi",
    "locale": "hi",
    "title": "लग्न बनाम चंद्र राशि: वैदिक चार्ट में क्या दिखता है",
    "description": "लग्न बनाम चंद्र राशि — वैदिक ज्योतिष में उदय और चंद्र राशि का अंतर, शरीर और मन क्या दर्शाते हैं; दोनों को संतुलित और गणना-आधारित पढ़ना कैसे सीखें।",
    "date": "2026-03-08",
    "content": [
      "लग्न बनाम चंद्र राशि वैदिक ज्योतिष में सबसे पहले सीखने योग्य अंतरों में से एक है। दोनों आपके जन्म विवरण से गणना होते हैं — पत्रिका स्तंभ से अनुमान नहीं — फिर भी चार्ट की अलग परतें बताते हैं। लग्न (उदय) जन्म क्षण में पूर्व क्षितिज पर उदय होती राशि है; चंद्र राशि उसी क्षण चंद्रमा की निरयण राशि है। दोनों को शांत समझने से एक लेबल को पूरी पहचान मानने की सामान्य गलती टलती है।",
      "लग्न पूर्ण-राशि ज्योतिष में भाव प्रणाली का लंगर है। यह प्रथम भाव तय करता है और हर ग्रह को जीवन क्षेत्र — करियर, विवाह, स्वास्थ्य, धन — में रखता है। शारीरिक और स्वभाव से लग्न शरीर, जीवन शक्ति, पहली छाप और नई परिस्थितियों से मिलने के तरीके से जुड़ा है। उदय लगभग चौबीस घंटे में बारह राशियों से गुजरता है, इसलिए यह सबसे समय-संवेदनशील बिंदु है — जन्म समय की सटीकता इसीलिए महत्वपूर्ण है।",
      "चंद्र राशि मन (मानस) बताती है: भावनात्मक आदत, स्मृति, पोषण, सहज प्रतिक्रिया और अनुभव को भीतर से कैसे पचाया जाता है। दैनिक जीवन में कई लोग चंद्र राशि के गुण लग्न से पहले पहचानते हैं, क्योंकि भावना उद्देश्य से पहले आती है। चंद्र का नक्षत्र विंशोत्तरी दशा क्रम भी शुरू करता है, इसलिए चंद्र राशि जीवन काल समय से जुड़ी रहती है, भले भाव-विषय लग्न से पढ़े जाएँ।",
      "सूर्य राशि तीसरा संदर्भ बिंदु है — सूर्य की निरयण राशि — उद्देश्य, अधिकार और स्थिर पहचान विषयों से जुड़ी। यह लेख लग्न बनाम चंद्र राशि पर केंद्रित है, पर कुशल पठन तीनों को जोड़ता है। कोई दूसरे की जगह नहीं लेता; प्रत्येक एक ही जन्म क्षण के बारे में अलग प्रश्न का उत्तर देता है, लाहिरी अयनांश से गणना होती है।",
      "लग्न की गणना कैसे होती है: सॉफ्टवेयर स्थानीय जन्म समय और स्थान को निरयण निर्देशांक में बदलकर पूर्व क्षितिज का अंश निकालता है और राशि तय करता है। पूरा भाव-जाल इसी से बनता है। सीमा पर बीस-तीस मिनट का अंतर लग्न बदल सकता है, जिससे हर ग्रह की भाव स्थिति बदल जाती है। यह गणना-आधारित सटीकता है — अनुमान नहीं — इसीलिए अस्पताल मिनट-स्तर समय दर्ज करते हैं।",
      "चंद्र राशि की गणना: जन्म पर चंद्रमा की निरयण देशांतर बारह राशियों में से एक में आता है, प्रत्येक तीस अंश की। चंद्रमा उदय से तेज़ चलता है — लगभग ढाई दिन प्रति राशि — इसलिए छोटी समय त्रुटि से चंद्र राशि कम प्रभावित होती है, पर नक्षत्र स्थिति को सटीक समय फायदेमंद है। जन्म समय अनिश्चित हो तो ज्योतिषी चंद्र और सूर्य पर अधिक भरोसा कर सकते हैं, यह नोट करते हुए कि भाव-विश्लेषण अस्थायी है।",
      "व्यवहार में पूर्ण चार्ट पठन लग्न से शुरू करें क्योंकि भाव इसी से बनते हैं। लग्नेश — उदय राशि का स्वामी — की स्थिति, भाव, गरिमा और दृष्टि देखें। स्थिर लग्न और लग्नेश पूरे चार्ट को नींव की तरह सहारा देते हैं। फिर चंद्र राशि से भावनात्मक पैटर्न और दशा आरंभ, सूर्य राशि से उद्देश्य और अधिकार विषय जोड़ें।",
      "चंद्र राशि पढ़ते समय पूछें: आप कैसा महसूस करते, कैसे प्रतिक्रिया देते और कैसे संतुलन पाते हैं। पृथ्वी राशि में चंद्र स्थिरता चाह सकता है; अग्नि में गति और अभिव्यक्ति; वायु में संवाद; जल में भावनात्मक गहराई। भाव स्थिति से मिलाएँ: चतुर्थ में चंद्र घर-माता; दशम में करियर के माध्यम से भावनात्मक जीवन दृश्य हो सकता है।",
      "गोचर दोनों बिंदुओं को अलग प्रभावित करता है। चंद्र राशि पर शनि (साढ़े साती सहित) भावनात्मक पुनर्गठन के लिए देखा जाता है — विनाश का फैसला नहीं, बल्कि धैर्य और ईमानदार आत्म-देखभाल का मौसम। लग्न पर गुरु गोचर अक्सर विस्तार, सीख और आत्म-प्रस्तुति में नवीन आत्मविश्वास लाता है। सक्रिय दशा के साथ गोचर पढ़ने से समय पूर्ण चार्ट में स्थिर रहता है।",
      "अनुकूलता चर्चा में चंद्र राशि प्रमुख — अष्टकूट में चंद्र नक्षत्र तुलना — विवाह भाव विश्लेषण में प्रत्येक की लग्न कुंडली। उच्च गुण मिलान सप्तमेश, शुक्र और नवमांश (D9) की जाँच का विकल्प नहीं — पूरक है। संबंधों में लग्न (जीवन संरचना), चंद्र (भावनात्मक अनुकूलता) और दशा (विषयों का समय) एकीकृत करें।",
      "क्या निष्कर्ष न निकालें: चंद्र राशि को \"अधिक सच\" न मानें क्योंकि परिचित लगती है, और जन्म समय नज़रअंदाज़ करके केवल चंद्र राशि को अपनी एकमात्र राशि न मानें। सटीक समय के बिना भाव-आधारित भविष्यवाणी — दशम से करियर, सप्तम से विवाह, पंचम से संतान — कम विश्वसनीय। भाग्यवाद से भी बचें: लग्न बनाम चंद्र राशि अंतर प्रवृत्ति बताते हैं, अटल भाग्य नहीं।",
      "एक और सामान्य भ्रम: वैदिक चंद्र राशि की तुलना पश्चिमी ट्रॉपिकल सूर्य राशि से करना। ये अलग प्रणालियाँ हैं। वैदिक चार्ट निरयण से गणित; अखबारी सूर्य राशि अक्सर ट्रॉपिकल और केवल सूर्य-आधारित। बिना रूपांतरण प्रणालियों के लेबल तुलना करने से भ्रम होता है, जो आपकी वास्तविक कुंडली से असंबंधित है।",
      "संतुलित स्व-अध्ययन सत्र लग्न, चंद्र और सूर्य राशि नामित करता है, सक्रिय महादशा और अंतरदशा नोट करता है, एक-दो प्रासंगिक गोचर देखता है। यह परंपरा का सम्मान करता है और कार्य योग्य भाषा देता है — भाग्य के रूप में एक लेबल नहीं। ज्योतिष तब सर्वोत्तम जब वह विकल्प और समय स्पष्ट करे, भय न उगाहे।",
      "अपना लग्न और चंद्र राशि एक साथ देखने के लिए तैयार? जन्म तिथि, समय और स्थान से /hi/kundli पर मुफ्त वैदिक कुंडली बनाएँ — लाहिरी अयनांश से गणना, अनुमान नहीं। उदय के गहन अध्ययन के लिए /hi/learn/lagna देखें। शांत दूसरी राय के लिए /hi/chat-with-astrologer पर अपना चार्ट लाएँ।",
      "प्र: लग्न या चंद्र राशि — कौन अधिक महत्वपूर्ण? उ: कोई दूसरे की जगह नहीं लेता। लग्न भाव और शारीरिक संरचना; चंद्र राशि मन, भावना और दशा आरंभ। पूर्ण पठन में दोनों, सूर्य राशि, दशा और गोचर — एक को सर्वोच्च मानना ज्योतिष को सरल बनाता है।",
      "प्र: क्या मेरा लग्न और चंद्र राशि समान हो सकते हैं? उ: हाँ। मेल खाने पर शरीर और मन विषय एकरूप प्रकट हो सकते हैं — पर ग्रह भाव स्थिति चित्र विविध रखती है। अलग होने पर उदय (लग्न) और भाव (चंद्र) के बीच आंतरिक अंतर सामान्य और चार्ट में पढ़ने योग्य है।",
      "प्र: वैदिक चंद्र राशि पश्चिमी राशि से क्यों भिन्न? उ: वैदिक ज्योतिष निरयण राशि और अयनांश शोध उपयोग करता है; पश्चिमी ट्रॉपिकल ऋतुओं से जोड़ता है। सदियों में दोनों अलग हो गए। वैदिक चंद्र राशि वास्तविक तारा स्थिति से गणना — सीखते समय समान प्रणाली की तुलना करें।",
    ],
  },
  {
    "slug": "vimshottari-dasha-basics",
    "locale": "en",
    "title": "Vimshottari Dasha Explained: Life Period Timing Basics",
    "description": "Vimshottari dasha explained: how the 120-year cycle starts from Moon nakshatra, Mahadasha and Antardasha work, and how to read life timing in your chart calmly.",
    "date": "2026-03-15",
    "content": [
      "Vimshottari dasha explained simply: it is the most widely used life-period system in North Indian Jyotish, mapping when chart themes are more likely to surface. Your birth kundli describes tendencies; dasha describes timing — calculated from the Moon's nakshatra at birth, not guessed from a calendar. This guide covers how the cycle works, practical reading steps, common mistakes, and calm ways to explore your timing.",
      "The full Vimshottari cycle spans 120 years, divided among nine grahas in a fixed order: Ketu 7 years, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19 and Mercury 17. No one lives through all periods; the sequence begins at birth and continues through life. Each planet's chapter colours experience with its natural significations — discipline for Saturn, expansion for Jupiter, desire and disruption for Rahu, and so on.",
      "The starting point is the Moon's nakshatra at birth — each of the twenty-seven nakshatras is ruled by a planet that begins the sequence. Software calculates how much of that planet's Mahadasha remains based on the Moon's exact degree within the nakshatra. Birth time precision therefore affects dasha start, not only Lagna. A few minutes can shift the balance of the opening period when the Moon sits near a nakshatra boundary.",
      "Mahadasha is the major chapter, often lasting several years. When you say you are in Saturn Mahadasha, Saturn's themes — structure, delay, responsibility, karma — tint the whole era regardless of shorter sub-periods inside it. Reading Mahadasha alone is like reading a book chapter title: useful, but incomplete without the paragraphs inside. Note when your Mahadasha changes — those dates are calculated from birth, not guessed — and read each new chapter through house rulerships in your kundli.",
      "Antardasha subdivides each Mahadasha among the same nine planets in the same order, proportional to their full lengths. Within Jupiter Mahadasha you pass through Jupiter–Jupiter, then Jupiter–Saturn, Jupiter–Mercury and onward. Antardasha tells you which planet's flavour is loudest inside the major chapter — the detail within the season.",
      "Pratyantar dasha and finer divisions exist for advanced and muhurta-level timing. For everyday planning, Mahadasha and Antardasha are the practical pair — year-scale chapters and month-scale accents. Your kundli report should show both, calculated from ephemeris data with Lahiri ayanamsa, so you can align reading with the present moment.",
      "Each planet performs differently depending on natal dignity — own sign, exaltation, debilitation, house placement and aspects. Saturn Mahadasha feels different with a well-placed Saturn in the tenth house versus Saturn debilitated in the fourth. Always read dasha through the birth chart, never from generic internet lists that claim one dasha is always good or bad.",
      "Functional benefics and malefics depend on Lagna. Mars may be challenging for Cancer Lagna but a yoga karaka for Capricorn Lagna. Dasha results follow that chart-specific logic. A planet strong in absolute terms may still rule difficult houses for your Ascendant — context decides whether its period supports or tests you.",
      "Transits activate dasha promises. A marriage indication in Venus Antardasha may crystallise when Jupiter transits the seventh house or aspects the seventh lord. Saturn transiting the Moon often adds emotional weight during an already heavy Saturn sub-period. Think of dasha as the script and transits as the staging — both matter, neither alone tells the full story.",
      "Dasha sandhi — the junction between two Mahadashas — is traditionally watched as a transition zone. Themes from the closing period may linger while new ones gradually rise. Retrograde planets in dasha can internalise or delay themes; Rahu and Ketu sub-periods may bring sudden turns or spiritual pivots depending on house placement — change seasons, not curses.",
      "In practice, note your current Mahadasha and Antardasha, then ask which houses those planets rule and occupy in your chart. A Mercury Antardasha during Jupiter Mahadasha emphasises different topics if Mercury rules your fourth house versus your eighth. Link dasha lords to house significations for grounded reading.",
      "Children and education themes often surface through fifth-house lords during relevant sub-periods; tenth-house periods may highlight career moves when transits agree. Marriage timing typically needs seventh-house analysis plus Navamsa (D9), not Mahadasha alone. Keeping a simple journal of major events alongside dasha dates helps you see patterns in your own life — calculated reflection, not superstition.",
      "What not to conclude: do not treat dasha as fate that removes agency. Favourable Venus periods still need communication and choice; challenging Saturn periods can build lasting structure if you cooperate with discipline. Avoid panic purchases of remedies the moment a \"bad dasha\" is named — timing awareness should clarify effort, not trigger fear spending.",
      "Also avoid comparing your dasha to someone else's as if longer Venus always means better life. Chart quality, effort and context differ. Online calculators display periods; interpretation requires seeing the whole kundli — Lagna, yogas, transits and divisional charts for marriage or career when events matter.",
      "For event-level timing — marriage window, job change, relocation — consult an astrologer who combines dasha, transits and divisional charts such as Navamsa (D9) for relationships or Dashamsa (D10) for career. Calculated dasha tables show the seasons; skilled reading shows how those seasons meet your unique chart without fear or fatalism.",
      "Explore your current periods with calculated precision at /en/calculators/vimshottari-dasha or generate a full kundli at /en/kundli that includes Mahadasha and Antardasha tables. For structured learning, visit /en/learn/nakshatras — dasha begins from the Moon's nakshatra. Questions about your active chapter are welcome at /en/chat-with-astrologer. Bring your birth time and place so results stay calculated, not guessed.",
      "Q: How is Vimshottari dasha calculated? A: From the Moon's nakshatra at birth. Each nakshatra has a ruling planet; software computes the remaining balance of that planet's Mahadasha from the Moon's exact degree, then follows the fixed nine-planet sequence for life.",
      "Q: Can dasha change if birth time is wrong? A: Yes, especially near nakshatra boundaries or when time error shifts the Moon's nakshatra. Even small shifts change the opening balance. Use the most accurate birth time available and note uncertainty when timing is critical.",
      "Q: Is Rahu or Saturn dasha always difficult? A: No. Results depend on house rulership, placement, aspects and transits for your Lagna. Generic fear labels mislead. Read each period through your full chart with calm, chart-specific analysis.",
    ],
  },
  {
    "slug": "vimshottari-dasha-basics",
    "locale": "hi",
    "title": "विंशोत्तरी दशा समझें: जीवन काल समय की शांत मार्गदर्शिका",
    "description": "विंशोत्तरी दशा — 120 वर्ष चक्र चंद्र नक्षत्र से कैसे शुरू होता है, महादशा और अंतरदशा कैसे काम करती हैं, और अपने चार्ट में समय कैसे शांत और गणना-आधारित पढ़ें।",
    "date": "2026-03-15",
    "content": [
      "विंशोत्तरी दशा सरल शब्दों में: उत्तर भारतीय ज्योतिष में सबसे अधिक प्रचलित जीवन काल प्रणाली, जो बताती है चार्ट विषय कब अधिक प्रकट होने की संभावना है। जन्म कुंडली प्रवृत्ति बताती है; दशा समय — जन्म के चंद्र नक्षत्र से गणना, कैलेंडर से अनुमान नहीं। महादशा और अंतरदशा शांत समझने से योजना बिना भय के होती है।",
      "पूर्ण विंशोत्तरी चक्र 120 वर्ष का है, नौ ग्रहों में निश्चित क्रम से: केतु 7, शुक्र 20, सूर्य 6, चंद्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17। कोई सभी अवधियाँ नहीं जीता; क्रम जन्म से शुरू होकर जीवन भर चलता है। प्रत्येक ग्रह का अध्याय अपने प्राकृतिक कारकों से अनुभव रंगता है — शनि से अनुशासन, गुरु से विस्तार, राहु से इच्छा और उथल-पुथल।",
      "आरंभ बिंदु जन्म के चंद्र नक्षत्र है — सत्ताईस नक्षत्रों में से प्रत्येक का स्वामी ग्रह होता है जो क्रम शुरू करता है। सॉफ्टवेयर नक्षत्र के भीतर चंद्र के सटीक अंश से उस ग्रह की महादशा का शेष भाग गणित करता है। इसलिए जन्म समय की सटीकता दशा आरंभ को प्रभावित करती है, केवल लग्न को नहीं। नक्षत्र सीमा पर कुछ मिनट प्रारंभिक अवधि बदल सकते हैं।",
      "महादशा बड़ा अध्याय है, अक्सर कई वर्ष। जब कहें आप शनि महादशा में हैं, शनि के विषय — संरचना, विलंब, जिम्मेदारी, कर्म — पूरे युग को रंगते हैं, भीतर की छोटी उप-अवधि चाहे जो हो। केवल महादशा पढ़ना अध्याय शीर्षक पढ़ने जैसा — उपयोगी, पर भीतर के अनुच्छेदों के बिना अधूरा।",
      "अंतरदशा प्रत्येक महादशा को उन्हीं नौ ग्रहों में, उन्हीं क्रम में, पूर्ण लंबाई के अनुपात में बाँटती है। गुरु महादशा में गुरु-गुरु, फिर गुरु-शनि, गुरु-बुध — इस क्रम में। अंतरदशा बताती है बड़े अध्याय में किस ग्रह का स्वर तीव्र है — ऋतु के भीतर की बारीकी।",
      "प्रत्यंतर और सूक्ष्म विभाजन उन्नत और मुहूर्त स्तर के लिए हैं। रोज़मर्रा योजना में महादशा और अंतरदशा व्यावहारिक जोड़ी — वर्ष-स्तर अध्याय और माह-स्तर स्वर। कुंडली रिपोर्ट दोनों दिखाए, लाहिरी अयनांश से गणित, ताकि पठन वर्तमान क्षण से जुड़े।",
      "प्रत्येक ग्रह जन्म कुंडली की गरिमा — स्वराशि, उच्च, नीच, भाव, दृष्टि — के अनुसार अलग परिणाम देता है। दशम में अच्छे शनि वाले के लिए शनि महादशा चतुर्थ में नीच शनि वाले से भिन्न। दशा को हमेशा जन्म चार्ट से पढ़ें, कभी सामान्य सूची से नहीं जो कहे एक दशा हमेशा अच्छी या बुरी।",
      "कारक शुभ-अशुभ लग्न पर निर्भर। मंगल कर्क लग्न के लिए कठिन, मकर लग्न के लिए योगकारक। दशा परिणाम इसी चार्ट-विशिष्ट तर्क से। पूर्ण रूप से मजबूत ग्रह भी कठिन भावों का स्वामी हो सकता है — संदर्भ तय करता है अवधि सहारा देती है या परखती है।",
      "गोचर दशा वादे सक्रिय करते हैं। शुक्र अंतरदशा में विवाह संकेत सप्तम भाव पर गुरु गोचर या सप्तमेश दृष्टि पर स्पष्ट हो सकता है। चंद्र पर शनि गोचर पहले से भारी शनि उप-अवधि में भावनात्मक बोझ जोड़ सकता है। दशा पटकथा; गोचर मंच — दोनों महत्वपूर्ण, कोई अकेला पूरी कहानी नहीं।",
      "दशा संधि — दो महादशाओं का संगम — परंपरा में संक्रमण क्षेत्र। समापन अवधि के विषय बने रह सकते हैं, नए धीरे उभरते हैं। कुछ ज्योतिषी सीमा पर अंतिम और प्रथम अंतरदशा स्वामी पर विशेष ध्यान देते हैं। संधि को समायोजन समय मानें, स्वतः संकट नहीं।",
      "व्यवहार में वर्तमान महादशा और अंतरदशा नोट करें, फिर पूछें वे ग्रह आपके चार्ट में कौन-से भाव के स्वामी और निवासी हैं। गुरु महादशा में बुध अंतरदशा अलग विषय जोर देती है यदि बुध चतुर्थ का स्वामी बनाम अष्टम का। दशा स्वामी को भाव कारक से जोड़ें।",
      "क्या निष्कर्ष न निकालें: दशा को ऐसा भाग्य न मानें जो सक्रियता हटा दे। अनुकूल शुक्र काल में भी संवाद और विकल्प चाहिए; चुनौतीपूर्ण शनि काल अनुशासन के साथ स्थायी संरचना बना सकता है। \"बुरी दशा\" सुनते ही उपाय की घबराहट खरीदारी से बचें — समय जागरूकता प्रयास स्पष्ट करे, भय खर्च न उगाहे।",
      "अपनी दशा की तुलना दूसरे से न करें जैसे लंबा शुक्र हमेशा बेहतर जीवन। चार्ट गुण, प्रयास और संदर्भ अलग। ऑनलाइन कैलकुलेटर अवधि दिखाते; व्याख्या पूरी कुंडली चाहती है — लग्न, योग, गोचर और विवाह या करियर के लिए वर्ग चार्ट।",
      "गणना-आधारित सटीकता से वर्तमान अवधि देखें: /hi/calculators/vimshottari-dasha या /hi/kundli पर पूर्ण कुंडली — महादशा और अंतरदशा सारणी सहित। संरचित सीखने के लिए /hi/learn/nakshatras — दशा चंद्र नक्षत्र से शुरू। सक्रिय अध्याय पर प्रश्न /hi/chat-with-astrologer पर।",
      "प्र: विंशोत्तरी दशा की गणना कैसे? उ: जन्म के चंद्र नक्षत्र से। प्रत्येक नक्षत्र का स्वामी ग्रह; सॉफ्टवेयर चंद्र के सटीक अंश से महादशा शेष गणित करता है, फिर नौ-ग्रह क्रम जीवन भर।",
      "प्र: गलत जन्म समय से दशा बदल सकती है? उ: हाँ, विशेषकर नक्षत्र सीमा पर या समय त्रुटि से नक्षत्र बदलने पर। छोटा अंतर भी प्रारंभिक शेष बदलता है। यथासंभव सटीक समय उपयोग करें; महत्वपूर्ण समय पर अनिश्चितता नोट करें।",
      "प्र: क्या राहु या शनि दशा हमेशा कठिन? उ: नहीं। परिणाम भाव स्वामित्व, स्थिति, दृष्टि और गोचर पर निर्भर — आपके लग्न के लिए। सामान्य भय लेबल भ्रामक। प्रत्येक अवधि पूर्ण चार्ट से शांत, विशिष्ट विश्लेषण से पढ़ें।",
    ],
  },
  {
    "slug": "when-to-seek-upchaar",
    "locale": "en",
    "title": "Astrology Remedies When to Seek: A Calm Jyotish Guide",
    "description": "Astrology remedies when to seek: when mantra, charity, lifestyle and gems help in Jyotish, when to consult an astrologer, and how to avoid fear-based over-use.",
    "date": "2026-03-22",
    "content": [
      "Astrology remedies when to seek is a practical question every Jyotish student eventually asks. Upchaar — mantra, charity, seva, lifestyle alignment and sometimes gemstones — are meant to support effort and mindset, not replace medicine, legal counsel or financial planning. This calm guide explains when upchaar helps, when to consult, what to avoid, and how to keep remedial work chart-specific and calculated.",
      "The first principle is chart specificity. A remedy helpful for Aries Lagna may not suit Virgo Lagna. Gemstones especially need caution: strengthening a planet that rules difficult houses can amplify problems rather than solve them. Never wear a ruby for the Sun or blue sapphire for Saturn without knowing whether that planet acts as functional benefic for your Ascendant — that judgement comes from the chart, not a generic list. The same rule applies to mantra intensity and charity type: match the planet, house and dasha you are supporting.",
      "Mantra japa — repetitive sacred sound — is among the safest broad remedies when pronunciation and intention are respectful. Planet or deity mantras traditionally align the mind with subtler rhythms. Consistency over months matters more than frantic seven-day bursts after a scary prediction. Mantra supports inner steadiness; it does not override another person's free will or guarantee lottery outcomes — results follow sustained practice, not panic.",
      "Charity (daan) directs planetary energy outward through generosity. Donating items associated with Saturn — oil, black sesame, service to elders — on Saturdays, or supporting students for Mercury themes, follows traditional correspondences. The spirit is humility and service, not transactional bribery of fate. Regular small acts often outperform one expensive ritual done in panic, and they keep remedial work aligned with character rather than fear.",
      "Lifestyle remedies are underrated and widely available. Saturn responds to discipline and routine; Mars to constructive physical activity; Moon to regular sleep and emotional honesty; Jupiter to study and teaching; Venus to art, harmony and balanced pleasure. Fasting, pilgrimage and seva may also support when chosen with guidance — Saturn periods to steady service, Jupiter to teaching sponsorship — but daily habit alignment often outperforms one-off symbolic fixes.",
      "Gemstones channel planetary symbolism through colour and mineral tradition. They work best when a planet is weak but functionally benefic — needing support, not when a malefic is already aggressive in the chart. Certification, correct metal, finger and day are part of classical protocol. Random purchase from fear marketing is the opposite of remedial Jyotish.",
      "When might remedies be worth exploring? During a heavy dasha of a challenging planet that also rules a stressed house; when repeated obstacles appear in one life area matching house significations; when a specific yoga suggests delay until support is offered; or when you want structured spiritual practice aligned with chart themes — not when someone frightens you into urgent spending.",
      "Consult an astrologer for remedies when you need prioritisation: one or two focused supports beat twelve done poorly. Share accurate birth data, describe your situation plainly, and ask why a remedy is suggested — which planet, which house, which dasha period. A calm practitioner explains chart logic; a fear seller skips straight to expensive puja without showing your kundli.",
      "Medical issues demand medical professionals first. Astrology may indicate periods of vulnerability or stress; remedies may support wellbeing alongside treatment — never instead of it. The same applies to mental health: therapy and compassionate support first; Jyotish as supplementary reflection. Remedies are partners to effort, not substitutes for care.",
      "Relationship remedies cannot force consent. Venus or seventh-house work may improve self-presentation and timing for meeting partners, but ethical Jyotish never promises to control another person's will. Beware totke marketed for manipulation. Work on your chart's relationship patterns and communication — not covert control of others.",
      "Career and business remedies often emphasise Mercury (trade, communication), Jupiter (expansion, wisdom) and Saturn (structure, persistence). Launching ventures during clearer dasha and transit windows beats symbolic fixes alone. Combine upchaar with skill-building, networking and financial planning — the chart shows seasons; your actions harvest them.",
      "Children and education themes link to the fifth house and Jupiter. Remedies here may involve study discipline, mentoring others or supporting children's learning — not only temple visits. Context from the full chart distinguishes delay from denial, and dasha periods show when such themes intensify. Patience plus consistent effort usually outlasts symbolic fixes without follow-through.",
      "What not to conclude: do not treat remedies as magic shields against all difficulty. Do not assume one gemstone fixes a complex chart pattern. Do not perform remedies from terror after a single alarming reading without second opinion. Fear-based remedy shopping — urgent expensive puja to avert unnamed disaster — is a red flag. Pause, verify your chart, seek calm guidance.",
      "Online kundli flags — Mangal dosha, Kaalsarp mentions, Sade Sati phases — are conversation starters, not automatic shopping lists. Personalised prioritisation in consultation prevents doing many remedies poorly. Track results over months — better sleep, steadier discipline, fewer reactive arguments — and remember upchaar deepens agency through symbol and habit, not fear-driven spending or superstition overload.",
      "If your chart shows challenging yogas or you enter a heavy Saturn or Rahu period, a short consultation can prioritise what actually helps for your Lagna and current dasha. Visit /en/chat-with-astrologer with your birth details. Review your chart at /en/kundli, learn remedial context at /en/learn/planets, and keep expectations grounded in effort plus time — calm consistency beats fear-driven ritual overload every time.",
      "Q: Should I wear gemstones without consultation? A: Not recommended. Gems strengthen planetary energies; if that planet rules difficult houses for your Lagna, effects can backfire. Chart-specific advice from a qualified astrologer is safer than shop recommendations or fear-based sales.",
      "Q: Can remedies replace medical treatment? A: No. Jyotish may highlight stress periods; mantra, charity or lifestyle may support wellbeing alongside professional care. Never delay diagnosis or treatment because a remedy was suggested.",
      "Q: How long before remedies show results? A: Traditional guidance looks at months of consistent practice — mantra, seva, habit change — not days. Subtle improvements in mood, discipline and relationships are realistic; guaranteed instant wealth, reconciliation or career jumps are not. Remedies support the work you already owe to your goals.",
    ],
  },
  {
    "slug": "when-to-seek-upchaar",
    "locale": "hi",
    "title": "ज्योतिष उपाय कब लें: शांत और संतुलित उपचार मार्गदर्शन",
    "description": "ज्योतिष उपाय कब लें — मंत्र, दान, जीवनशैली और रत्न कब सहायक हैं, परामर्श कब लें, और भय-आधारित अति-उपाय से कैसे बचें; गणना और संतुलन पर आधारित शांत दृष्टि।",
    "date": "2026-03-22",
    "content": [
      "ज्योतिष उपाय कब लें — यह प्रश्न हर गंभीर अध्ययनकर्ता पूछता है। उपचार — मंत्र, दान, सेवा, जीवनशैली और कभी-कभी रत्न — प्रयास और मनोदशा का सहारा हैं, चिकित्सा, कानूनी या वित्तीय योजना का विकल्प नहीं। शास्त्र उपचारात्मक उपकरण देते हैं; शांत उपयोग कुंडली-विशिष्टता और यथार्थवादी अपेक्षा चाहता है — भय से नहीं, गणना से।",
      "पहला सिद्धांत कुंडली-विशिष्टता। मेष लग्न को सहायक उपाय कन्या लग्न को अनुकूल न भी हो। रत्न विशेष सावधानी: कठिन भावों का स्वामी ग्रह मजबूत करने से समस्या बढ़ सकती है। यह जाने बिना सूर्य के लिए माणिक्य या शनि के लिए नीलम न पहनें कि वह ग्रह आपके उदय के लिए कारक शुभ है — निर्णय चार्ट से, सामान्य सूची से नहीं।",
      "मंत्र जप — पवित्र ध्वनि का पुनरावृत्ति — उच्चारण और संकल्प के सम्मान के साथ सबसे सुरक्षित व्यापक उपायों में है। ग्रह या देवता मंत्र परंपरा में मन को सूक्ष्म लय से मिलाते हैं। डरावनी भविष्यवाणी के बाद सात दिन की हड़बड़ी से अधिक महीनों की नियमितता। मंत्र भीतरी स्थिरता सहारा देता है; दूसरे की इच्छा नहीं थोपता, लॉटरी गारंटी नहीं।",
      "दान ग्रह ऊर्जा उदारता से बाहर मोड़ता है। शनि से जुड़ी वस्तुएँ — तेल, काले तिल, बड़ों की सेवा — शनिवार को, या बुध विषयों के लिए विद्यार्थियों की सहायता — पारंपरिक अनुकूलता। भाव दान और विनम्रता का, भाग्य की सौदेबाजी नहीं। नियमित छोटे कृत्य अक्सर घबराहट में एक महँगे अनुष्ठान से बेहतर।",
      "जीवनशैली उपाय कम मूल्याएँ जाते हैं और सुलभ हैं। शनि अनुशासन और दिनचर्या; मंगल रचनात्मक शारीरिक गतिविधि; चंद्र नियमित नींद और भावनात्मक ईमानदारी; गुरु अध्ययन और शिक्षण; शुक्र कला, सामंजस्य और संतुलित आनंद। दैनिक आदतें ग्रह प्रतीक से मिलाना प्रतीकात्मक से बिना व्यवहार परिवर्तन अक्सर बेहतर — प्रयास और प्रतीक, केवल प्रतीक नहीं।",
      "रत्न रंग और खनिज परंपरा से ग्रह प्रतीक चैनल करते हैं। सर्वोत्तम तब जब ग्रह कमजोर पर कारक शुभ — सहारा चाहिए, न कि जब अशुभ पहले से आक्रामक। प्रमाणन, धातु, उंगली, दिन शास्त्रीय प्रोटोकॉल। भय विपणन से यादृच्छिक खरीद उपचारात्मक ज्योतिष के विपरीत।",
      "उपाय कब लें? चुनौतीपूर्ण ग्रह की भारी दशा जो तनावग्रस्त भाव का स्वामी भी हो; एक जीवन क्षेत्र में बार-बार बाधा जो भाव कारक से मेल खाए; विशिष्ट योग विलंब सुझाए जब तक सहायता न मिले; या चार्ट विषयों से जुड़ी संरचित आध्यात्मिक साधना — न कि जब कोई तत्काल खर्च के लिए डराए।",
      "उपाय के लिए ज्योतिषी से परामर्श तब जब प्राथमिकता चाहिए: एक-दो केंद्रित सहायक बारह खराब से बेहतर। सटीक जन्म विवरण, स्थिति स्पष्ट बताएँ, पूछें उपाय क्यों — कौन सा ग्रह, भाव, दशा। शांत ज्योतिषी चार्ट तर्क समझाता; भय विक्रेता बिना कुंडली महँगी पूजा पर जाता है।",
      "चिकित्सा में पहले चिकित्सक। ज्योतिष कमजोरी या तनाव काल दिखा सकता है; उपाय उपचार के साथ कल्याण सहायक — उसके बजाय नहीं। मानसिक स्वास्थ्य: थेरेपी और करुणामय सहायता पहले; ज्योतिष पूरक चिंतन। उपाय प्रयास के साथी, देखभाल का विकल्प नहीं।",
      "संबंध उपाय सहमति थोप नहीं सकते। शुक्र या सप्तम भाव कार्य आत्म-प्रस्तुति और साथी मिलने के समय में सुधार; नैतिक ज्योतिष दूसरे की इच्छा नियंत्रित करने का वादा नहीं। हेर-फेर के टोटकों से सावधान। अपने चार्ट के संबंध पैटर्न और संवाद पर काम — छिपा नियंत्रण नहीं।",
      "करियर और व्यापार उपाय अक्सर बुध (व्यापार, संचार), गुरु (विस्तार, ज्ञान), शनि (संरचना, दृढ़ता) पर जोर। स्पष्ट दशा और गोचर खिड़की में उद्यम शुरू केवल प्रतीकात्मक से बेहतर। उपचार कौशल, संपर्क और वित्त योजना के साथ — चार्ट ऋतु दिखाता, कर्म फसल काटता।",
      "क्या निष्कर्ष न निकालें: उपाय को सभी कठिनाई से ढाल न मानें। एक रत्न जटिल चार्ट ठीक कर दे — ऐसा न सोचें। एक डरावनी पठन के बाद बिना दूसरी राय उपाय न करें। भय-आधारित उपाय खरीद — अनाम आपदा टालने तत्काल महँगी पूजा — चेतावनी। रुकें, चार्ट सत्यापित करें, शांत मार्गदर्शन लें।",
      "ऑनलाइन कुंडली ध्वज — मंगल दोष, कालसर्प, साढ़े साती — बातचीत के प्रारंभ बिंदु, स्वचालित खरीद सूची नहीं। परामर्श में व्यक्तिगत प्राथमिकता कई खराब उपाय से बचाती। महीनों में यथार्थवादी परिणाम: बेहतर नींद, कम प्रतिक्रियाशील झगड़े, अनुशासन से स्थिर आय — सूक्ष्म बदलाव, रातों-रात चमत्कार नहीं।",
      "यदि चार्ट चुनौती योग दिखाए या भारी शनि/राहु काल आए, संक्षिप्त परामर्श प्राथमिकता तय कर सकता है — आपके लग्न और दशा के अनुसार। /hi/chat-with-astrologer पर जन्म विवरण लाएँ। /hi/kundli पर चार्ट देखें, /hi/learn/planets पर संदर्भ सीखें, अपेक्षा प्रयास और समय में स्थिर रखें।",
      "प्र: बिना परामर्श रत्न पहनें? उ: अनुशंसित नहीं। रत्न ग्रह ऊर्जा मजबूत करते; यदि वह ग्रह कठिन भावों का स्वामी, प्रभाव उलट भी सकता। योग्य ज्योतिषी की चार्ट-विशिष्ट सलाह दुकान या भय बिक्री से सुरक्षित।",
      "प्र: क्या उपाय चिकित्सा का विकल्प? उ: नहीं। ज्योतिष तनाव काल दिखा सकता; मंत्र, दान या जीवनशैली पेशेवर देखभाल के साथ सहायक — उसके बजाय कभी नहीं। निदान या उपचार उपाय के कारण न टालें।",
      "प्र: उपाय के परिणाम कब? उ: परंपरा महीनों की नियमित साधना — मंत्र, सेवा, आदत — देखती है, दिन नहीं। मनोदशा, अनुशासन, संबंध में सूक्ष्म सुधार यथार्थवादी; तत्काल धन या मिलन का वादा नहीं।",
    ],
  },
]
# fmt: on

REPLACE_SLUGS = {
  "lagna-vs-rashi",
  "vimshottari-dasha-basics",
  "when-to-seek-upchaar",
}


def escape_ts_string(value: str) -> str:
  return value.replace("\\", "\\\\").replace('"', '\\"')


def post_to_ts(post: dict) -> str:
  lines = [
    "  {",
    f'    slug: "{post["slug"]}",',
    f'    locale: "{post["locale"]}",',
    f'    title: "{escape_ts_string(post["title"])}",',
    "    description:",
    f'      "{escape_ts_string(post["description"])}",',
    f'    date: "{post["date"]}",',
    "    content: [",
  ]
  for paragraph in post["content"]:
    lines.append(f'      "{escape_ts_string(paragraph)}",')
  lines.append("    ],")
  lines.append("  },")
  return "\n".join(lines)


def find_replacement_bounds(content: str) -> tuple[int, int]:
  start_marker = '  {\n    slug: "lagna-vs-rashi",'
  start = content.index(start_marker)
  end_pattern = re.compile(
    r'  \{\n    slug: "when-to-seek-upchaar",\n    locale: "hi",.*?\n  \},',
    re.DOTALL,
  )
  match = end_pattern.search(content, start)
  if not match:
    raise ValueError("Could not find end boundary for when-to-seek-upchaar (hi)")
  return start, match.end()


def count_words(text: str) -> int:
  return len(re.findall(r"\b[\w'-]+\b", text, flags=re.UNICODE))


def main() -> None:
  content = POSTS_PATH.read_text(encoding="utf-8")
  start, end = find_replacement_bounds(content)
  replacement = "\n".join(post_to_ts(post) for post in POSTS) + "\n"
  new_content = content[:start] + replacement + content[end:]

  untouched = re.search(
    r'slug: "what-is-vedic-kundli"[\s\S]*?locale: "en"[\s\S]*?date: "2026-03-01"',
    new_content,
  )
  if not untouched:
    raise ValueError("what-is-vedic-kundli entry missing or altered")

  POSTS_PATH.write_text(new_content, encoding="utf-8")
  print(f"Updated {POSTS_PATH}")
  print()

  for post in POSTS:
    slug = post["slug"]
    loc = post["locale"]
    paras = len(post["content"])
    title_len = len(post["title"])
    desc_len = len(post["description"])
    print(f"{slug} ({loc}): {paras} paragraphs | title={title_len} desc={desc_len}")
    if loc == "en":
      words = count_words("\n".join(post["content"]))
      print(f"  EN word count: {words}")

  print()
  print("Done")


if __name__ == "__main__":
  main()
