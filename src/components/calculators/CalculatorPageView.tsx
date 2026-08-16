"use client";

import { useLocale } from "next-intl";
import type { CalculatorMeta } from "@/lib/calculators/catalog";
import type { CalcPageContent } from "@/lib/calculators/content";
import { CalculatorClient } from "./CalculatorClient";
import { CalculatorSeo, PromoBanner } from "./CalculatorSeo";
import { ChoghadiyaBoard } from "./ChoghadiyaBoard";
import { RectifyClient } from "./RectifyClient";
import { RelatedSidebar } from "./RelatedSidebar";
import { PageHero } from "@/components/ui/PageHero";
import { DirectAnswer } from "@/components/seo/DirectAnswer";
import { TodayPanchangView } from "@/components/panchang/TodayPanchangView";

export function CalculatorPageView({
  meta,
  content,
}: {
  meta: CalculatorMeta;
  content: CalcPageContent;
}) {
  const locale = useLocale();
  const hi = locale === "hi";
  const h1 = hi ? content.h1.hi : content.h1.en;
  const intro = hi ? content.intro.hi : content.intro.en;
  const isChoghadiya = meta.slug === "choghadiya";
  const isTodayPanchang =
    meta.slug === "today-panchang" || meta.slug === "daily-panchang";
  const isRectify = meta.slug === "birth-time-rectification";
  const toolTitle =
    meta.slug === "love-calculator"
      ? hi
        ? "अपना प्रेम प्रतिशत जाँचें"
        : "Test Your Love Percentage"
      : meta.slug === "lo-shu-grid"
        ? hi
          ? "आपका लो शू ग्रिड"
          : "Your Lo Shu Grid"
        : hi
          ? meta.title.hi
          : meta.title.en;

  return (
    <div className="min-h-screen bg-cosmic-navy">
      <PageHero
        eyebrow={hi ? "कैलकुलेटर" : "Calculator"}
        title={h1}
        description={intro}
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: hi ? "कैलकुलेटर" : "Calculators", href: "/calculators" },
          { label: hi ? meta.title.hi : meta.title.en },
        ]}
      />
      <div className="container-page py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="min-w-0 space-y-6">
            <DirectAnswer>
              <p>
                <strong>{hi ? "सीधे उत्तर:" : "Direct answer:"}</strong> {intro}
              </p>
            </DirectAnswer>

            {isTodayPanchang ? (
              <TodayPanchangView />
            ) : isChoghadiya ? (
              <ChoghadiyaBoard />
            ) : isRectify ? (
              <RectifyClient />
            ) : (
              <CalculatorClient meta={meta} toolTitle={toolTitle} />
            )}

            {content.promo && !isChoghadiya && !isTodayPanchang && !isRectify ? (
              <PromoBanner
                text={content.promo.text}
                cta={content.promo.cta}
                href={content.promo.href}
              />
            ) : null}

            <CalculatorSeo content={content} />
          </div>
          <RelatedSidebar excludeSlug={meta.slug} />
        </div>
      </div>
    </div>
  );
}
