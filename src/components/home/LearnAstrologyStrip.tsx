import { Link } from "@/i18n/navigation";
import { Reveal } from "./Reveal";

const LEARN = [
  {
    title: { en: "Zodiac Signs", hi: "राशियाँ" },
    text: { en: "What each Rashi represents.", hi: "प्रत्येक राशि क्या दर्शाती है।" },
    href: "/learn/zodiac",
  },
  {
    title: { en: "Planets", hi: "ग्रह" },
    text: {
      en: "Sun through Ketu in plain language.",
      hi: "सूर्य से केतु—सरल भाषा में।",
    },
    href: "/learn/planets",
  },
  {
    title: { en: "Houses", hi: "भाव" },
    text: { en: "Meaning of all 12 houses.", hi: "बारह भावों का अर्थ।" },
    href: "/learn/houses",
  },
  {
    title: { en: "Western", hi: "पश्चिमी" },
    text: {
      en: "Signs, planets, houses and aspects.",
      hi: "राशि, ग्रह, भाव और दृष्टि।",
    },
    href: "/learn/western",
  },
  {
    title: { en: "KP Astrology", hi: "केपी" },
    text: {
      en: "Sub-lords and horary basics.",
      hi: "उपस्वामी और प्रश्न कुंडली।",
    },
    href: "/learn/kp-astrology",
  },
  {
    title: { en: "Numerology", hi: "अंक ज्योतिष" },
    text: {
      en: "Life path and name numbers.",
      hi: "जीवन पथ और नाम अंक।",
    },
    href: "/numerology",
  },
  {
    title: { en: "Vastu", hi: "वास्तु" },
    text: {
      en: "Home Dosha flags and remedies.",
      hi: "घर दोष चिह्न और उपाय।",
    },
    href: "/vastu",
  },
] as const;

export function LearnAstrologyStrip({ locale }: { locale: string }) {
  const hi = locale === "hi";
  return (
    <section className="py-10 sm:py-12">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="heading-1 font-display tracking-tight text-ink">
                {hi ? "ज्योतिष सीखें" : "Learn Astrology"}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-ink-muted">
                {hi
                  ? "कुंडली, पश्चिमी, केपी और अंक ज्योतिष।"
                  : "Kundli, Western, KP and numerology guides."}
              </p>
            </div>
            <Link href="/learn" className="text-sm font-semibold text-saffron-deep hover:underline">
              {hi ? "सभी गाइड →" : "All guides →"}
            </Link>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {LEARN.map((item) => (
            <Link
              key={item.href + item.title.en}
              href={item.href}
              className="rounded-xl border border-black/[0.07] bg-white px-4 py-3.5 transition hover:border-saffron/30"
            >
              <h3 className="text-[14px] font-semibold text-ink">
                {hi ? item.title.hi : item.title.en}
              </h3>
              <p className="mt-1 text-[12px] text-ink-muted">
                {hi ? item.text.hi : item.text.en}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
