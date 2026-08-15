import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Used when a request never reaches [locale]/layout (no <html>/<body> there). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0b0f1f",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ padding: "3rem 1.25rem", maxWidth: 40 + "rem", margin: "0 auto" }}>
          <p style={{ color: "#c2c8d8", fontSize: 14 }}>404</p>
          <h1 style={{ fontSize: "1.5rem" }}>{siteConfig.brandName}</h1>
          <p style={{ color: "#c2c8d8", lineHeight: 1.5 }}>
            This page was not found. If you typed a path like{" "}
            <code>/en/en/observatory</code>, use{" "}
            <code>/en/observatory</code> (one language prefix).
          </p>
          <p>
            <Link href="/en/observatory" style={{ color: "#ffc857" }}>
              Cosmic Observatory
            </Link>
            {" · "}
            <Link href="/en" style={{ color: "#ffc857" }}>
              Home
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
