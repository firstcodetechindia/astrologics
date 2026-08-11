"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import {
  formatPhoneDisplay,
  getSession,
  loginOrSignupWithPhone,
  normalizePhone,
  verifyDevOtp,
} from "@/lib/auth/client-auth";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp";

const OTP_LENGTH = 6;

export function AuthOtpForm() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const search = useSearchParams();
  const rawNext = search.get("next") || "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");

  useEffect(() => {
    if (getSession()) {
      router.replace(next);
    }
  }, [router, next]);

  useEffect(() => {
    if (step === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  function resetOtp() {
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
  }

  function focusIndex(index: number) {
    const el = inputRefs.current[Math.max(0, Math.min(OTP_LENGTH - 1, index))];
    el?.focus();
    el?.select();
  }

  function applyOtpValue(value: string, startIndex = 0) {
    const cleaned = value.replace(/\D/g, "").slice(0, OTP_LENGTH - startIndex);
    if (!cleaned) return;

    setDigits((prev) => {
      const nextDigits = [...prev];
      for (let i = 0; i < cleaned.length; i += 1) {
        nextDigits[startIndex + i] = cleaned[i]!;
      }
      return nextDigits;
    });

    const nextFocus = Math.min(startIndex + cleaned.length, OTP_LENGTH - 1);
    requestAnimationFrame(() => focusIndex(nextFocus));
  }

  function onDigitChange(index: number, raw: string) {
    setError(null);
    const cleaned = raw.replace(/\D/g, "");

    if (cleaned.length > 1) {
      applyOtpValue(cleaned, index);
      return;
    }

    const digit = cleaned.slice(-1);
    setDigits((prev) => {
      const nextDigits = [...prev];
      nextDigits[index] = digit;
      return nextDigits;
    });

    if (digit && index < OTP_LENGTH - 1) {
      requestAnimationFrame(() => focusIndex(index + 1));
    }
  }

  function onDigitKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const nextDigits = [...prev];
          nextDigits[index] = "";
          return nextDigits;
        });
        return;
      }
      if (index > 0) {
        e.preventDefault();
        setDigits((prev) => {
          const nextDigits = [...prev];
          nextDigits[index - 1] = "";
          return nextDigits;
        });
        focusIndex(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  }

  function onDigitPaste(index: number, e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    setError(null);
    applyOtpValue(e.clipboardData.getData("text"), index);
  }

  function onSendOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError(
        hi
          ? "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }
    setPhone(normalized);
    setStep("otp");
    resetOtp();
  }

  function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (otp.length !== OTP_LENGTH) {
      setError(
        hi
          ? "कृपया 6 अंकों का OTP दर्ज करें।"
          : "Please enter the 6-digit OTP."
      );
      return;
    }

    setBusy(true);

    if (!verifyDevOtp(otp)) {
      setBusy(false);
      setError(hi ? "गलत OTP। पुनः प्रयास करें।" : "Invalid OTP. Please try again.");
      resetOtp();
      requestAnimationFrame(() => focusIndex(0));
      return;
    }

    const result = loginOrSignupWithPhone(phone, whatsappUpdates);
    setBusy(false);
    if ("error" in result) {
      setError(hi ? "मोबाइल नंबर अमान्य है।" : "Mobile number is invalid.");
      return;
    }

    router.replace(next);
  }

  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-saffron/20 bg-white p-5 shadow-[0_10px_28px_-18px_rgba(42,33,24,0.22)] sm:p-7">
      <div className="mb-5">
        <h2 className="font-display text-[1.55rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.7rem]">
          {hi
            ? `${siteConfig.brandName} में आपका स्वागत है`
            : `Welcome to ${siteConfig.brandName}`}
        </h2>
        <p className="mt-1.5 text-[13px] text-ink-muted">
          {step === "phone"
            ? hi
              ? "लॉगिन / साइन अप के लिए अपना मोबाइल नंबर दर्ज करें"
              : "Enter your mobile number to Login/Signup"
            : hi
              ? `${formatPhoneDisplay(phone)} पर भेजा गया OTP दर्ज करें`
              : `Enter the OTP sent to ${formatPhoneDisplay(phone)}`}
        </p>
      </div>

      {step === "phone" ? (
        <form className="space-y-4" onSubmit={onSendOtp}>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "मोबाइल नंबर*" : "Mobile number*"}
            </span>
            <div className="flex overflow-hidden rounded-xl border border-saffron/25 bg-white focus-within:border-saffron/55 focus-within:ring-[3px] focus-within:ring-saffron/15">
              <div className="flex shrink-0 items-center gap-1 border-r border-saffron/15 bg-[#fff8f1] px-3 text-[13px] font-semibold text-ink">
                +91 (IN)
                <ChevronDown className="h-3.5 w-3.5 text-[#8a7a6a]" />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                required
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder={hi ? "मोबाइल नंबर" : "Mobile number"}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-[#9a8b7a]"
              />
            </div>
          </label>

          {error ? (
            <p className="rounded-xl border border-saffron/20 bg-[#fff1e6] px-3 py-2.5 text-[13px] text-saffron-deep">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            className="w-full !rounded-2xl !bg-[#F06A00] !py-3.5 text-[14px] !shadow-none hover:!bg-[#e85d04]"
          >
            {hi ? "OTP भेजें" : "Send OTP"}
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onVerifyOtp}>
          <fieldset>
            <legend className="mb-2.5 block text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "OTP*" : "OTP*"}
            </legend>
            <div className="flex justify-between gap-1.5 sm:gap-2.5">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  pattern="[0-9]*"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  aria-label={
                    hi ? `OTP अंक ${index + 1}` : `OTP digit ${index + 1}`
                  }
                  value={digit}
                  onChange={(e) => onDigitChange(index, e.target.value)}
                  onKeyDown={(e) => onDigitKeyDown(index, e)}
                  onPaste={(e) => onDigitPaste(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "h-12 w-10 rounded-xl border border-saffron/25 bg-white text-center text-lg font-semibold text-ink outline-none transition sm:h-13 sm:w-12",
                    "focus:border-saffron/55 focus:ring-[3px] focus:ring-saffron/15",
                    digit && "border-saffron/40"
                  )}
                />
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-xl border border-saffron/20 bg-[#fff1e6] px-3 py-2.5 text-[13px] text-saffron-deep">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={busy || otp.length !== OTP_LENGTH}
            className="w-full !rounded-2xl !bg-[#F06A00] !py-3.5 text-[14px] !shadow-none hover:!bg-[#e85d04] disabled:opacity-60"
          >
            {hi ? "OTP सत्यापित करें" : "Verify OTP"}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("phone");
              resetOtp();
              setError(null);
            }}
            className="w-full text-center text-[13px] font-semibold text-saffron-deep hover:underline"
          >
            {hi ? "नंबर बदलें" : "Change number"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-[12px] leading-relaxed text-ink-muted">
        {hi ? "आगे बढ़कर आप हमारी " : "By proceeding, you agree to our "}
        <Link href="/terms" className="font-semibold text-saffron-deep underline">
          {hi ? "नियम व शर्तें" : "T&C"}
        </Link>
        {hi ? " और " : " & "}
        <Link
          href="/privacy"
          className="font-semibold text-saffron-deep underline"
        >
          {hi ? "गोपनीयता नीति" : "Privacy Policy"}
        </Link>
        {hi ? " से सहमत होते हैं।" : "."}
      </p>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2.5 text-[13px] text-ink">
        <input
          type="checkbox"
          checked={whatsappUpdates}
          onChange={(e) => setWhatsappUpdates(e.target.checked)}
          className="h-4 w-4 rounded border-saffron/40 text-saffron accent-[#F06A00]"
        />
        <span className="inline-flex items-center gap-1.5">
          {hi ? "WhatsApp पर अपडेट पाएँ" : "Get updates on WhatsApp"}
          <span className="inline-flex h-5 w-5 shrink-0" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="12" cy="12" r="12" fill="#25D366" />
              <path
                fill="#fff"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
          </span>
        </span>
      </label>
    </div>
  );
}
