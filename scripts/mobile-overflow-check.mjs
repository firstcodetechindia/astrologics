/**
 * Viewport overflow sweep — page-level scrollWidth vs innerWidth.
 * Usage: node scripts/mobile-overflow-check.mjs
 *
 * Distinguishes:
 *   Y  = document/body wider than the viewport (real horizontal page scroll)
 *   N  = no page scroll (decorative blobs / tables inside overflow-x-auto may
 *        still paint past the viewport but are contained)
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const WIDTHS = [360, 390, 430];
const HEIGHT = 844;
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CALCULATORS = [
  "birth-time-rectification",
  "moon-sign",
  "sun-sign",
  "nakshatra",
  "lagna",
  "navamsa",
  "moon-phase",
  "mangal-dosha",
  "kaal-sarp-dosha",
  "sade-sati",
  "vimshottari-dasha",
  "pitra-dosha",
  "kundli-matching",
  "love-calculator",
  "atmakaraka",
  "ishta-devata",
  "prashna-kundli",
  "kp-horary",
  "kp-sub-lord",
  "kp-ruling-planets",
  "gemstone",
  "rudraksha",
  "baby-name",
  "muhurta-electional",
  "today-panchang",
  "choghadiya",
  "gowri-panchangam",
  "rahu-kaal",
  "hora",
  "birth-panchang",
  "ayanamsa",
  "life-path",
  "name-numerology",
  "mobile-number",
  "vehicle-number",
  "house-number",
  "business-name",
  "personal-year",
  "lo-shu-grid",
  "love-compatibility-num",
  "name-correction",
];

const PAGES = [
  "/en",
  "/hi",
  "/en/login",
  "/en/signup",
  "/en/astrologer/signin",
  "/en/astrologer/signup",
  "/en/astrologer/dashboard",
  "/en/kundli",
  "/en/kundli/result",
  "/en/calculators",
  ...CALCULATORS.map((s) => `/en/calculators/${s}`),
  "/en/horoscope",
  "/en/horoscope/aries",
  "/en/numerology",
  "/en/vastu",
  "/en/panchang",
  "/en/chat",
  "/en/chat-with-astrologer",
  "/en/features",
  "/en/pricing",
  "/en/about",
  "/en/methodology",
  "/en/services",
  "/en/faq",
  "/en/contact",
  "/en/blog",
  "/en/learn",
  "/en/learn/zodiac",
  "/en/learn/glossary/lagna",
  "/en/dashboard",
  "/en/dashboard/profile",
  "/en/dashboard/results",
  "/en/dashboard/kundli-check",
  "/en/dashboard/saved",
  "/en/terms",
  "/en/privacy",
];

function measureScript() {
  const vw = window.innerWidth;
  const docW = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth
  );
  const delta = docW - vw;
  const pageScroll = delta > 1;
  const nodes = [];
  if (pageScroll) {
    const all = document.querySelectorAll("body *");
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      const overflow = r.right - vw;
      if (overflow > 2 || r.left < -2) {
        nodes.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && String(el.className).slice(0, 80)) || "",
          w: Math.round(r.width),
          left: Math.round(r.left),
          overflow: Math.round(overflow),
        });
      }
      if (nodes.length > 6) break;
    }
  }
  return {
    inner: vw,
    scroll: docW,
    delta,
    overflow: pageScroll,
    offenders: nodes.slice(0, 4),
  };
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];
for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: HEIGHT, deviceScaleFactor: 1 });
  for (const path of PAGES) {
    const url = `${BASE}${path}`;
    try {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      await new Promise((r) => setTimeout(r, 250));
      const data = await page.evaluate(measureScript);
      results.push({
        width,
        path,
        status: res?.status() ?? 0,
        ...data,
      });
      process.stdout.write(
        `${data.overflow ? "Y" : "N"} ${width} ${path} Δ${data.delta}\n`
      );
    } catch (e) {
      results.push({
        width,
        path,
        status: 0,
        overflow: null,
        error: String(e.message || e).slice(0, 120),
      });
      process.stdout.write(`E ${width} ${path} ${e.message}\n`);
    }
  }
  await page.close();
}

await browser.close();

const byPage = new Map();
for (const r of results) {
  const prev = byPage.get(r.path) || {
    path: r.path,
    overflow: false,
    widths: [],
    offenders: [],
  };
  if (r.overflow) prev.overflow = true;
  prev.widths.push({
    w: r.width,
    y: r.overflow ? "Y" : r.overflow === null ? "E" : "N",
    delta: r.delta ?? 0,
    status: r.status,
  });
  if (r.offenders?.length) prev.offenders.push(...r.offenders);
  byPage.set(r.path, prev);
}

console.log("\n=== SUMMARY (page-level horizontal scroll) ===");
for (const row of byPage.values()) {
  const cause = row.offenders[0]
    ? `${row.offenders[0].tag}.${row.offenders[0].cls} w=${row.offenders[0].w}`
    : "";
  console.log(
    `${row.overflow ? "Y" : "N"}\t${row.path}\t${row.widths.map((x) => `${x.w}:${x.y}`).join(" ")}\t${cause}`
  );
}
