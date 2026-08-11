/** Demo astrologer directory until live partner profiles are wired. */

export type AstrologerGender = "male" | "female";

export type AstrologerBadge =
  | "rising-star"
  | "top-choice"
  | "celebrity"
  | "new"
  | null;

export type ConsultCategory =
  | "love"
  | "education"
  | "career"
  | "marriage"
  | "health"
  | "wealth"
  | "finance"
  | "remedies"
  | "parents";

export type DirectoryAstrologer = {
  id: string;
  name: string;
  gender: AstrologerGender;
  image: string;
  verified: boolean;
  online: boolean;
  badge: AstrologerBadge;
  skills: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  ordersLabel: string;
  pricePerMin: number;
  firstChatFree: boolean;
  categories: ConsultCategory[];
  featured?: boolean;
};

export const CONSULT_CATEGORIES: {
  id: "all" | ConsultCategory;
  en: string;
  hi: string;
}[] = [
  { id: "all", en: "All", hi: "सभी" },
  { id: "love", en: "Love", hi: "प्रेम" },
  { id: "marriage", en: "Marriage", hi: "विवाह" },
  { id: "career", en: "Career", hi: "करियर" },
  { id: "education", en: "Education", hi: "शिक्षा" },
  { id: "health", en: "Health", hi: "स्वास्थ्य" },
  { id: "wealth", en: "Wealth", hi: "धन" },
  { id: "finance", en: "Finance", hi: "वित्त" },
  { id: "remedies", en: "Remedies", hi: "उपाय" },
  { id: "parents", en: "Parents", hi: "परिवार" },
];

export const BADGE_LABEL: Record<
  Exclude<AstrologerBadge, null>,
  { en: string; hi: string; className: string }
> = {
  "rising-star": {
    en: "Rising Star",
    hi: "राइज़िंग स्टार",
    className: "bg-[#fff1e6] text-[#c45a00] ring-[#F06A00]/20",
  },
  "top-choice": {
    en: "Top Choice",
    hi: "टॉप चॉइस",
    className: "bg-[#fff8e8] text-[#9a6b00] ring-[#e6b800]/25",
  },
  celebrity: {
    en: "Celebrity",
    hi: "सेलिब्रिटी",
    className: "bg-[#fde8ef] text-[#a61e4d] ring-[#e64980]/20",
  },
  new: {
    en: "New",
    hi: "नया",
    className: "bg-[#e8f7ef] text-[#0f7a45] ring-[#2f9e6b]/20",
  },
};

const SKILLS = [
  "Vedic",
  "KP",
  "Tarot",
  "Numerology",
  "Vastu",
  "Palmistry",
  "Nadi",
  "Life Coach",
  "Prashana",
  "Lal Kitab",
  "Face Reading",
] as const;

const LANGS = [
  "Hindi",
  "English",
  "Hinglish",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Kannada",
] as const;

/** Names inspired by public Indian astrology listing patterns (KundliChat-style). */
const PEOPLE: { name: string; gender: AstrologerGender }[] = [
  // From kundlichat.in listing names
  { name: "Prem Sastri", gender: "male" },
  { name: "Akash Kumar", gender: "male" },
  { name: "Harbhajan Singh", gender: "male" },
  { name: "Kavita Bhargava", gender: "female" },
  { name: "Anaya Deshpande", gender: "female" },
  { name: "Asha Mehta", gender: "female" },
  { name: "Ritu Bhattacharya", gender: "female" },
  { name: "Tanya Kapoor", gender: "female" },
  { name: "Mohan Verma", gender: "male" },
  { name: "Bejan Kapil", gender: "male" },
  { name: "Shreya Gokhale", gender: "female" },
  { name: "Tara Vyas", gender: "female" },
  { name: "Arun Patel", gender: "male" },
  { name: "Sneha Jindal", gender: "female" },
  { name: "Drishti Wadhwa", gender: "female" },
  { name: "Anaya Singh", gender: "female" },
  { name: "Radhika Iyer", gender: "female" },
  { name: "Nikita Chaturvedi", gender: "female" },
  { name: "Raghav Sharma", gender: "male" },
  { name: "Amit Kumar", gender: "male" },
  { name: "Divya Anand", gender: "female" },
  { name: "Aditya Menon", gender: "male" },
  { name: "Meenal Rathi", gender: "female" },
  { name: "Vivek Sharma", gender: "male" },
  // Additional Indian names to reach 50
  { name: "Priya Nair", gender: "female" },
  { name: "Rohit Malhotra", gender: "male" },
  { name: "Sunita Rao", gender: "female" },
  { name: "Deepak Joshi", gender: "male" },
  { name: "Neha Agarwal", gender: "female" },
  { name: "Suresh Pillai", gender: "male" },
  { name: "Pooja Saxena", gender: "female" },
  { name: "Manish Gupta", gender: "male" },
  { name: "Kiran Bhatt", gender: "female" },
  { name: "Sanjay Reddy", gender: "male" },
  { name: "Anjali Desai", gender: "female" },
  { name: "Vikram Chauhan", gender: "male" },
  { name: "Meera Krishnan", gender: "female" },
  { name: "Rajesh Khare", gender: "male" },
  { name: "Swati Banerjee", gender: "female" },
  { name: "Naveen Shetty", gender: "male" },
  { name: "Lakshmi Narayan", gender: "female" },
  { name: "Karan Mehta", gender: "male" },
  { name: "Isha Trivedi", gender: "female" },
  { name: "Yogesh Pandey", gender: "male" },
  { name: "Bhavna Shah", gender: "female" },
  { name: "Ashok Tripathi", gender: "male" },
  { name: "Rekha Menon", gender: "female" },
  { name: "Pranav Iyer", gender: "male" },
  { name: "Chitra Subramanian", gender: "female" },
  { name: "Dinesh Yadav", gender: "male" },
];

function pick<T>(arr: readonly T[], i: number, count: number): T[] {
  const out: T[] = [];
  for (let n = 0; n < count; n += 1) {
    out.push(arr[(i + n * 3) % arr.length]!);
  }
  return [...new Set(out)];
}

function ordersLabel(i: number): string {
  const tiers = ["New!", "1k+ orders", "5k+ orders", "10k+ orders", "50k+ orders"];
  if (i % 7 === 0) return tiers[0]!;
  if (i % 5 === 0) return tiers[4]!;
  if (i % 3 === 0) return tiers[3]!;
  if (i % 2 === 0) return tiers[2]!;
  return tiers[1]!;
}

function badgeFor(i: number, featured: boolean): AstrologerBadge {
  if (featured && i % 3 === 0) return "celebrity";
  if (featured && i % 3 === 1) return "rising-star";
  if (featured) return "top-choice";
  if (i % 7 === 0) return "new";
  if (i % 11 === 0) return "rising-star";
  if (i % 13 === 0) return "top-choice";
  if (i % 17 === 0) return "celebrity";
  return null;
}

let maleImg = 0;
let femaleImg = 0;

export const DIRECTORY_ASTROLOGERS: DirectoryAstrologer[] = PEOPLE.map(
  (person, index) => {
    const featured = index < 8;
    const imgIndex =
      person.gender === "male" ? maleImg++ : femaleImg++;
    const imgPrefix = person.gender === "male" ? "m" : "f";
    const cats = pick(
      [
        "love",
        "marriage",
        "career",
        "education",
        "health",
        "wealth",
        "finance",
        "remedies",
        "parents",
      ] as const,
      index,
      2 + (index % 3)
    );
    const priceBase = person.gender === "female" ? 28 : 24;
    return {
      id: `${person.gender}-${index + 1}`,
      name: person.name,
      gender: person.gender,
      image: `/images/astrologers/${imgPrefix}${String(imgIndex).padStart(2, "0")}.jpg`,
      verified: true,
      online: index % 4 !== 3,
      badge: badgeFor(index, featured),
      skills: pick(SKILLS, index, 2 + (index % 2)),
      languages: pick(LANGS, index + 1, 2 + (index % 2)),
      experienceYears: 2 + ((index * 3) % 22),
      rating: index % 9 === 0 ? 4.8 : 5,
      ordersLabel: ordersLabel(index),
      pricePerMin: priceBase + ((index * 7) % 110),
      firstChatFree: index % 5 !== 4,
      categories: cats,
      featured: featured || index % 9 === 0,
    };
  }
);

export function getFeaturedAstrologers(limit = 8) {
  return DIRECTORY_ASTROLOGERS.filter((a) => a.featured).slice(0, limit);
}

export function filterAstrologers(
  category: "all" | ConsultCategory,
  query = ""
) {
  const q = query.trim().toLowerCase();
  return DIRECTORY_ASTROLOGERS.filter((a) => {
    const catOk = category === "all" || a.categories.includes(category);
    if (!catOk) return false;
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.skills.some((s) => s.toLowerCase().includes(q)) ||
      a.languages.some((l) => l.toLowerCase().includes(q))
    );
  });
}

export function onlineCount() {
  return DIRECTORY_ASTROLOGERS.filter((a) => a.online).length;
}
