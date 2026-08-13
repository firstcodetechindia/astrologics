import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";

const variants: Record<Variant, string> = {
  primary: "btn-grad text-ivory hover:brightness-105",
  secondary:
    "bg-gradient-to-r from-gold to-saffron text-ivory hover:brightness-105 shadow-md shadow-saffron/25",
  ghost:
    "bg-white/10 text-white border border-cosmic-purple/40 hover:bg-cosmic-purple/20",
  whatsapp: "bg-[#128C7E] text-white hover:bg-[#0e7a6e] shadow-md",
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
