import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/page-meta";
import { siteConfig } from "@/lib/site-config";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";

export type LegalTocItem = {
  id: string;
  label: string;
};

type LegalPageShellProps = {
  locale: string;
  path: "/terms" | "/privacy";
  title: string;
  description: string;
  eyebrow: string;
  updatedLabel: string;
  toc: LegalTocItem[];
  children: ReactNode;
};

export function LegalPageShell({
  locale,
  path,
  title,
  description,
  eyebrow,
  updatedLabel,
  toc,
  children,
}: LegalPageShellProps) {
  const hi = locale === "hi";

  return (
    <div className="bg-[#faf8f5]">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: hi ? "होम" : "Home", path: "" },
          { name: title, path },
        ])}
      />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        compact
        crumbs={[
          { label: hi ? "होम" : "Home", href: "/" },
          { label: title },
        ]}
      />

      <div className="container-page py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-64 lg:shrink-0">
            <div className="rounded-2xl border border-saffron/15 bg-white/70 p-5 shadow-[0_12px_32px_-24px_rgba(42,33,24,0.35)] backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-saffron-deep">
                {hi ? "इस पृष्ठ पर" : "On this page"}
              </p>
              <nav className="mt-3 space-y-1.5" aria-label={title}>
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block rounded-lg px-2 py-1.5 text-[13px] font-medium text-ink-muted transition hover:bg-saffron/10 hover:text-ink"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-5 border-t border-saffron/15 pt-4 text-[12px] text-ink-muted">
                <p>{updatedLabel}</p>
                <p className="mt-2">
                  {hi ? "संबंधित:" : "Related:"}{" "}
                  <Link
                    href={path === "/terms" ? "/privacy" : "/terms"}
                    className="font-semibold text-saffron-deep hover:underline"
                  >
                    {path === "/terms"
                      ? hi
                        ? "गोपनीयता नीति"
                        : "Privacy Policy"
                      : hi
                        ? "नियम व शर्तें"
                        : "Terms & Conditions"}
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          <article className="min-w-0 flex-1">
            <div className="rounded-2xl border border-saffron/15 bg-white/80 px-5 py-7 shadow-[0_16px_40px_-28px_rgba(42,33,24,0.4)] backdrop-blur-sm sm:px-8 sm:py-9">
              <div className="legal-prose space-y-8 text-[15px] leading-relaxed text-ink-muted [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-ink [&_a]:font-semibold [&_a]:text-saffron-deep [&_a]:underline">
                {children}
              </div>

              <div className="mt-10 rounded-xl border border-saffron/20 bg-[#fff8f1] px-4 py-4 sm:px-5">
                <p className="text-sm font-semibold text-ink">
                  {hi ? "सहायता चाहिए?" : "Need help?"}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {hi
                    ? `${siteConfig.brandName} से पूछताछ के लिए ईमेल करें:`
                    : `Questions about this policy? Email ${siteConfig.brandName} at`}
                </p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-saffron-deep hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
                <p className="mt-2 text-[12px] text-ink-muted">
                  {siteConfig.siteUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
