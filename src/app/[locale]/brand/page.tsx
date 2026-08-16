import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
} from "@/lib/seo/page-meta";
import {
  BrandGuidelinesView,
  brandFaqs,
} from "@/components/brand/BrandGuidelinesView";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/brand",
    title: hi
      ? "ब्रांड दिशानिर्देश — CosmicTalks नाम, लोगो व चिह्न"
      : "CosmicTalks Brand Guidelines — Logo, Colour, Usage",
    description: hi
      ? "सहभागी, सूचीबद्ध ज्योतिषी और प्रेस CosmicTalks नाम, वर्डмарк, आइकन व रंग कैसे इस्तेमाल करें — अनुमतियाँ, वर्जित उपयोग और फ़ाइल अनुरोध यहाँ।"
      : "Rules for partners, listed astrologers, and the press on using the CosmicTalks name, wordmark, icon, and colors — including what is not allowed.",
    keywords: hi
      ? [
          "CosmicTalks ब्रांड दिशानिर्देश",
          "CosmicTalks लोगो",
          "CosmicTalks वर्डмарк",
          "CosmicTalks ट्रेडमार्क",
          "ज्योतिषी ब्रांड उपयोग",
          "CosmicTalks प्रेस",
          "CosmicTalks रंग",
        ]
      : [
          "CosmicTalks brand guidelines",
          "CosmicTalks logo",
          "CosmicTalks wordmark",
          "CosmicTalks trademark",
          "astrologer logo usage",
          "CosmicTalks press",
          "CosmicTalks colors",
        ],
  });
}

export default async function BrandPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const faqs = brandFaqs(siteConfig.email).map((f) => ({
    q: hi ? f.q.hi : f.q.en,
    a: hi ? f.a.hi : f.a.en,
  }));

  return (
    <div className="bg-cosmic-navy">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          {
            name: hi ? "ब्रांड दिशानिर्देश" : "Brand Guidelines",
            path: "/brand",
          },
        ])}
      />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <PageHero
        eyebrow={siteConfig.brandName}
        title={hi ? "ब्रांड दिशानिर्देश" : "Brand Guidelines"}
        description={
          hi
            ? "नाम, वर्डмарк, आइकन और रंग — बाहरी उल्लेख के नियम, बिक्री भाषा नहीं।"
            : "Name, wordmark, icon, and colour — rules for external reference, not a sales page."
        }
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "ब्रांड दिशानिर्देश" : "Brand Guidelines" },
        ]}
      />
      <BrandGuidelinesView locale={locale} />
    </div>
  );
}
