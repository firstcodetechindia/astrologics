import type { CalculatorMeta, CalcInputType } from "@/lib/calculators/catalog";

export type LocaleText = { en: string; hi: string };

export type CalcFormConfig = {
  /** Show a personal name field (only when it affects the tool). */
  askName: boolean;
  /** Dual-birth partner names are optional labels when false. */
  nameRequired: boolean;
  dateLabel: LocaleText;
  timeLabel: LocaleText;
  placeLabel: LocaleText;
  valueLabel: LocaleText;
  hint?: LocaleText;
};

const L = (en: string, hi: string): LocaleText => ({ en, hi });

const DEFAULTS: Record<
  CalcInputType,
  Pick<CalcFormConfig, "askName" | "nameRequired" | "dateLabel" | "timeLabel" | "placeLabel" | "valueLabel">
> = {
  birth: {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date of birth", "जन्म तिथि"),
    timeLabel: L("Birth time", "जन्म समय"),
    placeLabel: L("Place of birth", "जन्म स्थान"),
    valueLabel: L("Value", "मान"),
  },
  "birth-optional-time": {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date of birth", "जन्म तिथि"),
    timeLabel: L("Birth time (optional)", "जन्म समय (वैकल्पिक)"),
    placeLabel: L("Place of birth", "जन्म स्थान"),
    valueLabel: L("Value", "मान"),
  },
  "dual-birth": {
    askName: true,
    nameRequired: false,
    dateLabel: L("Date of birth", "जन्म तिथि"),
    timeLabel: L("Birth time", "जन्म समय"),
    placeLabel: L("Place of birth", "जन्म स्थान"),
    valueLabel: L("Value", "मान"),
  },
  names: {
    askName: true,
    nameRequired: true,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Name", "नाम"),
  },
  number: {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Number (1–249)", "संख्या (1–249)"),
  },
  date: {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Value", "मान"),
  },
  "date-year": {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date of birth", "जन्म तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Value", "मान"),
  },
  "name-date": {
    askName: true,
    nameRequired: true,
    dateLabel: L("Date of birth", "जन्म तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Name", "नाम"),
  },
  value: {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Number / value", "नंबर / मान"),
  },
  "dual-date": {
    askName: false,
    nameRequired: false,
    dateLabel: L("First date of birth", "पहली जन्म तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Value", "मान"),
  },
  "place-date": {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time (optional)", "समय (वैकल्पिक)"),
    placeLabel: L("City / place", "शहर / स्थान"),
    valueLabel: L("Value", "मान"),
  },
  none: {
    askName: false,
    nameRequired: false,
    dateLabel: L("Date", "तिथि"),
    timeLabel: L("Time", "समय"),
    placeLabel: L("Place", "स्थान"),
    valueLabel: L("Value", "मान"),
  },
};

const SLUG_OVERRIDES: Partial<Record<string, Partial<CalcFormConfig>>> = {
  "baby-name": {
    askName: false,
    dateLabel: L("Baby's date of birth", "शिशु की जन्म तिथि"),
    timeLabel: L("Birth time", "जन्म समय"),
    placeLabel: L("Place of birth", "जन्म स्थान"),
    hint: L(
      "We find the Moon sign (Rashi) and birth star first, then suggest auspicious starting letters — no name needed.",
      "पहले चंद्र राशि और जन्म नक्षत्र निकलते हैं, फिर शुभ आरंभ अक्षर सुझाए जाते हैं — नाम भरने की ज़रूरत नहीं।"
    ),
  },
  "moon-sign": {
    hint: L(
      "Enter birth details to find the Moon’s zodiac sign (Rashi).",
      "चंद्र राशि जानने के लिए जन्म विवरण भरें।"
    ),
  },
  "sun-sign": {
    hint: L(
      "Enter birth date (and place) for the Vedic Sun sign.",
      "वैदिक सूर्य राशि के लिए जन्म तिथि (और स्थान) भरें।"
    ),
  },
  lagna: {
    hint: L(
      "Rising sign needs an accurate birth time and place.",
      "लग्न के लिए सटीक जन्म समय और स्थान आवश्यक हैं।"
    ),
  },
  "birth-time-rectification": {
    hint: L(
      "Approximate birth time + at least 3 dated life events. Heuristic dasha alignment — not certificate-grade proof. Prefer hospital records.",
      "अनुमानित जन्म समय + कम से कम 3 दिनांकित घटनाएँ। दशा संरेखण अनुमान — प्रमाण नहीं। अस्पताल अभिलेख प्राथमिक।"
    ),
  },
  "kundli-matching": {
    askName: true,
    nameRequired: false,
    hint: L(
      "Names are optional labels. Matching uses both birth charts (Ashtakoot).",
      "नाम वैकल्पिक हैं। मिलान दोनों जन्म कुंडलियों (अष्टकूट) से होता है।"
    ),
  },
  "love-calculator": {
    askName: true,
    nameRequired: true,
    hint: L(
      "Only two names — no birth details. For marriage talks, use Kundli Matching.",
      "केवल दो नाम — जन्म विवरण नहीं। विवाह चर्चा हेतु कुंडली मिलान उपयोग करें।"
    ),
  },
  "name-numerology": {
    hint: L("Enter the name whose numbers you want to read.", "जिस नाम के अंक जानने हों, वही लिखें।"),
  },
  "business-name": {
    valueLabel: L("Business / brand name", "व्यवसाय / ब्रांड नाम"),
    hint: L("Analyse the spelling of the business or brand name.", "व्यवसाय या ब्रांड नाम की वर्तनी का विश्लेषण।"),
  },
  "name-correction": {
    hint: L(
      "Compare your current name number with birth Life Path / Radical.",
      "वर्तमान नाम अंक की तुलना जन्म लाइफ पाथ / रेडिकल से करें।"
    ),
  },
  "mobile-number": {
    valueLabel: L("Mobile number", "मोबाइल नंबर"),
    hint: L("Digits only — country code optional.", "केवल अंक — देश कोड वैकल्पिक।"),
  },
  "vehicle-number": {
    valueLabel: L("Vehicle registration", "वाहन रजिस्ट्रेशन"),
    hint: L("Enter the registration as written on the plate.", "प्लेट पर लिखा रजिस्ट्रेशन नंबर भरें।"),
  },
  "house-number": {
    valueLabel: L("House / flat number", "मकान / फ्लैट नंबर"),
  },
  "prashna-kundli": {
    dateLabel: L("Date of question", "प्रश्न तिथि"),
    timeLabel: L("Time of asking", "प्रश्न समय"),
    placeLabel: L("Place of asking", "प्रश्न स्थान"),
    hint: L(
      "Casts a chart for the moment you ask. Pick a topic — lean/caution only, not %-odds. Not medical or legal advice.",
      "जिस क्षण आप पूछते हैं उसी का चार्ट। विषय चुनें — केवल झुकाव/सावधानी, %-संभावना नहीं। चिकित्सकीय/कानूनी सलाह नहीं।"
    ),
  },
  "kp-horary": {
    hint: L(
      "Pick a number from 1–249 for the question you have in mind.",
      "अपने प्रश्न के लिए 1–249 में से एक संख्या चुनें।"
    ),
  },
  choghadiya: {
    hint: L(
      "Daily timing from sunrise — no birth chart. Choose city and date.",
      "सूर्योदय से दैनिक समय — जन्म कुंडली नहीं। शहर और तिथि चुनें।"
    ),
  },
  "rahu-kaal": {
    hint: L(
      "Inauspicious daytime window for your city — no birth details needed.",
      "आपके शहर का अशुभ दिन-खंड — जन्म विवरण की ज़रूरत नहीं।"
    ),
  },
  hora: {
    hint: L(
      "Planetary hours for the selected city and date.",
      "चुने शहर और तिथि की ग्रहीय होरा।"
    ),
  },
  "gowri-panchangam": {
    hint: L(
      "South-Indian day/night quality windows — city and date only.",
      "दक्षिण भारतीय दिन/रात गुणवत्ता खंड — केवल शहर और तिथि।"
    ),
  },
  "muhurta-electional": {
    dateLabel: L("Start date", "आरंभ तिथि"),
    placeLabel: L("Place", "स्थान"),
    hint: L(
      "Pick an activity and date range (max 14 days). Windows use daytime Choghadiya + Panchang — pass / caution / avoid only, no luck %. Optional natal Moon 8th filter is off by default.",
      "गतिविधि और तिथि सीमा चुनें (अधिकतम 14 दिन)। दिन चौघड़िया + पंचांग — केवल पास / सावधानी / बचें, भाग्य-% नहीं। जन्म चंद्र 8वाँ फ़िल्टर डिफ़ॉल्ट बंद।"
    ),
  },
  "today-panchang": {
    hint: L(
      "Tithi, nakshatra and related elements for a date at a place.",
      "किसी स्थान पर किसी तिथि की तिथि, नक्षत्र आदि।"
    ),
  },
  "birth-panchang": {
    hint: L(
      "Panchang at the moment of birth — date, time and place.",
      "जन्म क्षण का पंचांग — तिथि, समय और स्थान।"
    ),
  },
};

/** Purpose-driven form fields — never ask for data the tool does not use. */
export function getFormConfig(meta: CalculatorMeta): CalcFormConfig {
  const base = DEFAULTS[meta.input];
  const override = SLUG_OVERRIDES[meta.slug] || {};
  return {
    askName: override.askName ?? base.askName,
    nameRequired: override.nameRequired ?? base.nameRequired,
    dateLabel: override.dateLabel ?? base.dateLabel,
    timeLabel: override.timeLabel ?? base.timeLabel,
    placeLabel: override.placeLabel ?? base.placeLabel,
    valueLabel: override.valueLabel ?? base.valueLabel,
    hint: override.hint,
  };
}
