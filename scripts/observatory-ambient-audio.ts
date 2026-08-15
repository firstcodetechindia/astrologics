/**
 * Observatory ambient audio: opt-in only, persist, snap-to-edge, viewports.
 * npx tsx scripts/observatory-ambient-audio.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import ffmpegStatic from "ffmpeg-static";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

type Box = { x: number; y: number; width: number; height: number };

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-ambient-audio-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  if (!ffmpegStatic || !fs.existsSync(ffmpegStatic)) {
    throw new Error("ffmpeg-static missing");
  }

  const audioBytes = fs.statSync(
    path.join(process.cwd(), "public/audio/observatory-ambient.mp3")
  ).size;

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--window-size=1440,900",
      "--ignore-gpu-blocklist",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
  const page = await browser.newPage();
  const consoleErrors: string[] = [];
  const audioRequests: { url: string; page: string }[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("request", (req) => {
    if (req.url().includes("observatory-ambient.mp3")) {
      audioRequests.push({ url: req.url(), page: page.url() });
    }
  });

  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(`${BASE}/en`, { waitUntil: "networkidle0", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 600));
  const homeAudioHits = audioRequests.length;

  const videoPath = path.join(outDir, "observatory-ambient-audio.mp4");
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
    await page.evaluate(() => {
      document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
    });
    await page.waitForSelector("[data-observatory-canvas] canvas", { timeout: 30000 });
    await page.waitForSelector("[data-observatory-ambient]", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));

    const hit = await page.evaluate(() => {
      const el = document.querySelector("[data-observatory-ambient]") as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const top = document.elementFromPoint(x, y);
      return {
        x,
        y,
        tag: top?.tagName,
        id: (top as HTMLElement)?.id || null,
        cls: (top as HTMLElement)?.className?.toString?.().slice(0, 120) || null,
        isBtn: top === el || el.contains(top),
      };
    });
    console.log("HIT", JSON.stringify(hit));

    const tapAmbient = async () => {
      const box = (await page.$eval("[data-observatory-ambient]", (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })) as Box;
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    };

    const beforePlay = await page.evaluate(() => ({
      on: document.querySelector("[data-observatory-ambient]")?.getAttribute("data-observatory-ambient-on"),
      audioEls: document.querySelectorAll("audio").length,
      lsOn: localStorage.getItem("ct.observatory.ambient.on"),
    }));
    const hitsBeforeClick = audioRequests.length;

    await tapAmbient();
    await new Promise((r) => setTimeout(r, 500));
    const afterPlay = await page.evaluate(() => ({
      on: document.querySelector("[data-observatory-ambient]")?.getAttribute("data-observatory-ambient-on"),
      paused: [...document.querySelectorAll("audio")].map((a) => (a as HTMLAudioElement).paused),
    }));

    const startBox = (await page.$eval("[data-observatory-ambient]", (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    })) as Box;
    const cx = startBox.x + startBox.width / 2;
    const cy = startBox.y + startBox.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(1200, 280, { steps: 24 });
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 350));

    const afterDrag = await page.evaluate(() => {
      const el = document.querySelector("[data-observatory-ambient]") as HTMLElement;
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        vw: window.innerWidth,
        on: el.getAttribute("data-observatory-ambient-on"),
        lsPos: localStorage.getItem("ct.observatory.ambient.pos"),
      };
    });

    await tapAmbient();
    await new Promise((r) => setTimeout(r, 300));
    const afterMute = await page.evaluate(
      () => document.querySelector("[data-observatory-ambient]")?.getAttribute("data-observatory-ambient-on")
    );

    await page.screenshot({ path: path.join(outDir, "desktop.png") });

    await page.reload({ waitUntil: "networkidle0", timeout: 90000 });
    await page.evaluate(() => {
      document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
    });
    await page.waitForSelector("[data-observatory-ambient]", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 500));
    const afterReload = await page.evaluate(() => {
      const el = document.querySelector("[data-observatory-ambient]") as HTMLElement;
      const r = el.getBoundingClientRect();
      return {
        on: el.getAttribute("data-observatory-ambient-on"),
        left: r.left,
        top: r.top,
        lsOn: localStorage.getItem("ct.observatory.ambient.on"),
        lsPos: localStorage.getItem("ct.observatory.ambient.pos"),
      };
    });

    const viewports: { w: number; h: number; name: string }[] = [
      { w: 360, h: 800, name: "360" },
      { w: 390, h: 844, name: "390" },
      { w: 430, h: 932, name: "430" },
    ];
    const viewportReport: Record<string, unknown>[] = [];
    for (const v of viewports) {
      await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1 });
      await new Promise((r) => setTimeout(r, 400));
      const info = await page.evaluate(() => {
        const el = document.querySelector("[data-observatory-ambient]") as HTMLElement;
        const nav = document.querySelector("nav, [class*='bottom']");
        const r = el.getBoundingClientRect();
        const header = document.querySelector(".site-header") as HTMLElement | null;
        const hr = header?.getBoundingClientRect();
        return {
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
          vw: window.innerWidth,
          vh: window.innerHeight,
          overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
          headerBottom: hr?.bottom ?? null,
          offscreen: r.left < 0 || r.top < 0 || r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1,
        };
      });
      viewportReport.push({ ...v, ...info });
      await page.screenshot({
        path: path.join(outDir, `viewport-${v.name}.png`),
        fullPage: false,
      });
    }

    const report = {
      measuredAt: new Date().toISOString(),
      audioBytes,
      audioKiB: Math.round((audioBytes / 1024) * 10) / 10,
      homeAudioHits,
      hitsBeforeClick,
      hitsTotal: audioRequests.length,
      beforePlay,
      afterPlay,
      afterDrag,
      afterMute,
      afterReload,
      viewportReport,
      consoleErrors,
      snappedRight: afterDrag.left > afterDrag.vw / 2,
      persistMute: afterReload.on === "0" && afterReload.lsOn === "0",
      persistPos: Boolean(afterReload.lsPos),
      tapTarget44: afterDrag.width >= 44 && afterDrag.height >= 44,
    };
    fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await recorder.stop();
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
