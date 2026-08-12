/** Client-side account vault until DB is wired. Scoped per phone. */

export type DashboardProfile = {
  firstName: string;
  lastName: string;
  email: string;
  gender: "" | "male" | "female" | "other";
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  primaryLanguage: "en" | "hi" | "";
  secondaryLanguage: "en" | "hi" | "";
};

export type RememberedResult = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  href?: string;
  createdAt: string;
};

export type SavedKundli = {
  id: string;
  label: string;
  personName: string;
  relation: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  notes: string;
  createdAt: string;
};

export type KundliCheckEntry = {
  id: string;
  personName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  checkedAt: string;
};

type Vault = {
  profile: DashboardProfile;
  results: RememberedResult[];
  savedKundlis: SavedKundli[];
  kundliChecks: KundliCheckEntry[];
};

const VAULT_KEY = "cosmicgpt_dashboard_vault_v1";

function emptyProfile(): DashboardProfile {
  return {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    primaryLanguage: "",
    secondaryLanguage: "",
  };
}

/** Migrate older single `name` field into first/last. */
function normalizeProfile(raw: Partial<DashboardProfile> & { name?: string }): DashboardProfile {
  const base = emptyProfile();
  const firstName =
    (raw.firstName || "").trim() ||
    (raw.name || "").trim().split(/\s+/)[0] ||
    "";
  const lastFromName = (raw.name || "").trim().split(/\s+/).slice(1).join(" ");
  const lastName = (raw.lastName || "").trim() || lastFromName;
  return {
    ...base,
    ...raw,
    firstName,
    lastName,
    email: raw.email || "",
    gender: raw.gender || "",
    birthDate: raw.birthDate || "",
    birthTime: raw.birthTime || "",
    birthPlace: raw.birthPlace || "",
    primaryLanguage: raw.primaryLanguage || "",
    secondaryLanguage: raw.secondaryLanguage || "",
  };
}

function emptyVault(): Vault {
  return {
    profile: emptyProfile(),
    results: [],
    savedKundlis: [],
    kundliChecks: [],
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): Record<string, Vault> {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Vault>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, Vault>) {
  if (!canUseStorage()) return;
  localStorage.setItem(VAULT_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("cosmicgpt-dashboard-changed"));
}

export function getVault(phone: string): Vault {
  const all = readAll();
  if (!all[phone]) return emptyVault();
  return {
    ...emptyVault(),
    ...all[phone],
    profile: normalizeProfile(all[phone].profile || {}),
  };
}

function saveVault(phone: string, vault: Vault) {
  const all = readAll();
  all[phone] = vault;
  writeAll(all);
}

export function getDashboardProfile(phone: string) {
  return getVault(phone).profile;
}

export function saveDashboardProfile(phone: string, profile: DashboardProfile) {
  const vault = getVault(phone);
  saveVault(phone, { ...vault, profile });
}

export function clearDashboardVault(phone: string) {
  const all = readAll();
  delete all[phone];
  writeAll(all);
}

export function listRememberedResults(phone: string) {
  return getVault(phone).results;
}

export function addRememberedResult(
  phone: string,
  input: Omit<RememberedResult, "id" | "createdAt">
) {
  const vault = getVault(phone);
  const item: RememberedResult = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveVault(phone, { ...vault, results: [item, ...vault.results] });
  return item;
}

export function removeRememberedResult(phone: string, id: string) {
  const vault = getVault(phone);
  saveVault(phone, {
    ...vault,
    results: vault.results.filter((r) => r.id !== id),
  });
}

export function listSavedKundlis(phone: string) {
  return getVault(phone).savedKundlis;
}

export function addSavedKundli(
  phone: string,
  input: Omit<SavedKundli, "id" | "createdAt">
) {
  const vault = getVault(phone);
  const item: SavedKundli = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveVault(phone, {
    ...vault,
    savedKundlis: [item, ...vault.savedKundlis],
  });
  return item;
}

export function removeSavedKundli(phone: string, id: string) {
  const vault = getVault(phone);
  saveVault(phone, {
    ...vault,
    savedKundlis: vault.savedKundlis.filter((k) => k.id !== id),
  });
}

export function listKundliChecks(phone: string) {
  return getVault(phone).kundliChecks;
}

export function addKundliCheck(
  phone: string,
  input: Omit<KundliCheckEntry, "id" | "checkedAt">
) {
  const vault = getVault(phone);
  const item: KundliCheckEntry = {
    ...input,
    birthTime: input.birthTime || "",
    id: crypto.randomUUID(),
    checkedAt: new Date().toISOString(),
  };
  saveVault(phone, {
    ...vault,
    kundliChecks: [item, ...vault.kundliChecks].slice(0, 40),
  });
  return item;
}

export function removeKundliCheck(phone: string, id: string) {
  const vault = getVault(phone);
  saveVault(phone, {
    ...vault,
    kundliChecks: vault.kundliChecks.filter((k) => k.id !== id),
  });
}
