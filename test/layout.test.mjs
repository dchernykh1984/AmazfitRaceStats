import { describe, it, expect } from "vitest";
import { fieldRows, MAX_FIELDS } from "../lib/layout.js";

describe("fieldRows (round)", () => {
  it("uses the diamond patterns", () => {
    expect(fieldRows(1, true)).toEqual([1]);
    expect(fieldRows(4, true)).toEqual([1, 2, 1]);
    expect(fieldRows(6, true)).toEqual([1, 2, 2, 1]);
    expect(fieldRows(9, true)).toEqual([1, 2, 3, 2, 1]);
  });

  it("has each pattern sum to the field count", () => {
    for (let n = 1; n <= MAX_FIELDS; n++) {
      const total = fieldRows(n, true).reduce((a, b) => a + b, 0);
      expect(total).toBe(n);
    }
  });

  it("keeps the narrow rows at the top and bottom", () => {
    const rows = fieldRows(9, true);
    expect(rows[0]).toBe(1);
    expect(rows[rows.length - 1]).toBe(1);
    expect(Math.max(...rows)).toBe(rows[Math.floor(rows.length / 2)]);
  });
});

describe("fieldRows (square)", () => {
  it("is a two-column grid with a lone last field centred", () => {
    expect(fieldRows(1, false)).toEqual([1]);
    expect(fieldRows(2, false)).toEqual([2]);
    expect(fieldRows(5, false)).toEqual([2, 2, 1]);
    expect(fieldRows(9, false)).toEqual([2, 2, 2, 2, 1]);
  });

  it("has each pattern sum to the field count", () => {
    for (let n = 1; n <= MAX_FIELDS; n++) {
      const total = fieldRows(n, false).reduce((a, b) => a + b, 0);
      expect(total).toBe(n);
    }
  });
});

describe("fieldRows (clamping)", () => {
  it("clamps out-of-range counts into 1..MAX_FIELDS", () => {
    expect(fieldRows(0, true)).toEqual(fieldRows(1, true));
    expect(fieldRows(-3, false)).toEqual(fieldRows(1, false));
    expect(fieldRows(99, true)).toEqual(fieldRows(MAX_FIELDS, true));
    expect(fieldRows("bogus", true)).toEqual(fieldRows(1, true));
  });
});
