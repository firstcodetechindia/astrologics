export type ConsultFaqItem = { q: { en: string; hi: string }; a: { en: string; hi: string } };

export const CONSULT_SESSION_FAQ: ConsultFaqItem[] = [
  {
    q: {
      en: "How do I know if I am chatting with AI or a human astrologer?",
      hi: "मुझे कैसे पता चलेगा कि एआई है या मानव ज्योतिषी?",
    },
    a: {
      en: "Every AI_PERSONA profile uses the same shared label: “AI astrologer — not a human.” It appears on the directory card, this chat window, and generated replies. Human listings are labeled “Real human astrologer.” CosmicTalks does not present AI as a person.",
      hi: "हर एआई प्रोफ़ाइल पर एक ही लेबल होता है: “एआई ज्योतिषी — मानव नहीं।” यह निर्देशिका कार्ड, इस चैट विंडो और उत्पन्न उत्तरों पर दिखता है। मानव सूची “वास्तविक मानव ज्योतिषी” कहती है। CosmicTalks एआई को व्यक्ति के रूप में नहीं दिखाता।",
    },
  },
  {
    q: {
      en: "Is an AI astrologer consultation medical or legal advice?",
      hi: "क्या एआई ज्योतिष परामर्श चिकित्सा या कानूनी सलाह है?",
    },
    a: {
      en: "No. CosmicTalks consultations — human or AI — are reflective Jyotish guidance only. They are not a diagnosis, prescription, or legal opinion. For health or legal questions, speak with a qualified professional.",
      hi: "नहीं। CosmicTalks परामर्श — मानव या एआई — केवल चिंतनशील ज्योतिष मार्गदर्शन है। यह निदान, नुस्खा या कानूनी राय नहीं है। स्वास्थ्य या कानूनी प्रश्नों के लिए योग्य पेशेवर से बात करें।",
    },
  },
  {
    q: {
      en: "How are consultation fees and commission calculated?",
      hi: "परामर्श शुल्क और कमीशन कैसे गिने जाते हैं?",
    },
    a: {
      en: "Each listing shows a per-minute rate inside admin min/max bounds. On capture, GST is computed on the taxable value; platform commission is taxable × commission%; the remainder is the astrologer’s share. Both human and AI sessions write the same commission ledger.",
      hi: "हर सूची प्रशासनिक न्यूनतम/अधिकतम सीमा के भीतर प्रति-मिनट दर दिखाती है। भुगतान पर करयोग्य राशि पर जीएसटी लगता है; प्लेटफ़ॉर्म कमीशन = करयोग्य × कमीशन%; शेष ज्योतिषी का हिस्सा है। मानव और एआई दोनों सत्र एक ही कमीशन लेजर में लिखे जाते हैं।",
    },
  },
];

export function consultFaqForLocale(locale: string) {
  const hi = locale === "hi";
  return CONSULT_SESSION_FAQ.map((item) => ({
    q: hi ? item.q.hi : item.q.en,
    a: hi ? item.a.hi : item.a.en,
  }));
}
