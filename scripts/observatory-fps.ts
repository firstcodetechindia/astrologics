/**
 * Sample Observatory WebGL FPS while always-on ambient drift is running.
 * Chrome on this Mac (Metal) — not a physical mid-range phone.
 * npx tsx scripts/observatory-fps.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

async function sampleFps(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
  ms: number
) {
  const samples: number[] = [];
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const fps = await page.evaluate(
      () => (window as Window & { __observatoryFps?: number }).__observatoryFps ?? 0
    );
    if (fps > 0) samples.push(fps);
    await new Promise((r) => setTimeout(r, 400));
  }
  return samples;
}

function stats(samples: number[]) {
  if (!samples.length) return { n: 0, min: 0, max: 0, mean: 0 };
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  return { n: samples.length, min, max, mean };
}

async function runViewport(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof puppeteer.launch>>["newPage"]>>,
  width: number,
  height: number,
  dsf: number
) {
  await page.setViewport({ width, height, deviceScaleFactor: dsf });
  await page.goto(`${BASE}/en/observatory?fps=1`, {
    waitUntil: "networkidle0",
    timeout: 90000,
  });
  await page.waitForSelector("[data-observatory-canvas] canvas", { timeout: 30000 });
  await page.waitForSelector("[data-observatory-full-view]", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1200));

  const renderer = await page.evaluate(() => {
    const canvas = document.querySelector("[data-observatory-canvas] canvas") as HTMLCanvasElement | null;
    const gl = canvas?.getContext("webgl2") || canvas?.getContext("webgl");
    if (!gl) return { vendor: "none", renderer: "none" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    };
  });

  const ambient = stats(await sampleFps(page, 4500));

  let moving = stats([]);
  const canvas = await page.$("[data-observatory-canvas] canvas");
  const box = await canvas?.boundingBox();
  if (box) {
    const cx = box.x + box.width * 0.55;
    const cy = box.y + box.height * 0.45;
    const orbit = sampleFps(page, 3500);
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 180, cy + 24, { steps: 36 });
    await page.mouse.move(cx - 70, cy + 70, { steps: 36 });
    await page.mouse.up();
    moving = stats(await orbit);
  }

  await page.$eval("[data-observatory-legend='saturn']", (el) =>
    (el as HTMLButtonElement).click()
  );
  await page.waitForSelector("[aria-labelledby='observatory-detail-title']", {
    timeout: 8000,
  });
  const focused = stats(await sampleFps(page, 3500));

  return {
    width,
    height,
    dsf,
    renderer,
    ambient,
    moving,
    focused,
  };
}

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/observatory-ambient-evidence");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      "--no-sandbox",
      "--ignore-gpu-blocklist",
      "--enable-webgl",
      "--use-angle=metal",
    ],
  });
  const page = await browser.newPage();
  try {
    const desktop = await runViewport(page, 1440, 900, 1);
    const phone2x = await runViewport(page, 390, 844, 2);
    const phone3x = await runViewport(page, 390, 844, 3);
    const report = {
      measuredAt: new Date().toISOString(),
      honesty:
        "Chrome on this Mac, GPU-backed. Not a physical mid-range phone. `ambient` is the default always-on drift (queryObservatoryScene each frame + trails). `focused` is ambient plus a planet fly-to. deviceScaleFactor 2/3 approximates phone fill-rate, not phone GPU.",
      desktop,
      phoneViewportDsf2: phone2x,
      phoneViewportDsf3: phone3x,
    };
    const out = path.join(outDir, "fps-report.json");
    fs.writeFileSync(out, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.log(`Wrote ${out}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
