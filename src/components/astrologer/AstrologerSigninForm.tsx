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
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import {
  formatPhoneDisplay,
  getAstrologerSession,
  loginAstrologer,
  normalizePhone,
  verifyDevOtp,
} from "@/lib/auth/astrologer-auth";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp";
const OTP_LENGTH = 6;

export function AstrologerSigninForm() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LENGTH }, () => "")
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otp = digits.join("");

  useEffect(() => {
    if (getAstrologerSession()) {
      router.replace("/astrologer/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (step === "otp") inputRefs.current[0]?.focus();
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
      const next = [...prev];
      for (let i = 0; i < cleaned.length; i += 1) next[startIndex + i] = cleaned[i]!;
      return next;
    });
    requestAnimationFrame(() =>
      focusIndex(Math.min(startIndex + cleaned.length, OTP_LENGTH - 1))
    );
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

  function onVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== OTP_LENGTH) {
      setError(hi ? "कृपया 6 अंकों का OTP दर्ज करें।" : "Please enter the 6-digit OTP.");
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
    const result = loginAstrologer(phone);
    setBusy(false);
    if ("error" in result) {
      setError(
        hi
          ? "अकाउंट नहीं मिला। पहले साइन अप करें।"
          : "Account not found. Please sign up first."
      );
      return;
    }
    router.replace("/astrologer/dashboard");
  }

  return (
    <div className="rounded-[1.35rem] border border-saffron/20 bg-white p-5 shadow-[0_12px_32px_-20px_rgba(42,33,24,0.28)] sm:p-7">
      <h2 className="font-display text-[1.55rem] font-semibold tracking-tight text-ink">
        {hi ? "ज्योतिषी साइन इन" : "Astrologer Sign In"}
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-muted">
        {step === "phone"
          ? hi
            ? "पार्टनर पोर्टल के लिए मोबाइल OTP दर्ज करें।"
            : "Enter your mobile number for partner portal OTP login."
          : hi
            ? `${formatPhoneDisplay(phone)} पर भेजा गया OTP दर्ज करें`
            : `Enter the OTP sent to ${formatPhoneDisplay(phone)}`}
      </p>

      {step === "phone" ? (
        <form className="mt-5 space-y-4" onSubmit={onSendOtp}>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "मोबाइल नंबर*" : "Mobile Number*"}
            </span>
            <div className="mt-1.5 flex overflow-hidden rounded-xl border border-saffron/25 focus-within:border-saffron/55 focus-within:ring-[3px] focus-within:ring-saffron/15">
              <div className="flex shrink-0 items-center gap-1 border-r border-saffron/15 bg-[#fff8f1] px-3 text-[13px] font-semibold text-ink">
                +91 (IN)
                <ChevronDown className="h-3.5 w-3.5 text-[#8a7a6a]" />
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder={hi ? "मोबाइल नंबर" : "Mobile Number"}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
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
            className="w-full rounded-2xl! bg-[#F06A00]! py-3.5! shadow-none! hover:bg-[#e85d04]!"
          >
            {hi ? "OTP भेजें" : "Send OTP"}
          </Button>

          <p className="text-center text-[13px] text-ink-muted lg:hidden">
            {hi ? "नए हैं? " : "New here? "}
            <Link
              href="/astrologer/signup"
              className="font-semibold text-saffron-deep hover:underline"
            >
              {hi ? "साइन अप" : "Sign up"}
            </Link>
          </p>
        </form>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={onVerify}>
          <fieldset>
            <legend className="mb-2 text-[12px] font-semibold text-[#5c4f42]">
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
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  value={digit}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "");
                    setError(null);
                    if (cleaned.length > 1) {
                      applyOtpValue(cleaned, index);
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
                  }}
                  onPaste={(e: ClipboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    applyOtpValue(e.clipboardData.getData("text"), index);
                  }}
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "h-12 w-10 rounded-xl border border-saffron/25 text-center text-lg font-semibold text-ink outline-none focus:border-saffron/55 focus:ring-[3px] focus:ring-saffron/15 sm:h-13 sm:w-12"
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
            className="w-full rounded-2xl! bg-[#F06A00]! py-3.5! shadow-none! hover:bg-[#e85d04]! disabled:opacity-60"
          >
            {hi ? "साइन इन करें" : "Sign In"}
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
            {hi ? "नंबर बदलें" : "Change Number"}
          </button>
        </form>
      )}
    </div>
  );
}
