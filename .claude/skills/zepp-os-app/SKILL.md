---
name: zepp-os-app
description: How this Zepp OS mini app is put together and where a change belongs - device page, side service, settings screen, pure lib, layouts, i18n. Use before editing app code, adding a metric, a locale or a screen shape.
---

# The app itself

## Three runtimes, one repository

A Zepp OS mini app is three programs that ship together, and none of them can call the
others directly:

- `page/index.js` - the **device app**, on the watch. Draws widgets through `@zos/ui`,
  asks the side service for stats every `REFRESH_MS` (60s), and renders whatever it is
  given. No network: the watch has none.
- `app-side/index.js` - the **side service**, JavaScript inside the Zepp phone app. Makes
  the single `GET` to the timing site, reads the rider's settings out of
  `settingsStorage`, and answers the device's `GET_STATS` request.
- `setting/index.js` - the **settings screen** in the phone app. Writes the rider's
  configuration into `settingsStorage`. Its own UI text is English; only the on-watch
  labels follow the watch language.

Anything with real logic goes in `lib/` instead, free of any Zepp OS import, because that
is the only part the unit tests can run:

- `lib/metrics.js` - the metric catalogue, the known-key set, the settings index mapping.
- `lib/settings.js` - the settings schema and defaults, shared by the writer and reader.
- `lib/layout.js` - how many columns each row gets for a field count and screen shape.
- `lib/round-geometry.js` - chord-limited line widths on a round screen.
- `lib/stats-formatter.js` - key to display value, the `--` placeholder, keeping the last
  good standings when a fetch fails.
- `lib/i18n/` - `labels.js` (one table per language) and `index.js` (locale resolution).
- `utils/config/` - colors, `REFRESH_MS`, the device-shape flags read from `@zos/device`.

The rule of thumb: if you want to test it, it does not belong in `page/`, `app-side/` or
`setting/`. Those three files stay thin enough to read.

## Failure is a display state, never an exception

No phone network, a 404 before the race has data, malformed JSON - all of them reply with
`null` stats, and the device keeps the last standings it had and shows `--` for what it
never had. Never let a fetch failure blank the screen or throw.

## Adding a metric

1. Add the key to `KNOWN_KEYS` in `lib/metrics.js` (unknown keys are ignored by design, so
   an older build keeps working), and to `METRICS` if the rider may pick it for a row.
   A stored row setting is an index into `METRICS`, so append rather than reorder - an
   insert silently changes what every installed watch shows.
2. Add a label for it in **every** language table in `lib/i18n/labels.js`. The
   locale-completeness test fails otherwise. Keep labels at most 12 characters or they do
   not fit a row on the round screen.
3. Cover it in `test/metrics.test.mjs` / `test/i18n.test.mjs`.

## Adding a language

Add a table to `LABELS` with every metric key and it becomes available automatically;
`lib/i18n/index.js` maps both a device locale string and the Zepp OS integer language code
to it, falling back to English. `lib/i18n/labels.js` is legitimately non-ASCII and is
exempt from the ASCII guard and the `no-non-ascii` pre-commit hook - no other file is.

## Screens

`app.json` targets round 466, round 480 and square 390. Round screens use a diamond of
rows (narrow top and bottom, wide middle) capped at `MAX_ROUND_FIELDS` (9); square screens
use a two-column grid up to `MAX_FIELDS` (10), which is also the settings cap. Layouts are
pure arithmetic in `lib/layout.js` and unit tested against every field count; the page only
turns column counts into pixel boxes.

## Settings

Keys live in `SETTING_KEYS`; per-row metrics are `rowMetric0`, `rowMetric1`, ... Every
stored value is a string, and the pure helpers coerce and clamp. A missing or out-of-range
value must fall back to a default rather than break - installs upgrade in place.
