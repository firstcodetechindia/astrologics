/**
 * Phase 2 chat chrome: real /en/chat on a running server, in-panel state
 * (not the quota-exhausted reveal). 360/390/430 geometry + screenshots
 * of the restyled panel, suggestion chips, remaining counter, and
 * AiAstrologerLabel visibility.
 * npx tsx scripts/guru-chat-panel-recording.ts
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Page } from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

type LabelGeom = {
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  inViewport: boolean;
  visible: boolean;
  inHeader: boolean;
};

type ChipGeom = {
  text: string;
  width: number;
  height: number;
  left: number;
  right: number;
  tooSmall: boolean;
  outOfViewport: boolean;
};

type Geom = {
  width: number;
  height: number;
  overflowX: boolean;
  remaining: string | null;
  labelCount: number;
  headerLabelCount: number;
  bubbleLabelCount: number;
  labels: LabelGeom[];
  chips: ChipGeom[];
  inputFontPx: number;
  send: { width: number; height: number } | null;
  chipNavOverlap: number;
  composerNavOverlap: number;
  ok: boolean;
  errors: string[];
};

async function setNativeValue(page: Page, selector: string, value: string) {
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
    localStorage.setItem("cosmicgpt_free_chats_used", "0");
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
    await page.waitForSelector("[data-chat-panel]", { timeout: 90000 });
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
        "scripts/fixtures/guru-chat-panel-evidence/debug-kundli.png"
      ),
      fullPage: true,
    });
    throw new Error(
      `kundli step failed: ${(e as Error).message}\n${JSON.stringify(debug, null, 2)}`
    );
  }

  await page.waitForSelector("[data-chat-chips] [data-chat-chip]", {
    timeout: 20000,
  });
  await page.waitForSelector("[data-free-left]", { timeout: 10000 });
  await page.waitForFunction(
    () =>
      document.querySelectorAll(
        "[data-chat-panel] [data-ai-persona-label]"
      ).length >= 2,
    { timeout: 10000 }
  );
}

async function scrollPanelIntoView(page: Page, align: "header" | "chips") {
  await page.evaluate((which) => {
    const target =
      which === "chips"
        ? ((document.querySelector("[data-chat-composer]") as HTMLElement) ||
            (document.querySelector("[data-chat-chips]") as HTMLElement))
        : (document.querySelector("[data-chat-header]") as HTMLElement);
    if (!target) return;
    const siteHeader = document.querySelector("header");
    const nav = document.querySelector(
      'nav[aria-label="Mobile menu"]'
    ) as HTMLElement | null;
    const headerH = siteHeader ? siteHeader.getBoundingClientRect().height : 64;
    const navH = nav ? nav.getBoundingClientRect().height : 84;
    if (which === "chips") {
      const r = target.getBoundingClientRect();
      const top =
        r.bottom + window.scrollY - (window.innerHeight - navH - 12);
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      return;
    }
    const top =
      target.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  }, align);
  await new Promise((r) => setTimeout(r, 350));
}

async function measure(page: Page): Promise<Geom> {
  return page.evaluate(() => {
    const errors: string[] = [];
    const panel = document.querySelector(
      "[data-chat-panel]"
    ) as HTMLElement | null;
    const header = document.querySelector(
      "[data-chat-header]"
    ) as HTMLElement | null;
    const remainingEl = document.querySelector(
      "[data-free-left]"
    ) as HTMLElement | null;
    const nav = document.querySelector(
      'nav[aria-label="Mobile menu"]'
    ) as HTMLElement | null;
    const composer = document.querySelector(
      "[data-chat-composer]"
    ) as HTMLElement | null;
    const input = document.querySelector(
      "[data-chat-input]"
    ) as HTMLElement | null;
    const send = document.querySelector(
      "[data-chat-send]"
    ) as HTMLElement | null;
    const chipsEl = document.querySelector("[data-chat-chips]");

    if (!panel) errors.push("chat panel missing");
    if (!header) errors.push("chat header missing");
    if (!remainingEl) errors.push("remaining counter missing");
    if (!chipsEl) errors.push("suggestion chips missing");
    if (document.querySelector(".guru-reveal-overlay")) {
      errors.push("reveal overlay unexpectedly open");
    }

    const overflowX =
      document.documentElement.scrollWidth > window.innerWidth + 1;
    if (overflowX) errors.push("horizontal overflow");

    const remaining = remainingEl?.textContent?.trim() || null;
    if (!remaining) errors.push("remaining counter empty");
    if (remaining && !/left|शेष/.test(remaining)) {
      errors.push(`remaining copy unexpected: ${remaining}`);
    }

    const remainingBox = remainingEl?.getBoundingClientRect();
    if (
      remainingBox &&
      (remainingBox.width < 8 || remainingBox.height < 8)
    ) {
      errors.push("remaining counter not visible");
    }

    const labelNodes = [
      ...document.querySelectorAll("[data-chat-panel] [data-ai-persona-label]"),
    ] as HTMLElement[];
    const labels: LabelGeom[] = labelNodes.map((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const inHeader = !!(header && header.contains(el));
      const visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        r.width > 8 &&
        r.height > 8;
      const inViewport =
        r.bottom > 0 &&
        r.top < window.innerHeight &&
        r.right > 0 &&
        r.left < window.innerWidth;
      const text = (el.textContent || "").trim();
      return {
        text,
        width: r.width,
        height: r.height,
        top: r.top,
        left: r.left,
        right: r.right,
        inViewport,
        visible,
        inHeader,
      };
    });

    const headerLabels = labels.filter((l) => l.inHeader);
    const bubbleLabels = labels.filter((l) => !l.inHeader);
    if (headerLabels.length < 1) {
      errors.push("AiAstrologerLabel missing from panel header");
    }
    if (bubbleLabels.length < 1) {
      errors.push("AiAstrologerLabel missing from assistant bubble");
    }
    for (const [i, l] of labels.entries()) {
      if (!/AI astrologer|एआई ज्योतिषी/.test(l.text)) {
        errors.push(`label ${i} text missing disclosure: ${l.text}`);
      }
      if (!l.visible) errors.push(`label ${i} not visible`);
      if (l.right > window.innerWidth + 1 || l.left < -1) {
        errors.push(`label ${i} horizontally out of viewport`);
      }
    }
    if (!headerLabels.some((l) => l.visible && l.inViewport)) {
      errors.push("header AiAstrologerLabel not in viewport");
    }

    const chips: ChipGeom[] = [
      ...document.querySelectorAll("[data-chat-chip]"),
    ].map((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      const tooSmall = r.height < 44;
      const outOfViewport =
        r.right > window.innerWidth + 1 || r.left < -1;
      return {
        text: ((el as HTMLElement).textContent || "").trim().slice(0, 80),
        width: r.width,
        height: r.height,
        left: r.left,
        right: r.right,
        tooSmall,
        outOfViewport,
      };
    });
    if (chips.length < 1) errors.push("no suggestion chips");
    for (const [i, c] of chips.entries()) {
      if (c.tooSmall) errors.push(`chip ${i} height ${c.height} < 44`);
      if (c.outOfViewport) errors.push(`chip ${i} horizontally out of viewport`);
    }

    const inputFontPx = input
      ? parseFloat(getComputedStyle(input).fontSize)
      : 0;
    if (inputFontPx < 16) errors.push(`input font ${inputFontPx}px < 16`);

    const sendBox = send?.getBoundingClientRect();
    if (!sendBox) errors.push("send button missing");
    if (sendBox && (sendBox.width < 44 || sendBox.height < 44)) {
      errors.push(
        `send ${sendBox.width.toFixed(1)}×${sendBox.height.toFixed(1)} < 44`
      );
    }

    const n = nav?.getBoundingClientRect();
    const chipsBox = chipsEl?.getBoundingClientRect();
    const composerBox = composer?.getBoundingClientRect();
    const chipNavOverlap =
      chipsBox && n
        ? Math.max(
            0,
            Math.min(chipsBox.bottom, n.bottom) - Math.max(chipsBox.top, n.top)
          )
        : 0;
    const composerNavOverlap =
      composerBox && n
        ? Math.max(
            0,
            Math.min(composerBox.bottom, n.bottom) -
              Math.max(composerBox.top, n.top)
          )
        : 0;

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      overflowX,
      remaining,
      labelCount: labels.length,
      headerLabelCount: headerLabels.length,
      bubbleLabelCount: bubbleLabels.length,
      labels,
      chips,
      inputFontPx,
      send: sendBox
        ? { width: sendBox.width, height: sendBox.height }
        : null,
      chipNavOverlap,
      composerNavOverlap,
      ok: errors.length === 0,
      errors,
    };
  });
}

async function main() {
  const outDir = path.join(
    process.cwd(),
    "scripts/fixtures/guru-chat-panel-evidence"
  );
  fs.mkdirSync(outDir, { recursive: true });

  const health = await fetch(`${BASE}/en/chat`).then((r) => r.status);
  if (health >= 500) throw new Error(`server ${BASE}/en/chat status ${health}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--window-size=390,844"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

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
      await scrollPanelIntoView(page, "header");
      const headerGeom = await measure(page);
      await page.screenshot({
        path: path.join(outDir, `guru-chat-panel-${vp.width}.png`),
        fullPage: false,
      });

      await scrollPanelIntoView(page, "chips");
      const chipsGeom = await measure(page);
      if (chipsGeom.chipNavOverlap > 1) {
        chipsGeom.errors.push(
          `chips overlap nav by ${chipsGeom.chipNavOverlap.toFixed(1)}px`
        );
      }
      if (chipsGeom.composerNavOverlap > 1) {
        chipsGeom.errors.push(
          `composer overlaps nav by ${chipsGeom.composerNavOverlap.toFixed(1)}px`
        );
      }
      chipsGeom.ok = chipsGeom.errors.length === 0;
      await page.screenshot({
        path: path.join(outDir, `guru-chat-chips-${vp.width}.png`),
        fullPage: false,
      });

      const merged: Geom = {
        ...headerGeom,
        chips: chipsGeom.chips,
        inputFontPx: chipsGeom.inputFontPx,
        send: chipsGeom.send,
        chipNavOverlap: chipsGeom.chipNavOverlap,
        composerNavOverlap: chipsGeom.composerNavOverlap,
        errors: [...new Set([...headerGeom.errors, ...chipsGeom.errors])],
        ok: false,
      };
      merged.ok = merged.errors.length === 0;
      viewports.push(merged);
    }

    const report = {
      ok: viewports.every((v) => v.ok),
      base: BASE,
      viewports,
    };
    fs.writeFileSync(
      path.join(outDir, "report.json"),
      JSON.stringify(report, null, 2)
    );
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exit(2);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
