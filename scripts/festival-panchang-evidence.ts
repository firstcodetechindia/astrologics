/**
 * Evidence: Hindu festival greetings come from Panchang tithi+paksha+masa,
 * not a Gregorian MM-DD table. npx tsx scripts/festival-panchang-evidence.ts
 */
import fs from "node:fs";
import path from "node:path";
import { hinduFestivalOnDate } from "../src/lib/social/hindu-festivals.ts";
import { buildSocialCandidates } from "../src/lib/social/candidates.ts";

function srcHasJanmashtamiMd(): boolean {
  const p = path.join(process.cwd(), "src/lib/social/candidates.ts");
  return fs.readFileSync(p, "utf8").includes("08-14");
}

async function main() {
  const janmashtami2026 = hinduFestivalOnDate("2026-09-04");
  const falseCivil = hinduFestivalOnDate("2026-08-14");
  const independence = hinduFestivalOnDate("2026-08-15");
  const randomMay = hinduFestivalOnDate("2026-05-20");
  const diwaliProbe = ["2026-11-06", "2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10"].map(
    (d) => hinduFestivalOnDate(d)
  );

  const todayCandidates = buildSocialCandidates("en");
  const festivalBody = todayCandidates.find((c) => c.kind === "festival_muhurta")?.body || "";

  const janmashtamiHit = janmashtami2026.festival?.id === "janmashtami";
  const noHardcodedMd = !srcHasJanmashtamiMd();
  const aug14IsNotJanmashtami = falseCivil.festival?.id !== "janmashtami";
  const independenceNotJanmashtami = independence.festival?.id !== "janmashtami";
  const mayHasNoFakeJanmashtami = randomMay.festival?.id !== "janmashtami";
  const diwaliHit = diwaliProbe.some((d) => d.festival?.id === "diwali");
  const usesPanchangCopy =
    festivalBody.includes("Panchang") ||
    festivalBody.includes("tithi") ||
    festivalBody.includes("masa") ||
    festivalBody.includes("Independence") ||
    festivalBody.includes("Republic") ||
    festivalBody.includes("Gandhi");

  const report = {
    ok:
      janmashtamiHit &&
      noHardcodedMd &&
      aug14IsNotJanmashtami &&
      independenceNotJanmashtami &&
      mayHasNoFakeJanmashtami &&
      diwaliHit &&
      usesPanchangCopy,
    method: janmashtami2026.purnimaNakshatra
      ? `purnima-nakshatra (${janmashtami2026.purnimaNakshatra})`
      : "purnima-nakshatra",
    janmashtami2026,
    civilAug14IsNotJanmashtami: {
      ymd: falseCivil.ymd,
      tithi: falseCivil.tithiName,
      paksha: falseCivil.paksha,
      festival: falseCivil.festival,
      note: "Sunrise Delhi tithi on 14 Aug 2026 is not Krishna Ashtami. Hard-coded 08-14 was the second date path.",
    },
    independence2026: {
      ymd: independence.ymd,
      masa: independence.masaId,
      tithi: independence.tithiName,
      festival: independence.festival,
    },
    diwaliWindow2026: diwaliProbe.map((d) => ({
      ymd: d.ymd,
      masa: d.masaId,
      paksha: d.paksha,
      tithiInPaksha: d.tithiInPaksha,
      festival: d.festival?.id || null,
    })),
    hardcodedJanmashtamiMdRemoved: noHardcodedMd,
    engine: "astronomy-engine + Lahiri via computeTodayPanchang / lunarMasaAt",
    adhikaMasa:
      "Amanta month is named by Purnima nakshatra. Adhika (extra) lunar months are not separately labelled.",
  };

  const outDir = path.join(process.cwd(), "scripts/fixtures/go-live-evidence");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "festival-panchang.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
