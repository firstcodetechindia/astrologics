import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { CosmicGPTWordmark } from "@/components/brand/CosmicGPTWordmark";
import { cn } from "@/lib/utils";

const GRADIENT =
  "linear-gradient(90deg,#6C3CFF 0%,#FF5CA8 32%,#FF8A3D 68%,#FFC857 100%)";

const PALETTE = [
  { hex: "#6C3CFF", nameEn: "Cosmic purple", nameHi: "कॉस्मिक पर्पल", roleEn: "Start of the brand gradient", roleHi: "ब्रांड ग्रेडिएंट की शुरुआत" },
  { hex: "#FF5CA8", nameEn: "Cosmic pink", nameHi: "कॉस्मिक पिंक", roleEn: "Second stop of the brand gradient", roleHi: "ग्रेडिएंट का दूसरा पड़ाव" },
  { hex: "#FF8A3D", nameEn: "Cosmic orange", nameHi: "कॉस्मिक ऑरेंज", roleEn: "Third stop of the brand gradient", roleHi: "ग्रेडिएंट का तीसरा पड़ाव" },
  { hex: "#FFC857", nameEn: "Cosmic gold", nameHi: "कॉस्मिक गोल्ड", roleEn: "End of the brand gradient; accent", roleHi: "ग्रेडिएंट का अंत; उच्चारण रंग" },
  { hex: "#0B0F1F", nameEn: "Cosmic navy", nameHi: "कॉस्मिक नेवी", roleEn: "Primary background", roleHi: "मुख्य पृष्ठभूमि" },
  { hex: "#1A1F3B", nameEn: "Deep indigo", nameHi: "डीप इंडिगो", roleEn: "Raised panels", roleHi: "उभरे हुए पैनल" },
  { hex: "#151A33", nameEn: "Surface", nameHi: "सरफेस", roleEn: "Cards and content wells", roleHi: "कार्ड व सामग्री क्षेत्र" },
  { hex: "#C2C8D8", nameEn: "Muted text", nameHi: "म्यूटेड टेक्स्ट", roleEn: "Secondary copy", roleHi: "द्वितीयक पाठ" },
] as const;

export function brandFaqs(email: string) {
  return [
  {
    q: {
      en: "May a listed astrologer put the CosmicTalks logo on their Instagram?",
      hi: "क्या प्लेटफ़ॉर्म पर सूचीबद्ध ज्योतिषी Instagram पर CosmicTalks लोगो लगा सकते हैं?",
    },
    a: {
      en: `Yes, if you are currently listed and you keep the wordmark or icon unaltered, with clear space, and a factual line such as “Verified astrologer on CosmicTalks.” Do not imply you own or speak for the company.`,
      hi: `हाँ — यदि आप वर्तमान में सूचीबद्ध हैं, चिह्न बिना बदलाव और पर्याप्त खाली जगह के साथ दिखाएँ, और तथ्य वाली पंक्ति लिखें जैसे “CosmicTalks पर सत्यापित ज्योतिषी।” यह न लिखें कि आप कंपनी के मालिक हैं या उसकी ओर से बोलते हैं।`,
    },
  },
  {
    q: {
      en: "How should journalists name CosmicTalks in an article?",
      hi: "पत्रकार लेख में CosmicTalks का उल्लेख कैसे करें?",
    },
    a: {
      en: "Use the single word CosmicTalks, capital C and T, no space. A short identifier is enough: an AI-assisted Vedic astrology platform at thecosmictalks.com. Do not rewrite the name as Cosmic Talks or Cosmic GPT.",
      hi: "एक शब्द CosmicTalks लिखें — C और T बड़े, बीच में स्पेस नहीं। संक्षिप्त पहचान काफी है: thecosmictalks.com पर एआई-सहायता प्राप्त वैदिक ज्योतिष मंच। Cosmic Talks या Cosmic GPT न लिखें।",
    },
  },
  {
    q: {
      en: "Can I download logo files from this page?",
      hi: "क्या इस पृष्ठ से लोगो फ़ाइलें डाउनलोड हो सकती हैं?",
    },
    a: {
      en: `Not as a self-serve zip. The specimens on this page are for reference. Email ${email} with the use case; we send PNG or SVG files when the request is appropriate.`,
      hi: `स्वतः डाउनलोड ज़िप अभी नहीं है। यहाँ नमूने संदर्भ के लिए हैं। उपयोग बताते हुए ${email} पर लिखें; उपयुक्त अनुरोध पर हम PNG या SVG भेजते हैं।`,
    },
  },
  {
    q: {
      en: "Does this page replace the Terms of Use or Privacy Policy?",
      hi: "क्या यह पृष्ठ उपयोग की शर्तों या गोपनीयता नीति की जगह लेता है?",
    },
    a: {
      en: "No. It only covers how the CosmicTalks name and visual marks may appear. Account rules, payments, and personal data are on Terms of Use and Privacy Policy.",
      hi: "नहीं। यह केवल नाम और दृश्य चिह्नों के प्रदर्शन से संबंधित है। खाता नियम, भुगतान और व्यक्तिगत डेटा उपयोग की शर्तों व गोपनीयता नीति पर हैं।",
    },
  },
] as const;
}

function DoDontCard({
  ok,
  hi,
  title,
  children,
}: {
  ok: boolean;
  hi: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F1F]">
      <div className="flex min-h-[7.5rem] items-center justify-center overflow-hidden p-4">
        {children}
      </div>
      <figcaption
        className={cn(
          "border-t px-3 py-2.5 text-[13px] leading-snug",
          ok
            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
            : "border-rose-400/25 bg-rose-400/10 text-rose-100"
        )}
      >
        <span className="font-ui text-[10px] font-bold uppercase tracking-[0.12em]">
          {ok ? (hi ? "करें" : "Do") : hi ? "न करें" : "Don’t"}
        </span>
        <span className="mt-0.5 block text-white/90">{title}</span>
      </figcaption>
    </figure>
  );
}

function Swatch({
  hex,
  name,
  role,
}: {
  hex: string;
  name: string;
  role: string;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-surface">
      <div
        className="h-16 w-full sm:h-[4.5rem]"
        style={{ background: hex }}
        aria-hidden
      />
      <div className="space-y-0.5 px-3 py-2.5">
        <p className="font-ui text-[13px] font-semibold text-white">{name}</p>
        <p className="font-ui text-[12px] font-medium tabular-nums tracking-wide text-cosmic-gold">
          {hex}
        </p>
        <p className="text-[12px] leading-snug text-ink-muted">{role}</p>
      </div>
    </div>
  );
}

export function BrandGuidelinesView({ locale }: { locale: string }) {
  const hi = locale === "hi";
  const email = siteConfig.email;
  const brand = siteConfig.brandName;

  const toc = [
    { id: "introduction", label: hi ? "परिचय" : "Introduction" },
    { id: "wordmark", label: hi ? "वर्डмарк" : "Wordmark" },
    { id: "icon", label: hi ? "आइकन चिह्न" : "Icon mark" },
    { id: "color", label: hi ? "रंग" : "Colour" },
    { id: "type", label: hi ? "टाइपोग्राफी" : "Typography" },
    { id: "usage", label: hi ? "नाम व चिह्न का उपयोग" : "Name and marks" },
    { id: "scope", label: hi ? "इस पृष्ठ की सीमा" : "Scope of this page" },
    { id: "contact", label: hi ? "संपर्क" : "Contact" },
    { id: "assets", label: hi ? "फ़ाइलें" : "Files" },
    { id: "faq", label: hi ? "प्रश्न" : "Questions" },
  ];

  return (
    <article className="container-page py-10 sm:py-12 text-[15px] leading-relaxed text-ink-muted">
      <nav
        aria-label={hi ? "इस पृष्ठ पर" : "On this page"}
        className="mb-10 flex flex-wrap gap-2"
      >
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="inline-flex min-h-11 items-center rounded-lg border border-white/12 bg-surface px-3 py-2 text-[13px] font-medium text-white/85 hover:border-white/25 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        <section id="introduction" className="scroll-mt-28 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "परिचय" : "Introduction"}
          </h2>
          <p>
            {hi
              ? `${brand} नाम, Cosm-ı✦-c-Talks वर्डмарк, इंटरलॉकिंग स्टार आइकन, वर्ग लॉकअप, ब्रांड ग्रेडिएंट और टैगलाइन “Let's Decode Your Stars” ${brand} की संपत्ति हैं — thecosmictalks.com के संचालक। यह पृष्ठ बताता है कि प्लेटफ़ॉर्म पर सूचीबद्ध ज्योतिषी, सहभागी, पत्रकार और अन्य तीसरे पक्ष इन चिह्नों का बाहरी उल्लेख कैसे कर सकते हैं — और क्या वर्जित है।`
              : `The name ${brand}, the Cosm-ı✦-c-Talks wordmark, the interlocking-star icon, the square lockup, the brand gradient, and the tagline “Let's Decode Your Stars” are marks of ${brand}, the operator of thecosmictalks.com. This page states how listed astrologers, partners, journalists, and other third parties may refer to those marks in public — and what they may not do.`}
          </p>
          <p>
            {hi
              ? "अनुमति सीमित, रद्द की जा सकने वाली और गैर-विशिष्ट है। चिह्नों का उपयोग हमें यह नहीं मान लेना चाहिए कि हमने आपके उत्पाद, सेवा या दावे का समर्थन किया है।"
              : "Any permission here is limited, revocable, and non-exclusive. Using the marks does not mean we have endorsed your product, service, or claim."}
          </p>
        </section>

        <section id="wordmark" className="scroll-mt-28 space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "वर्डмарк" : "Wordmark"}
          </h2>
          <p>
            {hi
              ? "साइट हेडर और फुटर पर जो लॉकअप दिखता है वही स्वीकृत वर्डмарк है: Cosm, बिंदु-रहित i पर तारा (✦), फिर c, और Talks ब्रांड ग्रेडिएंट में। टैगलाइन वैकल्पिक है — पूर्ण लॉकअप पर अंग्रेज़ी में Let's Decode Your Stars।"
              : "The lockup on the site header and footer is the approved wordmark: Cosm, a star (✦) on a dotless i, then c, with Talks in the brand gradient. The tagline is optional — on the full lockup it reads Let's Decode Your Stars, in English."}
          </p>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1F] px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-md">
              <CosmicGPTWordmark size="md" showTagline className="mx-auto" />
            </div>
            <p className="mt-5 text-center font-ui text-[12px] text-white/55">
              {hi
                ? "स्वीकृत वर्डмарк — CosmicTalks + टैगलाइन"
                : "Approved wordmark — CosmicTalks + tagline"}
            </p>
          </div>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "खाली जगह" : "Clear space"}
          </h3>
          <p>
            {hi
              ? "वर्डмарк के चारों ओर कम-से-कम i पर लगे तारे जितनी ऊँचाई खाली रखें। बटन, फ़ोटो, अन्य लोगो या पैराग्राफ़ उससे सटाकर न लगाएँ।"
              : "Keep empty space around the wordmark at least as tall as the star on the i. Do not park buttons, photographs, other logos, or a paragraph against its edges."}
          </p>
          <div
            className="overflow-hidden rounded-2xl border border-dashed border-white/25 bg-[#0B0F1F]"
            aria-hidden
          >
            <div className="border border-dashed border-cosmic-gold/50 p-8 sm:p-10">
              <CosmicGPTWordmark size="sm" showTagline={false} className="mx-auto" />
            </div>
            <p className="px-4 py-2 text-center font-ui text-[11px] text-white/50">
              {hi
                ? "सोने की धराशायी रेखा = न्यूनतम खाली जगह"
                : "Gold dashed edge = minimum clear space"}
            </p>
          </div>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "करें / न करें" : "Do and don’t"}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DoDontCard
              hi={hi}
              ok
              title={
                hi
                  ? "दिए गए नमूने को ज्यों का त्यों रखें"
                  : "Use the supplied lockup as it is"
              }
            >
              <div aria-hidden>
                <CosmicGPTWordmark size="sm" showTagline={false} />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "खींचें, तिरछा करें या अनुपात बदलें नहीं"
                  : "Don’t stretch, skew, or change the proportion"
              }
            >
              <div aria-hidden className="origin-center scale-x-150">
                <CosmicGPTWordmark size="sm" showTagline={false} />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "ग्रेडिएंट या सफेद अक्षरों का रंग न बदलें"
                  : "Don’t recolor the gradient or the white letters"
              }
            >
              <div aria-hidden className="hue-rotate-[160deg] saturate-150">
                <CosmicGPTWordmark size="sm" showTagline={false} />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={hi ? "काटकर न दिखाएँ" : "Don’t crop it"}
            >
              <div aria-hidden className="h-8 w-40 overflow-hidden">
                <CosmicGPTWordmark size="sm" showTagline={false} />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "अतिरिक्त छाया, चमक या टेक्स्चर न जोड़ें"
                  : "Don’t add extra shadow, glow, or texture"
              }
            >
              <div
                aria-hidden
                className="blur-[0.3px] drop-shadow-[0_12px_18px_rgba(255,200,87,0.85)]"
              >
                <CosmicGPTWordmark size="sm" showTagline={false} />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "किसी अन्य फ़ॉन्ट में नाम न दोबारा बनाएँ"
                  : "Don’t redraw the name in another typeface"
              }
            >
              <p
                aria-hidden
                className="font-serif text-[1.35rem] italic tracking-wide text-white"
              >
                CosmicTalks
              </p>
            </DoDontCard>
          </div>
        </section>

        <section id="icon" className="scroll-mt-28 space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "आइकन चिह्न" : "Icon mark"}
          </h2>
          <p>
            {hi
              ? "स्वीकृत चिह्न live साइट का इंटरलॉकिंग स्टार है — वही फ़ाइल फ़ेविकॉन, ऐप आइकन और सोशल पूर्वावलोकन में लगती है (`cosmictalks-mark`). गहरे रंग पर सफेद चिह्न; हल्के प्लेट पर नेवी चिह्न। वर्ग लॉकअप (चिह्न + नाम + टैगलाइन) ऐप आइकन और शेयर छवियों के लिए है; लेख, ईमेल हस्ताक्षर या साझेदारी पट्टी में मुख्य पहचान वर्डмарк ही रहे।"
              : "The approved icon is the interlocking star already on the live site — the same file used for the favicon, app icon, and social preview (`cosmictalks-mark`). Use the white mark on dark grounds and the navy mark on a light plate. The square lockup (mark + name + tagline) is for app icons and share images; in articles, email signatures, or partner bars the wordmark remains the primary identifier."}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <figure className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1F] p-6">
              <Image
                src="/icons/cosmictalks-mark-white.png"
                alt=""
                width={160}
                height={160}
                className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
              />
              <figcaption className="mt-3 text-center font-ui text-[12px] text-white/55">
                {hi ? "सफेद चिह्न · नेवी भूमि" : "White mark · navy ground"}
              </figcaption>
            </figure>
            <figure className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white p-6">
              <Image
                src="/icons/cosmictalks-mark-navy.png"
                alt=""
                width={160}
                height={160}
                className="mx-auto h-28 w-28 object-contain sm:h-32 sm:w-32"
              />
              <figcaption className="mt-3 text-center font-ui text-[12px] text-[#0B0F1F]/70">
                {hi ? "नेवी चिह्न · हल्की भूमि" : "Navy mark · light ground"}
              </figcaption>
            </figure>
            <figure className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1F] p-4">
              <Image
                src="/icons/cosmictalks-lockup-square.png"
                alt=""
                width={200}
                height={200}
                className="mx-auto h-36 w-36 rounded-xl object-contain sm:h-40 sm:w-40"
              />
              <figcaption className="mt-3 text-center font-ui text-[12px] text-white/55">
                {hi
                  ? "वर्ग लॉकअप · ऐप / शेयर"
                  : "Square lockup · app / share"}
              </figcaption>
            </figure>
          </div>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "खाली जगह" : "Clear space"}
          </h3>
          <p>
            {hi
              ? "चिह्न के चारों ओर उसके आंतरिक तारे की चौड़ाई जितना खाली क्षेत्र रखें। व्यस्त कुंडली चार्ट, राशि चक्र फ़ोटो या सघन पैटर्न पर चिह्न न रखें।"
              : "Leave a margin around the icon at least as wide as the inner star. Do not sit the mark on a busy kundli chart, a zodiac photograph, or a dense pattern."}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DoDontCard
              hi={hi}
              ok
              title={
                hi
                  ? "सादी नेवी भूमि, पर्याप्त हाशिया"
                  : "Plain navy, with enough margin"
              }
            >
              <div
                aria-hidden
                className="rounded-lg border border-dashed border-cosmic-gold/50 p-6"
              >
                <Image
                  src="/icons/cosmictalks-mark-white.png"
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={hi ? "रंग बदलें नहीं" : "Don’t recolor the mark"}
            >
              <Image
                src="/icons/cosmictalks-mark-white.png"
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 object-contain hue-rotate-90 saturate-200"
              />
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "अनधिकृत छल्ले, बैज या राशि न जोड़ें"
                  : "Don’t add rings, badges, or extra signs"
              }
            >
              <div aria-hidden className="relative">
                <Image
                  src="/icons/cosmictalks-mark-white.png"
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
                <span className="absolute -right-2 -top-1 rounded-full bg-cosmic-orange px-1.5 py-0.5 font-ui text-[9px] font-bold text-white">
                  NEW
                </span>
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "व्यस्त पृष्ठभूमि पर न रखें"
                  : "Don’t place it on a cluttered background"
              }
            >
              <div
                aria-hidden
                className="flex h-24 w-full items-center justify-center bg-[url(/images/Zodiac.jpg)] bg-cover bg-center"
              >
                <Image
                  src="/icons/cosmictalks-mark-white.png"
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 object-contain"
                />
              </div>
            </DoDontCard>
            <DoDontCard
              hi={hi}
              ok={false}
              title={
                hi
                  ? "अधिकतर संदर्भों में वर्डмарк की जगह केवल आइकन न चलाएँ"
                  : "Don’t replace the wordmark with the icon in most contexts"
              }
            >
              <div aria-hidden className="text-center">
                <Image
                  src="/icons/cosmictalks-mark-white.png"
                  alt=""
                  width={40}
                  height={40}
                  className="mx-auto h-10 w-10 object-contain"
                />
                <p className="mt-1 font-ui text-[10px] text-white/50">
                  {hi ? "लेख शीर्षक में अकेला चिह्न" : "Icon alone in a byline"}
                </p>
              </div>
            </DoDontCard>
          </div>
        </section>

        <section id="color" className="scroll-mt-28 space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "रंग पट्टिका" : "Colour palette"}
          </h2>
          <p>
            {hi
              ? "Talks अक्षरों का ग्रेडिएंट पहचान का केंद्र है। अनुक्रम यही रहे: #6C3CFF → #FF5CA8 → #FF8A3D → #FFC857, बाएँ से दाएँ। पृष्ठभूमि कॉस्मिक नेवी (#0B0F1F) है।"
              : "The gradient on Talks is core to the identity. Keep this sequence, left to right: #6C3CFF → #FF5CA8 → #FF8A3D → #FFC857. The ground is cosmic navy (#0B0F1F)."}
          </p>
          <div
            className="h-14 w-full overflow-hidden rounded-xl border border-white/10 sm:h-16"
            style={{ background: GRADIENT }}
            role="img"
            aria-label={
              hi
                ? "ब्रांड ग्रेडिएंट: पर्पल, पिंक, ऑरेंज, गोल्ड"
                : "Brand gradient: purple, pink, orange, gold"
            }
          />
          <p className="font-ui text-[12px] tabular-nums text-white/55">
            #6C3CFF · #FF5CA8 · #FF8A3D · #FFC857
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PALETTE.map((c) => (
              <Swatch
                key={c.hex}
                hex={c.hex}
                name={hi ? c.nameHi : c.nameEn}
                role={hi ? c.roleHi : c.roleEn}
              />
            ))}
          </div>
        </section>

        <section id="type" className="scroll-mt-28 space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "टाइपोग्राफी" : "Typography"}
          </h2>
          <p>
            {hi
              ? "साइट पर टाइप फ़ॉन्टसोर्स से स्व-होस्ट है। अंग्रेज़ी शीर्षक और मुख्य पाठ दोनों Roboto हैं। हिंदी शीर्षक Noto Serif Devanagari; हिंदी मुख्य पाठ Noto Sans Devanagari। वर्डмарк इन फ़ॉन्ट परिवारों से नहीं बनता — उसे दोबारा न टाइप करें।"
              : "Type on the site is self-hosted through Fontsource. English headlines and body copy both use Roboto. Hindi headlines use Noto Serif Devanagari; Hindi body copy uses Noto Sans Devanagari. The wordmark is not set in these families — do not type it out."}
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-surface px-5 py-5">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] text-cosmic-gold">
                Roboto · {hi ? "अंग्रेज़ी UI / शीर्षक" : "English UI / headlines"}
              </p>
              <p className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-white">
                Let&apos;s Decode Your Stars
              </p>
              <p className="mt-2 font-ui text-[15px] font-normal text-ink-muted">
                {hi
                  ? "मुख्य पाठ व नेविगेशन — 400/500/700."
                  : "Body and navigation — weights 400, 500, and 700."}
              </p>
            </div>
            <div className="min-w-0 rounded-2xl border border-white/10 bg-surface px-5 py-5">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] text-cosmic-gold">
                Noto · {hi ? "हिंदी" : "Hindi"}
              </p>
              <p
                className="mt-3 text-2xl font-semibold text-white"
                style={{
                  fontFamily:
                    '"Noto Serif Devanagari", "Noto Sans Devanagari", serif',
                }}
              >
                आइए अपने सितारों को समझें
              </p>
              <p
                className="mt-2 text-[15px] text-ink-muted"
                style={{
                  fontFamily: '"Noto Sans Devanagari", Roboto, sans-serif',
                }}
              >
                {hi
                  ? "शीर्षक: Noto Serif Devanagari। पाठ: Noto Sans Devanagari।"
                  : "Headlines: Noto Serif Devanagari. Body: Noto Sans Devanagari."}
              </p>
            </div>
          </div>
        </section>

        <section id="usage" className="scroll-mt-28 space-y-5">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi
              ? "नाम और चिह्नों का उपयोग"
              : "How to use the name and marks"}
          </h2>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "प्लेटफ़ॉर्म पर ज्योतिषी" : "Astrologers on the platform"}
          </h3>
          <p>
            {hi
              ? "यदि आप CosmicTalks पर सूचीबद्ध हैं, तो अपनी सोशल प्रोफ़ाइल, विजिटिंग कार्ड या व्यक्तिगत साइट पर तथ्य बता सकते हैं। उपयुक्त पंक्तियाँ: “CosmicTalks पर सत्यापित ज्योतिषी”, “CosmicTalks पर परामर्श उपलब्ध”। वर्जित: “CosmicTalks के आधिकारिक प्रवक्ता”, “CosmicTalks टीम”, या ऐसा चित्र जिसमें आपका नाम हमारे वर्डмарк से बड़ा न हो और लगे कि मंच आपका है। सूची समाप्त होने पर चिह्न हटा दें।"
              : "If you are listed on CosmicTalks, you may state that fact on social profiles, visiting cards, or a personal site. Suitable lines: “Verified astrologer on CosmicTalks”, “Consultations available on CosmicTalks”. Not allowed: “Official spokesperson for CosmicTalks”, “CosmicTalks team”, or artwork where our wordmark outranks your own name and reads as if you operate the platform. Remove the marks if your listing ends."}
          </p>
          <p>
            <Link
              href="/astrologer/signup"
              className="font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "ज्योतिषी साइन अप →" : "Astrologer sign up →"}
            </Link>
            {" · "}
            <Link
              href="/chat-with-astrologer"
              className="font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "ज्योतिषी से चैट →" : "Chat with astrologer →"}
            </Link>
          </p>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "मीडिया और प्रेस" : "Media and press"}
          </h3>
          <p>
            {hi
              ? "कंपनी का नाम एक शब्द में लिखें: CosmicTalks। पहली बार उल्लेख पर इतना काफी है: “CosmicTalks, thecosmictalks.com पर एआई-सहायता प्राप्त वैदिक ज्योतिष मंच”। Cosmic GPT, CosmicGyan, या Cosmic Talks न लिखें। स्क्रीनशॉट में हेडर वर्डмарк ज्यों का त्यों रहे; ग्रेडिएंट रीब्रांड न करें।"
              : "Write the company name as one word: CosmicTalks. On first mention, a short identifier is enough: “CosmicTalks, an AI-assisted Vedic astrology platform at thecosmictalks.com.” Do not write Cosmic GPT, CosmicGyan, or Cosmic Talks. If you screenshot the product, leave the header wordmark intact; do not rebrand the gradient."}
          </p>
          <p>
            <Link
              href="/about"
              className="font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "परिचय →" : "About CosmicTalks →"}
            </Link>
            {" · "}
            <Link
              href="/methodology"
              className="font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "पद्धति →" : "Methodology →"}
            </Link>
          </p>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "सहभागी और सह-ब्रांडिंग" : "Partners and co-branding"}
          </h3>
          <p>
            {hi
              ? "वॉलेट, सदस्यता या वाणिज्य सहयोग में हमारा चिह्न आपके लोगो के बराबर या छोटा रहे — कभी बड़ा नहीं। दोनों के बीच वर्डмарк की खाली-जगह नियम जितना अंतर रखें। बिना लिखित अनुमति संयुक्त लोगो, ऐप आइकन या भुगतान बैज न बनाएँ।"
              : "On wallet, subscription, or commerce collaborations, our mark should be equal to or smaller than yours — never larger. Separate the two identities by at least the wordmark clear-space rule. Do not invent a combined logo, app icon, or payment badge without written approval."}
          </p>

          <h3 className="font-display text-base font-semibold text-ink">
            {hi ? "सामान्य अनुमति / मनाही" : "General do and don’t"}
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              {hi
                ? "ऐसा समर्थन न दिखाएँ जो हमने लिखित में नहीं दिया।"
                : "Do not imply an endorsement we have not given in writing."}
            </li>
            <li>
              {hi
                ? "अपनी पहचान से अधिक प्रमुखता से हमारे चिह्न न चलाएँ।"
                : "Do not display our marks more prominently than your own identity."}
            </li>
            <li>
              {hi
                ? "लोगो का अनुपात, रंग या अक्षर न बदलें।"
                : "Do not alter the logo’s proportion, colour, or lettering."}
            </li>
            <li>
              {hi
                ? "हमारे चिह्न को अपने लोगो, डोमेन, ऐप नाम या हैंडल में न मिलाएँ।"
                : "Do not fold our marks into your own logo, domain, app name, or handle."}
            </li>
            <li>
              {hi
                ? "कपड़े, मूर्ति, कैलेंडर या पैक किए सामान पर बिना अनुमति चिह्न न छापें।"
                : "Do not print the marks on merchandise, idols, calendars, or packaged goods without permission."}
            </li>
          </ul>
        </section>

        <section id="scope" className="scroll-mt-28 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "इस पृष्ठ की सीमा" : "What this page does not cover"}
          </h2>
          <p>
            {hi ? (
              <>
                यह पृष्ठ केवल नाम, लोगो और रंग के प्रदर्शन से संबंधित है। यह API
                शर्तें नहीं है, और न ही यह बताता है कि जन्म विवरण कैसे संभाला जाता
                है। खाता, भुगतान और प्लेटफ़ॉर्म नियम{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  उपयोग की शर्तों
                </Link>{" "}
                पर हैं। व्यक्तिगत डेटा{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  गोपनीयता नीति
                </Link>{" "}
                पर है। गणना विधि{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  पद्धति
                </Link>{" "}
                पर है।
              </>
            ) : (
              <>
                This page governs brand and trademark presentation only. It is
                not an API agreement, and it does not describe how birth details
                are handled. Account, payment, and platform rules live in the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Terms of Use
                </Link>
                . Personal data is described in the{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Privacy Policy
                </Link>
                . How charts are calculated is on{" "}
                <Link
                  href="/methodology"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Methodology
                </Link>
                .
              </>
            )}
          </p>
        </section>

        <section id="contact" className="scroll-mt-28 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "संपर्क" : "Contact"}
          </h2>
          <p>
            {hi ? (
              <>
                ट्रेडमार्क, गलत उपयोग की सूचना, प्रेस पहचान, या सह-ब्रांडिंग की
                अनुमति — अभी {email} पर लिखें। सामान्य पाठक सहायता{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  संपर्क
                </Link>{" "}
                पृष्ठ पर है।
              </>
            ) : (
              <>
                For trademark questions, misuse reports, press identification, or
                co-branding approval, write to {email} for now. Ordinary reader
                support stays on the{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-saffron-deep hover:underline"
                >
                  Contact
                </Link>{" "}
                page.
              </>
            )}
          </p>
          <p>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                hi
                  ? "CosmicTalks ब्रांड / ट्रेडमार्क"
                  : "CosmicTalks brand / trademark"
              )}`}
              className="inline-flex min-h-11 items-center font-semibold text-saffron-deep hover:underline"
            >
              {email}
            </a>
          </p>
        </section>

        <section id="assets" className="scroll-mt-28 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "फ़ाइलें" : "Downloadable files"}
          </h2>
          <p>
            {hi
              ? "प्रेस किट ज़िप (SVG/PNG + एक-पृष्ठ सार) अभी प्रकाशित नहीं है। इस पृष्ठ के नमूने संदर्भ हैं; प्रजनन के लिए फ़ाइल ईमेल पर माँगें — उपयोग, माध्यम और समय सीमा बताएँ। जब किट बनेगी, लिंक यहीं जुड़ेगा।"
              : "A self-serve press zip (SVG/PNG plus a one-page sheet) is not published yet. The specimens on this page are for reference; request production files by email, with the use, channel, and deadline. When a kit exists, the link will sit in this section."}
          </p>
        </section>

        <section id="faq" className="scroll-mt-28 space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Questions"}
          </h2>
          <dl className="space-y-3">
            {brandFaqs(email).map((f) => (
              <div
                key={f.q.en}
                className="rounded-xl border border-white/10 bg-surface px-4 py-3"
              >
                <dt className="font-semibold text-ink">
                  {hi ? f.q.hi : f.q.en}
                </dt>
                <dd className="mt-1.5 text-[14px]">{hi ? f.a.hi : f.a.en}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
