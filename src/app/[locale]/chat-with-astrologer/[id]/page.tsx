import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ConsultSessionClient } from "@/components/talk/ConsultSessionClient";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";
import { getLiveBySlug } from "@/lib/astrologers/consult-engine";
import { consultFaqForLocale } from "@/lib/talk/consult-seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const hi = locale === "hi";
  let name = hi ? "ज्योतिषी" : "Astrologer";
  try {
    const astro = await getLiveBySlug(id);
    if (astro?.name) name = astro.name;
  } catch {
    /* metadata still renders */
  }
  const aiHint = /ai|jyoti/i.test(id) || /jyoti/i.test(name);
  const title = hi
    ? `${name} से चैट${aiHint ? " (एआई)" : ""} | ${siteConfig.brandName}`
    : `Chat with ${name}${aiHint ? " (AI)" : ""} | ${siteConfig.brandName}`;
  const description = hi
    ? `${name} से परामर्श। एआई प्रोफ़ाइल हर स्क्रीन पर “एआई ज्योतिषी — मानव नहीं” लेबल से दिखती हैं। चिकित्सा/कानूनी सलाह नहीं।`
    : `Consult ${name}. AI profiles are labeled “AI astrologer — not a human” on every screen. Not medical or legal advice.`;
  return buildPageMetadata({
    locale,
    path: `/chat-with-astrologer/${id}`,
    title,
    description,
    keywords: hi
      ? ["एआई ज्योतिषी", "ज्योतिषी से चैट", "ऑनलाइन परामर्श", "मानव ज्योतिषी"]
      : ["AI astrologer", "chat with astrologer", "online consultation", "human astrologer"],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const hi = locale === "hi";
  const faqs = consultFaqForLocale(locale);

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
          { name: id, path: `/chat-with-astrologer/${id}` },
        ])}
      />
      <div className="container-page py-8 sm:py-10">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          {hi
            ? "CosmicGyan निर्देशिका में मानव ज्योतिषी और एआई ज्योतिषी दोनों हैं। एआई प्रोफ़ाइल हर टचपॉइंट पर साझा लेबल से एआई बताई जाती हैं। यह चिकित्सा या कानूनी सलाह नहीं है।"
            : "The CosmicGyan directory lists both human astrologers and AI astrologers. AI profiles are disclosed with a shared “AI astrologer — not a human” label at every touchpoint. This is not medical or legal advice."}
        </p>
        <div className="mt-6">
          <ConsultSessionClient slug={id} locale={locale} />
        </div>
        <nav className="mt-10 flex max-w-xl flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/chat-with-astrologer" className="text-[#F06A00] hover:underline">
            {hi ? "ज्योतिषी निर्देशिका" : "Astrologer directory"}
          </Link>
          <Link href="/chat" className="text-[#F06A00] hover:underline">
            {hi ? "एआई गुरु" : "AI Guru"}
          </Link>
          <Link href="/kundli" className="text-[#F06A00] hover:underline">
            {hi ? "मुफ्त कुंडली" : "Free Kundli"}
          </Link>
          <Link href="/methodology" className="text-[#F06A00] hover:underline">
            {hi ? "गणना पद्धति" : "Methodology"}
          </Link>
        </nav>
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-ink">
            {hi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently asked questions"}
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </section>
      </div>
    </>
  );
}
