"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { PhoneNationalField } from "@/components/auth/PhoneNationalField";
import {
  ASTROLOGER_CATEGORY_SECTIONS,
  ASTROLOGER_LANGUAGE_SECTIONS,
  ASTROLOGER_SKILL_SECTIONS,
  formatPhoneDisplay,
  getAstrologerSession,
  normalizePhone,
  registerAstrologer,
  verifyDevOtp,
} from "@/lib/auth/astrologer-auth";
import { cn } from "@/lib/utils";
import { MultiSectionSelect } from "./MultiSectionSelect";
import { OtpBoxes, OTP_LENGTH } from "@/components/auth/OtpBoxes";

type Step = "details" | "otp";

const fieldClass =
  "mt-1 w-full rounded-xl border border-white/12 bg-surface px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-ink-muted focus:border-[#F06A00]/50 focus:ring-[3px] focus:ring-[#F06A00]/12";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted";

export function AstrologerSignupForm() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [skills, setSkills] = useState<string[]>(["vedic"]);
  const [languages, setLanguages] = useState<string[]>(["hi", "en"]);
  const [categories, setCategories] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
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
    if (!firstName.trim()) {
      setError(hi ? "पहला नाम आवश्यक है।" : "First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError(hi ? "अंतिम नाम आवश्यक है।" : "Last name is required.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(hi ? "वैध ईमेल दर्ज करें।" : "Please enter a valid email.");
      return;
    }
    if (skills.length === 0) {
      setError(hi ? "कम से कम एक कौशल चुनें।" : "Select at least one skill.");
      return;
    }
    if (languages.length === 0) {
      setError(hi ? "कम से कम एक भाषा चुनें।" : "Select at least one language.");
      return;
    }
    if (categories.length === 0) {
      setError(
        hi ? "कम से कम एक श्रेणी चुनें।" : "Select at least one category."
      );
      return;
    }
    if (!agree) {
      setError(
        hi
          ? "कृपया नियम व शर्तों से सहमत हों।"
          : "Please agree to the Terms & Conditions."
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
    const result = registerAstrologer({
      phone,
      firstName,
      middleName,
      lastName,
      email,
      gender,
      skills,
      languages,
      categories,
    });
    setBusy(false);
    if ("error" in result) {
      if (result.error === "already_registered") {
        setError(
          hi
            ? "यह नंबर पहले से पंजीकृत है। साइन इन करें।"
            : "This number is already registered. Please sign in."
        );
      } else if (result.error === "invalid_email") {
        setError(hi ? "वैध ईमेल दर्ज करें।" : "Please enter a valid email.");
      } else {
        setError(hi ? "पंजीकरण विफल।" : "Registration failed.");
      }
      return;
    }
    router.replace("/astrologer/dashboard");
  }

  return (
    <div className="rounded-2xl border border-white/12 bg-surface shadow-[0_20px_48px_-28px_rgba(42,33,24,0.45)]">
      <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10 surface-wash px-5 py-4 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(240,106,0,0.12), transparent 42%), radial-gradient(circle at 88% 0%, rgba(240,106,0,0.08), transparent 36%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#F06A00]">
                {hi ? "पार्टनर ऑनबोर्डिंग" : "Partner onboarding"}
              </p>
              <h2 className="mt-1 font-display text-[1.45rem] font-semibold tracking-tight text-ink sm:text-[1.6rem]">
                {hi ? "ज्योतिषी पंजीकरण" : "Astrologer Registration"}
              </h2>
            </div>
            <span className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-[#F06A00] text-white shadow-[0_10px_24px_-12px_rgba(240,106,0,0.9)] sm:inline-flex">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {(
              [
                { id: "details" as const, en: "Details", hi: "विवरण" },
                { id: "otp" as const, en: "Verify", hi: "सत्यापन" },
              ] as const
            ).map((s, i) => {
              const active = step === s.id;
              const done = step === "otp" && s.id === "details";
              return (
                <div key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      active || done
                        ? "bg-[#F06A00] text-white"
                        : "bg-white/[0.08] text-ink-muted"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={cn(
                      "truncate text-[12px] font-semibold",
                      active || done ? "text-ink" : "text-ink-muted"
                    )}
                  >
                    {hi ? s.hi : s.en}
                  </span>
                  {i === 0 ? (
                    <span
                      className={cn(
                        "mx-1 h-px flex-1",
                        done ? "bg-cosmic-purple/50" : "bg-white/15"
                      )}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <p className="mt-2.5 text-[12.5px] leading-snug text-ink-muted">
            {step === "details"
              ? hi
                ? "संक्षिप्त विवरण भरें — OTP से सत्यापित करें।"
                : "A short profile, then OTP verification."
              : hi
                ? `${formatPhoneDisplay(phone)} पर भेजा गया OTP दर्ज करें`
                : `Enter the OTP sent to ${formatPhoneDisplay(phone)}`}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6 sm:py-5">
        {step === "details" ? (
          <form className="space-y-3.5" onSubmit={onSendOtp}>
            <div>
              <span className={labelClass}>
                {hi ? "लिंग" : "Gender"}
                <span className="text-[#F06A00]"> *</span>
              </span>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-xl bg-white/[0.06] p-1">
                {(
                  [
                    { id: "male" as const, en: "Male", hi: "पुरुष" },
                    { id: "female" as const, en: "Female", hi: "महिला" },
                    { id: "other" as const, en: "Other", hi: "अन्य" },
                  ] as const
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGender(g.id)}
                    className={cn(
                      "rounded-lg px-2 py-2 text-[12px] font-semibold transition",
                      gender === g.id
                        ? "bg-surface text-[#F06A00] shadow-sm ring-1 ring-[#F06A00]/20"
                        : "text-ink-muted hover:text-ink"
                    )}
                  >
                    {hi ? g.hi : g.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <PhoneNationalField
                id="astrologer-signup-phone"
                label={`${hi ? "मोबाइल" : "Mobile"}*`}
                value={phone}
                onChange={setPhone}
                placeholder="98765 43210"
                required
                prefix="+91"
                rowClassName="mt-1 border-white/12 focus-within:border-[#F06A00]/50 focus-within:ring-[#F06A00]/12"
                inputClassName="px-2.5 py-2.5"
              />

              <div>
                <label htmlFor="astrologer-signup-email" className={labelClass}>
                  {hi ? "ईमेल" : "Email"}{" "}
                  <span className="normal-case tracking-normal text-ink-muted">
                    ({hi ? "वैकल्पिक" : "optional"})
                  </span>
                </label>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
                  <input
                    id="astrologer-signup-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={hi ? "name@email.com" : "name@email.com"}
                    className={cn(fieldClass, "mt-0 pl-9")}
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <label className="block min-w-0">
                <span className={labelClass}>
                  {hi ? "पहला" : "First"}
                  <span className="text-[#F06A00]"> *</span>
                </span>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={hi ? "नाम" : "First"}
                  className={fieldClass}
                />
              </label>
              <label className="block min-w-0">
                <span className={labelClass}>
                  {hi ? "मध्य" : "Middle"}{" "}
                  <span className="normal-case tracking-normal text-ink-muted">
                    ({hi ? "वैकल्पिक" : "opt."})
                  </span>
                </span>
                <input
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder={hi ? "मध्य" : "Middle"}
                  className={fieldClass}
                />
              </label>
              <label className="block min-w-0">
                <span className={labelClass}>
                  {hi ? "अंतिम" : "Last"}
                  <span className="text-[#F06A00]"> *</span>
                </span>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={hi ? "उपनाम" : "Last"}
                  className={fieldClass}
                />
              </label>
            </div>

            <MultiSectionSelect
              label={hi ? "प्राथमिक कौशल" : "Primary skills"}
              required
              placeholder={hi ? "कौशल चुनें" : "Select skills"}
              sections={ASTROLOGER_SKILL_SECTIONS}
              values={skills}
              onChange={setSkills}
              hi={hi}
            />

            <MultiSectionSelect
              label={hi ? "ज्ञात भाषाएँ" : "Languages known"}
              required
              placeholder={hi ? "भाषाएँ चुनें" : "Select languages"}
              sections={ASTROLOGER_LANGUAGE_SECTIONS}
              values={languages}
              onChange={setLanguages}
              hi={hi}
            />

            <MultiSectionSelect
              label={hi ? "श्रेणियाँ" : "Categories"}
              required
              placeholder={hi ? "श्रेणियाँ चुनें" : "Select categories"}
              sections={ASTROLOGER_CATEGORY_SECTIONS}
              values={categories}
              onChange={setCategories}
              hi={hi}
            />

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5 text-[12.5px] text-ink">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#F06A00]"
              />
              <span>
                {hi ? "मैं " : "I agree to the "}
                <Link
                  href="/terms"
                  className="font-semibold text-[#F06A00] underline decoration-[#F06A00]/35 underline-offset-2"
                >
                  {hi ? "नियम व शर्तें" : "Terms & Conditions"}
                </Link>
                {hi ? " से सहमत हूँ।" : "."}
              </span>
            </label>

            {error ? (
              <p className="rounded-xl border border-[#F06A00]/20 bg-cosmic-purple/15 px-3 py-2 text-[12.5px] text-cosmic-gold">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-xl! bg-[#F06A00]! py-3! text-[14px]! shadow-[0_12px_28px_-14px_rgba(240,106,0,0.85)]! hover:bg-[#e85d04]!"
            >
              {hi ? "OTP प्राप्त करें" : "Get OTP"}
            </Button>

            <p className="text-center text-[12.5px] text-ink-muted">
              {hi ? "पहले से खाता है? " : "Already have an account? "}
              <Link
                href="/astrologer/signin"
                className="font-semibold text-[#F06A00] hover:underline"
              >
                {hi ? "साइन इन करें" : "Sign in"}
              </Link>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={onVerify}>
            <fieldset>
              <legend className={cn(labelClass, "mb-2")}>
                {hi ? "OTP" : "OTP"}
                <span className="text-[#F06A00]"> *</span>
              </legend>
              <OtpBoxes
                digits={digits}
                setDigits={(next) => {
                  setError(null);
                  setDigits(next);
                }}
                disabled={busy}
                boxClassName="border-white/12 focus:border-[#F06A00]/55 focus:ring-[#F06A00]/12"
                ariaLabel={(i) =>
                  hi ? `OTP अंक ${i + 1}` : `OTP digit ${i + 1}`
                }
              />
            </fieldset>

            {error ? (
              <p className="rounded-xl border border-[#F06A00]/20 bg-cosmic-purple/15 px-3 py-2 text-[12.5px] text-cosmic-gold">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={busy || otp.length !== OTP_LENGTH}
              className="w-full rounded-xl! bg-[#F06A00]! py-3! text-[14px]! shadow-[0_12px_28px_-14px_rgba(240,106,0,0.85)]! hover:bg-[#e85d04]! disabled:opacity-60"
            >
              {hi ? "सत्यापित करें व आवेदन करें" : "Verify & Submit Application"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep("details");
                resetOtp();
                setError(null);
              }}
              className="w-full text-center text-[13px] font-semibold text-[#F06A00] hover:underline"
            >
              {hi ? "विवरण बदलें" : "Edit details"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
