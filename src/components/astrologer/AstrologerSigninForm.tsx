"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import {
  formatPhoneDisplay,
  getAstrologerSession,
  loginAstrologer,
  normalizePhone,
  verifyDevOtp,
} from "@/lib/auth/astrologer-auth";
import { OtpBoxes, OTP_LENGTH } from "@/components/auth/OtpBoxes";
import { PhoneNationalField } from "@/components/auth/PhoneNationalField";

type Step = "phone" | "otp";

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
  const otp = digits.join("");

  useEffect(() => {
    if (getAstrologerSession()) {
      router.replace("/astrologer/dashboard");
    }
  }, [router]);

  function resetOtp() {
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
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
    <div className="rounded-[1.35rem] border border-saffron/20 bg-surface p-5 shadow-[0_12px_32px_-20px_rgba(42,33,24,0.28)] sm:p-7">
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
          <PhoneNationalField
            id="astrologer-signin-phone"
            label={hi ? "मोबाइल नंबर*" : "Mobile Number*"}
            value={phone}
            onChange={setPhone}
            placeholder={hi ? "मोबाइल नंबर" : "Mobile Number"}
            required
          />

          {error ? (
            <p className="rounded-xl border border-saffron/20 bg-cosmic-purple/15 px-3 py-2.5 text-[13px] text-saffron-deep">
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
            <legend className="mb-2 text-[12px] font-semibold text-ink-muted">
              {hi ? "OTP*" : "OTP*"}
            </legend>
            <OtpBoxes
              digits={digits}
              setDigits={(next) => {
                setError(null);
                setDigits(next);
              }}
              disabled={busy}
              ariaLabel={(i) =>
                hi ? `OTP अंक ${i + 1}` : `OTP digit ${i + 1}`
              }
            />
          </fieldset>

          {error ? (
            <p className="rounded-xl border border-saffron/20 bg-cosmic-purple/15 px-3 py-2.5 text-[13px] text-saffron-deep">
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
