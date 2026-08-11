"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ClipboardCheck, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  DashboardEmpty,
  DashboardPanel,
} from "@/components/dashboard/DashboardPanel";
import { getSession } from "@/lib/auth/client-auth";
import {
  addKundliCheck,
  listKundliChecks,
  removeKundliCheck,
  type KundliCheckEntry,
} from "@/lib/auth/dashboard-store";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-saffron/20 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-saffron/50 focus:ring-[3px] focus:ring-saffron/15";

export function DashboardKundliCheckPanel() {
  const locale = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [checks, setChecks] = useState<KundliCheckEntry[]>([]);
  const [personName, setPersonName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  function refresh(p: string) {
    setChecks(listKundliChecks(p));
  }

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setPhone(session.phone);
    refresh(session.phone);
  }, []);

  function onCheck(e: React.FormEvent) {
    e.preventDefault();
    if (
      !phone ||
      !personName.trim() ||
      !birthDate ||
      !birthTime ||
      !birthPlace.trim()
    ) {
      return;
    }
    addKundliCheck(phone, {
      personName: personName.trim(),
      birthDate,
      birthTime,
      birthPlace: birthPlace.trim(),
    });
    refresh(phone);
    router.push("/kundli");
  }

  return (
    <DashboardPanel>
      <div className="border-b border-saffron/10 px-5 py-5 sm:px-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          {hi ? "कुंडली जाँच" : "Kundli Check"}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {hi
            ? "अपनी या किसी और की कुंडली जाँचें। इतिहास यहाँ सेव रहेगा।"
            : "Check your own or someone else’s kundli. History stays here."}
        </p>
      </div>

      <form
        onSubmit={onCheck}
        className="grid gap-4 border-b border-saffron/10 px-5 py-6 sm:grid-cols-2 sm:px-8"
      >
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-semibold text-[#5c4f42]">
            {hi ? "व्यक्ति का नाम*" : "Person Name*"}
          </span>
          <input
            required
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder={hi ? "नाम" : "Name"}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-[#5c4f42]">
            {hi ? "जन्म तिथि*" : "Birth Date*"}
          </span>
          <input
            required
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-semibold text-[#5c4f42]">
            {hi ? "जन्म समय*" : "Birth Time*"}
          </span>
          <input
            required
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-semibold text-[#5c4f42]">
            {hi ? "जन्म स्थान*" : "Birth Place*"}
          </span>
          <input
            required
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder={hi ? "शहर" : "City"}
            className={fieldClass}
          />
        </label>
        <div className="sm:col-span-2">
          <Button
            type="submit"
            className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
          >
            {hi ? "जाँचें और कुंडली खोलें" : "Check & Open Kundli"}
          </Button>
        </div>
      </form>

      <div className="px-5 py-4 sm:px-8">
        <h3 className="text-sm font-semibold text-ink">
          {hi ? "हाल की जाँचें" : "Recent Checks"}
        </h3>
      </div>

      {checks.length === 0 ? (
        <DashboardEmpty
          icon={ClipboardCheck}
          title={hi ? "अभी कोई जाँच नहीं" : "No checks yet"}
          description={
            hi
              ? "ऊपर विवरण भरकर कुंडली जाँच शुरू करें।"
              : "Fill the form above to start a kundli check."
          }
        />
      ) : (
        <ul className="divide-y divide-saffron/10 pb-2">
          {checks.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
            >
              <div>
                <p className="text-sm font-semibold text-ink">
                  {item.personName}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {item.birthDate}
                  {item.birthTime ? ` · ${item.birthTime}` : ""}
                  {" · "}
                  {item.birthPlace}
                </p>
                <p className="mt-1 text-[11px] text-[#9a8b7a]">
                  {new Date(item.checkedAt).toLocaleString(
                    hi ? "hi-IN" : "en-IN"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/kundli"
                  className="rounded-lg border border-saffron/25 px-3 py-1.5 text-xs font-semibold text-saffron-deep hover:bg-[#fff1e6]"
                >
                  {hi ? "फिर खोलें" : "Open again"}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    removeKundliCheck(phone, item.id);
                    refresh(phone);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8a7a6a] hover:bg-[#fff1e6] hover:text-saffron-deep"
                  aria-label={hi ? "हटाएँ" : "Remove"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
