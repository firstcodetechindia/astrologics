export type LocaleText = { en: string; hi: string };

export type LearnCategory = "vedic" | "western" | "guides" | "reference";

export type LearnSection = {
  heading: LocaleText;
  paragraphs: LocaleText[];
  bullets?: LocaleText[];
};

export type LearnCard = {
  icon?: string;
  title: LocaleText;
  subtitle?: LocaleText;
  body: LocaleText;
  tags?: LocaleText[];
};

export type LearnGuide = {
  slug: string;
  category: LearnCategory;
  icon: string;
  menuTitle: LocaleText;
  menuDescription: LocaleText;
  title: LocaleText;
  subtitle: LocaleText;
  description: LocaleText;
  intro: LocaleText[];
  sections: LearnSection[];
  cards?: LearnCard[];
  relatedSlugs?: string[];
  relatedCalculator?: string;
};

export function pickLocale(locale: string, t: LocaleText) {
  return locale === "hi" ? t.hi : t.en;
}
