/** Client-side astrologer partner auth until backend is wired. */

import {
  DEV_OTP,
  formatPhoneDisplay,
  normalizePhone,
  verifyDevOtp,
} from "@/lib/auth/client-auth";

export { DEV_OTP, formatPhoneDisplay, normalizePhone, verifyDevOtp };

const ASTROLOGERS_KEY = "cosmicgpt_astrologers_v1";
const ASTROLOGER_SESSION_KEY = "cosmicgpt_astrologer_session_v1";

export type AstrologerOption = { id: string; en: string; hi: string };
export type AstrologerOptionSection = {
  id: string;
  en: string;
  hi: string;
  options: readonly AstrologerOption[];
};

export const ASTROLOGER_SKILL_SECTIONS: readonly AstrologerOptionSection[] = [
  {
    id: "systems",
    en: "Astrology systems",
    hi: "ज्योतिष पद्धतियाँ",
    options: [
      { id: "vedic", en: "Vedic Astrology", hi: "वैदिक ज्योतिष" },
      { id: "kp", en: "KP System", hi: "केपी पद्धति" },
      { id: "nadi", en: "Nadi Astrology", hi: "नाड़ी ज्योतिष" },
      { id: "western", en: "Western Astrology", hi: "पश्चिमी ज्योतिष" },
      { id: "lal-kitab", en: "Lal Kitab", hi: "लाल किताब" },
    ],
  },
  {
    id: "practices",
    en: "Other practices",
    hi: "अन्य अभ्यास",
    options: [
      { id: "tarot", en: "Tarot Reading", hi: "टैरो रीडिंग" },
      { id: "numerology", en: "Numerology", hi: "अंक ज्योतिष" },
      { id: "vastu", en: "Vastu", hi: "वास्तु" },
      { id: "palmistry", en: "Palmistry", hi: "हस्तरेखा" },
      { id: "marriage", en: "Marriage Matching", hi: "विवाह मिलान" },
    ],
  },
] as const;

export const ASTROLOGER_LANGUAGE_SECTIONS: readonly AstrologerOptionSection[] = [
  {
    id: "primary",
    en: "Primary",
    hi: "मुख्य",
    options: [
      { id: "hi", en: "Hindi", hi: "हिंदी" },
      { id: "en", en: "English", hi: "अंग्रेज़ी" },
    ],
  },
  {
    id: "regional",
    en: "Regional",
    hi: "क्षेत्रीय",
    options: [
      { id: "bn", en: "Bengali", hi: "बांग्ला" },
      { id: "mr", en: "Marathi", hi: "मराठी" },
      { id: "te", en: "Telugu", hi: "तेलुगु" },
      { id: "ta", en: "Tamil", hi: "तमिल" },
      { id: "gu", en: "Gujarati", hi: "गुजराती" },
      { id: "kn", en: "Kannada", hi: "कन्नड़" },
      { id: "ml", en: "Malayalam", hi: "मलयालम" },
      { id: "pa", en: "Punjabi", hi: "पंजाबी" },
    ],
  },
] as const;

export const ASTROLOGER_CATEGORY_SECTIONS: readonly AstrologerOptionSection[] = [
  {
    id: "life",
    en: "Life & relationships",
    hi: "जीवन व संबंध",
    options: [
      { id: "love", en: "Love", hi: "प्रेम" },
      { id: "marriage", en: "Marriage", hi: "विवाह" },
      { id: "health", en: "Health", hi: "स्वास्थ्य" },
      { id: "education", en: "Education", hi: "शिक्षा" },
    ],
  },
  {
    id: "work",
    en: "Work & money",
    hi: "काम व धन",
    options: [
      { id: "career", en: "Career", hi: "करियर" },
      { id: "finance", en: "Finance", hi: "वित्त" },
      { id: "business", en: "Business", hi: "व्यवसाय" },
    ],
  },
] as const;

export const ASTROLOGER_SKILLS = ASTROLOGER_SKILL_SECTIONS.flatMap((s) => s.options);
export const ASTROLOGER_LANGUAGES = ASTROLOGER_LANGUAGE_SECTIONS.flatMap(
  (s) => s.options
);
export const ASTROLOGER_CATEGORIES = ASTROLOGER_CATEGORY_SECTIONS.flatMap(
  (s) => s.options
);

export type AstrologerStatus = "pending" | "verified" | "rejected";

export type AstrologerProfile = {
  phone: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  gender: "male" | "female" | "other";
  skills: string[];
  languages: string[];
  categories: string[];
  status: AstrologerStatus;
  createdAt: string;
  updatedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAstrologers(): AstrologerProfile[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(ASTROLOGERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AstrologerProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAstrologers(list: AstrologerProfile[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(ASTROLOGERS_KEY, JSON.stringify(list));
}

export function getAstrologerSession(): AstrologerProfile | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(ASTROLOGER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AstrologerProfile;
  } catch {
    return null;
  }
}

export function setAstrologerSession(profile: AstrologerProfile) {
  if (!canUseStorage()) return;
  localStorage.setItem(ASTROLOGER_SESSION_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("cosmicgpt-astrologer-auth-changed"));
}

export function clearAstrologerSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(ASTROLOGER_SESSION_KEY);
  window.dispatchEvent(new Event("cosmicgpt-astrologer-auth-changed"));
}

export function findAstrologerByPhone(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) return null;
  return readAstrologers().find((a) => a.phone === phone) || null;
}

export function registerAstrologer(input: {
  phone: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  gender: AstrologerProfile["gender"];
  skills: string[];
  languages: string[];
  categories: string[];
}): { profile: AstrologerProfile } | { error: string } {
  const phone = normalizePhone(input.phone);
  if (!phone) return { error: "invalid_phone" };
  if (!input.firstName.trim()) return { error: "invalid_name" };
  if (!input.lastName.trim()) return { error: "invalid_last_name" };
  if (input.skills.length === 0) return { error: "skills_required" };
  if (input.languages.length === 0) return { error: "languages_required" };
  if (input.categories.length === 0) return { error: "categories_required" };

  const email = input.email?.trim() || undefined;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "invalid_email" };
  }

  const existing = findAstrologerByPhone(phone);
  if (existing) return { error: "already_registered" };

  const now = new Date().toISOString();
  const profile: AstrologerProfile = {
    phone,
    firstName: input.firstName.trim(),
    middleName: input.middleName?.trim() || undefined,
    lastName: input.lastName.trim(),
    email,
    gender: input.gender,
    skills: input.skills,
    languages: input.languages,
    categories: input.categories,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  writeAstrologers([...readAstrologers(), profile]);
  setAstrologerSession(profile);
  return { profile };
}

export function loginAstrologer(
  phoneRaw: string
): { profile: AstrologerProfile } | { error: string } {
  const phone = normalizePhone(phoneRaw);
  if (!phone) return { error: "invalid_phone" };
  const profile = findAstrologerByPhone(phone);
  if (!profile) return { error: "not_found" };
  setAstrologerSession(profile);
  return { profile };
}

export function displayAstrologerName(profile: AstrologerProfile) {
  return [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");
}
