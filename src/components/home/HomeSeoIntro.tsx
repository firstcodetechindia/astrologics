"use client";

import { useLocale } from "next-intl";

/** Crawlable below-fold intro for homepage topical strength. */
export function HomeSeoIntro() {
  const locale = useLocale();
  const hi = locale === "hi";

  return (
    <section className="border-b border-saffron/10 bg-[#fff8f1]/80">
      <div className="container-page max-w-3xl py-8 sm:py-10">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {hi
            ? "Astrologics अलग क्यों है"
            : "Why Astrologics is different"}
        </h2>
        {hi ? (
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>
              Astrologics वैदिक कुंडली, पश्चिमी ज्योतिष, केपी ज्योतिष और अंक
              ज्योतिष को एक प्लेटफ़ॉर्म पर लाता है — ताकि पाँच परंपराओं के लिए
              पाँच अलग साइटों की ज़रूरत न पड़े। हर चार्ट आपकी वास्तविक जन्म
              तिथि, समय और स्थान से शुरू होता है, भारत की मानक लाहिरी गणना
              पद्धति से — यहाँ सामान्य सूर्य-राशि अनुमान नहीं चलाया जाता।
            </p>
            <p>
              चार्ट गणना के बाद एआई गुरु उसे सरल हिंदी या अंग्रेज़ी में समझा
              सकता है, बिना ऐसी ग्रह स्थिति गढ़े जो गणना में मौजूद न हो। चाहे
              त्वरित चंद्र राशि जाँच हो या दशा-योग सहित पूर्ण कुंडली —
              Astrologics पद्धति को पारदर्शी रखता है, ताकि आप हमेशा जानें कि आप
              क्या पढ़ रहे हैं।
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-muted">
            <p>
              Astrologics brings together Vedic Kundli, Western astrology, KP
              astrology and numerology in one platform, so you don&apos;t need
              five different sites for five different traditions. Every chart
              starts from your real birth date, time and place using India&apos;s
              standard Lahiri calculation method — nothing here is generic
              sun-sign guesswork.
            </p>
            <p>
              Once your chart is calculated, our AI Guru can explain what it
              means in plain English or Hindi, without inventing planetary
              positions that aren&apos;t there. Whether you want a quick Moon
              sign check or a full Kundli with dashas and yogas, Astrologics
              keeps the method transparent so you always know what you&apos;re
              reading.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
