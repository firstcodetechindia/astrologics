"use client";

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export const OTP_LENGTH = 6;

type Props = {
  digits: string[];
  setDigits: (next: string[] | ((prev: string[]) => string[])) => void;
  disabled?: boolean;
  /** Extra classes on each box */
  boxClassName?: string;
  ariaLabel: (index: number) => string;
};

/**
 * Six OTP boxes that shrink on 360px phones.
 * Native inputs default to ~20ch min-width — `size={1}` + `w-0` defeats that.
 */
export function OtpBoxes({
  digits,
  setDigits,
  disabled,
  boxClassName,
  ariaLabel,
}: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function focusIndex(index: number) {
    const el = refs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))];
    el?.focus();
    el?.select();
  }

  function applyValue(value: string, startIndex: number) {
    const cleaned = value.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex);
    if (!cleaned) return;
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < cleaned.length; i++) {
        next[startIndex + i] = cleaned[i]!;
      }
      return next;
    });
    focusIndex(Math.min(startIndex + cleaned.length, OTP_LENGTH - 1));
  }

  return (
    <div className="flex w-full min-w-0 gap-1.5 sm:gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          size={1}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={index === 0 ? OTP_LENGTH : 1}
          aria-label={ariaLabel(index)}
          disabled={disabled}
          value={digit}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, "");
            if (cleaned.length > 1) {
              applyValue(cleaned, index);
              return;
            }
            const d = cleaned.slice(-1);
            setDigits((prev) => {
              const next = [...prev];
              next[index] = d;
              return next;
            });
            if (d && index < OTP_LENGTH - 1) {
              requestAnimationFrame(() => focusIndex(index + 1));
            }
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace" && !digits[index] && index > 0) {
              e.preventDefault();
              setDigits((prev) => {
                const next = [...prev];
                next[index - 1] = "";
                return next;
              });
              focusIndex(index - 1);
            }
            if (e.key === "ArrowLeft" && index > 0) {
              e.preventDefault();
              focusIndex(index - 1);
            }
            if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
              e.preventDefault();
              focusIndex(index + 1);
            }
          }}
          onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            applyValue(e.clipboardData.getData("text"), index);
          }}
          onFocus={(e) => e.target.select()}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          suppressHydrationWarning
          className={cn(
            "h-12 min-h-12 w-0 min-w-0 flex-1 rounded-xl border border-saffron/25 bg-surface text-center text-base font-semibold text-ink outline-none",
            "focus:border-saffron/55 focus:ring-[3px] focus:ring-saffron/15",
            digit && "border-saffron/40",
            boxClassName
          )}
        />
      ))}
    </div>
  );
}
