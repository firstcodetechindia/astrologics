import { SIGNS } from "./constants";
import type { LifeInsight, PlanetPosition } from "./types";

const SIGN_PERSONALITY: Record<number, { en: string; hi: string }> = {
  0: {
    en: "Pioneering, direct, and action-oriented. You thrive when you lead with courage.",
    hi: "अग्रणी, स्पष्ट और कर्मशील। साहस के साथ नेतृत्व में आप चमकते हैं।",
  },
  1: {
    en: "Steady, sensual, and value-driven. Stability and beauty matter deeply to you.",
    hi: "स्थिर, सौंदर्यप्रिय और मूल्य-केंद्रित। स्थिरता और सुंदरता आपके लिए महत्वपूर्ण।",
  },
  2: {
    en: "Curious, communicative, and adaptable. Learning and variety keep you alive.",
    hi: "जिज्ञासु, संवादकुशल और अनुकूलनशील। सीखना और विविधता आपको ऊर्जा देती है।",
  },
  3: {
    en: "Nurturing, intuitive, and emotionally intelligent. Home and belonging are anchors.",
    hi: "पोषणकारी, सहज और भावनात्मक रूप से समझदार। घर और अपनापन आधार हैं।",
  },
  4: {
    en: "Warm, expressive, and purposeful. Recognition fuels your creative fire.",
    hi: "उष्ण, अभिव्यक्त और उद्देश्यपूर्ण। सम्मान आपकी रचनात्मक ऊर्जा को बढ़ाता है।",
  },
  5: {
    en: "Precise, helpful, and analytical. You excel through craft and thoughtful service.",
    hi: "सूक्ष्म, सहायक और विश्लेषणात्मक। कौशल और सेवा से आप उत्कृष्टता पाते हैं।",
  },
  6: {
    en: "Diplomatic, aesthetic, and partnership-focused. Balance is your superpower.",
    hi: "कूटनीतिक, सौंदर्यपरक और साझेदारी-केंद्रित। संतुलन आपकी शक्ति है।",
  },
  7: {
    en: "Intense, perceptive, and transformative. You seek depth over surface.",
    hi: "गहन, सूक्ष्मदर्शी और परिवर्तनकारी। सतह से अधिक गहराई खोजते हैं।",
  },
  8: {
    en: "Optimistic, philosophical, and growth-seeking. Meaning guides your choices.",
    hi: "आशावादी, दार्शनिक और विकास-इच्छुक। अर्थ आपके निर्णयों का मार्ग है।",
  },
  9: {
    en: "Ambitious, disciplined, and structured. Long climbs suit your nature.",
    hi: "महत्वाकांक्षी, अनुशासित और संरचित। लंबी चढ़ाई आपके स्वभाव के अनुकूल।",
  },
  10: {
    en: "Innovative, community-minded, and independent. You think ahead of the curve.",
    hi: "नवाचारी, समुदाय-उन्मुख और स्वतंत्र। आप समय से आगे सोचते हैं।",
  },
  11: {
    en: "Compassionate, imaginative, and spiritually inclined. Empathy is your gift.",
    hi: "करुणामय, कल्पनाशील और आध्यात्मिक झुकाव वाले। सहानुभूति आपका वरदान है।",
  },
};

export function buildInsights(
  lagnaSign: number,
  planets: PlanetPosition[]
): LifeInsight[] {
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]));
  const tenth = planets.find((p) => p.house === 10);
  const second = planets.find((p) => p.house === 2);
  const seventh = planets.find((p) => p.house === 7);
  const sixth = planets.find((p) => p.house === 6);
  const moon = byId.moon;
  const jupiter = byId.jupiter;
  const saturn = byId.saturn;

  const lagnaName = SIGNS[lagnaSign];

  return [
    {
      area: "personality",
      title: { en: "Personality & Path", hi: "व्यक्तित्व और मार्ग" },
      text: {
        en: `With ${lagnaName.en} Lagna — ${SIGN_PERSONALITY[lagnaSign].en} Moon in ${moon?.sign.en || "—"} colors your emotional world.`,
        hi: `${lagnaName.hi} लग्न के साथ — ${SIGN_PERSONALITY[lagnaSign].hi} चंद्र ${moon?.sign.hi || "—"} में भावनात्मक दुनिया को रंग देता है।`,
      },
    },
    {
      area: "career",
      title: { en: "Career & Status", hi: "करियर और प्रतिष्ठा" },
      text: {
        en: tenth
          ? `The 10th house emphasis via ${tenth.name.en} in ${tenth.sign.en} points to visibility through ${tenth.name.en.toLowerCase()}-linked skills. ${jupiter && jupiter.house >= 9 ? "Jupiter support strengthens mentors and dharma-aligned work." : "Steady craft and timing will matter more than shortcuts."}`
          : `Your 10th house sign sets the career stage — focus on consistent contribution and public trust.`,
        hi: tenth
          ? `दसवें भाव में ${tenth.name.hi} (${tenth.sign.hi}) — ${tenth.name.hi} से जुड़े कौशल से पहचान संभव। ${jupiter && jupiter.house >= 9 ? "गुरु का बल गुरु-मार्ग और धर्मसंगत कार्य मजबूत करता है।" : "शॉर्टकट से अधिक निरंतर अभ्यास और समय महत्वपूर्ण।"}`
          : `दसवाँ भाव करियर का मंच तय करता है — निरंतर योगदान और सार्वजनिक विश्वास पर ध्यान दें।`,
      },
    },
    {
      area: "wealth",
      title: { en: "Wealth & Resources", hi: "धन और संसाधन" },
      text: {
        en: second
          ? `2nd house activity with ${second.name.en} suggests income themes tied to ${second.sign.en} qualities. Build multiple skill streams and protect speech/family harmony.`
          : `Wealth grows when values, skills, and savings habits align. A detailed dhana yoga reading is available on consult.`,
        hi: second
          ? `द्वितीय भाव में ${second.name.hi} — आय के विषय ${second.sign.hi} गुणों से जुड़े। अनेक कौशल धाराएँ बनाएँ और वाणी/परिवार सामंजस्य रखें।`
          : `धन तब बढ़ता है जब मूल्य, कौशल और बचत की आदतें मेल खाएँ। विस्तृत धन योग परामर्श पर उपलब्ध।`,
      },
    },
    {
      area: "relationships",
      title: { en: "Relationships & Partnership", hi: "संबंध और साझेदारी" },
      text: {
        en: seventh
          ? `7th house occupied by ${seventh.name.en} in ${seventh.sign.en} — partnerships benefit from clarity, timing, and mutual respect. Matching and deeper charts refine this further.`
          : `Partnership themes are shaped by your 7th sign and Venus/Jupiter interplay. Personalized matching unlocks finer detail.`,
        hi: seventh
          ? `सप्तम में ${seventh.name.hi} (${seventh.sign.hi}) — साझेदारी में स्पष्टता, समय और सम्मान लाभकारी। गुण मिलान व विस्तृत कुंडली इसे और गहरा करते हैं।`
          : `साझेदारी आपके सप्तम राशि और शुक्र/गुरु के मेल से बनती है। व्यक्तिगत मिलान से सूक्ष्म विवरण मिलता है।`,
      },
    },
    {
      area: "health",
      title: { en: "Health & Vitality", hi: "स्वास्थ्य और ऊर्जा" },
      text: {
        en: sixth
          ? `6th house influence of ${sixth.name.en} asks for routines, digestion/lifestyle care, and stress hygiene. ${saturn ? "Saturn reminds you that consistency heals." : "Small daily disciplines compound."}`
          : `Lagna and 6th house together guide vitality. Balance rest, movement, and mindful diet — remedies personalized on consult.`,
        hi: sixth
          ? `षष्ठ भाव में ${sixth.name.hi} — दिनचर्या, पाचन/जीवनशैली और तनाव प्रबंधन आवश्यक। ${saturn ? "शनि याद दिलाता है कि निरंतरता ही उपचार है।" : "छोटे दैनिक अनुशासन बड़ा फल देते हैं।"}`
          : `लग्न और षष्ठ मिलकर ऊर्जा तय करते हैं। विश्राम, व्यायाम और आहार संतुलित रखें — उपाय परामर्श पर व्यक्तिगत।`,
      },
    },
  ];
}
