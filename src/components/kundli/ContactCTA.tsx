"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { telLink, whatsappLink } from "@/lib/site-config";

export function StickyContactBar() {
  const t = useTranslations("common");

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-saffron/25 bg-gradient-to-r from-[#fffaf6]/97 via-[#fff3ea]/96 to-[#ffe8d4]/95 backdrop-blur-xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <div className="flex gap-2 max-w-lg mx-auto">
        <ButtonLink
          href={whatsappLink()}
          variant="whatsapp"
          className="flex-1 !py-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          {t("whatsapp")}
        </ButtonLink>
        <ButtonLink href={telLink()} variant="primary" className="flex-1 !py-3">
          <Phone className="h-4 w-4" />
          {t("call")}
        </ButtonLink>
      </div>
    </div>
  );
}

export function ContactCTA({
  title,
  text,
  compact = false,
}: {
  title?: string;
  text?: string;
  compact?: boolean;
}) {
  const t = useTranslations("common");
  const tr = useTranslations("result");
  const heading = title ?? tr("upchaarTitle");
  const body = text ?? tr("upchaarText");

  return (
    <div
      className={`glass-strong shine-border relative overflow-hidden rounded-2xl sm:rounded-3xl ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-8 md:p-10"
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-saffron/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
      <div className="relative">
        <h3 className="heading-2 font-display text-saffron-deep">
          {heading}
        </h3>
        <p className="text-muted mt-2 max-w-2xl">
          {body}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
          <ButtonLink
href={whatsappLink(
            "Namaste, I want a detailed kundli reading and remedy guidance."
          )}
            variant="whatsapp"
            className="w-full sm:w-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            {t("whatsapp")}
          </ButtonLink>
          <ButtonLink href={telLink()} variant="primary" className="w-full sm:w-auto">
            <Phone className="h-4 w-4" />
            {t("call")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
