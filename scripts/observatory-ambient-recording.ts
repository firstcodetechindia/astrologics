/**
 * Ambient Observatory recording: auto-drift on load (no play button),
 * planet focus + knowledge panel, full view, Sun/Earth toggle, mobile widths.
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

async function sampleFps(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>
) {
  return page.evaluate(
    () => (window as Window & { __observatoryFps?: number }).__observatoryFps ?? 0
  );
}

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-ambient-evidence");
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

  const videoPath = path.join(outDir, "observatory-ambient.mp4");
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
    await page.waitForSelector("[data-observatory-full-view]", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 4500));
    fpsLog.push({ t: new Date().toISOString(), label: "ambient-load", fps: await sampleFps(page) });
    await page.screenshot({
      path: path.join(outDir, "observatory-ambient-load.png"),
    });

    await page.$eval("[data-observatory-legend='saturn']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await page.waitForSelector("[aria-labelledby='observatory-detail-title']", {
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 1800));
    fpsLog.push({ t: new Date().toISOString(), label: "focus-saturn", fps: await sampleFps(page) });
    await page.screenshot({
      path: path.join(outDir, "observatory-ambient-focus.png"),
    });

    await page.$eval("[data-observatory-full-view]", (el) =>
      (el as HTMLButtonElement).click()
    );
    await new Promise((r) => setTimeout(r, 1500));
    fpsLog.push({ t: new Date().toISOString(), label: "full-view", fps: await sampleFps(page) });

    await page.$eval("[data-observatory-frame='geocentric']", (el) =>
      (el as HTMLButtonElement).click()
    );
    await new Promise((r) => setTimeout(r, 1400));
    fpsLog.push({ t: new Date().toISOString(), label: "earth-centered", fps: await sampleFps(page) });
    await page.screenshot({
      path: path.join(outDir, "observatory-ambient-geo.png"),
    });

    for (const w of [360, 390, 430] as const) {
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 400));
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      await page.screenshot({
        path: path.join(outDir, `observatory-ambient-${w}.png`),
      });
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
