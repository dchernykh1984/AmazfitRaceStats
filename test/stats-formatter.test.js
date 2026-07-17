import { describe, it, expect } from "vitest";
import { NO_VALUE, valueFor, placeValue, displayValue, displayOr } from "../lib/stats-formatter.js";

describe("valueFor", () => {
  it("returns a present string key verbatim", () => {
    expect(valueFor({ place_abs: "17" }, "place_abs")).toBe("17");
  });

  it("is blank for an absent key or a null snapshot, never throwing", () => {
    expect(valueFor({ place_abs: "17" }, "laps")).toBe("");
    expect(valueFor(null, "place_abs")).toBe("");
    expect(valueFor(undefined, "place_abs")).toBe("");
  });

  it("is blank when the value is not a string (defensive)", () => {
    expect(valueFor({ place_abs: 17 }, "place_abs")).toBe("");
  });

  it("renders a signed delta verbatim, including a negative sign", () => {
    expect(valueFor({ gap_prev_abs_delta: "-0:20" }, "gap_prev_abs_delta")).toBe("-0:20");
  });
});

describe("placeValue", () => {
  it("combines place and field size as place/qty", () => {
    expect(placeValue({ place_abs: "17", qty_abs: "84" }, "place_abs", "qty_abs")).toBe("17/84");
  });

  it("shows the place alone when the field size is missing", () => {
    expect(placeValue({ place_group: "3" }, "place_group", "qty_group")).toBe("3");
  });

  it("shows a disqualified rider alone, never DSQ/qty", () => {
    expect(placeValue({ place_abs: "DSQ", qty_abs: "84" }, "place_abs", "qty_abs")).toBe("DSQ");
  });

  it("is blank when there is no place yet", () => {
    expect(placeValue({ qty_abs: "84" }, "place_abs", "qty_abs")).toBe("");
  });
});

describe("displayValue", () => {
  it("composes the two place metrics", () => {
    expect(displayValue({ place_abs: "17", qty_abs: "84" }, "place_abs")).toBe("17/84");
    expect(displayValue({ place_group: "2", qty_group: "3" }, "place_group")).toBe("2/3");
  });

  it("renders the raw value for a non-place metric", () => {
    expect(displayValue({ gap_prev_abs: "+0:12" }, "gap_prev_abs")).toBe("+0:12");
  });
});

describe("displayOr", () => {
  it("shows a real value when present and NO_VALUE when not", () => {
    expect(displayOr({ gap_prev_abs: "+0:12" }, "gap_prev_abs")).toBe("+0:12");
    expect(displayOr({ gap_prev_abs: "+0:12" }, "laps")).toBe(NO_VALUE);
    expect(displayOr(null, "place_abs")).toBe(NO_VALUE);
  });
});
