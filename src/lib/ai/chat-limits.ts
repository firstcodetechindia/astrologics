/** Free AI chat quota (client + server safe). */
export const FREE_CHAT_LIMIT = 3;

export function suggestedQuestions(locale: "en" | "hi"): string[] {
  return locale === "hi"
    ? [
        "मेरी वर्तमान दशा क्या कहती है?",
        "करियर के लिए कौन-से भाव और ग्रह महत्वपूर्ण हैं?",
        "विवाह / संबंध के संकेत कैसे दिखते हैं?",
        "लग्न और चंद्र राशि मेरे स्वभाव को कैसे दर्शाते हैं?",
        "कौन-से सरल उपाय उपयोगी हो सकते हैं?",
      ]
    : [
        "What does my current dasha indicate?",
        "Which houses and planets matter most for career?",
        "How do marriage / relationship indicators look?",
        "How do lagna and Moon describe my nature?",
        "What simple remedies may be useful?",
      ];
}

/** Follow-up chips after each free reply (4 at a time, rotates by round). */
export function followUpQuestions(
  locale: "en" | "hi",
  round: number
): string[] {
  const pools =
    locale === "hi"
      ? [
          [
            "इस दशा में करियर के लिए सबसे अच्छा समय कब है?",
            "मेरे संबंधों पर वर्तमान दशा का क्या प्रभाव है?",
            "स्वास्थ्य के लिए मुझे किन बातों का ध्यान रखना चाहिए?",
            "कौन-से सरल उपाय अभी सबसे उपयोगी होंगे?",
          ],
          [
            "मेरे लिए कौन-सा विषय या करियर क्षेत्र स्वाभाविक है?",
            "कुछ बातें जल्दी समझ आती हैं पर निरंतरता क्यों टूटती है?",
            "आगे उच्च शिक्षा पूरी करने के संकेत कैसे हैं?",
            "कौन-सी आदत मेरी तरक्की रोक रही है?",
          ],
          [
            "विवाह / साझेदारी के लिए कौन-से भाव सक्रिय हैं?",
            "धन और स्थिरता के संकेत कैसे दिखते हैं?",
            "मेरे स्वभाव की सबसे बड़ी ताकत क्या है?",
            "अगली दशा में क्या बदलाव आ सकते हैं?",
          ],
        ]
      : [
          [
            "When is the best career window in this dasha?",
            "How does this period affect my relationships?",
            "What should I watch for regarding health?",
            "Which simple remedies help most right now?",
          ],
          [
            "What kind of subject or career field would suit my natural intelligence best?",
            "Why do I understand some topics quickly but struggle to stay consistent?",
            "Will I have a strong chance of completing a higher qualification later in life?",
            "Which hidden habit is blocking my academic and professional growth?",
          ],
          [
            "Which houses are most active for marriage or partnership?",
            "How do wealth and stability indicators look?",
            "What is my strongest natural trait from the chart?",
            "What shifts can I expect in the next dasha?",
          ],
        ];
  return pools[Math.max(0, round - 1) % pools.length];
}
