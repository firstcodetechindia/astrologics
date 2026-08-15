/**
 * Measure CosmicTalks wordmark glyph width vs slot, screenshot lockups.
 * npx tsx scripts/wordmark-talks-measure.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>
  body { margin: 0; background: #0B0F1F; font-family: Poppins, system-ui, sans-serif; color: #fff; }
  .row { display: flex; gap: 32px; padding: 24px; align-items: flex-end; }
  .slot { border: 1px dashed rgba(255,255,255,.25); }
  .lock {
    display: inline-flex; align-items: baseline; white-space: nowrap;
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.05;
  }
  .suf {
    background: linear-gradient(90deg,#6C3CFF 0%,#FF5CA8 32%,#FF8A3D 68%,#FFC857 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    letter-spacing: -0.05em; padding-bottom: 0.08em;
  }
  .i { position: relative; display: inline-block; padding: 0 0.01em; }
  .meta { font-size: 12px; color: #9aa; margin-top: 8px; }
</style></head><body>
<div class="row">
  <div>
    <div class="slot" id="hslot" style="width:168px">
      <div class="lock" id="hlock" style="font-size:28px">Cosm<span class="i">ı</span>c<span class="suf">Talks</span></div>
    </div>
    <div class="meta" id="hmeta"></div>
  </div>
  <div>
    <div class="slot" id="fslot" style="width:252px">
      <div class="lock" id="flock" style="font-size:42px">Cosm<span class="i">ı</span>c<span class="suf">Talks</span></div>
    </div>
    <div class="meta" id="fmeta"></div>
  </div>
  <div>
    <div class="slot" id="lgslot" style="width:392px">
      <div class="lock" id="lglock" style="font-size:52px">Cosm<span class="i">ı</span>c<span class="suf">Talks</span></div>
    </div>
    <div class="meta" id="lgmeta"></div>
  </div>
</div>
<script>
function report(lockId, slotId, metaId, label) {
  const lock = document.getElementById(lockId);
  const slot = document.getElementById(slotId);
  const meta = document.getElementById(metaId);
  const lw = Math.round(lock.getBoundingClientRect().width * 10) / 10;
  const sw = slot.getBoundingClientRect().width;
  const ok = lw <= sw + 0.5;
  meta.textContent = label + ': text ' + lw + 'px / slot ' + sw + 'px ' + (ok ? 'FITS' : 'OVERFLOW');
}
report('hlock','hslot','hmeta','header 168 / 28px');
report('flock','fslot','fmeta','footer 252 / 42px');
report('lglock','lgslot','lgmeta','lg 392 / 52px');
</script>
</body></html>`;

async function main() {
  const outDir = path.join(process.cwd(), "scripts/fixtures/wordmark-talks");
  fs.mkdirSync(outDir, { recursive: true });
  const pagePath = path.join(outDir, "measure.html");
  fs.writeFileSync(pagePath, html);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 400, deviceScaleFactor: 2 });
  await page.goto("file://" + pagePath, { waitUntil: "networkidle0" });
  const lines = await page.$$eval(".meta", (els) => els.map((e) => e.textContent));
  await page.screenshot({ path: path.join(outDir, "lockups.png") });
  await browser.close();
  const report = { ok: lines.every((l) => l?.includes("FITS")), lines };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
