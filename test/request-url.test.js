import { describe, it, expect } from "vitest";
import { buildRequestUrl } from "../lib/request-url.js";

describe("buildRequestUrl", () => {
  it("builds the live-stats endpoint from the settings", () => {
    expect(buildRequestUrl("https://universalbicycle.team", 259, "1")).toBe(
      "https://universalbicycle.team/api/v1/live-stats/259/1"
    );
  });

  it("tolerates a trailing slash and surrounding whitespace on the site URL", () => {
    expect(buildRequestUrl("https://example.org/", 12, "7")).toBe(
      "https://example.org/api/v1/live-stats/12/7"
    );
    expect(buildRequestUrl("  https://example.org  ", 12, "7")).toBe(
      "https://example.org/api/v1/live-stats/12/7"
    );
  });

  it("accepts a numeric competition id given as a string", () => {
    expect(buildRequestUrl("https://x.io", "259", "1")).toBe(
      "https://x.io/api/v1/live-stats/259/1"
    );
  });

  it("returns null until the settings are usable", () => {
    expect(buildRequestUrl("", 259, "1")).toBeNull();
    expect(buildRequestUrl("https://x.io", 0, "1")).toBeNull();
    expect(buildRequestUrl("https://x.io", -5, "1")).toBeNull();
    expect(buildRequestUrl("https://x.io", "abc", "1")).toBeNull();
    expect(buildRequestUrl("https://x.io", 259, "")).toBeNull();
    expect(buildRequestUrl(null, 259, "1")).toBeNull();
  });
});
