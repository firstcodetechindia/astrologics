"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import {
  deactivateAccount,
  deleteAccount,
  formatPhoneDisplay,
  getSession,
  updateSessionProfile,
} from "@/lib/auth/client-auth";
import {
  clearDashboardVault,
  getDashboardProfile,
  saveDashboardProfile,
  type DashboardProfile,
} from "@/lib/auth/dashboard-store";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type ProfileTab = "details" | "language" | "account";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-saffron/20 bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-saffron/50 focus:ring-[3px] focus:ring-saffron/15";

const DEACTIVATE_REASONS = [
  { en: "Too expensive", hi: "बहुत महंगा" },
  { en: "Too many technical issues", hi: "बहुत तकनीकी समस्याएँ" },
  { en: "Too many notifications & emails", hi: "बहुत सूचनाएँ व ईमेल" },
  { en: "Poor customer care", hi: "खराब ग्राहक सेवा" },
  { en: "Created a second account", hi: "दूसरा अकाउंट बनाया" },
  { en: "Quality of guidance", hi: "मार्गदर्शन की गुणवत्ता" },
  { en: "Privacy concerns", hi: "गोपनीयता संबंधी चिंता" },
  { en: "Others", hi: "अन्य" },
] as const;

export function DashboardProfilePanel() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState<ProfileTab>("details");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [langSaved, setLangSaved] = useState(false);
  const [accountMode, setAccountMode] = useState<"deactivate" | "delete">(
    "deactivate"
  );
  const [reason, setReason] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setPhone(session.phone);
    const stored = getDashboardProfile(session.phone);
    setProfile({
      ...stored,
      firstName:
        stored.firstName ||
        session.firstName ||
        session.name?.trim().split(/\s+/)[0] ||
        "",
      lastName:
        stored.lastName ||
        session.lastName ||
        session.name?.trim().split(/\s+/).slice(1).join(" ") ||
        "",
      primaryLanguage: stored.primaryLanguage || (locale === "hi" ? "hi" : "en"),
      secondaryLanguage: stored.secondaryLanguage || "",
    });
  }, [locale]);

  const tabs: { id: ProfileTab; en: string; hi: string }[] = [
    { id: "details", en: "Personal Details", hi: "व्यक्तिगत विवरण" },
    { id: "language", en: "Preferred Language", hi: "पसंदीदा भाषा" },
    { id: "account", en: "Deactivate/Delete", hi: "निष्क्रिय/हटाएँ" },
  ];

  function onSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !phone) return;
    const next = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
    };
    saveDashboardProfile(phone, next);
    updateSessionProfile({
      firstName: next.firstName || undefined,
      lastName: next.lastName || undefined,
    });
    setProfile(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function onSaveLanguage(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !phone || !profile.primaryLanguage) return;
    saveDashboardProfile(phone, profile);
    setLangSaved(true);
    if (profile.primaryLanguage !== locale) {
      router.replace(pathname, { locale: profile.primaryLanguage });
    }
    window.setTimeout(() => setLangSaved(false), 2200);
  }

  function onProceedAccount(e: React.FormEvent) {
    e.preventDefault();
    setAccountError(null);
    if (!reason) {
      setAccountError(
        hi ? "कृपया एक कारण चुनें।" : "Please select a reason."
      );
      return;
    }
    if (!phone) return;

    if (accountMode === "delete") {
      clearDashboardVault(phone);
      deleteAccount();
      router.replace("/login");
      return;
    }

    deactivateAccount();
    router.replace("/login");
  }

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold transition sm:px-4",
                active
                  ? "border-saffron/40 bg-[#F06A00] text-white shadow-[0_10px_22px_-14px_rgba(240,106,0,0.9)]"
                  : "border-saffron/20 bg-surface text-ink hover:border-saffron/35 hover:bg-cosmic-navy"
              )}
            >
              {hi ? item.hi : item.en}
            </button>
          );
        })}
      </div>

      {tab === "details" ? (
        <DashboardPanel>
          <div className="border-b border-saffron/10 px-5 py-5 sm:px-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              {hi ? "व्यक्तिगत विवरण" : "Personal Details"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {hi
                ? "अपना नाम और जन्म विवरण अपडेट करें। मोबाइल नंबर लॉगिन से जुड़ा है।"
                : "Update your name and birth details. Mobile number is tied to login."}
            </p>
          </div>

          <form
            onSubmit={onSaveDetails}
            className="space-y-4 px-5 py-6 sm:px-8 sm:py-7"
          >
            <label className="block">
              <span className="text-[12px] font-semibold text-ink-muted">
                {hi ? "मोबाइल नंबर" : "Mobile Number"}
              </span>
              <input
                value={formatPhoneDisplay(phone)}
                disabled
                className={`${fieldClass} cursor-not-allowed bg-cosmic-navy text-ink-muted`}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "पहला नाम*" : "First Name*"}
                </span>
                <input
                  required
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, firstName: e.target.value } : p
                    )
                  }
                  placeholder={hi ? "पहला नाम" : "First Name"}
                  className={fieldClass}
                />
                <span className="mt-1 block text-[11px] text-ink-muted">
                  {hi
                    ? "राशिफल / नाम आधारित गणना के लिए उपयोग होता है।"
                    : "Used for horoscope and name-based calculations."}
                </span>
              </label>

              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "उपनाम" : "Last Name"}
                </span>
                <input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, lastName: e.target.value } : p
                    )
                  }
                  placeholder={hi ? "उपनाम" : "Last Name"}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "ईमेल (वैकल्पिक)" : "Email (Optional)"}
                </span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, email: e.target.value } : p
                    )
                  }
                  placeholder="you@email.com"
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "लिंग" : "Gender"}
                </span>
                <select
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile((p) =>
                      p
                        ? {
                            ...p,
                            gender: e.target
                              .value as DashboardProfile["gender"],
                          }
                        : p
                    )
                  }
                  className={fieldClass}
                >
                  <option value="">{hi ? "चयन करें" : "Select"}</option>
                  <option value="male">{hi ? "पुरुष" : "Male"}</option>
                  <option value="female">{hi ? "महिला" : "Female"}</option>
                  <option value="other">{hi ? "अन्य" : "Other"}</option>
                </select>
              </label>

              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "जन्म तिथि" : "Birth Date"}
                </span>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, birthDate: e.target.value } : p
                    )
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "जन्म समय" : "Birth Time"}
                </span>
                <input
                  type="time"
                  value={profile.birthTime}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, birthTime: e.target.value } : p
                    )
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-[12px] font-semibold text-ink-muted">
                  {hi ? "जन्म स्थान" : "Birth Place"}
                </span>
                <input
                  value={profile.birthPlace}
                  onChange={(e) =>
                    setProfile((p) =>
                      p ? { ...p, birthPlace: e.target.value } : p
                    )
                  }
                  placeholder={hi ? "शहर, राज्य" : "City, State"}
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
              >
                {hi ? "प्रोफ़ाइल सेव करें" : "Save Profile"}
              </Button>
              {saved ? (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-deep">
                  <Check className="h-4 w-4" />
                  {hi ? "सेव हो गया" : "Saved"}
                </span>
              ) : null}
            </div>
          </form>
        </DashboardPanel>
      ) : null}

      {tab === "language" ? (
        <DashboardPanel>
          <div className="border-b border-saffron/10 px-5 py-5 sm:px-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              {hi ? "पसंदीदा भाषा" : "Preferred Language"}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {hi
                ? "साइट और सामग्री के लिए अपनी मुख्य भाषा चुनें।"
                : "Choose your primary language for the site and content."}
            </p>
          </div>

          <form
            onSubmit={onSaveLanguage}
            className="space-y-4 px-5 py-6 sm:px-8 sm:py-7"
          >
            <label className="block max-w-md">
              <span className="text-[12px] font-semibold text-ink-muted">
                {hi ? "प्राथमिक भाषा*" : "Primary Language*"}
              </span>
              <select
                required
                value={profile.primaryLanguage}
                onChange={(e) =>
                  setProfile((p) =>
                    p
                      ? {
                          ...p,
                          primaryLanguage: e.target
                            .value as DashboardProfile["primaryLanguage"],
                        }
                      : p
                  )
                }
                className={fieldClass}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </label>

            <label className="block max-w-md">
              <span className="text-[12px] font-semibold text-ink-muted">
                {hi ? "द्वितीय भाषा (वैकल्पिक)" : "Secondary Language (Optional)"}
              </span>
              <select
                value={profile.secondaryLanguage}
                onChange={(e) =>
                  setProfile((p) =>
                    p
                      ? {
                          ...p,
                          secondaryLanguage: e.target
                            .value as DashboardProfile["secondaryLanguage"],
                        }
                      : p
                  )
                }
                className={fieldClass}
              >
                <option value="">
                  {hi ? "चयन करें" : "Select"}
                </option>
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
              >
                {hi ? "अपडेट करें" : "Update"}
              </Button>
              {langSaved ? (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-deep">
                  <Check className="h-4 w-4" />
                  {hi ? "अपडेट हो गया" : "Updated"}
                </span>
              ) : null}
            </div>
          </form>
        </DashboardPanel>
      ) : null}

      {tab === "account" ? (
        <DashboardPanel>
          <div className="border-b border-saffron/10 px-5 py-5 sm:px-8">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink">
              {hi ? "निष्क्रिय / हटाएँ" : "Deactivate / Delete"}
            </h2>
            <p className="mt-2 text-sm font-semibold text-ink">
              {hi
                ? "अपना अकाउंट निष्क्रिय या हटाना"
                : "Deactivating or deleting your account"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {hi
                ? `यदि आप ${siteConfig.brandName} से थोड़ा ब्रेक चाहते हैं तो अकाउंट निष्क्रिय करें। स्थायी रूप से हटाने के लिए Delete चुनें।`
                : `If you want a break from ${siteConfig.brandName}, deactivate your account. If you want to permanently delete it, choose Delete.`}
            </p>
          </div>

          <form
            onSubmit={onProceedAccount}
            className="space-y-4 px-5 py-6 sm:px-8 sm:py-7"
          >
            <button
              type="button"
              onClick={() => setAccountMode("deactivate")}
              className={cn(
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                accountMode === "deactivate"
                  ? "border-saffron/40 bg-cosmic-navy"
                  : "border-saffron/15 bg-surface hover:bg-cosmic-navy"
              )}
            >
              <span className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    accountMode === "deactivate"
                      ? "border-[#F06A00]"
                      : "border-[#cfc4b8]"
                  )}
                >
                  {accountMode === "deactivate" ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F06A00]" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {hi ? "अकाउंट निष्क्रिय करें" : "Deactivate your account"}
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-ink">
                    {hi
                      ? "निष्क्रिय करना अस्थायी है"
                      : "Deactivating your account is temporary"}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink-muted">
                    {hi
                      ? "आपका अकाउंट अक्षम हो जाएगा, लेकिन आप बाद में फिर लॉगिन कर सकते हैं।"
                      : "Your account will be disabled from this device session, but you can log in again anytime."}
                  </span>
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountMode("delete")}
              className={cn(
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                accountMode === "delete"
                  ? "border-saffron/40 bg-cosmic-navy"
                  : "border-saffron/15 bg-surface hover:bg-cosmic-navy"
              )}
            >
              <span className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    accountMode === "delete"
                      ? "border-[#F06A00]"
                      : "border-[#cfc4b8]"
                  )}
                >
                  {accountMode === "delete" ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F06A00]" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {hi ? "अकाउंट हटाएँ" : "Delete your account"}
                  </span>
                  <span className="mt-1 block text-[13px] font-semibold text-ink">
                    {hi
                      ? "अकाउंट हटाना स्थायी है"
                      : `Deleting your ${siteConfig.brandName} account is permanent`}
                  </span>
                  <span className="mt-2 block text-[13px] text-ink-muted">
                    {hi
                      ? "हटाने पर आप स्थायी रूप से खो सकते हैं:"
                      : "By deleting, you will permanently lose:"}
                  </span>
                  <ul className="mt-2 space-y-1.5 text-[13px] text-ink">
                    {[
                      hi ? "सेव कुंडलियाँ" : "Saved kundlis",
                      hi ? "याद रखे गए रिज़ल्ट्स" : "Remembered results",
                      hi ? "प्रोफ़ाइल विवरण" : "Profile details",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#e85d04]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </span>
              </span>
            </button>

            <label className="block max-w-lg">
              <span className="text-[13px] font-semibold text-ink">
                {accountMode === "delete"
                  ? hi
                    ? "आप अकाउंट क्यों हटा रहे हैं?"
                    : "Why are you deleting your account?"
                  : hi
                    ? "आप अकाउंट क्यों निष्क्रिय कर रहे हैं?"
                    : "Why are you deactivating your account?"}
              </span>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={fieldClass}
              >
                <option value="">
                  {hi ? "-- कारण चुनें --*" : "--Select a reason--*"}
                </option>
                {DEACTIVATE_REASONS.map((r) => (
                  <option key={r.en} value={r.en}>
                    {hi ? r.hi : r.en}
                  </option>
                ))}
              </select>
            </label>

            {accountError ? (
              <p className="rounded-xl border border-saffron/20 bg-cosmic-purple/15 px-3 py-2.5 text-[13px] text-saffron-deep">
                {accountError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="w-full rounded-2xl! bg-[#F06A00]! py-3.5! shadow-none! hover:bg-[#e85d04]! sm:w-auto sm:px-8"
            >
              {accountMode === "delete"
                ? hi
                  ? "हटाने के लिए आगे बढ़ें"
                  : "Proceed to delete"
                : hi
                  ? "निष्क्रिय करने के लिए आगे बढ़ें"
                  : "Proceed to deactivate"}
            </Button>
          </form>
        </DashboardPanel>
      ) : null}
    </div>
  );
}
