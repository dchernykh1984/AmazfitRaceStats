import { describe, it, expect } from "vitest";
import {
  METRICS,
  MAX_ROWS,
  metricForIndex,
  clampRowCount,
  isKnownKey,
  pickKnownStats,
} from "../lib/metrics.js";

describe("metricForIndex", () => {
  it("maps a dropdown index to its metric", () => {
    expect(metricForIndex(0)).toBe("place_abs");
    expect(metricForIndex(5)).toBe("gap_prev_abs_delta");
    expect(metricForIndex(METRICS.length - 1)).toBe("laps");
  });

  it("falls back to the default for an out-of-range or bad index", () => {
    expect(metricForIndex(-1)).toBe("place_abs");
    expect(metricForIndex(99)).toBe("place_abs");
    expect(metricForIndex(1.5)).toBe("place_abs");
    expect(metricForIndex(undefined)).toBe("place_abs");
  });
});

describe("clampRowCount", () => {
  it("keeps a configured row count within 1..MAX_ROWS", () => {
    expect(clampRowCount(1)).toBe(1);
    expect(clampRowCount(4)).toBe(4);
    expect(clampRowCount(MAX_ROWS)).toBe(MAX_ROWS);
    expect(clampRowCount(0)).toBe(1);
    expect(clampRowCount(-3)).toBe(1);
    expect(clampRowCount(MAX_ROWS + 5)).toBe(MAX_ROWS);
    expect(clampRowCount("bogus")).toBe(1);
  });
});

describe("isKnownKey", () => {
  it("recognises base and extension keys, and rejects unknown ones", () => {
    expect(isKnownKey("gap_leader_abs")).toBe(true);
    expect(isKnownKey("qty_abs")).toBe(true);
    expect(isKnownKey("wattage")).toBe(false);
  });
});

describe("pickKnownStats", () => {
  it("keeps known keys and drops anything the server adds later", () => {
    expect(pickKnownStats({ place_abs: "3", qty_abs: "7", wattage: "250" })).toEqual({
      place_abs: "3",
      qty_abs: "7",
    });
  });

  it("returns an empty object for a null or non-object input", () => {
    expect(pickKnownStats(null)).toEqual({});
    expect(pickKnownStats("nope")).toEqual({});
  });
});
