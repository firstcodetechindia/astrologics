"use client";

import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  /** Shows a pink * and marks the control as required. */
  required?: boolean;
  /** Truthy = error state; string = custom message. */
  error?: boolean | string;
  /** Bump on each failed submit to re-trigger shake. */
  shakeKey?: number;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Shared labeled field — mandatory asterisk + shake on validation error.
 */
export function FormField({
  label,
  required,
  error,
  shakeKey = 0,
  hint,
  className,
  children,
}: FormFieldProps) {
  const hasError = Boolean(error);
  const message =
    typeof error === "string" && error.trim()
      ? error
      : hasError
        ? "Required"
        : null;

  const control = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ className?: string; "aria-invalid"?: boolean; required?: boolean }>;
    return cloneElement(el, {
      className: cn(
        el.props.className,
        hasError && "border-cosmic-pink/70 ring-2 ring-cosmic-pink/25"
      ),
      "aria-invalid": hasError || undefined,
      required: required || el.props.required,
    });
  });

  return (
    <div className={cn("block min-w-0", className)}>
      <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-ink">
        <span>{label}</span>
        {required ? (
          <>
            <span className="text-cosmic-pink" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
      </span>
      <div
        key={hasError ? `shake-${shakeKey}` : "ok"}
        className={cn(hasError && "field-shake")}
      >
        {control}
      </div>
      {message ? (
        <span
          className="mt-1.5 block text-xs font-medium text-cosmic-pink"
          role="alert"
        >
          {message}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>
      ) : null}
    </div>
  );
}
