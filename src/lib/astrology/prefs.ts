/**
 * Multi-ayanamsa helpers for chart prefs (astronomy-engine based).
 * Offsets vs Lahiri follow common Indian software conventions (not SE SIDM enums).
 */
import {
  kpAyanamsaFromDate,
  lahiriAyanamsaFromDate,
  trueChitrapakshaAyanamsa,
} from "./ayanamsa";

export type AyanamsaId = "lahiri" | "raman" | "kp" | "true_chitra";
export type HouseSystemId = "whole_sign" | "sripati" | "placidus";
export type NodeModeId = "mean" | "true";

/** Raman ayanamsa ≈ Lahiri − 1°25′40″ (approx modern era). */
const RAMAN_FROM_LAHIRI_DEG = (1 * 3600 + 25 * 60 + 40) / 3600;

export function resolveAyanamsa(date: Date, id: AyanamsaId = "lahiri"): number {
  switch (id) {
    case "raman":
      return lahiriAyanamsaFromDate(date) - RAMAN_FROM_LAHIRI_DEG;
    case "kp":
      return kpAyanamsaFromDate(date);
    case "true_chitra":
      return trueChitrapakshaAyanamsa(date);
    case "lahiri":
    default:
      return lahiriAyanamsaFromDate(date);
  }
}

export const AYANAMSA_OPTIONS: {
  id: AyanamsaId;
  label: { en: string; hi: string };
}[] = [
  { id: "lahiri", label: { en: "Lahiri (Chitrapaksha)", hi: "लाहिरी (चित्रापक्ष)" } },
  { id: "raman", label: { en: "Raman", hi: "रामन" } },
  { id: "kp", label: { en: "Krishnamurti (KP)", hi: "कृष्णमूर्ति (KP)" } },
  {
    id: "true_chitra",
    label: { en: "True Chitrapaksha", hi: "सत्य चित्रापक्ष" },
  },
];

export const HOUSE_SYSTEM_OPTIONS: {
  id: HouseSystemId;
  label: { en: string; hi: string };
}[] = [
  { id: "whole_sign", label: { en: "Whole sign", hi: "पूर्ण राशि" } },
  { id: "sripati", label: { en: "Sripati (Bhav Chalit)", hi: "श्रीपति (भाव चलित)" } },
  { id: "placidus", label: { en: "Placidus", hi: "प्लैसिडस" } },
];
