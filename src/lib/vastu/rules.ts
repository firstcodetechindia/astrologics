/**
 * Vastu Purusha Mandala zones + placement rules + non-structural remedies.
 * Spec: .cursor/skills/astro-vastu/SKILL.md
 */

export type Loc = { en: string; hi: string };

export type VastuDirection =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW"
  | "CENTER";

export type VastuRoom =
  | "entrance"
  | "kitchen"
  | "master_bedroom"
  | "pooja"
  | "study"
  | "bathroom"
  | "staircase"
  | "water"
  | "living"
  | "dining"
  | "guest"
  | "storage"
  | "children_bedroom";

export const DIRECTIONS: {
  id: VastuDirection;
  label: Loc;
  deity: Loc;
  element: Loc;
  theme: Loc;
}[] = [
  {
    id: "N",
    label: { en: "North (Uttar)", hi: "उत्तर" },
    deity: { en: "Kubera", hi: "कुबेर" },
    element: { en: "Prosperity / wealth axis", hi: "समृद्धि / धन अक्ष" },
    theme: {
      en: "Wealth, career openness, light and opportunity.",
      hi: "धन, करियर खुलापन, प्रकाश और अवसर।",
    },
  },
  {
    id: "NE",
    label: { en: "North-East (Ishaan)", hi: "ईशान (उत्तर-पूर्व)" },
    deity: { en: "Ishana", hi: "ईशान" },
    element: { en: "Water — sacred", hi: "जल — पवित्र" },
    theme: {
      en: "Most sacred zone — prayer, clarity, calm water energy.",
      hi: "सबसे पवित्र क्षेत्र — पूजा, स्पष्टता, शांत जल ऊर्जा।",
    },
  },
  {
    id: "E",
    label: { en: "East (Purva)", hi: "पूर्व" },
    deity: { en: "Indra / Sun", hi: "इंद्र / सूर्य" },
    element: { en: "Sun / positivity", hi: "सूर्य / सकारात्मकता" },
    theme: {
      en: "Main entrance favour, morning light, social positivity.",
      hi: "मुख्य द्वार अनुकूल, प्रातः प्रकाश, सामाजिक सकारात्मकता।",
    },
  },
  {
    id: "SE",
    label: { en: "South-East (Agneya)", hi: "आग्नेय (दक्षिण-पूर्व)" },
    deity: { en: "Agni", hi: "अग्नि" },
    element: { en: "Fire", hi: "अग्नि" },
    theme: {
      en: "Fire element — kitchen, cooking, controlled heat.",
      hi: "अग्नि तत्व — रसोई, पाक, नियंत्रित ऊष्मा।",
    },
  },
  {
    id: "S",
    label: { en: "South (Dakshin)", hi: "दक्षिण" },
    deity: { en: "Yama", hi: "यम" },
    element: { en: "Stability / heaviness", hi: "स्थिरता / भारीपन" },
    theme: {
      en: "Stability, storage, grounded rest.",
      hi: "स्थिरता, भंडारण, ठोस विश्राम।",
    },
  },
  {
    id: "SW",
    label: { en: "South-West (Nairutya)", hi: "नैरृत्य (दक्षिण-पश्चिम)" },
    deity: { en: "Nairutya / Rahu", hi: "नैरृत्य / राहु" },
    element: { en: "Earth — heaviest", hi: "पृथ्वी — सबसे भारी" },
    theme: {
      en: "Heaviest zone — master bedroom, anchors the home.",
      hi: "सबसे भारी क्षेत्र — मास्टर बेडरूम, घर का आधार।",
    },
  },
  {
    id: "W",
    label: { en: "West (Paschim)", hi: "पश्चिम" },
    deity: { en: "Varuna", hi: "वरुण" },
    element: { en: "Water / completion", hi: "जल / पूर्णता" },
    theme: {
      en: "Dining, study, evening activity and completion.",
      hi: "भोजन, अध्ययन, संध्या गतिविधि और पूर्णता।",
    },
  },
  {
    id: "NW",
    label: { en: "North-West (Vayavya)", hi: "वायव्य (उत्तर-पश्चिम)" },
    deity: { en: "Vayu", hi: "वायु" },
    element: { en: "Air", hi: "वायु" },
    theme: {
      en: "Movement — guest room, light storage, circulation.",
      hi: "गति — अतिथि कक्ष, हल्का भंडारण, परिसंचरण।",
    },
  },
  {
    id: "CENTER",
    label: { en: "Center (Brahmasthan)", hi: "ब्रह्मस्थान (केंद्र)" },
    deity: { en: "Brahma", hi: "ब्रह्मा" },
    element: { en: "Space — keep open", hi: "आकाश — खुला रखें" },
    theme: {
      en: "Must stay open and light — no heavy toilets, stairs or clutter.",
      hi: "खुला और हल्का रखें — भारी शौचालय, सीढ़ियाँ या अव्यवस्था नहीं।",
    },
  },
];

export type PlacementRule = {
  room: VastuRoom;
  label: Loc;
  ideal: VastuDirection[];
  avoid: VastuDirection[];
  weight: number;
  note: Loc;
};

export const PLACEMENT_RULES: PlacementRule[] = [
  {
    room: "entrance",
    label: { en: "Main entrance", hi: "मुख्य द्वार" },
    ideal: ["N", "E", "NE"],
    avoid: ["SW"],
    weight: 1.4,
    note: {
      en: "North, East or North-East welcomes light and opportunity; South-West entrance is classically avoided.",
      hi: "उत्तर, पूर्व या ईशान प्रकाश व अवसर लाते हैं; दक्षिण-पश्चिम द्वार शास्त्र में वर्जित।",
    },
  },
  {
    room: "kitchen",
    label: { en: "Kitchen", hi: "रसोई" },
    ideal: ["SE"],
    avoid: ["NE"],
    weight: 1.35,
    note: {
      en: "South-East (Agni) suits fire; North-East kitchen conflicts with the sacred water zone.",
      hi: "दक्षिण-पूर्व (अग्नि) रसोई के अनुकूल; ईशान में रसोई पवित्र जल क्षेत्र से टकराती है।",
    },
  },
  {
    room: "master_bedroom",
    label: { en: "Master bedroom", hi: "मास्टर बेडरूम" },
    ideal: ["SW"],
    avoid: ["NE"],
    weight: 1.25,
    note: {
      en: "South-West is the heaviest earth zone — ideal for the main couple’s rest.",
      hi: "दक्षिण-पश्चिम सबसे भारी पृथ्वी क्षेत्र — मुख्य दंपति विश्राम हेतु आदर्श।",
    },
  },
  {
    room: "pooja",
    label: { en: "Pooja / prayer room", hi: "पूजा कक्ष" },
    ideal: ["NE"],
    avoid: ["CENTER", "SW"],
    weight: 1.2,
    note: {
      en: "North-East is the sacred Ishaan zone. Avoid under stairs or beside bathrooms.",
      hi: "ईशान पवित्र क्षेत्र है। सीढ़ियों के नीचे या स्नानघर के पास न रखें।",
    },
  },
  {
    room: "study",
    label: { en: "Study room", hi: "अध्ययन कक्ष" },
    ideal: ["W", "N"],
    avoid: [],
    weight: 1.0,
    note: {
      en: "West or North supports focus and learning.",
      hi: "पश्चिम या उत्तर एकाग्रता और सीखने को सहारा देते हैं।",
    },
  },
  {
    room: "bathroom",
    label: { en: "Toilet / bathroom", hi: "शौचालय / स्नानघर" },
    ideal: ["NW"],
    avoid: ["NE", "CENTER"],
    weight: 1.15,
    note: {
      en: "North-West is preferred; never place in North-East or the Brahmasthan center.",
      hi: "उत्तर-पश्चिम अनुकूल; ईशान या ब्रह्मस्थान में कभी नहीं।",
    },
  },
  {
    room: "staircase",
    label: { en: "Staircase", hi: "सीढ़ियाँ" },
    ideal: ["S", "W", "SW"],
    avoid: ["CENTER", "NE"],
    weight: 1.1,
    note: {
      en: "South, West or South-West are classical; center and North-East are avoided.",
      hi: "दक्षिण, पश्चिम या दक्षिण-पश्चिम शास्त्रीय; केंद्र और ईशान वर्जित।",
    },
  },
  {
    room: "water",
    label: { en: "Water storage / borewell", hi: "जल भंडारण / बोरवेल" },
    ideal: ["NE"],
    avoid: ["SW"],
    weight: 1.1,
    note: {
      en: "North-East suits water; South-West water storage is avoided.",
      hi: "ईशान जल के अनुकूल; दक्षिण-पश्चिम में जल भंडारण वर्जित।",
    },
  },
  {
    room: "living",
    label: { en: "Living / drawing room", hi: "बैठक / ड्राइंग रूम" },
    ideal: ["N", "E", "NE"],
    avoid: ["SW"],
    weight: 0.95,
    note: {
      en: "North or East keeps the social zone bright and welcoming.",
      hi: "उत्तर या पूर्व सामाजिक क्षेत्र को उज्ज्वल और स्वागतयोग्य रखते हैं।",
    },
  },
  {
    room: "dining",
    label: { en: "Dining area", hi: "भोजन क्षेत्र" },
    ideal: ["W", "NW"],
    avoid: ["NE"],
    weight: 0.9,
    note: {
      en: "West / North-West dining is commonly preferred.",
      hi: "पश्चिम / उत्तर-पश्चिम भोजन क्षेत्र सामान्यतः अनुकूल।",
    },
  },
  {
    room: "guest",
    label: { en: "Guest room", hi: "अतिथि कक्ष" },
    ideal: ["NW"],
    avoid: ["SW"],
    weight: 0.85,
    note: {
      en: "North-West (air) suits temporary guests; keep master weight in South-West.",
      hi: "उत्तर-पश्चिम (वायु) अस्थायी अतिथियों हेतु; मास्टर भार दक्षिण-पश्चिम में रखें।",
    },
  },
  {
    room: "storage",
    label: { en: "Storage / heavy store", hi: "भंडार / भारी स्टोर" },
    ideal: ["SW", "S", "W"],
    avoid: ["NE", "CENTER"],
    weight: 0.85,
    note: {
      en: "Heavy storage belongs in Southern or Western zones — not the sacred North-East.",
      hi: "भारी भंडारण दक्षिण या पश्चिम में — पवित्र ईशान में नहीं।",
    },
  },
  {
    room: "children_bedroom",
    label: { en: "Children’s bedroom", hi: "बच्चों का कमरा" },
    ideal: ["W", "NW", "N"],
    avoid: ["SW"],
    weight: 0.9,
    note: {
      en: "West or North-West often used for children; keep South-West for the master suite.",
      hi: "बच्चों हेतु प्रायः पश्चिम या उत्तर-पश्चिम; दक्षिण-पश्चिम मास्टर हेतु।",
    },
  },
];

/** Non-structural remedies — preferred default per skill. */
export const REMEDIES: Record<
  VastuRoom,
  Partial<Record<VastuDirection, Loc>> & { default: Loc }
> = {
  entrance: {
    default: {
      en: "Keep the entrance well-lit, clutter-free and welcoming. A clean nameplate and soft warm light help when the direction is imperfect.",
      hi: "द्वार को रोशन, अव्यवस्था-मुक्त और स्वागतयोग्य रखें। दिशा अपूर्ण हो तो साफ नेमप्लेट व नरम गर्म प्रकाश मदद करते हैं।",
    },
    SW: {
      en: "Avoid heavy dark colours at a South-West door. Use bright lighting, a reflective metal nameplate facing North/East visually, and keep shoes outside — do not rebuild as first step.",
      hi: "दक्षिण-पश्चिम द्वार पर गहरे भारी रंग न रखें। उज्ज्वल प्रकाश, उत्तर/पूर्व की ओर धातु नेमप्लेट और जूते बाहर — पहले पुनर्निर्माण न करें।",
    },
  },
  kitchen: {
    default: {
      en: "Cook facing East when possible. Keep the stove clean; use warm colours (saffron/cream) and ensure good exhaust — symbolic fire order without moving walls.",
      hi: "संभव हो तो पूर्व मुख कर पकाएँ। चूल्हा साफ रखें; केसरिया/क्रीम रंग व अच्छा निकास — दीवार हटाए बिना अग्नि व्यवस्था।",
    },
    NE: {
      en: "North-East kitchen is a classic Dosha. Prefer a portable induction on a South-East wall if layout allows, keep NE sink/pooja side cleaner, use a small Agni symbol (lamp) in SE corner of the kitchen — avoid structural shift as default.",
      hi: "ईशान रसोई शास्त्रीय दोष है। संभव हो तो दक्षिण-पूर्व दीवार पर पोर्टेबल इंडक्शन, ईशान सिंक/पूजा तरफ साफ रखें, रसोई के आग्नेय कोने में छोटा दीपक — डिफ़ॉल्ट में ढाँचा न बदलें।",
    },
  },
  master_bedroom: {
    default: {
      en: "Sleep with head toward South or East. Keep SW corner heavier (wardrobe) and NE corner of the room lighter.",
      hi: "सिर दक्षिण या पूर्व की ओर रख कर सोएँ। कमरे का दक्षिण-पश्चिम कोना भारी (अलमारी), ईशान हल्का रखें।",
    },
    NE: {
      en: "Master bed in North-East is avoided. Shift bed toward SW of the same room if possible, keep NE clear for light/plants, use earth tones and avoid mirrors facing the bed.",
      hi: "ईशान में मास्टर बिस्तर वर्जित। संभव हो तो बिस्तर कमरे के दक्षिण-पश्चिम की ओर खिसकाएँ, ईशान हल्का/पौधे हेतु खुला, मिट्टी रंग, बिस्तर के सामने आईना न रखें।",
    },
  },
  pooja: {
    default: {
      en: "Face East or North while praying. Keep the altar elevated, clean and free of storage clutter.",
      hi: "पूजा करते समय पूर्व या उत्तर मुख। वेदी ऊँची, स्वच्छ और भंडारण अव्यवस्था से मुक्त।",
    },
    CENTER: {
      en: "Move the altar to a North-East wall niche if possible. Never leave pooja under a staircase; use a wall shelf in Ishaan instead of a heavy center structure.",
      hi: "संभव हो तो वेदी ईशान दीवार आला में ले जाएँ। सीढ़ियों के नीचे पूजा न रखें; केंद्र में भारी ढाँचे की जगह ईशान दीवार शेल्फ।",
    },
  },
  study: {
    default: {
      en: "Face East or North while studying. Keep the desk clutter-free; a small green plant on the North side supports focus.",
      hi: "अध्ययन में पूर्व या उत्तर मुख। डेस्क साफ; उत्तर तरफ छोटा हरा पौधा एकाग्रता सहारा देता है।",
    },
  },
  bathroom: {
    default: {
      en: "Keep the bathroom door closed, exhaust working, and colours light. A bowl of rock salt (changed weekly) is a common non-structural cleanser.",
      hi: "स्नानघर का दरवाज़ा बंद, निकास चालू, रंग हल्के। साप्ताहिक बदला सेंधा नमक का कटोरा सामान्य गैर-संरचनात्मक शुद्धि है।",
    },
    NE: {
      en: "Bathroom in North-East is a serious Dosha. Keep it meticulously dry/clean, door always shut, place a Vastu pyramid or copper strip near the outer NE wall of the home as a symbolic buffer — structural relocation only if renovating.",
      hi: "ईशान में स्नानघर गंभीर दोष। अत्यंत सूखा/साफ रखें, दरवाज़ा बंद, घर की बाहरी ईशान दीवार पर वास्तु पिरामिड या ताँबे की पट्टी प्रतीकात्मक बफर — संरचना केवल नवीनीकरण पर।",
    },
    CENTER: {
      en: "Center bathroom conflicts with Brahmasthan. Prioritise dryness, light colours, closed door, and keep the surrounding hall open and uncluttered.",
      hi: "केंद्र स्नानघर ब्रह्मस्थान से टकराता है। सूखापन, हल्के रंग, बंद द्वार प्राथमिकता; आसपास का हॉल खुला व अव्यवस्था-मुक्त।",
    },
  },
  staircase: {
    default: {
      en: "Climb clockwise if possible. Keep stairs well-lit; avoid storage clutter under North-East stair voids.",
      hi: "संभव हो तो दक्षिणावर्त चढ़ें। सीढ़ियाँ रोशन रखें; ईशान सीढ़ी खाली जगह के नीचे भंडारण अव्यवस्था न रखें।",
    },
    CENTER: {
      en: "Central stairs burden Brahmasthan. Soften with light paint, open risers if safe, and keep the landing free of heavy cabinets.",
      hi: "केंद्रीय सीढ़ियाँ ब्रह्मस्थान पर भार। हल्का रंग, सुरक्षित खुले राइज़र, लैंडिंग पर भारी अलमारी न रखें।",
    },
    NE: {
      en: "North-East stairs are avoided. Brighten the NE, avoid toilets under that flight, and use light décor rather than dark heavy finishes.",
      hi: "ईशान सीढ़ियाँ वर्जित। ईशान उज्ज्वल रखें, उस उड़ान के नीचे शौचालय न हो, गहरे भारी फिनिश की जगह हल्की सजावट।",
    },
  },
  water: {
    default: {
      en: "Keep water tanks clean and covered. A clean NE water source is auspicious when present.",
      hi: "पानी की टंकियाँ साफ और ढकी रखें। साफ ईशान जल स्रोत शुभ माना जाता है।",
    },
    SW: {
      en: "South-West water storage is classically avoided. Prefer covered portable storage moved toward North/NE if feasible; keep SW dry and heavy with furniture instead.",
      hi: "दक्षिण-पश्चिम जल भंडारण शास्त्र में वर्जित। संभव हो तो ढका पोर्टेबल भंडारण उत्तर/ईशान की ओर; दक्षिण-पश्चिम सूखा व फर्नीचर से भारी रखें।",
    },
  },
  living: {
    default: {
      en: "Place heavier sofas toward South/West walls; keep North and East more open for light and air.",
      hi: "भारी सोफे दक्षिण/पश्चिम दीवारों की ओर; उत्तर व पूर्व प्रकाश और हवा हेतु अधिक खुले।",
    },
  },
  dining: {
    default: {
      en: "Diners preferably face East or North. Keep the table tidy; avoid mirrors that create restless meal energy if they feel agitating.",
      hi: "भोजन करने वाले अधिमानतः पूर्व या उत्तर मुख। मेज़ साफ; यदि बेचैन लगे तो अस्थिर भोजन ऊर्जा वाले आईने से बचें।",
    },
  },
  guest: {
    default: {
      en: "Keep guest rooms airy and less permanently loaded than the master suite — suitcases over built-in bulk in SW.",
      hi: "अतिथि कक्ष हवादार और मास्टर से कम स्थायी भार वाला रखें — दक्षिण-पश्चिम में भारी बिल्ट-इन की जगह सूटकेस।",
    },
  },
  storage: {
    default: {
      en: "Stack heavy items South or West. Keep North-East free of junk and cardboard piles.",
      hi: "भारी सामान दक्षिण या पश्चिम में रखें। ईशान को कबाड़ और गत्ते के ढेर से मुक्त रखें।",
    },
  },
  children_bedroom: {
    default: {
      en: "Study desk facing East/North; soft blues/greens; avoid sharp clutter under the bed.",
      hi: "डेस्क पूर्व/उत्तर मुख; नरम नीला/हरा; बिस्तर के नीचे तीखा कबाड़ न रखें।",
    },
  },
};

export function directionMeta(id: VastuDirection) {
  return DIRECTIONS.find((d) => d.id === id)!;
}

export function ruleFor(room: VastuRoom) {
  return PLACEMENT_RULES.find((r) => r.room === room)!;
}

export function remedyFor(room: VastuRoom, direction: VastuDirection): Loc {
  const pack = REMEDIES[room];
  return pack[direction] ?? pack.default;
}
