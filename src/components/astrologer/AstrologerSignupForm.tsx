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
import { ChevronDown, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
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

type Step = "details" | "otp";
const OTP_LENGTH = 6;

const fieldClass =
  "mt-1 w-full rounded-xl border border-[#e8ddd2] bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-[#b0a090] focus:border-[#F06A00]/50 focus:ring-[3px] focus:ring-[#F06A00]/12";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b5c4c]";

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
      requestAnimationFrame(() => focusIndex(0));
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
    <div className="rounded-2xl border border-[#e8ddd2] bg-white shadow-[0_20px_48px_-28px_rgba(42,33,24,0.45)]">
      <div className="relative overflow-hidden rounded-t-2xl border-b border-[#f0e6dc] bg-[linear-gradient(135deg,#fff8f1_0%,#ffffff_55%,#fff1e6_100%)] px-5 py-4 sm:px-6">
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
                        : "bg-[#f3ebe3] text-[#8a7a6a]"
                    )}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={cn(
                      "truncate text-[12px] font-semibold",
                      active || done ? "text-ink" : "text-[#9a8b7a]"
                    )}
                  >
                    {hi ? s.hi : s.en}
                  </span>
                  {i === 0 ? (
                    <span
                      className={cn(
                        "mx-1 h-px flex-1",
                        done ? "bg-[#F06A00]/50" : "bg-[#e8ddd2]"
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
              <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-xl bg-[#f7f1ea] p-1">
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
                        ? "bg-white text-[#F06A00] shadow-sm ring-1 ring-[#F06A00]/20"
                        : "text-[#6b5c4c] hover:text-ink"
                    )}
                  >
                    {hi ? g.hi : g.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>
                  {hi ? "मोबाइल" : "Mobile"}
                  <span className="text-[#F06A00]"> *</span>
                </span>
                <div className="mt-1 flex overflow-hidden rounded-xl border border-[#e8ddd2] focus-within:border-[#F06A00]/50 focus-within:ring-[3px] focus-within:ring-[#F06A00]/12">
                  <div className="flex shrink-0 items-center gap-1 border-r border-[#efe4d8] bg-[#fff8f1] px-2.5 text-[12px] font-semibold text-ink">
                    +91
                    <ChevronDown className="h-3 w-3 text-[#8a7a6a]" />
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
                    placeholder="98765 43210"
                    className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className={labelClass}>
                  {hi ? "ईमेल" : "Email"}{" "}
                  <span className="normal-case tracking-normal text-[#9a8b7a]">
                    ({hi ? "वैकल्पिक" : "optional"})
                  </span>
                </span>
                <div className="relative mt-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b0a090]" />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={hi ? "name@email.com" : "name@email.com"}
                    className={cn(fieldClass, "mt-0 pl-9")}
                  />
                </div>
              </label>
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
                  <span className="normal-case tracking-normal text-[#9a8b7a]">
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

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-[#faf6f1] px-3 py-2.5 text-[12.5px] text-ink">
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
              <p className="rounded-xl border border-[#F06A00]/20 bg-[#fff1e6] px-3 py-2 text-[12.5px] text-[#c45a00]">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-xl! bg-[#F06A00]! py-3! text-[14px]! shadow-[0_12px_28px_-14px_rgba(240,106,0,0.85)]! hover:bg-[#e85d04]!"
            >
              {hi ? "OTP प्राप्त करें" : "Get OTP"}
            </Button>

            <p className="text-center text-[12.5px] text-ink-muted lg:hidden">
              {hi ? "पहले से पार्टनर हैं? " : "Already a partner? "}
              <Link
                href="/astrologer/signin"
                className="font-semibold text-[#F06A00] hover:underline"
              >
                {hi ? "साइन इन" : "Sign in"}
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
                    aria-label={hi ? `OTP अंक ${index + 1}` : `OTP digit ${index + 1}`}
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
                    className="h-12 w-10 rounded-xl border border-[#e8ddd2] text-center text-lg font-semibold text-ink outline-none focus:border-[#F06A00]/55 focus:ring-[3px] focus:ring-[#F06A00]/12 sm:h-13 sm:w-12"
                  />
                ))}
              </div>
            </fieldset>

            {error ? (
              <p className="rounded-xl border border-[#F06A00]/20 bg-[#fff1e6] px-3 py-2 text-[12.5px] text-[#c45a00]">
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
