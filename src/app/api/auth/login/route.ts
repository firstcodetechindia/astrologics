import { NextRequest, NextResponse } from "next/server";
import { isAuth0Enabled, getAuth0Client } from "@/lib/auth/auth0";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAuth0Enabled())) {
    return NextResponse.json(
      {
        ok: false,
        error: "Auth0 is feature-flagged OFF. Use the existing mobile OTP login.",
      },
      { status: 404 }
    );
  }
  const auth0 = await getAuth0Client();
  return auth0.startInteractiveLogin();
}

export async function POST(req: NextRequest) {
  return GET(req);
}
