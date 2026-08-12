"use client";

import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";

export function FaqPageClient({
  title,
  subtitle,
  faqs,
  homeLabel,
}: {
  title: string;
  subtitle: string;
  faqs: { q: string; a: string }[];
  homeLabel: string;
}) {
  return (
    <div className="bg-cosmic-navy">
      <PageHero
        eyebrow="FAQ"
        title={title}
        description={subtitle}
        crumbs={[{ label: homeLabel, href: "/" }, { label: title }]}
      />
      <div className="container-page py-10 sm:py-12">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
