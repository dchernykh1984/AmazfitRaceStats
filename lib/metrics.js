// The metric catalogue and the settings-index mapping. Kept free of any Zepp OS
// runtime dependency so it can be exercised directly by the unit tests.

// Every stats key this build understands: the base set plus the leader gaps and
// per-lap gap deltas. Used only by isKnownKey - a key the server adds later that
// is not here is simply ignored by an old build (the backward-compatibility
// contract). qty_group/qty_abs stay known: they are no longer shown on their own,
// but the server keeps sending them and place folds them in.
export const KNOWN_KEYS = [
  "place_group",
  "qty_group",
  "gap_prev_group",
  "gap_next_group",
  "gap_leader_group",
  "gap_prev_group_delta",
  "gap_next_group_delta",
  "gap_leader_group_delta",
  "place_abs",
  "qty_abs",
  "gap_prev_abs",
  "gap_next_abs",
  "gap_leader_abs",
  "gap_prev_abs_delta",
  "gap_next_abs_delta",
  "gap_leader_abs_delta",
  "laps",
];

// The metrics the rider can pick for a row, in the order the settings dropdown
// lists them; a stored per-row index is an index into this array. qty is
// intentionally absent - it is shown as "place/qty" by the two place metrics.
export const METRICS = [
  "place_abs",
  "place_group",
  "gap_prev_abs",
  "gap_next_abs",
  "gap_leader_abs",
  "gap_prev_abs_delta",
  "gap_next_abs_delta",
  "gap_leader_abs_delta",
  "gap_prev_group",
  "gap_next_group",
  "gap_leader_group",
  "gap_prev_group_delta",
  "gap_next_group_delta",
  "gap_leader_group_delta",
  "laps",
];

// Default metric index (into METRICS); 0 == place_abs.
export const DEFAULT_METRIC_INDEX = 0;

// The most rows the app will draw on the round watch screen.
export const MAX_ROWS = 8;

// The metric for a settings dropdown index. An out-of-range index falls back to
// the default (place_abs) so a bad setting can never leave a row metric-less.
export function metricForIndex(index) {
  if (Number.isInteger(index) && index >= 0 && index < METRICS.length) {
    return METRICS[index];
  }
  return METRICS[DEFAULT_METRIC_INDEX];
}

// Clamp a configured row count into 1..MAX_ROWS.
export function clampRowCount(configured) {
  const n = Number(configured);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  if (n > MAX_ROWS) {
    return MAX_ROWS;
  }
  return Math.floor(n);
}

// Whether key is one of the keys this build knows (base + extension).
export function isKnownKey(key) {
  return KNOWN_KEYS.indexOf(key) !== -1;
}

// A copy of stats holding only the keys this build knows, dropping anything the
// server adds later. This is the "ignore unknown keys" contract: an old install
// keeps working when the server grows new fields, and the payload sent to the
// watch stays small.
export function pickKnownStats(stats) {
  if (stats == null || typeof stats !== "object") {
    return {};
  }
  const known = {};
  for (let i = 0; i < KNOWN_KEYS.length; i++) {
    const key = KNOWN_KEYS[i];
    if (Object.prototype.hasOwnProperty.call(stats, key)) {
      known[key] = stats[key];
    }
  }
  return known;
}
