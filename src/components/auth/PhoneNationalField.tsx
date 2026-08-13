"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (digits: string) => void;
  placeholder?: string;
  required?: boolean;
  /** Prefix chip, default "+91 (IN)" */
  prefix?: string;
  className?: string;
  rowClassName?: string;
  inputClassName?: string;
};

/**
 * Phone row that must NOT wrap a <div> in a <label> — Safari rewrites that
 * invalid nesting and Next reports a hydration attribute mismatch.
 */
export function PhoneNationalField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  prefix = "+91 (IN)",
  className,
  rowClassName,
  inputClassName,
}: Props) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12px] font-semibold text-ink-muted"
      >
        {label}
      </label>
      <div
        className={cn(
          "flex overflow-hidden rounded-xl border border-saffron/25 bg-surface focus-within:border-saffron/55 focus-within:ring-[3px] focus-within:ring-saffron/15",
          rowClassName
        )}
      >
        <div
          className="flex shrink-0 items-center gap-1 border-r border-saffron/15 bg-cosmic-navy px-3 text-[13px] font-semibold text-ink"
          aria-hidden
        >
          {prefix}
          <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          size={1}
          autoComplete="tel-national"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={10}
          required={required}
          value={value}
          placeholder={placeholder}
          suppressHydrationWarning
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          className={cn(
            "w-0 min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-ink outline-none placeholder:text-ink-muted",
            inputClassName
          )}
        />
      </div>
    </div>
  );
}
