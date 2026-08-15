/**
 * Phase 1 Observatory recording: scene, helio/geo toggle, date, outer planets, orbit.
 * npx tsx scripts/observatory-phase1-recording.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import ffmpegStatic from "ffmpeg-static";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-phase1-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static missing");
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,900"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const videoPath = path.join(outDir, "observatory-phase1.mp4");
  const recorder = await page.screencast({
    path: videoPath,
    ffmpegPath: ffmpegStatic,
    overwrite: true,
  });

  try {
    await page.goto(`${BASE}/en/observatory`, {
      waitUntil: "networkidle0",
      timeout: 90000,
    });
    await page.waitForSelector("[data-observatory-canvas] canvas", { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const canvas = await page.$("[data-observatory-canvas] canvas");
    if (!canvas) throw new Error("no webgl canvas");
    const box = await canvas.boundingBox();
    if (!box) throw new Error("no canvas box");

    const cx = box.x + box.width * 0.55;
    const cy = box.y + box.height * 0.45;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 180, cy + 40, { steps: 24 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 600));

    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const geo = buttons.find((b) => (b.textContent || "").includes("Earth-centered"));
      geo?.click();
    });
    await new Promise((r) => setTimeout(r, 900));

    await page.evaluate(() => {
      const input = document.querySelector('input[type="datetime-local"]') as HTMLInputElement | null;
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setter?.call(input, "1990-05-15T06:30");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 900));

    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const outer = buttons.find((b) => (b.textContent || "").includes("Uranus"));
      outer?.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      const helio = buttons.find((b) => (b.textContent || "").includes("Sun-centered"));
      helio?.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx - 120, cy - 70, { steps: 18 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(outDir, "observatory-desktop.png"),
      fullPage: true,
    });

    for (const w of [360, 390, 430] as const) {
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 400));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      await page.screenshot({
        path: path.join(outDir, `observatory-${w}.png`),
        fullPage: true,
      });
      if (overflow) throw new Error(`horizontal overflow at ${w}px`);
    }
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
