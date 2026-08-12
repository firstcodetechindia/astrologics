/**
 * Locked silent settings — the five choices that cause cross-platform chart
 * disagreement. Defaults match the Accuracy Hardening Blueprint.
 * Source of truth for Methodology + chart.settings.
 */
import { ASTRO_CONFIG } from "./config";

export type SilentSettingRow = {
  id:
    | "ayanamsa"
    | "node"
    | "house_system"
    | "sunrise_day_boundary"
    | "timezone";
  setting: { en: string; hi: string };
  currentDefault: { en: string; hi: string };
  justification: { en: string; hi: string };
  docText: { en: string; hi: string };
};

export const SILENT_SETTINGS: SilentSettingRow[] = [
  {
    id: "ayanamsa",
    setting: {
      en: "Ayanamsa variant",
      hi: "अयनांश प्रकार",
    },
    currentDefault: {
      en: "Lahiri (Chitrapaksha), date-specific",
      hi: "लाहिरी (चित्रापक्ष), तिथि-विशिष्ट",
    },
    justification: {
      en: "Indian Astronomical Ephemeris / Rashtriya Panchang standard; recomputed for the birth instant (not a fixed constant).",
      hi: "भारतीय खगोलीय पंचांग / राष्ट्रीय पंचांग मानक; जन्म क्षण पर पुनः गणना (स्थिर स्थिरांक नहीं)।",
    },
    docText: {
      en: "We use Lahiri (Chitrapaksha) ayanamsa, calculated fresh for your birth date. The numeric value used for your chart is stored with the result for auditability. Optional Raman / KP / True Chitrapaksha prefs exist for advanced use; the public default remains Lahiri.",
      hi: "हम लाहिरी (चित्रापक्ष) अयनांश उपयोग करते हैं, जो आपकी जन्म तिथि के लिए ताज़ा गणना होता है। कुंडली परिणाम में ऑडिट के लिए संख्यात्मक मान संग्रहीत रहता है। उन्नत उपयोग हेतु रामन / KP / सत्य चित्रापक्ष विकल्प उपलब्ध हैं; सार्वजनिक डिफ़ॉल्ट लाहिरी ही है।",
    },
  },
  {
    id: "node",
    setting: {
      en: "True vs Mean Node (Rahu/Ketu)",
      hi: "ट्रू बनाम मीन नोड (राहु/केतु)",
    },
    currentDefault: {
      en: "Mean Node",
      hi: "मीन नोड",
    },
    justification: {
      en: "Classical Parashari convention; matches most competitor defaults. True node remains experimental on astronomy-engine.",
      hi: "शास्त्रीय पाराशरी परंपरा; अधिकांश प्लेटफ़ॉर्म डिफ़ॉल्ट से मेल। ट्रू नोड astronomy-engine पर अभी प्रयोगात्मक है।",
    },
    docText: {
      en: "Rahu and Ketu default to the Mean Node (constant lunar-node rate). True Node (orbital wobble) is available as an advanced preference but is not the default, because classical Parashari practice and most Indian software use Mean Node.",
      hi: "राहु-केतु डिफ़ॉल्ट रूप से मीन नोड (स्थिर चंद्र-नोड दर) हैं। ट्रू नोड उन्नत विकल्प के रूप में उपलब्ध है, पर डिफ़ॉल्ट नहीं — क्योंकि शास्त्रीय पाराशरी और अधिकांश भारतीय सॉफ़्टवेयर मीन नोड उपयोग करते हैं।",
    },
  },
  {
    id: "house_system",
    setting: {
      en: "House system (per chart type)",
      hi: "भाव पद्धति (प्रति चार्ट प्रकार)",
    },
    currentDefault: {
      en: "D1 whole-sign · KP Placidus · Bhav Chalit Sripati",
      hi: "D1 पूर्ण-राशि · KP प्लैसिडस · भाव चलित श्रीपति",
    },
    justification: {
      en: "Parashari traditional whole-sign for primary D1; KP requires Placidus; Sripati for classical cusp (Bhav Chalit) view.",
      hi: "मुख्य D1 के लिए पाराशरी पूर्ण-राशि; KP के लिए प्लैसिडस; शास्त्रीय भाव-चलित हेतु श्रीपति।",
    },
    docText: {
      en: "Primary D1 (Rashi) houses use whole-sign from Lagna. The KP module uses Placidus cusps. Bhav Chalit uses Sripati (Bhava Madhya). We state the system per chart type rather than silently mixing them.",
      hi: "मुख्य D1 (राशि) भाव लग्न से पूर्ण-राशि पद्धति से हैं। KP मॉड्यूल प्लैसिडस कुस्प उपयोग करता है। भाव चलित श्रीपति (भाव मध्य) उपयोग करता है। हम प्रति चार्ट प्रकार पद्धति स्पष्ट करते हैं, उन्हें चुपचाप मिलाए बिना।",
    },
  },
  {
    id: "sunrise_day_boundary",
    setting: {
      en: "Sunrise-based day boundary",
      hi: "सूर्योदय-आधारित दिन सीमा",
    },
    currentDefault: {
      en: "Actual local sunrise (astronomy-engine)",
      hi: "वास्तविक स्थानीय सूर्योदय (astronomy-engine)",
    },
    justification: {
      en: "Vedic civil day / muhurta / daily Panchang timing starts at sunrise, not midnight or a fixed 6 AM assumption.",
      hi: "वैदिक दिन / मुहूर्त / दैनिक पंचांग समय सूर्योदय से शुरू होता है — मध्यरात्रि या कल्पित सुबह 6 बजे से नहीं।",
    },
    docText: {
      en: "For daily Panchang and muhurta, the Vedic day is bounded by actual sunrise and sunset at the selected place (computed with astronomy-engine), not by midnight and not by an assumed 6:00 AM. Birth-moment Tithi/Nakshatra/Yoga/Karana are still evaluated at the exact birth instant.",
      hi: "दैनिक पंचांग और मुहूर्त के लिए वैदिक दिन चुने हुए स्थान के वास्तविक सूर्योदय–सूर्यास्त से निर्धारित होता है (astronomy-engine), न कि मध्यरात्रि या कल्पित 6:00 AM से। जन्म-क्षण की तिथि/नक्षत्र/योग/करण फिर भी सटीक जन्म समय पर ही मूल्यांकित होते हैं।",
    },
  },
  {
    id: "timezone",
    setting: {
      en: "Historical timezone handling",
      hi: "ऐतिहासिक समय-क्षेत्र हैंडलिंग",
    },
    currentDefault: {
      en: "IANA tz database at birth instant",
      hi: "जन्म क्षण पर IANA टाइमज़ोन डेटाबेस",
    },
    justification: {
      en: "Civil offsets change over time (e.g. India wartime +06:30, pre-standard LMT). Fixed modern IST would misplace older charts.",
      hi: "सिविल ऑफ़सेट समय के साथ बदलते हैं (जैसे भारत युद्धकालीन +06:30, मानकीकरण-पूर्व LMT)। आधुनिक स्थिर IST पुरानी कुंडलियों को गलत कर सकता है।",
    },
    docText: {
      en: "Birth civil time is converted to UTC using the IANA time zone database for the place (India cities → Asia/Kolkata), applying the offset that was in effect on that date — including historical transitions present in the OS/runtime tzdata. Note: separate colonial city standards such as Bombay Time vs Madras Time are only as accurate as the IANA zone mapped for the coordinates; we do not invent custom city-time tables beyond IANA.",
      hi: "जन्म का सिविल समय स्थान के IANA टाइमज़ोन (भारत → Asia/Kolkata) से UTC में बदला जाता है, उसी तिथि पर लागू ऑफ़सेट सहित — OS/रनटाइम tzdata में मौजूद ऐतिहासिक परिवर्तनों के साथ। नोट: बॉम्बे टाइम बनाम मद्रास टाइम जैसे अलग औपनिवेशिक मानक केवल निर्देशांक से मैप किए गए IANA ज़ोन जितने सटीक हैं; हम IANA से परे कस्टम सिटी-टाइम टेबल नहीं बनाते।",
    },
  },
];

/** Engine defaults mirrored for chart.settings / UI. */
export const LOCKED_ENGINE_DEFAULTS = {
  ayanamsa: ASTRO_CONFIG.ayanamsa,
  nodeMode: ASTRO_CONFIG.nodeMode,
  houseSystemD1: ASTRO_CONFIG.houseSystem,
  houseSystemKp: "placidus" as const,
  houseSystemBhavChalit: "sripati" as const,
  dayBoundary: "sunrise" as const,
  timezoneMode: ASTRO_CONFIG.timezoneMode,
  ephemerisEngine: ASTRO_CONFIG.ephemerisEngine,
} as const;
