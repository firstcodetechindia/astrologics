import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Roboto,
} from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyContactBar } from "@/components/kundli/ContactCTA";
import { cn } from "@/lib/utils";
import "../globals.css";

/** English UI — Roboto family */
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

/** Hindi body — clearest professional Devanagari UI font */
const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
  display: "swap",
});

/** Hindi headings — elegant professional Devanagari serif */
const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi-display",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={locale === "hi" ? "locale-hi" : "locale-en"}>
      <body
        className={cn(
          roboto.variable,
          notoSansDevanagari.variable,
          notoSerifDevanagari.variable,
          "antialiased vedic-bg vedic-pattern"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-[70vh] pb-16 sm:pb-3">{children}</main>
          <Footer />
          <StickyContactBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
