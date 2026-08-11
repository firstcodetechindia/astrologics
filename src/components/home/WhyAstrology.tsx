import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

const AREAS = [
  {
    title: { en: "Understand Yourself", hi: "अपने आप को समझें" },
    text: {
      en: "Your Lagna, Moon sign, planets and Nakshatra can offer a traditional framework for understanding personality, emotional patterns and natural tendencies.",
      hi: "लग्न, चंद्र राशि, ग्रह और नक्षत्र व्यक्तित्व, भावनात्मक पैटर्न और स्वाभाविक प्रवृत्तियों को समझने का पारंपरिक ढाँचा दे सकते हैं।",
    },
  },
  {
    title: { en: "Make Sense of Life Phases", hi: "जीवन के चरण समझें" },
    text: {
      en: "Dashas and planetary transits are traditionally used to understand why certain themes may become more prominent during different periods of life.",
      hi: "दशा और गोचर पारंपरिक रूप से यह समझने में सहायक माने जाते हैं कि जीवन के अलग-अलग काल में कुछ विषय क्यों प्रमुख हो सकते हैं।",
    },
  },
  {
    title: { en: "Career & Direction", hi: "करियर व दिशा" },
    text: {
      en: "Your Kundli can be explored for traditional indicators related to profession, skills, ambition, work environment and periods of change.",
      hi: "कुंडली में व्यवसाय, कौशल, महत्वाकांक्षा, कार्य-वातावरण और परिवर्तन के काल से जुड़े पारंपरिक संकेत देखे जा सकते हैं।",
    },
  },
  {
    title: { en: "Relationships", hi: "संबंध" },
    text: {
      en: "The 7th house, Venus, Jupiter, Moon, D9 and other factors can be considered when exploring relationships and marriage.",
      hi: "संबंध और विवाह विषयों में सप्तम भाव, शुक्र, गुरु, चंद्र, D9 और अन्य कारकों पर विचार किया जा सकता है।",
    },
  },
  {
    title: { en: "Strengths & Challenges", hi: "शक्तियाँ व चुनौतियाँ" },
    text: {
      en: "A birth chart contains both supportive and challenging combinations. Understanding both can provide a more balanced perspective.",
      hi: "जन्म कुंडली में सहायक और चुनौतीपूर्ण दोनों योग होते हैं। दोनों को समझना अधिक संतुलित दृष्टि देता है।",
    },
  },
  {
    title: { en: "Find Clarity, Not Certainty", hi: "स्पष्टता खोजें, निश्चितता नहीं" },
    text: {
      en: "Astrology should be used as a tool for reflection and guidance—not as a replacement for your own judgement.",
      hi: "ज्योतिष चिंतन और मार्गदर्शन का साधन होना चाहिए—अपने निर्णय का विकल्प नहीं।",
    },
  },
] as const;

export function WhyAstrology({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="bg-[#f7f4f0] py-14 sm:py-20">
      <div className="container-page">
        <Reveal>
          <h2 className="heading-1 max-w-3xl font-display tracking-tight text-ink">
            {hi
              ? "लोग ज्योतिष की ओर क्यों देखते हैं?"
              : "Why Do People Turn to Astrology?"}
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
            <p>
              {hi
                ? "जीवन हमेशा स्पष्ट उत्तर नहीं देता। कभी हम स्वयं को बेहतर समझना चाहते हैं, कभी कठिन चरण का अर्थ खोजना चाहते हैं, कभी आगे की संभावनाएँ जानना चाहते हैं। ज्योतिष—कुंडली, पश्चिमी दृष्टि, केपी या अंक ज्योतिष—इन प्रश्नों पर चिंतन का पारंपरिक ढाँचा दे सकता है।"
                : "Life does not always come with clear answers. Sometimes we want to understand ourselves better, make sense of a difficult phase, or simply know what possibilities lie ahead. Astrology—through kundli, Western perspectives, KP or numerology—can offer a traditional framework for reflecting on these questions."}
            </p>
            <p>
              {hi
                ? "Astrologics गणना को पहले रखता है, फिर व्याख्या को सरल भाषा में—ताकि आप स्वयं सोच सकें।"
                : "Astrologics puts calculation first, then explanation in plain language—so you can think for yourself."}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {AREAS.map((area, i) => (
            <Reveal key={area.title.en} delay={Math.min(i * 0.04, 0.2)}>
              <article className="border-l-2 border-saffron-deep/70 pl-4 sm:pl-5">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {hi ? area.title.hi : area.title.en}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                  {hi ? area.text.hi : area.text.en}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 max-w-2xl">
          <p className="text-[15px] font-medium italic leading-relaxed text-[#6B1C1C] sm:text-base">
            {hi
              ? "आपकी कुंडली आपके लिए निर्णय नहीं लेती। यह विचार करने के लिए एक और दृष्टिकोण देती है।"
              : "Your chart doesn’t make decisions for you. It gives you another perspective to consider."}
          </p>
          <Link
            href="/kundli"
            className="btn-grad mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-ivory"
          >
            {hi ? "अपनी मुफ्त कुंडली देखें" : "Explore Your Free Kundli"}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
