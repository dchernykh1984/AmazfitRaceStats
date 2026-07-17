import { describe, it, expect } from "vitest";
import { LABELS } from "../lib/i18n/labels.js";
import { LANGUAGES, DEFAULT_LANGUAGE, labelFor, resolveLanguage } from "../lib/i18n/index.js";
import { METRICS } from "../lib/metrics.js";

// The on-watch label budget: a row header longer than this is truncated on the
// 466x466 screen. Kept in step with the labels the Garmin field ships.
const MAX_LABEL = 12;

describe("locale completeness", () => {
  it("includes the default language", () => {
    expect(LANGUAGES).toContain(DEFAULT_LANGUAGE);
  });

  it("defines exactly the metric catalogue in every language", () => {
    const expected = [...METRICS].sort();
    for (const lang of LANGUAGES) {
      expect(Object.keys(LABELS[lang]).sort(), lang).toEqual(expected);
    }
  });

  it("has a non-empty label within budget for every metric in every language", () => {
    for (const lang of LANGUAGES) {
      for (const metric of METRICS) {
        const label = LABELS[lang][metric];
        expect(typeof label, `${lang}/${metric}`).toBe("string");
        expect(label.length, `${lang}/${metric} '${label}'`).toBeGreaterThan(0);
        expect(label.length, `${lang}/${metric} '${label}'`).toBeLessThanOrEqual(MAX_LABEL);
      }
    }
  });
});

describe("resolveLanguage", () => {
  it("maps a device locale to a supported 2-letter language", () => {
    expect(resolveLanguage("ru-RU")).toBe("ru");
    expect(resolveLanguage("en_US")).toBe("en");
    expect(resolveLanguage("kk-KZ")).toBe("kk");
    expect(resolveLanguage("de")).toBe("de");
  });

  it("falls back to the default for unknown or empty locales", () => {
    expect(resolveLanguage("ja-JP")).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage("")).toBe(DEFAULT_LANGUAGE);
    expect(resolveLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
  });
});

describe("labelFor", () => {
  it("returns the localized label for a supported language", () => {
    expect(labelFor("ru", "place_abs")).toBe(LABELS.ru.place_abs);
    expect(labelFor("kk", "laps")).toBe(LABELS.kk.laps);
  });

  it("falls back to English, then to the raw key", () => {
    expect(labelFor("ja", "laps")).toBe(LABELS.en.laps);
    expect(labelFor("en", "not_a_metric")).toBe("not_a_metric");
  });
});
