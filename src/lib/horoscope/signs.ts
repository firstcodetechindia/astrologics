import { SIGNS, SIGN_LORDS } from "@/lib/astrology/constants";
import { ZODIAC_SLUGS, type ZodiacSlug } from "@/lib/zodiac-icons";

export type LocaleText = { en: string; hi: string };

export type HoroscopePeriod = "daily" | "weekly" | "monthly";

export type HoroscopeSign = {
  slug: ZodiacSlug;
  index: number;
  name: LocaleText;
  element: LocaleText;
  quality: LocaleText;
  ruler: LocaleText;
  luckyNumber: string;
  luckyColour: LocaleText;
  luckyDay: LocaleText;
  gemstone: LocaleText;
  metal: LocaleText;
  direction: LocaleText;
  deity: LocaleText;
  mantra: string;
  summary: LocaleText;
  rulerBlurb: LocaleText;
  sections: {
    love: LocaleText;
    career: LocaleText;
    money: LocaleText;
    health: LocaleText;
    family: LocaleText;
    outlook: LocaleText;
  };
  /** Slightly different openers for tabs */
  periodLead: Record<HoroscopePeriod, LocaleText>;
};

function L(en: string, hi: string): LocaleText {
  return { en, hi };
}

const META: Omit<
  HoroscopeSign,
  "slug" | "index" | "name" | "ruler" | "sections" | "summary" | "rulerBlurb" | "periodLead"
>[] = [
  {
    element: L("Fire", "अग्नि"),
    quality: L("Movable", "चर"),
    luckyNumber: "9",
    luckyColour: L("Red", "लाल"),
    luckyDay: L("Tuesday", "मंगलवार"),
    gemstone: L("Red Coral", "मूंगा"),
    metal: L("Copper", "तांबा"),
    direction: L("South", "दक्षिण"),
    deity: L("Lord Hanuman / Kartikeya", "हनुमान / कार्तिकेय"),
    mantra: "Om Angarakaya Namaha",
  },
  {
    element: L("Earth", "पृथ्वी"),
    quality: L("Fixed", "स्थिर"),
    luckyNumber: "6",
    luckyColour: L("White / Cream", "सफ़ेद / क्रीम"),
    luckyDay: L("Friday", "शुक्रवार"),
    gemstone: L("Diamond / White Sapphire", "हीरा / सफ़ेद पुखराज"),
    metal: L("Silver", "चाँदी"),
    direction: L("South-East", "आग्नेय"),
    deity: L("Lakshmi / Goddess Earth", "लक्ष्मी / भूमि देवी"),
    mantra: "Om Shukraya Namaha",
  },
  {
    element: L("Air", "वायु"),
    quality: L("Dual", "द्विस्वभाव"),
    luckyNumber: "5",
    luckyColour: L("Green", "हरा"),
    luckyDay: L("Wednesday", "बुधवार"),
    gemstone: L("Emerald", "पन्ना"),
    metal: L("Bronze", "कांस्य"),
    direction: L("North", "उत्तर"),
    deity: L("Lord Vishnu / Budha", "विष्णु / बुध"),
    mantra: "Om Budhaya Namaha",
  },
  {
    element: L("Water", "जल"),
    quality: L("Movable", "चर"),
    luckyNumber: "2",
    luckyColour: L("White / Silver", "सफ़ेद / चाँदी"),
    luckyDay: L("Monday", "सोमवार"),
    gemstone: L("Pearl", "मोती"),
    metal: L("Silver", "चाँदी"),
    direction: L("North-West", "वायव्य"),
    deity: L("Goddess Parvati / Chandra", "पार्वती / चंद्र"),
    mantra: "Om Chandraya Namaha",
  },
  {
    element: L("Fire", "अग्नि"),
    quality: L("Fixed", "स्थिर"),
    luckyNumber: "1",
    luckyColour: L("Gold / Orange", "सुनहरा / नारंगी"),
    luckyDay: L("Sunday", "रविवार"),
    gemstone: L("Ruby", "माणिक्य"),
    metal: L("Gold", "सोना"),
    direction: L("East", "पूर्व"),
    deity: L("Lord Surya / Shiva", "सूर्य / शिव"),
    mantra: "Om Suryaya Namaha",
  },
  {
    element: L("Earth", "पृथ्वी"),
    quality: L("Dual", "द्विस्वभाव"),
    luckyNumber: "5",
    luckyColour: L("Green / Grey", "हरा / धूसर"),
    luckyDay: L("Wednesday", "बुधवार"),
    gemstone: L("Emerald", "पन्ना"),
    metal: L("Bronze", "कांस्य"),
    direction: L("North", "उत्तर"),
    deity: L("Lord Vishnu", "विष्णु"),
    mantra: "Om Budhaya Namaha",
  },
  {
    element: L("Air", "वायु"),
    quality: L("Movable", "चर"),
    luckyNumber: "6",
    luckyColour: L("Pink / Light blue", "गुलाबी / हल्का नीला"),
    luckyDay: L("Friday", "शुक्रवार"),
    gemstone: L("Diamond / Opal", "हीरा / ओपल"),
    metal: L("Copper", "तांबा"),
    direction: L("West", "पश्चिम"),
    deity: L("Goddess Lakshmi", "लक्ष्मी"),
    mantra: "Om Shukraya Namaha",
  },
  {
    element: L("Water", "जल"),
    quality: L("Fixed", "स्थिर"),
    luckyNumber: "9",
    luckyColour: L("Deep red / Maroon", "गहरा लाल / मरून"),
    luckyDay: L("Tuesday", "मंगलवार"),
    gemstone: L("Red Coral", "मूंगा"),
    metal: L("Iron", "लोहा"),
    direction: L("North", "उत्तर"),
    deity: L("Lord Kartikeya / Kali", "कार्तिकेय / काली"),
    mantra: "Om Angarakaya Namaha",
  },
  {
    element: L("Fire", "अग्नि"),
    quality: L("Dual", "द्विस्वभाव"),
    luckyNumber: "3",
    luckyColour: L("Yellow / Saffron", "पीला / केसरिया"),
    luckyDay: L("Thursday", "गुरुवार"),
    gemstone: L("Yellow Sapphire", "पुखराज"),
    metal: L("Gold", "सोना"),
    direction: L("North-East", "ईशान"),
    deity: L("Lord Vishnu / Guru", "विष्णु / गुरु"),
    mantra: "Om Gurave Namaha",
  },
  {
    element: L("Earth", "पृथ्वी"),
    quality: L("Movable", "चर"),
    luckyNumber: "8",
    luckyColour: L("Dark blue / Black", "गहरा नीला / काला"),
    luckyDay: L("Saturday", "शनिवार"),
    gemstone: L("Blue Sapphire", "नीलम"),
    metal: L("Iron", "लोहा"),
    direction: L("West", "पश्चिम"),
    deity: L("Lord Shani / Hanuman", "शनि / हनुमान"),
    mantra: "Om Shanaischaraya Namaha",
  },
  {
    element: L("Air", "वायु"),
    quality: L("Fixed", "स्थिर"),
    luckyNumber: "4",
    luckyColour: L("Electric blue / Turquoise", "नीला / फ़िरोज़ी"),
    luckyDay: L("Saturday", "शनिवार"),
    gemstone: L("Blue Sapphire / Amethyst", "नीलम / नीलकंठ"),
    metal: L("Uranium-tone metals / Iron", "लोहा"),
    direction: L("West", "पश्चिम"),
    deity: L("Lord Varuna / Shani", "वरुण / शनि"),
    mantra: "Om Shanaischaraya Namaha",
  },
  {
    element: L("Water", "जल"),
    quality: L("Dual", "द्विस्वभाव"),
    luckyNumber: "3",
    luckyColour: L("Sea green / Cream", "समुद्री हरा / क्रीम"),
    luckyDay: L("Thursday", "गुरुवार"),
    gemstone: L("Yellow Sapphire / Pearl", "पुखराज / मोती"),
    metal: L("Platinum-tone / Silver", "चाँदी"),
    direction: L("North", "उत्तर"),
    deity: L("Lord Vishnu / Goddess Saraswati", "विष्णु / सरस्वती"),
    mantra: "Om Gurave Namaha",
  },
];

const SECTION_PACKS: HoroscopeSign["sections"][] = [
  {
    love: L(
      "In relationships, Aries moves first. Honest conversations clear fog faster than waiting. Singles may notice someone who matches their pace; couples thrive when both keep a healthy independence.",
      "संबंधों में मेष पहले कदम बढ़ाता है। इंतज़ार से बेहतर सीधी बात। अकेले लोग समान ऊर्जा वाले व्यक्ति की ओर खिंच सकते हैं; जोड़ों में स्वतंत्रता बनाए रखना फायदेमंद है।"
    ),
    career: L(
      "Work rewards Aries for starting and setting the pace. Pitch ideas, lead stalled work, or step into competition — then finish one goal before opening too many fronts.",
      "काम में आरंभ और गति मेष को फल देती है। विचार पेश करें, अटके काम आगे बढ़ाएँ — एक लक्ष्य पूरा कर फिर अगला लें।"
    ),
    money: L(
      "Income often follows initiative. Act on clear opportunities, but pause before impulse buys. Strong Mars phases suit negotiation; quieter ones suit clearing debt.",
      "आय अक्सर पहल से आती है। स्पष्ट अवसर पर आगे बढ़ें, आवेग खर्च से बचें। मज़बूत मंगल काल बातचीत के लिए, शांत काल कर्ज चुकाने के लिए उपयुक्त।"
    ),
    health: L(
      "Tension sits in the head — watch eye strain and a short fuse when rest is skipped. Channel heat into exercise; cooling food and sleep steady the mood.",
      "तनाव सिर में बैठता है — आँखों की थकान और चिड़चिड़ापन देखें। व्यायाम से ऊर्जा निकालें; ठंडक वाला भोजन और नींद मूड स्थिर करती है।"
    ),
    family: L(
      "At home you spring into action. Protect and provide rather than dictate. Softer days are good to mend a hasty word or check on elders.",
      "घर में आप तुरंत सक्रिय होते हैं। आदेश से ज़्यादा सुरक्षा और सहयोग दें। नरम दिनों में जल्दबाज़ी में कही बात सुधारें या बुज़ुर्गों का हाल पूछें।"
    ),
    outlook: L(
      "Courage and a clear yes-or-no serve Aries well. Pair drive with a moment of patience and restless energy becomes real progress.",
      "साहस और स्पष्ट हाँ/नहीं मेष के पक्ष में है। धैर्य के एक पल के साथ गति वास्तविक प्रगति बनती है।"
    ),
  },
  {
    love: L(
      "Taurus prefers steady warmth over drama. Slow trust-building works; rushing intimacy backfires. Shared comfort — meals, music, quiet time — deepens the bond.",
      "वृषभ नाटक से ज़्यादा स्थिर गर्मजोशी पसंद करता है। धीरे विश्वास बनाएँ। साथ भोजन, संगीत या शांत समय संबंध गहरा करता है।"
    ),
    career: L(
      "Consistency beats flash. Finish what you started, document wins, and negotiate from proven value. Avoid spreading effort across too many unfinished tasks.",
      "निरंतरता चमक से आगे है। शुरू किया काम पूरा करें, उपलब्धियाँ दर्ज करें, सिद्ध मूल्य पर बात करें।"
    ),
    money: L(
      "Saving and tangible assets feel natural. Review subscriptions, lock a small investment habit, and skip speculative tips that promise overnight gains.",
      "बचत और ठोस संपत्ति स्वाभाविक लगती है। सब्सक्रिप्शन जाँचें, छोटी निवेश आदत बनाएँ, रातों-रात लाभ के झांसे से बचें।"
    ),
    health: L(
      "Neck, throat and digestion need care. Regular meals, gentle stretches and less late-night scrolling help more than extreme routines.",
      "गर्दन, गला और पाचन ध्यान माँगते हैं। नियमित भोजन, हल्की स्ट्रेचिंग और देर रात स्क्रॉल कम करें।"
    ),
    family: L(
      "You stabilise the household. Practical help lands better than lectures. A shared plan for money or home repairs reduces friction.",
      "आप घर को स्थिर रखते हैं। व्याख्यान से ज़्यादा व्यावहारिक मदद काम आती है।"
    ),
    outlook: L(
      "Patience is your edge. Small daily improvements compound into security others notice later.",
      "धैर्य आपकी ताकत है। रोज़ की छोटी सुधर बाद में सुरक्षा बनती है।"
    ),
  },
  {
    love: L(
      "Gemini bonds through conversation. Curiosity keeps the spark; silence breeds distance. Say what you mean without turning every talk into a debate.",
      "मिथुन बातचीत से जुड़ता है। जिज्ञासा चिंगारी रखती है; चुप्पी दूरी बढ़ाती है।"
    ),
    career: L(
      "Ideas and networking open doors. Capture notes, follow up fast, and pick one project to ship instead of juggling endless drafts.",
      "विचार और नेटवर्किंग द्वार खोलते हैं। नोट्स लें, जल्दी फॉलो-अप करें, एक प्रोजेक्ट पूरा करें।"
    ),
    money: L(
      "Multiple streams can appear — keep a simple tracker. Impulse gadgets drain more than they delight; sleep on big purchases.",
      "कई स्रोत दिख सकते हैं — सादा ट्रैकर रखें। आवेग गैजेट्स से बचें।"
    ),
    health: L(
      "Nervous energy shows in sleep and restless hands. Breathwork, short walks and screen breaks calm the mind faster than caffeine.",
      "नर्वस ऊर्जा नींद में दिखती है। साँस, छोटी सैर और स्क्रीन ब्रेक कैफीन से बेहतर शांत करते हैं।"
    ),
    family: L(
      "You are the messenger. Share news kindly and listen fully before offering solutions — siblings and cousins respond to that.",
      "आप संदेशवाहक हैं। खबरें कोमलता से दें, समाधान से पहले सुनें।"
    ),
    outlook: L(
      "Curiosity is fuel. Aim it at one meaningful skill this week and the scatter settles.",
      "जिज्ञासा ईंधन है। इसे एक कौशल पर केंद्रित करें तो बिखराव कम होगा।"
    ),
  },
  {
    love: L(
      "Cancer loves through care. Name your needs softly; don’t wait for mind-reading. Emotional safety matters more than grand gestures.",
      "कर्क देखभाल से प्रेम करता है। जरूरतें कोमलता से कहें; मन पढ़ने का इंतज़ार न करें।"
    ),
    career: L(
      "Protective leadership and client care shine. Set boundaries on overtime so empathy doesn’t become burnout.",
      "सुरक्षात्मक नेतृत्व और क्लाइंट केयर चमकते हैं। ओवरटाइम की सीमा रखें।"
    ),
    money: L(
      "Home and family expenses may rise. Build a buffer fund; avoid emotional shopping after stressful talks.",
      "घर-परिवार के खर्च बढ़ सकते हैं। बफर फंड बनाएँ; तनाव के बाद भावनात्मक खरीदारी से बचें।"
    ),
    health: L(
      "Stomach and mood link tightly. Warm meals, hydration and an earlier bedtime help more than skipping meals.",
      "पेट और मूड जुड़े हैं। गुनगुना भोजन, पानी और जल्दी सोना मदद करता है।"
    ),
    family: L(
      "You hold the emotional centre. A short check-in call or shared meal repairs more than long arguments.",
      "आप भावनात्मक केंद्र हैं। छोटी कॉल या साथ भोजन लंबी बहस से ज़्यादा सुधारता है।"
    ),
    outlook: L(
      "Tenderness is strength when paired with clear boundaries. Protect your energy and your care lands cleaner.",
      "कोमलता सीमाओं के साथ शक्ति बनती है। ऊर्जा बचाएँ तो देखभाल साफ़ पहुँचती है।"
    ),
  },
  {
    love: L(
      "Leo thrives on appreciation. Offer warmth freely and ask for it cleanly. Drama fades when pride softens into playfulness.",
      "सिंह प्रशंसा से फलता है। गर्मजोशी दें और साफ़ माँगें। गर्व जब खेल में बदले तो नाटक कम होता है।"
    ),
    career: L(
      "Visibility helps — present your work. Lead with generosity, not ego, and collaborators stay loyal.",
      "दृश्यता मदद करती है — काम दिखाएँ। अहंकार नहीं, उदारता से नेतृत्व करें।"
    ),
    money: L(
      "Spending on quality feels right; watch status purchases. Invest in skills that raise your long-term earning glow.",
      "गुणवत्ता पर खर्च ठीक लगता है; स्टेटस खरीदारी देखें। कौशल में निवेश करें।"
    ),
    health: L(
      "Heart and back respond to posture and joyful movement. Sunlight and consistent sleep keep vitality high.",
      "हृदय और पीठ आसन व आनंदमय व्यायाम से सुधरते हैं। धूप और नींद ऊर्जा रखती है।"
    ),
    family: L(
      "You brighten gatherings. Share the spotlight so younger members feel seen — loyalty grows both ways.",
      "आप जमावड़े रोशन करते हैं। स्पॉटलाइट बाँटें ताकि छोटे सदस्य भी दिखें।"
    ),
    outlook: L(
      "Shine with purpose. When creativity serves others, recognition follows without forcing it.",
      "उद्देश्य के साथ चमकें। रचनात्मकता दूसरों की सेवा करे तो मान बिना ज़बरदस्ती आता है।"
    ),
  },
  {
    love: L(
      "Virgo shows love in details. Soften critique into helpfulness. Perfection can wait; presence cannot.",
      "कन्या प्यार विवरणों में दिखाती है। आलोचना को मदद में बदलें। उपस्थिति पूर्णता से ज़्यादा ज़रूरी है।"
    ),
    career: L(
      "Systems and precision are your edge. Automate one messy process and your week gets quieter.",
      "सिस्टम और सटीकता आपकी ताकत है। एक अव्यवस्थित प्रक्रिया स्वचालित करें।"
    ),
    money: L(
      "Budgets and audits feel satisfying. Cut silent drains; reward yourself with something useful, not wasteful.",
      "बजट जाँच संतोष देती है। चुपचाप बहते खर्च काटें।"
    ),
    health: L(
      "Gut and nerves need routine. Fibre, walks and less overthinking at night restore balance.",
      "पाचन और नसें दिनचर्या माँगती हैं। फाइबर, सैर और रात का कम सोच-विचार।"
    ),
    family: L(
      "Practical care lands — medicine lists, schedules, tidy spaces. Soften the tone so help feels kind, not corrective.",
      "व्यावहारिक देखभाल काम आती है। स्वर कोमल रखें ताकि मदद सुधार न लगे।"
    ),
    outlook: L(
      "Order creates peace. One cleared drawer or inbox can change the whole mood of the day.",
      "व्यवस्था शांति लाती है। एक साफ़ दराज या इनबॉक्स दिन का मूड बदल सकता है।"
    ),
  },
  {
    love: L(
      "Libra seeks harmony and beauty. Decide instead of hovering in maybe. Fairness keeps attraction alive.",
      "तुला सामंजस्य चाहती है। शायद में मत अटके — निर्णय लें। निष्पक्षता आकर्षण जीवित रखती है।"
    ),
    career: L(
      "Diplomacy and design sense open doors. Mediate carefully; don’t absorb everyone’s conflict as your job.",
      "कूटनीति और सौंदर्यबोध द्वार खोलते हैं। विवाद अपना काम न बना लें।"
    ),
    money: L(
      "Partnerships and aesthetics influence spending. Compare options; beauty needn’t equal overspend.",
      "साझेदारी और सौंदर्य खर्च प्रभावित करते हैं। विकल्प तुलना करें।"
    ),
    health: L(
      "Kidneys, skin and lower back prefer balance — water, moderate sweets, and posture breaks.",
      "गुर्दे, त्वचा और कमर संतुलन चाहती हैं — पानी, कम मिठाई, आसन ब्रेक।"
    ),
    family: L(
      "You keep peace at home. Name unfair patterns gently so harmony isn’t bought with silence.",
      "आप घर में शांति रखते हैं। अन्याय को कोमलता से कहें ताकि चुप्पी से शांति न खरीदी जाए।"
    ),
    outlook: L(
      "Balance is a verb. Small daily choices toward fairness beat one dramatic reset.",
      "संतुलन क्रिया है। रोज़ की छोटी निष्पक्षता एक बड़े रिसेट से बेहतर।"
    ),
  },
  {
    love: L(
      "Scorpio bonds intensely. Trust builds in private honesty. Control softens when vulnerability is mutual.",
      "वृश्चिक गहराई से जुड़ता है। विश्वास निजी ईमानदारी से बनता है।"
    ),
    career: L(
      "Research, crisis work and transformation suit you. Finish one deep project rather than hovering in secrecy.",
      "अनुसंधान और परिवर्तन आपके अनुकूल। एक गहरा प्रोजेक्ट पूरा करें।"
    ),
    money: L(
      "Shared finances and taxes may surface. Clarity beats suspicion — put numbers on paper together.",
      "साझा वित्त या कर सामने आ सकते हैं। शक से बेहतर कागज़ पर स्पष्ट आँकड़े।"
    ),
    health: L(
      "Reproductive system and stress toxins ask for detox habits — sleep, hydration, fewer late arguments.",
      "तनाव विषैला लगता है — नींद, पानी, देर रात की बहस कम।"
    ),
    family: L(
      "Loyalty runs deep. Protect privacy, but don’t weaponise silence. One truthful talk resets the field.",
      "वफादारी गहरी है। चुप्पी हथियार न बनाएँ। एक सच्ची बात मैदान साफ़ करती है।"
    ),
    outlook: L(
      "Power used to heal beats power used to win. Transform one habit and the chart of the week shifts.",
      "जीत से ज़्यादा उपचार के लिए शक्ति। एक आदत बदलें तो सप्ताह बदलता है।"
    ),
  },
  {
    love: L(
      "Sagittarius needs freedom and humour. Plans work when they leave room to roam. Preach less, play more.",
      "धनु स्वतंत्रता और हास्य चाहता है। योजना में घूमने की जगह रखें।"
    ),
    career: L(
      "Teaching, travel and big-picture pitches thrive. Convert inspiration into a calendar block before it fades.",
      "शिक्षण, यात्रा और बड़े विचार फलते हैं। प्रेरणा को कैलेंडर में बाँधें।"
    ),
    money: L(
      "Optimism can overspend. Cap adventure budgets; luck grows when risk is sized, not denied.",
      "आशावाद खर्च बढ़ा सकता है। रोमांच बजट सीमित रखें।"
    ),
    health: L(
      "Hips, thighs and liver prefer movement and lighter evenings. Outdoor time lifts mood fast.",
      "कूल्हे और लीवर गति व हल्की शाम पसंद करते हैं। बाहर समय मूड उठाता है।"
    ),
    family: L(
      "You bring stories and perspective. Listen as much as you advise — elders feel respected that way.",
      "आप कहानियाँ और दृष्टि लाते हैं। सलाह जितना सुनें भी।"
    ),
    outlook: L(
      "Aim higher, travel lighter. One honest belief update beats collecting more opinions.",
      "ऊँचा लक्ष्य, हल्का सफर। एक सच्ची मान्यता अपडेट कई रायों से बेहतर।"
    ),
  },
  {
    love: L(
      "Capricorn commits through reliability. Soften the schedule for affection. Respect is love’s language here.",
      "मकर विश्वसनीयता से प्रतिबद्ध होता है। स्नेह के लिए शेड्यूल नरम करें।"
    ),
    career: L(
      "Structure and ambition align. Climb steadily; document milestones for reviews and promotions.",
      "संरचना और महत्वाकांक्षा मेल खाती हैं। मील के पत्थर दर्ज करें।"
    ),
    money: L(
      "Long-term plans shine. Automate savings; delay status upgrades until cashflow is calm.",
      "दीर्घकालीन योजना चमकती है। बचत स्वचालित करें।"
    ),
    health: L(
      "Knees, bones and teeth need pacing. Warm-ups and less grinding through pain keep you durable.",
      "घुटने और हड्डियाँ गति माँगती हैं। वार्म-अप करें, दर्द में न धकेलें।"
    ),
    family: L(
      "You provide. Share appreciation out loud so duty doesn’t feel cold. A weekend ritual helps.",
      "आप प्रदान करते हैं। प्रशंसा ज़ोर से कहें ताकि कर्तव्य ठंडा न लगे।"
    ),
    outlook: L(
      "Slow builds last. Choose the hard right over the easy impressive — results compound quietly.",
      "धीमी नींव टिकती है। आसान दिखावे से कठिन सही चुनें।"
    ),
  },
  {
    love: L(
      "Aquarius needs friendship inside romance. Space is not rejection. Ideals work when grounded in daily kindness.",
      "कुम्भ प्रेम में मित्रता चाहता है। जगह अस्वीकार नहीं। आदर्श रोज़ की दया में उतरें।"
    ),
    career: L(
      "Innovation and community projects fit. Prototype fast; don’t orphan ideas without a next step owner.",
      "नवाचार और सामुदायिक काम अनुकूल। प्रोटोटाइप तेज़ बनाएँ।"
    ),
    money: L(
      "Tech and group investments may tempt. Read terms twice; independence includes financial clarity.",
      "टेक/ग्रुप निवेश लुभा सकते हैं। शर्तें दो बार पढ़ें।"
    ),
    health: L(
      "Ankles, circulation and nervous system like novelty movement and hydration. Limit late screens.",
      "टखने और नसें नई गति व पानी पसंद करती हैं। देर स्क्रीन सीमित करें।"
    ),
    family: L(
      "You modernise traditions. Explain why before changing how — relatives follow when they feel included.",
      "आप परंपरा को नया रूप देते हैं। कैसे बदलने से पहले क्यों समझाएँ।"
    ),
    outlook: L(
      "Future-minded works best with one human connection today. Progress needs both.",
      "भविष्य की सोच आज एक मानवीय जुड़ाव के साथ सर्वश्रेष्ठ है।"
    ),
  },
  {
    love: L(
      "Pisces loves through empathy and imagination. Boundaries keep compassion from draining you. Art and music reconnect hearts.",
      "मीन सहानुभूति से प्रेम करता है। सीमाएँ करुणा को थकने से बचाती हैं।"
    ),
    career: L(
      "Creative, healing and support roles flourish. Write down vague goals so inspiration becomes deliverables.",
      "रचनात्मक व सहायक भूमिकाएँ फलती हैं। अस्पष्ट लक्ष्य लिखें।"
    ),
    money: L(
      "Charity and soft spending rise. Separate giving from guilt purchases; keep a tiny joy fund consciously.",
      "दान और नरम खर्च बढ़ सकते हैं। अपराधबोध खरीदारी से दान अलग रखें।"
    ),
    health: L(
      "Feet, immunity and sleep need care. Salt water, rest and less doom-scrolling restore sensitivity.",
      "पाँव, प्रतिरक्षा और नींद ध्यान माँगते हैं। आराम और कम डूम-स्क्रॉल।"
    ),
    family: L(
      "You sense unspoken moods. Ask before absorbing everyone’s feelings — presence beats rescuing.",
      "आप अनकहे मूड भाँपते हैं। सबकी भावनाएँ सोखने से पहले पूछें।"
    ),
    outlook: L(
      "Dreams need docks. Anchor one vision in a small daily act and intuition becomes useful.",
      "सपनों को घाट चाहिए। एक दृष्टि को छोटी रोज़ क्रिया से बाँधें।"
    ),
  },
];

function periodLeads(nameEn: string, nameHi: string): HoroscopeSign["periodLead"] {
  return {
    daily: L(
      `Today’s ${nameEn} focus: move with awareness — small choices shape the tone of the day.`,
      `आज ${nameHi} पर ध्यान: सजगता से आगे बढ़ें — छोटी पसंदें दिन का रंग तय करती हैं।`
    ),
    weekly: L(
      `This week for ${nameEn}: pace yourself across seven days — start strong, finish clean.`,
      `इस सप्ताह ${nameHi} के लिए: सात दिनों में गति बाँटें — मज़बूत शुरुआत, साफ़ समापन।`
    ),
    monthly: L(
      `This month for ${nameEn}: think in chapters — one theme at a time beats scattered effort.`,
      `इस माह ${nameHi} के लिए: अध्यायों में सोचें — एक विषय बिखराव से बेहतर।`
    ),
  };
}

function summaries(i: number): { summary: LocaleText; rulerBlurb: LocaleText } {
  const name = SIGNS[i];
  const ruler = SIGN_LORDS[i];
  return {
    summary: L(
      `${name.en} forecasts blend temperament with the sky’s current weather. Read them as guidance for timing and tone — not as fixed fate.`,
      `${name.hi} भविष्यवाणी स्वभाव और वर्तमान ग्रह मौसम को मिलाती है। इसे समय व स्वर का मार्गदर्शन मानें — तय किस्मत नहीं।`
    ),
    rulerBlurb: L(
      `${name.en} is ruled by ${ruler.en}. When ${ruler.en} is strong, the sign’s gifts flow easily; when stressed, the same traits need extra care. Tracking that planetary weather is the heart of a ${name.en} horoscope.`,
      `${name.hi} पर ${ruler.hi} की अधिपति शक्ति है। जब ${ruler.hi} बलवान हो, गुण सहज बहते हैं; दबाव में उन्हीं गुणों को सावधानी चाहिए। यही ${name.hi} राशिफल का मूल है।`
    ),
  };
}

export const HOROSCOPE_SIGNS: HoroscopeSign[] = ZODIAC_SLUGS.map((slug, index) => {
  const { summary, rulerBlurb } = summaries(index);
  return {
    slug,
    index,
    name: { en: SIGNS[index].en, hi: SIGNS[index].hi },
    ruler: { en: SIGN_LORDS[index].en, hi: SIGN_LORDS[index].hi },
    ...META[index],
    sections: SECTION_PACKS[index],
    summary,
    rulerBlurb,
    periodLead: periodLeads(SIGNS[index].en, SIGNS[index].hi),
  };
});

export function getHoroscopeSign(slug: string): HoroscopeSign | undefined {
  return HOROSCOPE_SIGNS.find((s) => s.slug === slug);
}

export function pickL(locale: string, t: LocaleText) {
  return locale === "hi" ? t.hi : t.en;
}

export const HOROSCOPE_FAQS: { q: LocaleText; a: LocaleText }[] = [
  {
    q: L(
      "Is this horoscope based on Sun sign or Moon sign?",
      "यह राशिफल सूर्य राशि पर है या चंद्र राशि पर?"
    ),
    a: L(
      "Vedic guidance is traditionally read by Moon sign first, because the Moon governs the mind and daily life. Your Sun sign still adds useful context.",
      "वैदिक परंपरा में पहले चंद्र राशि पढ़ी जाती है, क्योंकि चंद्र मन और दैनिक जीवन से जुड़ा है। सूर्य राशि भी सहायक संदर्भ देती है।"
    ),
  },
  {
    q: L("How often is the daily horoscope updated?", "दैनिक राशिफल कितनी बार अपडेट होता है?"),
    a: L(
      "Daily guidance refreshes for each new day. Weekly and monthly tabs give a wider window for planning.",
      "दैनिक मार्गदर्शन हर नए दिन के लिए ताज़ा होता है। साप्ताहिक व मासिक टैब योजना के लिए व्यापक दृष्टि देते हैं।"
    ),
  },
  {
    q: L("How accurate is a general sign horoscope?", "सामान्य राशिफल कितना सटीक है?"),
    a: L(
      "It offers general guidance for your sign — not a fixed prediction. A full birth-chart (kundli) reading is far more personal.",
      "यह आपकी राशि का सामान्य मार्गदर्शन है — तय भविष्यवाणी नहीं। पूर्ण कुंडली पढ़ना कहीं अधिक व्यक्तिगत होता है।"
    ),
  },
];
