import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Collapse accidental /en/en/... (relative URL typed on an already-localized page). */
function collapseDoubleLocale(pathname: string): string | null {
  const m = pathname.match(/^\/(en|hi)\/(en|hi)(?=\/|$)/);
  if (!m) return null;
  return pathname.replace(/^\/(en|hi)\/(en|hi)/, "/$1");
}

export default function middleware(request: NextRequest) {
  const collapsed = collapseDoubleLocale(request.nextUrl.pathname);
  if (collapsed && collapsed !== request.nextUrl.pathname) {
    const url = request.nextUrl.clone();
    url.pathname = collapsed || "/";
    return NextResponse.redirect(url);
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|hi)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
