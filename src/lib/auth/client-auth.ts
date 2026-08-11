/** Client-side auth placeholder until SMS / backend is wired. */

export const DEV_OTP = "112233";

const USERS_KEY = "astrologics_users_v1";
const SESSION_KEY = "astrologics_session_v1";

export type AuthUser = {
  phone: string;
  /** Used for horoscope / personalization. */
  firstName?: string;
  lastName?: string;
  /** @deprecated Prefer firstName + lastName */
  name?: string;
  createdAt: string;
  whatsappUpdates: boolean;
  isNewAtLogin?: boolean;
};

export function displayUserName(user: Pick<AuthUser, "firstName" | "lastName" | "name">) {
  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return user.name?.trim() || "";
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readUsers(): AuthUser[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuthUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: AuthUser[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return digits;
  if (digits.length === 12 && digits.startsWith("91") && /^91[6-9]\d{9}$/.test(digits)) {
    return digits.slice(2);
  }
  return null;
}

export function formatPhoneDisplay(phone: string) {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export function verifyDevOtp(otp: string) {
  return otp.replace(/\s/g, "") === DEV_OTP;
}

export function getSession(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(user: AuthUser) {
  if (!canUseStorage()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("astrologics-auth-changed"));
}

export function clearSession() {
  if (!canUseStorage()) return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("astrologics-auth-changed"));
}

/** Sync profile fields onto the session user until DB exists. */
export function updateSessionProfile(
  patch: Partial<Pick<AuthUser, "firstName" | "lastName" | "name">>
) {
  const session = getSession();
  if (!session) return null;
  const next: AuthUser = {
    ...session,
    ...patch,
    name:
      [patch.firstName ?? session.firstName, patch.lastName ?? session.lastName]
        .map((p) => p?.trim())
        .filter(Boolean)
        .join(" ") || patch.name || session.name,
  };
  const users = readUsers();
  const idx = users.findIndex((u) => u.phone === session.phone);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...next };
    writeUsers(users);
  }
  setSession(next);
  return next;
}

/** Soft sign-out; user can log in again with the same number. */
export function deactivateAccount() {
  clearSession();
}

/** Permanently remove local account data for the current session phone. */
export function deleteAccount() {
  const session = getSession();
  if (!session) {
    clearSession();
    return;
  }
  const users = readUsers().filter((u) => u.phone !== session.phone);
  writeUsers(users);
  clearSession();
}

/** Create account for new numbers; return existing for returning users. */
export function loginOrSignupWithPhone(
  phoneRaw: string,
  whatsappUpdates: boolean
): { user: AuthUser; isNew: boolean } | { error: string } {
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return { error: "invalid_phone" };
  }

  const users = readUsers();
  const existing = users.find((u) => u.phone === phone);
  if (existing) {
    const user = { ...existing, whatsappUpdates, isNewAtLogin: false };
    const nextUsers = users.map((u) => (u.phone === phone ? user : u));
    writeUsers(nextUsers);
    setSession(user);
    return { user, isNew: false };
  }

  const user: AuthUser = {
    phone,
    createdAt: new Date().toISOString(),
    whatsappUpdates,
    isNewAtLogin: true,
  };
  writeUsers([...users, user]);
  setSession(user);
  return { user, isNew: true };
}
