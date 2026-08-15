/**
 * Real-time Observatory recording: live default, past-date snapshot, planet focus,
 * full view, mobile widths. No speed controls.
 * npx tsx scripts/observatory-ambient-recording.ts
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
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-realtime-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static missing");
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--window-size=1440,900",
      "--ignore-gpu-blocklist",
      "--enable-webgl",
      "--use-angle=metal",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const videoPath = path.join(outDir, "observatory-realtime.mp4");
  const recorder = await page.screencast({
    path: videoPath,
    ffmpegPath: ffmpegStatic,
    overwrite: true,
  });

  try {
    await page.goto(`${BASE}/en/observatory?fps=1`, {
      waitUntil: "networkidle0",
      timeout: 90000,
    });
    await page.waitForSelector("[data-observatory-canvas] canvas", { timeout: 30000 });
    await page.waitForSelector("[data-observatory-date]", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1500));

    const liveDefault = await page.$eval(
      "[data-observatory-canvas]",
      (el) => (el as HTMLElement).dataset.observatoryLive
    );
    if (liveDefault !== "1") throw new Error("default is not live");
    if (await page.$("[data-observatory-play]")) throw new Error("play control still present");
    if (await page.$("[data-observatory-speed]")) throw new Error("speed control still present");

    await page.screenshot({ path: path.join(outDir, "observatory-live.png") });

    await page.$eval("[data-observatory-date]", (el) => {
      const input = el as HTMLInputElement;
      const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      proto?.set?.call(input, "1990-05-15");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.$eval("[data-observatory-time]", (el) => {
      const input = el as HTMLInputElement;
      const proto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      proto?.set?.call(input, "06:30");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await page.waitForFunction(
      () =>
        document.querySelector("[data-observatory-canvas]")?.getAttribute("data-observatory-live") ===
        "0",
      { timeout: 5000 }
    );
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, "observatory-snapshot.png") });

    await page.$eval("[data-observatory-legend='saturn']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await page.waitForSelector("[aria-labelledby='observatory-detail-title']", {
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 1600));
    await page.screenshot({ path: path.join(outDir, "observatory-focus.png") });

    await page.$eval("[data-observatory-full-view]", (el) =>
      (el as HTMLButtonElement).click()
    );
    await new Promise((r) => setTimeout(r, 1200));

    for (const w of [360, 390, 430] as const) {
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 400));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      await page.screenshot({
        path: path.join(outDir, `observatory-realtime-${w}.png`),
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
