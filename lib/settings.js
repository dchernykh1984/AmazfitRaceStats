// The settings schema shared by the settings screen (which writes) and the side
// service (which reads), plus the pure mapping from stored values to the metric
// keys the device draws. Kept free of any Zepp OS dependency so it is unit tested.
import { clampRowCount, metricForIndex, DEFAULT_METRIC_INDEX } from "./metrics.js";

export const DEFAULT_SITE_URL = "https://universalbicycle.team";

// Demo defaults so a fresh install shows live data from the sample race
// (competition 259, bib 1) without any setup. Revisit before store release.
export const DEFAULT_COMPETITION_ID = "259";
export const DEFAULT_BIB = "1";

// settingsStorage keys.
export const SETTING_KEYS = {
  SITE_URL: "siteUrl",
  COMPETITION_ID: "competitionId",
  BIB: "bib",
  ROW_COUNT: "rowCount",
  // Per-row metric index is stored under `rowMetric0`, `rowMetric1`, ...
  ROW_METRIC_PREFIX: "rowMetric",
};

// The default number of rows a fresh install shows.
export const DEFAULT_ROW_COUNT = 4;

// The ordered metric keys to draw, from a plain settings object
// { rowCount, rowMetric0, rowMetric1, ... }. A row with no stored choice defaults
// to the metric at its own index, so a fresh install shows a sensible spread
// rather than the same metric repeated. Out-of-range or missing values fall back
// to the default metric.
export function resolveRowMetrics(settings) {
  const source = settings || {};
  const storedCount = source[SETTING_KEYS.ROW_COUNT];
  const count = clampRowCount(
    storedCount == null || storedCount === "" ? DEFAULT_ROW_COUNT : storedCount
  );

  const metrics = [];
  for (let i = 0; i < count; i++) {
    const stored = source[SETTING_KEYS.ROW_METRIC_PREFIX + i];
    const index = stored == null || stored === "" ? i : Number(stored);
    metrics.push(metricForIndex(Number.isInteger(index) ? index : DEFAULT_METRIC_INDEX));
  }
  return metrics;
}
