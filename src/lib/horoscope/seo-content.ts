import { SIGNS, SIGN_LORDS } from "@/lib/astrology/constants";
import type { LocaleText } from "@/lib/horoscope/signs";
import { ZODIAC_SLUGS, type ZodiacSlug } from "@/lib/zodiac-icons";

function L(en: string, hi: string): LocaleText {
  return { en, hi };
}

export type HoroscopeSeo = {
  slug: ZodiacSlug;
  tagline: LocaleText;
  personality: LocaleText;
  strengths: LocaleText[];
  challenges: LocaleText[];
  bodyFocus: LocaleText;
  careerFields: LocaleText;
  bestMatches: LocaleText;
  watchMatches: LocaleText;
  remedies: LocaleText[];
  doList: LocaleText[];
  dontList: LocaleText[];
  deepGuide: LocaleText[];
  aiInsight: LocaleText;
  faqs: { q: LocaleText; a: LocaleText }[];
};

const BODY = [
  L("Head, eyes, brain", "सिर, आँखें, मस्तिष्क"),
  L("Neck, throat, voice", "गर्दन, गला, आवाज़"),
  L("Arms, lungs, nerves", "भुजाएँ, फेफड़े, नसें"),
  L("Chest, stomach, breasts", "छाती, पेट, स्तन"),
  L("Heart, spine, upper back", "हृदय, रीढ़, ऊपरी पीठ"),
  L("Gut, intestines, skin", "पाचन, आँतें, त्वचा"),
  L("Kidneys, lower back, skin", "गुर्दे, कमर, त्वचा"),
  L("Reproductive system, colon", "प्रजनन तंत्र, बृहदांत्र"),
  L("Hips, thighs, liver", "कूल्हे, जाँघें, लीवर"),
  L("Knees, bones, joints", "घुटने, हड्डियाँ, जोड़"),
  L("Ankles, calves, circulation", "टखने, पिंडलियाँ, रक्त प्रवाह"),
  L("Feet, immunity, lymph", "पाँव, प्रतिरक्षा, लसीका"),
];

const CAREERS = [
  L("Leadership, defence, sports, entrepreneurship, engineering", "नेतृत्व, रक्षा, खेल, उद्यमिता, इंजीनियरिंग"),
  L("Finance, real estate, design, food, banking, agriculture", "वित्त, रियल एस्टेट, डिज़ाइन, भोजन, बैंकिंग, कृषि"),
  L("Media, writing, sales, teaching, tech support, travel", "मीडिया, लेखन, बिक्री, शिक्षण, टेक सपोर्ट, यात्रा"),
  L("Hospitality, nursing, counselling, home business, HR", "आतिथ्य, नर्सिंग, परामर्श, घरेलू व्यवसाय, एचआर"),
  L("Entertainment, politics, branding, management, coaching", "मनोरंजन, राजनीति, ब्रांडिंग, प्रबंधन, कोचिंग"),
  L("Analytics, health, editing, quality control, research", "एनालिटिक्स, स्वास्थ्य, संपादन, गुणवत्ता नियंत्रण, शोध"),
  L("Law, diplomacy, fashion, arts, partnerships, consulting", "कानून, कूटनीति, फैशन, कला, साझेदारी, परामर्श"),
  L("Investigation, surgery, psychology, occult sciences, finance deep-dives", "जांच, शल्य, मनोविज्ञान, गूढ़ विद्या, गहन वित्त"),
  L("Education, publishing, travel, law, philosophy, marketing", "शिक्षा, प्रकाशन, यात्रा, कानून, दर्शन, मार्केटिंग"),
  L("Administration, mining, governance, architecture, strategy", "प्रशासन, खनन, शासन, वास्तुकला, रणनीति"),
  L("Technology, social impact, aviation, innovation, NGOs", "प्रौद्योगिकी, सामाजिक प्रभाव, विमानन, नवाचार, एनजीओ"),
  L("Healing arts, film, spirituality, charity, marine work", "उपचार कला, फिल्म, अध्यात्म, दान, समुद्री कार्य"),
];

const MATCH_BEST = [
  L("Leo, Sagittarius, Gemini", "सिंह, धनु, मिथुन"),
  L("Virgo, Capricorn, Cancer", "कन्या, मकर, कर्क"),
  L("Libra, Aquarius, Aries", "तुला, कुम्भ, मेष"),
  L("Scorpio, Pisces, Taurus", "वृश्चिक, मीन, वृषभ"),
  L("Aries, Sagittarius, Libra", "मेष, धनु, तुला"),
  L("Taurus, Capricorn, Cancer", "वृषभ, मकर, कर्क"),
  L("Gemini, Aquarius, Leo", "मिथुन, कुम्भ, सिंह"),
  L("Cancer, Pisces, Virgo", "कर्क, मीन, कन्या"),
  L("Aries, Leo, Aquarius", "मेष, सिंह, कुम्भ"),
  L("Taurus, Virgo, Scorpio", "वृषभ, कन्या, वृश्चिक"),
  L("Gemini, Libra, Sagittarius", "मिथुन, तुला, धनु"),
  L("Cancer, Scorpio, Capricorn", "कर्क, वृश्चिक, मकर"),
];

const MATCH_WATCH = [
  L("Cancer, Capricorn (needs patience)", "कर्क, मकर (धैर्य चाहिए)"),
  L("Leo, Aquarius (pace mismatch)", "सिंह, कुम्भ (गति का अंतर)"),
  L("Virgo, Pisces (overthinking risk)", "कन्या, मीन (अधिक सोच)"),
  L("Aries, Libra (mood vs drive)", "मेष, तुला (मूड बनाम गति)"),
  L("Taurus, Scorpio (pride clashes)", "वृषभ, वृश्चिक (गर्व टकराव)"),
  L("Gemini, Sagittarius (detail vs vision)", "मिथुन, धनु (विवरण बनाम दृष्टि)"),
  L("Cancer, Capricorn (emotional vs practical)", "कर्क, मकर (भावना बनाम व्यवहार)"),
  L("Leo, Aquarius (control vs freedom)", "सिंह, कुम्भ (नियंत्रण बनाम स्वतंत्रता)"),
  L("Virgo, Pisces (critique vs dream)", "कन्या, मीन (आलोचना बनाम सपना)"),
  L("Aries, Libra (speed vs balance)", "मेष, तुला (गति बनाम संतुलन)"),
  L("Taurus, Scorpio (stability vs intensity)", "वृषभ, वृश्चिक (स्थिरता बनाम तीव्रता)"),
  L("Gemini, Sagittarius (scatter vs focus)", "मिथुन, धनु (बिखराव बनाम फोकस)"),
];

const TAGLINES = [
  L("The pioneer — courage with a starting spark", "अग्रणी — साहस और आरंभ की चिंगारी"),
  L("The builder — steady beauty and lasting value", "निर्माता — स्थिर सौंदर्य और टिकाऊ मूल्य"),
  L("The messenger — curious mind, quick connection", "संदेशवाहक — जिज्ञासु मन, तेज़ जुड़ाव"),
  L("The nurturer — emotional intelligence as strength", "पालनहार — भावनात्मक बुद्धि ही शक्ति"),
  L("The radiant — warm leadership and creative fire", "तेजस्वी — गर्म नेतृत्व और रचनात्मक अग्नि"),
  L("The analyst — precision that quietly improves life", "विश्लेषक — सटीकता जो जीवन सुधारती है"),
  L("The diplomat — harmony, fairness and refined taste", "राजनयिक — सामंजस्य, न्याय और परिष्कृत रुचि"),
  L("The transformer — depth, loyalty and powerful focus", "परिवर्तक — गहराई, वफादारी और शक्तिशाली फोकस"),
  L("The seeker — truth, travel and expansive hope", "अन्वेषक — सत्य, यात्रा और विस्तृत आशा"),
  L("The architect — discipline that builds empires slowly", "वास्तुकार — अनुशासन जो धीरे साम्राज्य बनाता है"),
  L("The innovator — future vision with a human heart", "नवप्रवर्तक — मानवीय हृदय के साथ भविष्य दृष्टि"),
  L("The mystic — empathy, imagination and quiet wisdom", "रहस्यवादी — सहानुभूति, कल्पना और शांत ज्ञान"),
];

const PERSONALITY = [
  L(
    "Aries (Mesha) is the first spark of the zodiac — direct, energetic and allergic to waiting. Mars gives courage, competitive fire and a preference for clear yes-or-no decisions. In Vedic astrology, Aries rising or Moon often shows a pioneering mind that learns by doing. The growth edge is patience: finishing what was boldly started, and listening before charging ahead. When balanced, Aries becomes a protective leader who opens doors for others, not only for the self.",
    "मेष राशि चक्र की पहली चिंगारी है — सीधी, ऊर्जावान और इंतज़ार से बेचैन। मंगल साहस, प्रतिस्पर्धा और स्पष्ट हाँ/नहीं का स्वभाव देता है। वैदिक ज्योतिष में मेष लग्न या चंद्र अक्सर करके सीखने वाले अग्रणी मन दिखाते हैं। विकास का किनारा धैर्य है: जो साहस से शुरू किया उसे पूरा करना, और आगे बढ़ने से पहले सुनना। संतुलित मेष दूसरों के लिए भी द्वार खोलने वाला रक्षक नेता बनता है।"
  ),
  L(
    "Taurus (Vrishabha) builds what lasts — comfort, craft and financial grounding. Venus colours taste, loyalty and a love of beauty in daily life. Fixed earth energy prefers proven methods over sudden change. In a kundli, strong Taurus themes often show talent for accumulation, design and patient relationships. The lesson is flexibility: not every change is a threat. When Taurus trusts gradual evolution, its stability becomes a gift to family and work alike.",
    "वृषभ टिकाऊ चीज़ें बनाता है — आराम, शिल्प और आर्थिक नींव। शुक्र रुचि, वफादारी और रोज़मर्रा की सुंदरता रंगता है। स्थिर पृथ्वी ऊर्जा अचानक बदलाव से ज़्यादा सिद्ध तरीकों को चुनती है। कुंडली में मज़बूत वृषभ संचय, डिज़ाइन और धैर्यपूर्ण संबंधों की प्रतिभा दिखा सकता है। पाठ है लचीलापन: हर बदलाव खतरा नहीं। जब वृषभ क्रमिक विकास पर भरोसा करता है, उसकी स्थिरता परिवार और काम दोनों के लिए वरदान बनती है।"
  ),
  L(
    "Gemini (Mithuna) lives through words, ideas and dual perspectives. Mercury sharpens curiosity, humour and the ability to connect different worlds. Dual air energy can multitask brilliantly — or scatter. Vedic readings often link Gemini to learning, media, commerce and sibling themes. Intelligence here is social and adaptable. Maturity arrives when Gemini chooses depth in one conversation, one skill, one promise — without losing the playful lightness that makes this sign magnetic.",
    "मिथुन शब्दों, विचारों और दोहरे दृष्टिकोण से जीता है। बुध जिज्ञासा, हास्य और अलग दुनिया जोड़ने की क्षमता तेज़ करता है। द्विस्वभाव वायु मल्टीटास्क में चमकता है — या बिखर भी सकता है। वैदिक पाठ अक्सर मिथुन को शिक्षा, मीडिया, व्यापार और सहोदर भाव से जोड़ते हैं। बुद्धिमत्ता यहाँ सामाजिक और अनुकूलनशील है। परिपक्वता तब आती है जब मिथुन एक बातचीत, एक कौशल, एक वादा गहराई से चुनता है — अपनी आकर्षक हल्की ऊर्जा खोए बिना।"
  ),
  L(
    "Cancer (Karka) protects what it loves — home, memory and emotional truth. The Moon rules mood, nurturing instincts and intuitive timing. Movable water can shift quickly between care and caution. In Jyotish, Cancer often highlights mother, property and the need for emotional safety before public ambition. Softness is not weakness; it is radar. Cancer thrives when feelings are named clearly and boundaries keep compassion from becoming exhaustion.",
    "कर्क जिसे प्रेम करता है उसकी रक्षा करता है — घर, स्मृति और भावनात्मक सत्य। चंद्र मूड, पालन प्रवृत्ति और सहज समय का स्वामी है। चर जल देखभाल और सावधानी के बीच तेज़ी से बदल सकता है। ज्योतिष में कर्क अक्सर माता, संपत्ति और सार्वजनिक महत्वाकांक्षा से पहले भावनात्मक सुरक्षा दिखाता है। कोमलता कमज़ोरी नहीं; रडार है। जब भावनाएँ साफ़ कही जाएँ और सीमाएँ करुणा को थकान बनने से रोकें, कर्क फलता है।"
  ),
  L(
    "Leo (Simha) wants to shine with heart — creativity, dignity and generous leadership. The Sun grants vitality, pride and a need to be recognised for real contribution. Fixed fire holds loyalty to people and purposes once chosen. A strong Leo signature in the chart often shows stage presence, mentoring capacity and a protective instinct toward one’s circle. Ego softens into radiance when Leo shares the spotlight and leads through warmth rather than control.",
    "सिंह हृदय से चमकना चाहता है — रचनात्मकता, गरिमा और उदार नेतृत्व। सूर्य जीवनशक्ति, गर्व और वास्तविक योगदान के लिए मान्यता की चाह देता है। स्थिर अग्नि एक बार चुने लोगों और उद्देश्यों पर वफादार रहती है। कुंडली में मज़बूत सिंह अक्सर मंच उपस्थिति, मार्गदर्शन क्षमता और अपने दायरे की रक्षा दिखाता है। जब सिंह स्पॉटलाइट बाँटता है और नियंत्रण नहीं, गर्मजोशी से नेतृत्व करता है, अहंकार तेज में बदल जाता है।"
  ),
  L(
    "Virgo (Kanya) refines life through detail, service and intelligent systems. Mercury here turns critical thinking into practical improvement. Dual earth energy notices what others miss — and can over-correct. Vedic astrology associates Virgo with health routines, skill mastery and clean process. The highest Virgo expression is helpful clarity, not endless fault-finding. When self-compassion joins precision, Virgo becomes the quiet engineer of better days.",
    "कन्या विवरण, सेवा और बुद्धिमान सिस्टम से जीवन परिष्कृत करती है। यहाँ बुध आलोचनात्मक सोच को व्यावहारिक सुधार बनाता है। द्विस्वभाव पृथ्वी वो देखती है जो अन्य चूकते हैं — और अति-सुधार भी कर सकती है। वैदिक ज्योतिष कन्या को स्वास्थ्य दिनचर्या, कौशल और स्वच्छ प्रक्रिया से जोड़ता है। उच्चतम कन्या अभिव्यक्ति सहायक स्पष्टता है, अंतहीन दोष नहीं। जब आत्म-करुणा सटीकता से जुड़ती है, कन्या बेहतर दिनों की शांत इंजीनियर बनती है।"
  ),
  L(
    "Libra (Tula) seeks balance — in relationships, aesthetics and decisions. Venus brings charm, diplomacy and a dislike of harsh conflict. Movable air weighs options carefully, sometimes too long. In a birth chart, Libra themes often include partnership, justice and design. Fairness is Libra’s north star. Growth comes from choosing a side when needed, without abandoning kindness. Then harmony becomes courage, not avoidance.",
    "तुला संतुलन चाहती है — संबंधों, सौंदर्य और निर्णयों में। शुक्र आकर्षण, कूटनीति और कठोर संघर्ष से दूरी लाता है। चर वायु विकल्प तोलती है, कभी बहुत देर तक। जन्म कुंडली में तुला साझेदारी, न्याय और डिज़ाइन से जुड़ती है। निष्पक्षता तुला का ध्रुवतारा है। विकास तब है जब जरूरत पर पक्ष चुनें, दया छोड़े बिना। तब सामंजस्य बचाव नहीं, साहस बनता है।"
  ),
  L(
    "Scorpio (Vrischika) feels life at full intensity — loyalty, research and transformation. Mars (and Ketu in some classical lists) fuels focus that can heal or control. Fixed water does not forget easily; trust is earned in private. Jyotish often links Scorpio to occult insight, shared resources and profound emotional honesty. Power used to protect and regenerate becomes wisdom. Power used only to win becomes a cage. Choose the first.",
    "वृश्चिक जीवन को तीव्रता से महसूस करता है — वफादारी, शोध और रूपांतरण। मंगल (कुछ परंपराओं में केतु भी) ऐसा फोकस देता है जो उपचार या नियंत्रण दोनों कर सकता है। स्थिर जल आसानी से नहीं भूलता; विश्वास निजी जगह में बनता है। ज्योतिष वृश्चिक को गूढ़ दृष्टि, साझा संसाधन और गहरी भावनात्मक ईमानदारी से जोड़ता है। रक्षा और पुनरुत्थान की शक्ति ज्ञान बनती है। केवल जीत की शक्ति पिंजरा। पहली चुनें।"
  ),
  L(
    "Sagittarius (Dhanu) expands toward meaning — travel, teaching and honest belief. Jupiter blesses optimism, ethics and the hunger to understand the big picture. Dual fire starts many journeys; maturity finishes the important ones. Vedic charts with strong Sagittarius often show mentors, publishing or cross-cultural work. Freedom is sacred here, but so is integrity. When Sagittarius aims higher without preaching, its hope becomes contagious.",
    "धनु अर्थ की ओर फैलता है — यात्रा, शिक्षण और ईमानदार विश्वास। गुरु आशावाद, नैतिकता और बड़ी तस्वीर समझने की भूख देता है। द्विस्वभाव अग्नि कई यात्राएँ शुरू करती है; परिपक्वता महत्वपूर्ण पूरी करती है। मज़बूत धनु वाली कुंडलियाँ अक्सर गुरु, प्रकाशन या सांस्कृतिक सेतु दिखाती हैं। स्वतंत्रता पवित्र है, अखंडता भी। जब धनु उपदेश बिना ऊँचा लक्ष्य रखता है, उसकी आशा संक्रामक बनती है।"
  ),
  L(
    "Capricorn (Makara) climbs with structure — responsibility, time and earned respect. Saturn teaches delay that strengthens, not delay that defeats. Movable earth plans in decades while still handling today’s duties. Capricorn signatures in kundli work often appear as leadership through competence. Softness is the secret upgrade: ambition without warmth isolates. Ambition with care builds legacies people actually want to inherit.",
    "मकर संरचना से चढ़ता है — ज़िम्मेदारी, समय और अर्जित सम्मान। शनि ऐसा विलंब सिखाता है जो मज़बूत करे, हराए नहीं। चर पृथ्वी दशकों में योजना बनाती है और आज का कर्तव्य भी निभाती है। कुंडली में मकर अक्सर दक्षता से नेतृत्व दिखाता है। कोमलता गुप्त अपग्रेड है: बिना गर्मजोशी की महत्वाकांक्षा अकेला करती है। देखभाल वाली महत्वाकांक्षा ऐसी विरासत बनाती है जिसे लोग सच में अपनाना चाहें।"
  ),
  L(
    "Aquarius (Kumbha) innovates for the collective — ideas, networks and reform. Saturn (and Rahu in some modern readings) mixes discipline with disruption. Fixed air holds ideals firmly; friendships matter as much as romance. Vedic Aquarius themes include technology, community and unconventional paths. The heart of this sign is humanitarian intelligence. Stay human while inventing the future, and Aquarius becomes a bridge, not a broadcast tower.",
    "कुम्भ सामूहिक के लिए नवाचार करता है — विचार, नेटवर्क और सुधार। शनि (कुछ आधुनिक पाठों में राहु भी) अनुशासन को विघटन से मिलाता है। स्थिर वायु आदर्श मज़बूती से पकड़ती है; मित्रता प्रेम जितनी महत्वपूर्ण। वैदिक कुम्भ में तकनीक, समुदाय और अपरंपरागत मार्ग आते हैं। इस राशि का हृदय मानवीय बुद्धि है। भविष्य गढ़ते हुए इंसान बने रहें — कुम्भ प्रसारण टॉवर नहीं, सेतु बने।"
  ),
  L(
    "Pisces (Meena) dissolves borders — empathy, art and spiritual imagination. Jupiter softens perception into compassion and creative flow. Dual water feels the room before speaking. Strong Pisces in a chart may indicate healing gifts, film, music or seva. Boundaries are not betrayal; they are how sensitivity survives. When Pisces anchors dreams in small daily acts, intuition becomes practical guidance instead of fog.",
    "मीन सीमाएँ घुलाता है — सहानुभूति, कला और आध्यात्मिक कल्पना। गुरु धारणा को करुणा और रचनात्मक प्रवाह बनाता है। द्विस्वभाव जल बोलने से पहले कमरा महसूस करता है। मज़बूत मीन उपचार, फिल्म, संगीत या सेवा का संकेत दे सकता है। सीमाएँ विश्वासघात नहीं; संवेदनशीलता कैसे बचती है। जब मीन सपनों को छोटी रोज़ क्रियाओं में बाँधता है, अंतर्ज्ञान कोहरा नहीं, व्यावहारिक मार्गदर्शन बनता है।"
  ),
];

function strengthsFor(i: number): LocaleText[] {
  const packs: LocaleText[][] = [
    [L("Initiative & courage", "पहल और साहस"), L("Fast decision-making", "तेज़ निर्णय"), L("Protective leadership", "रक्षक नेतृत्व")],
    [L("Patience & loyalty", "धैर्य और वफादारी"), L("Aesthetic sense", "सौंदर्य बोध"), L("Financial grounding", "आर्थिक नींव")],
    [L("Communication", "संवाद"), L("Adaptability", "अनुकूलन"), L("Learning speed", "सीखने की गति")],
    [L("Empathy", "सहानुभूति"), L("Memory & care", "स्मृति और देखभाल"), L("Intuitive timing", "सहज समय")],
    [L("Creativity", "रचनात्मकता"), L("Warm leadership", "गर्म नेतृत्व"), L("Generosity", "उदारता")],
    [L("Precision", "सटीकता"), L("Problem-solving", "समस्या समाधान"), L("Service mindset", "सेवा भाव")],
    [L("Diplomacy", "कूटनीति"), L("Fairness", "निष्पक्षता"), L("Aesthetic balance", "सौंदर्य संतुलन")],
    [L("Focus & depth", "फोकस और गहराई"), L("Loyalty", "वफादारी"), L("Transformative insight", "रूपांतरीय दृष्टि")],
    [L("Optimism", "आशावाद"), L("Teaching gift", "शिक्षण वरदान"), L("Big-picture vision", "बड़ी तस्वीर")],
    [L("Discipline", "अनुशासन"), L("Long-term planning", "दीर्घ योजना"), L("Reliable leadership", "विश्वसनीय नेतृत्व")],
    [L("Innovation", "नवाचार"), L("Network thinking", "नेटवर्क सोच"), L("Humanitarian ideals", "मानवीय आदर्श")],
    [L("Imagination", "कल्पना"), L("Compassion", "करुणा"), L("Spiritual sensitivity", "आध्यात्मिक संवेदन")],
  ];
  return packs[i];
}

function challengesFor(i: number): LocaleText[] {
  const packs: LocaleText[][] = [
    [L("Impatience", "अधीरता"), L("Incomplete projects", "अधूरे प्रोजेक्ट"), L("Blunt speech", "कठोर वाणी")],
    [L("Resistance to change", "बदलाव से इनकार"), L("Stubborn comfort zones", "हठ आराम क्षेत्र"), L("Possessiveness", "अधिकार भावना")],
    [L("Scattered focus", "बिखरा फोकस"), L("Restless nerves", "बेचैन नसें"), L("Inconsistent follow-through", "अनियमित पालन")],
    [L("Mood swings", "मूड स्विंग"), L("Over-attachment", "अत्यधिक लगाव"), L("Indirect needs", "अप्रत्यक्ष जरूरतें")],
    [L("Pride sensitivity", "गर्व की संवेदनशीलता"), L("Need for applause", "प्रशंसा की चाह"), L("Drama under stress", "तनाव में नाटक")],
    [L("Over-criticism", "अति आलोचना"), L("Worry loops", "चिंता चक्र"), L("Perfection delay", "पूर्णता विलंब")],
    [L("Indecision", "अनिर्णय"), L("People-pleasing", "सबको खुश रखना"), L("Avoided conflict", "टाला संघर्ष")],
    [L("Control habits", "नियंत्रण आदतें"), L("Secretive silence", "गुप्त चुप्पी"), L("All-or-nothing intensity", "सब-या-कुछ तीव्रता")],
    [L("Over-promising", "अधिक वादा"), L("Restless escape", "बेचैन पलायन"), L("Preachy tone", "उपदेश स्वर")],
    [L("Workaholism", "वर्कहॉलिज़्म"), L("Emotional reserve", "भावनात्मक दूरी"), L("Harsh self-standards", "कठोर आत्म-मानक")],
    [L("Detachment", "अलगाव"), L("Rebel without plan", "बिना योजना विद्रोह"), L("Ideas without ownership", "बिना मालिक विचार")],
    [L("Boundary blur", "सीमा धुंधलापन"), L("Escapism", "पलायन"), L("Vague goals", "अस्पष्ट लक्ष्य")],
  ];
  return packs[i];
}

function remediesFor(i: number): LocaleText[] {
  const packs: LocaleText[][] = [
    [L("Channel Mars into sport before hard talks", "कठिन बात से पहले मंगल ऊर्जा खेल में निकालें"), L("Tuesday simple red offering or Hanuman remembrance", "मंगलवार सरल लाल अर्पण या हनुमान स्मरण"), L("Finish one started task daily", "रोज़ एक अधूरा काम पूरा करें")],
    [L("Keep a small beauty or garden ritual", "छोटी सुंदरता या बाग अनुष्ठान रखें"), L("Friday gratitude for what already supports you", "शुक्रवार पहले से सहारे के लिए कृतज्ञता"), L("Practice one flexible change a week", "सप्ताह में एक लचीला बदलाव")],
    [L("Write three priorities before opening messages", "संदेश खोलने से पहले तीन प्राथमिकताएँ लिखें"), L("Wednesday green walk for nervous calm", "बुधवार नसों हेतु हरी सैर"), L("Deep-dive one skill for 25 focused minutes", "एक कौशल पर 25 मिनट गहराई")],
    [L("Warm meals and earlier sleep", "गुनगुना भोजन और जल्दी नींद"), L("Monday moonlit quiet or water nearness", "सोमवार शांत चंद्र/जल निकटता"), L("Say one need out loud instead of hinting", "संकेत नहीं, एक जरूरत ज़ोर से कहें")],
    [L("Create something small to share weekly", "साप्ताहिक कुछ छोटा बनाकर साझा करें"), L("Sunday sunrise gratitude", "रविवार सूर्योदय कृतज्ञता"), L("Praise someone else before seeking praise", "प्रशंसा माँगने से पहले किसी और की करें")],
    [L("Declutter one drawer or inbox daily", "रोज़ एक दराज/इनबॉक्स साफ़ करें"), L("Gentle gut routine — fibre and walks", "कोमल पाचन दिनचर्या — फाइबर और सैर"), L("Replace critique with one helpful suggestion", "आलोचना को एक सहायक सुझाव से बदलें")],
    [L("Decide with a 10-minute timer when stuck", "अटकने पर 10 मिनट टाइमर से निर्णय"), L("Friday aesthetic reset of your workspace", "शुक्रवार कार्यस्थल सौंदर्य रीसेट"), L("Practice fair disagreement kindly", "निष्पक्ष असहमति कोमलता से")],
    [L("Journal privately instead of silent resentment", "चुप नाराज़गी की जगह निजी जर्नल"), L("Tuesday disciplined workout for intensity", "मंगलवार अनुशासित व्यायाम"), L("One act of transparent trust weekly", "साप्ताहिक एक पारदर्शी विश्वास")],
    [L("Schedule adventure inside a budget", "बजट के अंदर रोमांच निर्धारित करें"), L("Thursday learning or mentoring time", "गुरुवार सीखने/मार्गदर्शन समय"), L("Convert one belief into a measurable habit", "एक विश्वास को मापने योग्य आदत बनाएँ")],
    [L("Block recovery hours like meetings", "रिकवरी घंटे मीटिंग की तरह ब्लॉक करें"), L("Saturday service or slow planning ritual", "शनिवार सेवा या धीमी योजना"), L("Speak appreciation to family out loud", "परिवार की प्रशंसा ज़ोर से कहें")],
    [L("Prototype ideas with a named next owner", "विचार का प्रोटोटाइप — अगला मालिक नामित"), L("Hydration + novel movement for ankles/nerves", "पानी + टखनों हेतु नई गति"), L("One offline human check-in daily", "रोज़ एक ऑफलाइन मानवीय संपर्क")],
    [L("Creative or prayer time before screens", "स्क्रीन से पहले रचना/प्रार्थना समय"), L("Feet care and salt-water soak weekly", "साप्ताहिक पाँव देखभाल/नमक पानी"), L("Write dream → one tiny daily dock action", "सपना लिखें → एक छोटी रोज़ क्रिया")],
  ];
  return packs[i];
}

function doDont(i: number): { doList: LocaleText[]; dontList: LocaleText[] } {
  return {
    doList: [
      L(`Lead with ${SIGNS[i].en}’s natural gift today`, `आज ${SIGNS[i].hi} की स्वाभाविक देन से आगे बढ़ें`),
      L("Pair intuition with one practical next step", "अंतर्ज्ञान को एक व्यावहारिक अगले कदम से जोड़ें"),
      L("Check Moon sign timing before major talks", "बड़ी बात से पहले चंद्र राशि समय देखें"),
    ],
    dontList: [
      L("Ignore body signals for the sake of speed", "गति के लिए शरीर संकेत न अनदेखा करें"),
      L("Treat a general horoscope as fixed fate", "सामान्य राशिफल को तय किस्मत न मानें"),
      L("Skip rest when your ruling planet is stressed", "शासक ग्रह दबाव में हो तो आराम न छोड़ें"),
    ],
  };
}

function deepGuide(i: number): LocaleText[] {
  const n = SIGNS[i];
  const r = SIGN_LORDS[i];
  return [
    L(
      `A complete ${n.en} horoscope page should answer more than “will today be good?” Searchers look for ${n.en} daily horoscope, weekly forecast, monthly prediction, lucky colour, lucky number, ruling planet ${r.en}, career guidance, love compatibility and simple remedies. CosmicTalks combines classical Jyotish language with clear modern English so both beginners and experienced readers can use this page as a reliable reference.`,
      `पूर्ण ${n.hi} राशिफल पृष्ठ केवल “आज अच्छा होगा?” से अधिक उत्तर दे। लोग ${n.hi} दैनिक राशिफल, साप्ताहिक, मासिक, लकी रंग-नंबर, शासक ${r.hi}, करियर, प्रेम अनुकूलता और सरल उपाय खोजते हैं। CosmicTalks शास्त्रीय ज्योतिष भाषा को स्पष्ट आधुनिक शैली से जोड़ता है।`
    ),
    L(
      `In Vedic practice, many astrologers prefer the Moon sign (Chandra Rashi) for day-to-day guidance because the Moon reflects the mind and fluctuating mood. Your Sun sign still describes core vitality. For precision beyond any free ${n.en} horoscope, generate a full kundli with birth time and place, then ask CosmicTalks AI Guru about dasha periods, yogas and house lords specific to you.`,
      `वैदिक परंपरा में दैनिक मार्गदर्शन हेतु अक्सर चंद्र राशि प्राथमिक है क्योंकि चंद्र मन और बदलते मूड को दर्शाता है। सूर्य राशि मूल ऊर्जा बताती है। मुफ़्त ${n.hi} राशिफल से आगे सटीकता के लिए जन्म समय-स्थान से पूर्ण कुंडली बनाएँ और CosmicTalks एआई गुरु से दशा, योग व भावेश पूछें।`
    ),
    L(
      `Use this ${n.en} forecast as timing weather: supportive windows for action, quieter windows for repair. Pair it with today’s panchang (tithi, nakshatra, yoga) when choosing muhurat for travel, contracts or family rituals. That combination — sign horoscope + panchang + personal chart — is how intelligent astrology stays useful without fear-mongering.`,
      `इस ${n.hi} पूर्वानुमान को समय के मौसम की तरह लें: क्रिया के सहायक पल, मरम्मत के शांत पल। यात्रा, अनुबंध या पारिवारिक अनुष्ठान हेतु आज के पंचांग (तिथि, नक्षत्र, योग) से जोड़ें। राशिफल + पंचांग + व्यक्तिगत कुंडली — यही बुद्धिमान ज्योतिष है, भय के बिना।`
    ),
  ];
}

function aiInsight(i: number): LocaleText {
  const n = SIGNS[i];
  const r = SIGN_LORDS[i];
  return L(
    `AI Guru tip for ${n.en}: track where ${r.en} is active in your natal chart and current transits. General ${n.en} horoscopes describe the sign’s weather; your kundli shows which houses that weather is raining on — career, marriage, health or wealth. Ask AI Guru with your birth details for a chart-grounded answer.`,
    `${n.hi} के लिए एआई गुरु सुझाव: जन्म कुंडली और वर्तमान गोचर में ${r.hi} कहाँ सक्रिय है देखें। सामान्य ${n.hi} राशिफल राशि का मौसम बताता है; कुंडली बताती है वह मौसम किस भाव पर बरस रहा है — करियर, विवाह, स्वास्थ्य या धन। जन्म विवरण देकर एआई गुरु से चार्ट-आधारित उत्तर लें।`
  );
}

function faqsFor(i: number): { q: LocaleText; a: LocaleText }[] {
  const n = SIGNS[i];
  const r = SIGN_LORDS[i];
  const metaLucky = ["9", "6", "5", "2", "1", "5", "6", "9", "3", "8", "4", "3"][i];
  return [
    {
      q: L(`What is the ${n.en} horoscope for today?`, `आज का ${n.hi} राशिफल क्या है?`),
      a: L(
        `Open the Daily tab above for today’s ${n.en} guidance across love, career, money, health and family. It is general Moon-sign style guidance and updates with each new day.`,
        `प्रेम, करियर, धन, स्वास्थ्य और परिवार हेतु आज के ${n.hi} मार्गदर्शन के लिए ऊपर दैनिक टैब खोलें। यह सामान्य चंद्र-राशि शैली मार्गदर्शन है और हर नए दिन अपडेट होता है।`
      ),
    },
    {
      q: L(`Which planet rules ${n.en}?`, `${n.hi} का स्वामी ग्रह कौन है?`),
      a: L(
        `${n.en} is ruled by ${r.en}. The tone of ${n.en} daily, weekly and monthly forecasts often moves with ${r.en}’s strength and transit activity.`,
        `${n.hi} पर ${r.hi} की अधिपति शक्ति है। ${n.hi} दैनिक-साप्ताहिक-मासिक स्वर अक्सर ${r.hi} के बल और गोचर से चलता है।`
      ),
    },
    {
      q: L(`What is the lucky number for ${n.en}?`, `${n.hi} का लकी नंबर क्या है?`),
      a: L(
        `Traditionally, ${metaLucky} is considered a supportive number for ${n.en}, alongside the lucky colour and weekday listed in the glass cards on this page.`,
        `परंपरा में ${metaLucky} ${n.hi} के लिए सहायक नंबर माना जाता है — साथ ही इस पृष्ठ के ग्लास कार्ड में लकी रंग और दिन देखें।`
      ),
    },
    {
      q: L(`Is ${n.en} horoscope based on Sun or Moon sign?`, `${n.hi} राशिफल सूर्य या चंद्र पर?`),
      a: L(
        `CosmicTalks presents Vedic-style guidance preferring Moon sign for daily life, while Sun sign remains useful context. For personal accuracy, use your full kundli.`,
        `CosmicTalks वैदिक शैली में दैनिक जीवन हेतु चंद्र राशि प्राथमिक रखता है; सूर्य राशि सहायक संदर्भ है। व्यक्तिगत सटीकता हेतु पूर्ण कुंडली उपयोग करें।`
      ),
    },
    {
      q: L(`How can I get a personalised ${n.en} reading?`, `व्यक्तिगत ${n.hi} पढ़ाई कैसे लूँ?`),
      a: L(
        `Create a free kundli with birth date, time and place, then chat with AI Guru. The assistant grounds answers in your lagna, Moon, dasha and yogas — far beyond a general ${n.en} sign page.`,
        `जन्म तिथि, समय और स्थान से मुफ़्त कुंडली बनाएँ, फिर एआई गुरु से बात करें। सहायक लग्न, चंद्र, दशा और योग पर उत्तर देता है — सामान्य ${n.hi} पृष्ठ से कहीं आगे।`
      ),
    },
  ];
}

export const HOROSCOPE_SEO: HoroscopeSeo[] = ZODIAC_SLUGS.map((slug, i) => {
  const { doList, dontList } = doDont(i);
  return {
    slug,
    tagline: TAGLINES[i],
    personality: PERSONALITY[i],
    strengths: strengthsFor(i),
    challenges: challengesFor(i),
    bodyFocus: BODY[i],
    careerFields: CAREERS[i],
    bestMatches: MATCH_BEST[i],
    watchMatches: MATCH_WATCH[i],
    remedies: remediesFor(i),
    doList,
    dontList,
    deepGuide: deepGuide(i),
    aiInsight: aiInsight(i),
    faqs: faqsFor(i),
  };
});

export function getHoroscopeSeo(slug: string): HoroscopeSeo | undefined {
  return HOROSCOPE_SEO.find((s) => s.slug === slug);
}
