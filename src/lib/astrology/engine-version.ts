/**
 * Resolved astronomy-engine version for chart.settings.
 * Must match the installed package (package-lock / node_modules), not the
 * ^range in package.json. Kept as a constant so client bundles that import
 * compute() do not pull Node fs.
 *
 * Sync: npm ls astronomy-engine → update this string → scripts assert match.
 */
export const ASTRONOMY_ENGINE_VERSION = "2.1.19";

export function astronomyEngineVersion(): string {
  return ASTRONOMY_ENGINE_VERSION;
}
