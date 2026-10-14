import { describe, it, expect } from "vitest";
import {
  MAX_ROWS,
  metricForIndex,
  clampRowCount,
  isKnownKey,
  pickKnownStats,
} from "../lib/metrics.js";
import { displayOr, NO_VALUE } from "../lib/stats-formatter.js";

describe("metricForIndex", () => {
  it("maps a dropdown index to its metric", () => {
    expect(metricForIndex(0)).toBe("place_abs");
    expect(metricForIndex(5)).toBe("gap_prev_abs_delta");
    expect(metricForIndex(14)).toBe("laps");
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
  it("appends neighbouring pack metrics without moving any saved row choice", () => {
    const previous = [
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
    previous.forEach((key, index) => expect(metricForIndex(index)).toBe(key));
    const packStats = {
      gap_prev_pack_abs: "+0:35.1",
      gap_next_pack_abs: "-1:04.2",
      qty_prev_pack_abs: "100",
      qty_next_pack_abs: "1",
    };
    const selected = pickKnownStats({ ...packStats, future_stat: "ignored" });
    expect(selected).toEqual(packStats);
    Object.entries(packStats).forEach(([key, value], index) => {
      expect(metricForIndex(15 + index)).toBe(key);
      expect(displayOr(selected, key)).toBe(value);
      expect(displayOr({}, key)).toBe(NO_VALUE);
    });
  });

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
