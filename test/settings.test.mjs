import { describe, it, expect } from "vitest";
import { resolveRowMetrics, DEFAULT_ROW_COUNT, SETTING_KEYS } from "../lib/settings.js";
import { MAX_ROWS } from "../lib/metrics.js";

describe("resolveRowMetrics", () => {
  it("defaults a fresh install to a spread of the first metrics", () => {
    expect(resolveRowMetrics({})).toEqual([
      "place_abs",
      "place_group",
      "gap_prev_abs",
      "gap_next_abs",
    ]);
    expect(resolveRowMetrics({}).length).toBe(DEFAULT_ROW_COUNT);
  });

  it("uses the stored per-row metric choices", () => {
    const settings = {
      [SETTING_KEYS.ROW_COUNT]: 2,
      [SETTING_KEYS.ROW_METRIC_PREFIX + 0]: 14,
      [SETTING_KEYS.ROW_METRIC_PREFIX + 1]: 0,
    };
    expect(resolveRowMetrics(settings)).toEqual(["laps", "place_abs"]);
  });

  it("clamps the row count to 1..MAX_ROWS", () => {
    expect(resolveRowMetrics({ [SETTING_KEYS.ROW_COUNT]: 99 }).length).toBe(MAX_ROWS);
    expect(resolveRowMetrics({ [SETTING_KEYS.ROW_COUNT]: 0 }).length).toBe(1);
  });

  it("treats an unset or empty row count as the default", () => {
    expect(resolveRowMetrics({ [SETTING_KEYS.ROW_COUNT]: "" }).length).toBe(DEFAULT_ROW_COUNT);
    expect(resolveRowMetrics({ [SETTING_KEYS.ROW_COUNT]: null }).length).toBe(DEFAULT_ROW_COUNT);
  });

  it("falls back to a valid metric for a bad stored index", () => {
    const settings = {
      [SETTING_KEYS.ROW_COUNT]: 2,
      [SETTING_KEYS.ROW_METRIC_PREFIX + 0]: "bogus",
    };
    expect(resolveRowMetrics(settings)).toEqual(["place_abs", "place_group"]);
  });
});
