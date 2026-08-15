/**
 * Time-acceleration Observatory recording: paused, play at day/sec and month/sec,
 * live clock, trails, jump-to-now, mobile widths.
 * npx tsx scripts/observatory-time-recording.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import ffmpegStatic from "ffmpeg-static";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

async function sampleFps(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>
) {
  return page.evaluate(
    () => (window as Window & { __observatoryFps?: number }).__observatoryFps ?? 0
  );
}

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-time-evidence");
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

  const videoPath = path.join(outDir, "observatory-time-acceleration.mp4");
  const recorder = await page.screencast({
    path: videoPath,
    ffmpegPath: ffmpegStatic,
    overwrite: true,
  });

  const fpsLog: { t: string; label: string; fps: number }[] = [];

  try {
    await page.goto(`${BASE}/en/observatory?fps=1`, {
      waitUntil: "networkidle0",
      timeout: 90000,
    });
    await page.waitForSelector("[data-observatory-canvas] canvas", { timeout: 30000 });
    await page.waitForSelector("[data-observatory-play]", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));

    fpsLog.push({ t: new Date().toISOString(), label: "paused", fps: await sampleFps(page) });
    await page.screenshot({
      path: path.join(outDir, "observatory-time-paused.png"),
    });
    await new Promise((r) => setTimeout(r, 1800));

    await page.$eval("[data-observatory-speed='day']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await page.$eval("[data-observatory-play]", (el) => (el as HTMLButtonElement).click());
    await page.waitForFunction(
      () =>
        document.querySelector("[data-observatory-canvas]")?.getAttribute("data-observatory-playing") ===
        "1",
      { timeout: 5000 }
    );
    await new Promise((r) => setTimeout(r, 3500));
    fpsLog.push({ t: new Date().toISOString(), label: "play-day", fps: await sampleFps(page) });

    await page.$eval("[data-observatory-speed='month']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await new Promise((r) => setTimeout(r, 4500));
    fpsLog.push({ t: new Date().toISOString(), label: "play-month", fps: await sampleFps(page) });
    await page.screenshot({
      path: path.join(outDir, "observatory-time-playing-month.png"),
    });

    await page.$eval("[data-observatory-now]", (el) => (el as HTMLButtonElement).click());
    await page.waitForFunction(
      () =>
        document.querySelector("[data-observatory-canvas]")?.getAttribute("data-observatory-playing") ===
        "0",
      { timeout: 5000 }
    );
    await new Promise((r) => setTimeout(r, 800));

    for (const w of [360, 390, 430] as const) {
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 400));
      await page.$eval("[data-observatory-speed='week']", (el) =>
        (el as HTMLButtonElement).click()
      );
      await page.$eval("[data-observatory-play]", (el) => (el as HTMLButtonElement).click());
      await new Promise((r) => setTimeout(r, 700));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      await page.screenshot({
        path: path.join(outDir, `observatory-time-${w}.png`),
      });
      await page.$eval("[data-observatory-play]", (el) => (el as HTMLButtonElement).click());
      if (overflow) throw new Error(`horizontal overflow at ${w}px`);
    }
  } finally {
    await recorder.stop();
    await browser.close();
  }

  fs.writeFileSync(path.join(outDir, "recording-fps.json"), JSON.stringify(fpsLog, null, 2));
  console.log(`Wrote ${videoPath}`);
  console.log(JSON.stringify(fpsLog, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
