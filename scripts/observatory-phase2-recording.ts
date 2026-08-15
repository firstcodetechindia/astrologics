/**
 * Phase 2 Observatory recording: labels + Kundli detail panel + mobile widths.
 * npx tsx scripts/observatory-phase2-recording.ts
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
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-phase2-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static missing");
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=1440,900", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const videoPath = path.join(outDir, "observatory-phase2.mp4");
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
    await page.waitForSelector("[data-observatory-legend='mars']", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));

    await page.$eval("[data-observatory-legend='mars']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await page.waitForSelector("[aria-labelledby='observatory-detail-title']", {
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.$eval("[data-observatory-legend='saturn']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await new Promise((r) => setTimeout(r, 600));

    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("button")];
      buttons.find((b) => (b.textContent || "").includes("Earth-centered"))?.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(outDir, "observatory-phase2-desktop.png"),
      fullPage: true,
    });

    for (const w of [360, 390, 430] as const) {
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 500));
      await page.$eval("[data-observatory-legend='venus']", (el) =>
        (el as HTMLButtonElement).click()
      );
      await new Promise((r) => setTimeout(r, 400));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      await page.screenshot({
        path: path.join(outDir, `observatory-phase2-${w}.png`),
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
