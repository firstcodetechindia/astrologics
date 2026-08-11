import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChatAstrologersClient } from "@/components/talk/ChatAstrologersClient";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";
import { chatFaqForLocale } from "@/lib/talk/chat-seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/chat-with-astrologer",
    title: hi
      ? `ज्योतिषी से ऑनलाइन चैट — लाइव परामर्श | ${siteConfig.brandName}`
      : `Chat with Astrologer Online — Live Consultation | ${siteConfig.brandName}`,
    description: hi
      ? "सत्यापित भारतीय ज्योतिषियों से ऑनलाइन चैट — प्रेम, विवाह, करियर और जीवन समय पर मार्गदर्शन। कुछ विशेषज्ञों पर पहली चैट मुफ्त।"
      : "Chat online with verified Indian astrologers for love, marriage, career and life timing. Select experts offer a first chat free — browse profiles and start when ready.",
    keywords: hi
      ? [
          "ज्योतिषी से चैट",
          "ऑनलाइन ज्योतिष",
          "लाइव ज्योतिष परामर्श",
          "प्रेम ज्योतिष",
          "विवाह ज्योतिष",
        ]
      : [
          "chat with astrologer",
          "talk to astrologer online",
          "live astrology consultation",
          "verified astrologers",
          "online astrology chat India",
        ],
  });
}

export default async function ChatWithAstrologerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const hi = locale === "hi";
  const faqs = chatFaqForLocale(locale);

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          {
            name: hi ? "ज्योतिषी से चैट" : "Chat with astrologer",
            path: "/chat-with-astrologer",
          },
        ])}
      />
      <main className="relative min-h-[70vh] overflow-hidden bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_40%,#fff3ea_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 8% 0%, rgba(240,106,0,0.10), transparent 38%), radial-gradient(circle at 92% 12%, rgba(240,106,0,0.07), transparent 32%)",
          }}
        />
        <div className="container-page relative py-8 sm:py-10">
          <ChatAstrologersClient locale={locale} />

          <section className="mt-14 max-w-3xl space-y-8 text-[15px] leading-relaxed text-ink-muted">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                {hi
                  ? "लाइव ज्योतिषी से कब बात करें, एआई गुरु से कब"
                  : "When to chat live vs use AI Guru"}
              </h2>
              <p>
                {hi
                  ? "Astrologics पर आप मुफ्त जन्म कुंडली बना सकते हैं और एआई गुरु से अपनी गणना की गई कुंडली पर त्वरित प्रश्न पूछ सकते हैं। यह स्व-अध्ययन और स्पष्टीकरण के लिए उपयुक्त है — ग्रह स्थिति पहले इंजन से निकलती है, एआई उन परिणामों की भाषा में व्याख्या करता है।"
                  : "On Astrologics you can generate a free birth chart and ask AI Guru quick follow-up questions on your calculated results. That suits self-study and clarification — planetary positions come from the calculation engine first; AI interprets those results in plain language."}
              </p>
              <p>
                {hi
                  ? "जब प्रश्न संवेदनशील हो — विवाह समय, करियर मोड़, पारिवारिक दबाव, दोष या उपाय प्राथमिकता — तब लाइव ज्योतिषी से चैट करना बेहतर है। मानव परामर्श संदर्भ, अनुभव और चार्ट के कई स्तर (लग्न, चंद्र, दशा, गोचर) को एक साथ जोड़ सकती है।"
                  : "When the question is sensitive — marriage timing, career turns, family pressure, dosha or remedy priority — chatting with a live astrologer is often better. Human consultation can weave context, experience and multiple chart layers (Lagna, Moon, dasha, transits) together."}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                {hi ? "किन विषयों पर चर्चा करें" : "Topics you can discuss"}
              </h2>
              <p>
                {hi
                  ? "ऑनलाइन ज्योतिष चैट में लोग अक्सर प्रेम और विवाह समय, करियर दिशा, व्यापार या नौकरी चक्र, धन प्रवृत्ति, गुण मिलान की गहराई, मंगल या शनि जैसे दोष, और शास्त्रीय उपाय (मंत्र, दान, जीवनशैली) पर बात करते हैं।"
                  : "In online astrology chat, people often discuss love and marriage timing, career direction, business or job cycles, wealth tendencies, deeper gun milan beyond scorecards, doshas such as Mangal or Shani themes, and classical remedies (mantra, charity, lifestyle)."}
              </p>
              <p>
                {hi
                  ? "ज्योतिष चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है। स्वास्थ्य संबंधी प्रश्नों में ज्योतिष प्रवृत्ति और समय दिखा सकता है, पर डॉक्टर या विशेषज्ञ से परामर्श आवश्यक रहता है।"
                  : "Astrology is not a substitute for medical, legal or financial advice. Health-related questions may show tendencies and timing in Jyotish, but consultation with a doctor or qualified professional remains essential."}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                {hi ? "चैट कैसे काम करती है" : "How chat consultation works"}
              </h2>
              <p>
                {hi
                  ? "निर्देशिका में श्रेणी (प्रेम, करियर, विवाह आदि), भाषा या कौशल से ज्योतिषी खोजें। प्रोफ़ाइल पर अनुभव, रेटिंग, भाषाएँ और प्रति मिनट दर देखें। कुछ विशेषज्ञ पहली चैट मुफ्त दिखाते हैं — कार्ड पर लेबल से पहचानें।"
                  : "Browse the directory by category (love, career, marriage and more), language or skill. Profiles show experience, ratings, languages and per-minute rates. Some experts display a first-chat-free label on their card — check before you start."}
              </p>
              <p>
                {hi
                  ? "चैट शुरू करने से पहले जन्म तिथि, समय और स्थान तैयार रखें। सटीक समय लग्न और भावों के लिए महत्वपूर्ण है; अनुमानित समय हो तो बताएँ ताकि ज्योतिषी Moon और Nakshatra आधारित पठन पर ध्यान दे सके।"
                  : "Keep birth date, time and place ready before you start. Accurate time matters for Lagna and houses; if yours is approximate, say so so the astrologer can focus reliably on Moon- and Nakshatra-based reading."}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                {hi ? "सत्यापन और गोपनीयता" : "Verification and privacy"}
              </h2>
              <p>
                {hi
                  ? "सूची में सत्यापित बैज, अनुभव वर्ष और उपयोगकर्ता रेटिंग दिखाई जाती है। हम Vedic कुंडली, KP, अंक ज्योतिष और संबंधित क्षेत्रों में विशेषज्ञता हाइलाइट करते हैं ताकि आप अपने प्रश्न के अनुसार चुन सकें।"
                  : "Listings show verified badges, years of experience and user ratings where available. We highlight expertise in Vedic kundli, KP, numerology and related areas so you can match the astrologer to your question."}
              </p>
              <p>
                {hi
                  ? "चैट सत्र निजी होते हैं। आप केवल वही जन्म विवरण साझा करें जो परामर्श के लिए आवश्यक हैं। गहन उपाय और समय-विशिष्ट मार्गदर्शन व्यक्तिगत संदर्भ में सबसे उपयोगी होता है।"
                  : "Chat sessions are private. Share only the birth details needed for the reading. Deeper remedies and time-specific guidance are most useful in a personal context."}
              </p>
            </div>
          </section>

          <section className="mt-14 max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-ink">
              {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {hi
                ? "लाइव ज्योतिष चैट से जुड़े सामान्य प्रश्न।"
                : "Common questions about live astrology chat."}
            </p>
            <div className="mt-6">
              <FaqAccordion items={faqs} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
