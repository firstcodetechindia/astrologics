/**
 * Guru reveal: real /en/chat on a running server, 4th-question trigger,
 * 360/390/430 geometry + screenshots, Observatory-style screencast.
 * npx tsx scripts/guru-reveal-recording.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Page } from "puppeteer-core";
import ffmpegStatic from "ffmpeg-static";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

type Geom = {
  width: number;
  height: number;
  overflowX: boolean;
  overlay: { top: number; bottom: number; height: number };
  nav: { top: number; bottom: number; height: number } | null;
  cta: { top: number; bottom: number; height: number; width: number };
  overlayNavOverlap: number;
  ctaNavOverlap: number;
  ctaHitsFab: boolean;
  ctaClippedByOverlay: boolean;
  ctaTooSmall: boolean;
  ok: boolean;
  errors: string[];
};

async function setNativeValue(
  page: Page,
  selector: string,
  value: string
) {
  await page.$eval(
    selector,
    (el, v) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(input, v);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    value
  );
}

async function fillKundliAndOpenChat(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem("cosmicgpt_free_chats_used", "3");
  });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector('input[placeholder="Your name"]', {
    timeout: 30000,
  });

  await page.click('input[placeholder="Your name"]', { clickCount: 3 });
  await page.type('input[placeholder="Your name"]', "Asha");
  await setNativeValue(page, 'input[type="date"]', "1990-05-15");
  await setNativeValue(page, 'input[type="time"]', "06:30");
  await page.click("#place-autocomplete", { clickCount: 3 });
  await page.type("#place-autocomplete", "New Delhi");
  await new Promise((r) => setTimeout(r, 400));

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      /Build kundli & start chat|कुंडली बनाएँ व चैट शुरू करें/.test(
        b.textContent || ""
      )
    );
    if (!btn) throw new Error("start button missing");
    (btn as HTMLButtonElement).click();
  });

  try {
    await page.waitForFunction(
      () =>
        document.body.innerText.includes("Your kundli") ||
        document.body.innerText.includes("आपकी कुंडली"),
      { timeout: 90000 }
    );
  } catch (e) {
    const debug = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll("input")].map((i) => ({
        type: i.type,
        placeholder: i.placeholder,
        value: i.value,
      }));
      return { inputs, text: document.body.innerText.slice(0, 2500) };
    });
    await page.screenshot({
      path: path.join(
        process.cwd(),
        "scripts/fixtures/guru-reveal-evidence/debug-kundli.png"
      ),
      fullPage: true,
    });
    throw new Error(
      `kundli step failed: ${(e as Error).message}\n${JSON.stringify(debug, null, 2)}`
    );
  }

  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("button")].some((b) => {
        const t = (b.textContent || "").trim();
        return t.length > 12 && (t.includes("?") || t.includes("।"));
      }),
    { timeout: 15000 }
  );

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => {
      const t = (b.textContent || "").trim();
      return t.length > 12 && (t.includes("?") || t.includes("।"));
    });
    btn?.click();
  });

  await page.waitForSelector(".guru-reveal-overlay", { timeout: 30000 });
  await page.waitForSelector("[data-guru-reveal-cta]", { timeout: 45000 });
  await new Promise((r) => setTimeout(r, 900));
}

async function measure(page: Page): Promise<Geom> {
  return page.evaluate(() => {
    const overlay = document.querySelector(
      ".guru-reveal-overlay"
    ) as HTMLElement | null;
    const nav = document.querySelector(
      'nav[aria-label="Mobile menu"]'
    ) as HTMLElement | null;
    const cta = document.querySelector(
      "[data-guru-reveal-cta]"
    ) as HTMLElement | null;
    const errors: string[] = [];
    if (!overlay) errors.push("overlay missing");
    if (!cta) errors.push("CTA missing");
    const o = overlay?.getBoundingClientRect();
    const n = nav?.getBoundingClientRect();
    const c = cta?.getBoundingClientRect();
    const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1;
    if (overflowX) errors.push("horizontal overflow");
    const overlayNavOverlap =
      o && n ? Math.max(0, Math.min(o.bottom, n.bottom) - Math.max(o.top, n.top)) : 0;
    const ctaNavOverlap = c && n ? Math.max(0, c.bottom - n.top) : 0;
    const fabTop = n ? n.top - 28 : 0;
    const ctaHitsFab = !!(c && n && c.bottom > fabTop + 1);
    const ctaClippedByOverlay = !!(
      o &&
      c &&
      (c.bottom > o.bottom + 1 || c.top < o.top - 1)
    );
    const ctaTooSmall = !!(c && c.height < 44);
    if (ctaNavOverlap > 1) errors.push(`CTA overlaps nav by ${ctaNavOverlap.toFixed(1)}px`);
    if (ctaHitsFab) errors.push("CTA collides with Home FAB");
    if (ctaClippedByOverlay) errors.push("CTA clipped by overlay");
    if (ctaTooSmall) errors.push(`CTA height ${c?.height} < 44`);
    if (c && (c.left < -1 || c.right > window.innerWidth + 1)) {
      errors.push("CTA horizontally out of viewport");
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      overflowX,
      overlay: o
        ? { top: o.top, bottom: o.bottom, height: o.height }
        : { top: 0, bottom: 0, height: 0 },
      nav: n ? { top: n.top, bottom: n.bottom, height: n.height } : null,
      cta: c
        ? { top: c.top, bottom: c.bottom, height: c.height, width: c.width }
        : { top: 0, bottom: 0, height: 0, width: 0 },
      overlayNavOverlap,
      ctaNavOverlap,
      ctaHitsFab,
      ctaClippedByOverlay,
      ctaTooSmall,
      ok: errors.length === 0,
      errors,
    };
  });
}

async function main() {
  const outDir = path.join(
    process.cwd(),
    "scripts/fixtures/guru-reveal-evidence"
  );
  fs.mkdirSync(outDir, { recursive: true });
  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static missing");
  }

  const health = await fetch(`${BASE}/en/chat`).then((r) => r.status);
  if (health >= 500) throw new Error(`server ${BASE}/en/chat status ${health}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=390,844"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

  const videoPath = path.join(outDir, "guru-reveal.mp4");
  const recorder = await page.screencast({
    path: videoPath,
    ffmpegPath: ffmpegStatic,
    overwrite: true,
  });

  const viewports: Geom[] = [];
  try {
    await page.goto(`${BASE}/en/chat`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await fillKundliAndOpenChat(page);

    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
      });
      await new Promise((r) => setTimeout(r, 500));
      const geom = await measure(page);
      viewports.push(geom);
      await page.screenshot({
        path: path.join(outDir, `guru-reveal-${vp.width}.png`),
        fullPage: false,
      });
    }

    const report = {
      ok: viewports.every((v) => v.ok),
      base: BASE,
      video: videoPath,
      viewports,
    };
    fs.writeFileSync(
      path.join(outDir, "report.json"),
      JSON.stringify(report, null, 2)
    );
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exit(2);
  } finally {
    await recorder.stop();
    await browser.close();
  }

  console.log(`Wrote ${videoPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
