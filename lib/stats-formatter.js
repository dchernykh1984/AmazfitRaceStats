// Pure helpers that map the opaque per-bib stats object returned by the timing
// site to the values the app renders. Free of any Zepp OS runtime dependency so
// the unit tests can exercise them directly. Mirrors the Garmin data field's
// StatsFormatter so the two clients render a race identically.

// Placeholder drawn when a value is not available yet - the same "no data" dashes
// a native field shows before its first reading.
export const NO_VALUE = "--";

// Value stored for key in stats, or an empty string when there is no data yet
// (null stats), the key is absent, or the value is not a string. Never throws, so
// a partial or missing snapshot can never crash the app. This is the raw
// single-key lookup; place composition is in displayValue.
export function valueFor(stats, key) {
  if (stats == null) {
    return "";
  }
  const value = stats[key];
  return typeof value === "string" ? value : "";
}

// "place/qty" (e.g. "17/84"), or just the place when qty is missing, or "" when
// there is no place yet. A non-numeric place (e.g. "DSQ") is shown on its own,
// since "DSQ/84" would be nonsense.
export function placeValue(stats, placeKey, qtyKey) {
  const place = valueFor(stats, placeKey);
  if (place === "") {
    return "";
  }
  const qty = valueFor(stats, qtyKey);
  if (qty === "" || Number.isNaN(Number(place))) {
    return place;
  }
  return place + "/" + qty;
}

// The value to render for a picked metric. For the two place metrics this is
// "place/qty"; for everything else it is the raw key value.
export function displayValue(stats, metric) {
  if (metric === "place_abs") {
    return placeValue(stats, "place_abs", "qty_abs");
  }
  if (metric === "place_group") {
    return placeValue(stats, "place_group", "qty_group");
  }
  return valueFor(stats, metric);
}

// Like displayValue, but never blank: a missing value becomes NO_VALUE. This is
// what the app actually draws, so an unconfigured or not-yet-fetched row reads as
// "waiting for data" instead of looking broken.
export function displayOr(stats, metric) {
  const value = displayValue(stats, metric);
  return value === "" ? NO_VALUE : value;
}
