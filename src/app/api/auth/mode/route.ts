import { NextResponse } from "next/server";
import { resolveAuthMode } from "@/lib/auth/auth0";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: tells the login UI whether Auth0 is active. Defaults to OTP. */
export async function GET() {
  try {
    const mode = await resolveAuthMode();
    return NextResponse.json({ ok: true, mode });
  } catch {
    return NextResponse.json({ ok: true, mode: "otp" });
  }
}
