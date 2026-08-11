"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Bookmark, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  DashboardEmpty,
  DashboardPanel,
} from "@/components/dashboard/DashboardPanel";
import { getSession } from "@/lib/auth/client-auth";
import {
  addSavedKundli,
  listSavedKundlis,
  removeSavedKundli,
  type SavedKundli,
} from "@/lib/auth/dashboard-store";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-saffron/20 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-saffron/50 focus:ring-[3px] focus:ring-saffron/15";

const emptyForm = {
  label: "",
  personName: "",
  relation: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  notes: "",
};

export function DashboardSavedPanel() {
  const locale = useLocale();
  const hi = locale === "hi";
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<SavedKundli[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [openForm, setOpenForm] = useState(false);

  function refresh(p: string) {
    setItems(listSavedKundlis(p));
  }

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setPhone(session.phone);
    refresh(session.phone);
  }, []);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !form.personName.trim() || !form.birthDate || !form.birthPlace.trim()) {
      return;
    }
    addSavedKundli(phone, {
      label: form.label.trim() || (hi ? "सेव कुंडली" : "Saved kundli"),
      personName: form.personName.trim(),
      relation: form.relation.trim(),
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      birthPlace: form.birthPlace.trim(),
      notes: form.notes.trim(),
    });
    setForm(emptyForm);
    setOpenForm(false);
    refresh(phone);
  }

  return (
    <DashboardPanel>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-saffron/10 px-5 py-5 sm:px-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            {hi ? "सेव कुंडलियाँ" : "Saved Kundlis"}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {hi
              ? "अपनी या परिवार/मित्रों की कुंडलियाँ अकाउंट में सेव करें।"
              : "Save your own or family/friends’ kundlis in your account."}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setOpenForm((v) => !v)}
          className="rounded-xl! bg-[#F06A00]! px-4! py-2.5! text-xs! shadow-none! hover:bg-[#e85d04]!"
        >
          {openForm
            ? hi
              ? "फ़ॉर्म बंद करें"
              : "Close form"
            : hi
              ? "कुंडली सेव करें"
              : "Save a kundli"}
        </Button>
      </div>

      {openForm ? (
        <form
          onSubmit={onSave}
          className="grid gap-4 border-b border-saffron/10 px-5 py-6 sm:grid-cols-2 sm:px-8"
        >
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "लेबल" : "Label"}
            </span>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder={hi ? "जैसे: माँ की कुंडली" : "e.g. Mom’s kundli"}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "संबंध" : "Relation"}
            </span>
            <input
              value={form.relation}
              onChange={(e) =>
                setForm((f) => ({ ...f, relation: e.target.value }))
              }
              placeholder={hi ? "स्वयं / माता / मित्र" : "Self / Mother / Friend"}
              className={fieldClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "नाम*" : "Name*"}
            </span>
            <input
              required
              value={form.personName}
              onChange={(e) =>
                setForm((f) => ({ ...f, personName: e.target.value }))
              }
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
              value={form.birthDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, birthDate: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "जन्म समय" : "Birth Time"}
            </span>
            <input
              type="time"
              value={form.birthTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, birthTime: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "जन्म स्थान*" : "Birth Place*"}
            </span>
            <input
              required
              value={form.birthPlace}
              onChange={(e) =>
                setForm((f) => ({ ...f, birthPlace: e.target.value }))
              }
              className={fieldClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold text-[#5c4f42]">
              {hi ? "नोट्स" : "Notes"}
            </span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="rounded-2xl! bg-[#F06A00]! px-5! py-3! shadow-none! hover:bg-[#e85d04]!"
            >
              {hi ? "अकाउंट में सेव करें" : "Save to account"}
            </Button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <DashboardEmpty
          icon={Bookmark}
          title={hi ? "कोई सेव कुंडली नहीं" : "No saved kundlis"}
          description={
            hi
              ? "परिवार या मित्रों की कुंडलियाँ बाद के लिए यहाँ सेव करें।"
              : "Save family or friends’ kundlis here for later."
          }
          action={
            <button
              type="button"
              onClick={() => setOpenForm(true)}
              className="inline-flex rounded-xl bg-[#F06A00] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {hi ? "पहली कुंडली सेव करें" : "Save first kundli"}
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 p-5 sm:grid-cols-2 sm:p-8">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-saffron/12 bg-[#fffaf6] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-saffron-deep">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {item.personName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeSavedKundli(phone, item.id);
                    refresh(phone);
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8a7a6a] hover:bg-white hover:text-saffron-deep"
                  aria-label={hi ? "हटाएँ" : "Remove"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {item.relation ? (
                <p className="mt-1 text-[12px] text-ink-muted">{item.relation}</p>
              ) : null}
              <p className="mt-2 text-[13px] text-ink-muted">
                {item.birthDate}
                {item.birthTime ? ` · ${item.birthTime}` : ""}
              </p>
              <p className="text-[13px] text-ink-muted">{item.birthPlace}</p>
              {item.notes ? (
                <p className="mt-2 text-[12px] leading-relaxed text-[#7a6b5c]">
                  {item.notes}
                </p>
              ) : null}
              <Link
                href="/kundli"
                className="mt-3 inline-flex text-xs font-semibold text-saffron-deep hover:underline"
              >
                {hi ? "कुंडली टूल खोलें" : "Open kundli tool"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardPanel>
  );
}
