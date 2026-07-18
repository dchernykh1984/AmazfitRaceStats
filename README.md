# Amazfit Race Stats

A **Zepp OS mini app** for Amazfit watches that shows a rider their live standing
during a race - place, gaps to the riders ahead and behind and to the leader,
per-lap gap dynamics, and laps - by polling the
[UniversalBicycleTeam](https://universalbicycle.team) site by competition id and
bib number.

It is the Amazfit companion to the Garmin
[GarminRaceStats](https://github.com/dchernykh1984/GarminRaceStats) data field and
speaks the same server contract, so a race timed for one works for the other.

## How it works

- The watch cannot reach the internet on its own. The **side service** (JavaScript
  running inside the Zepp phone app) issues a single `GET` to the timing site and
  hands the result back to the **device app**, which renders one metric per row.
- All values are strings, pre-formatted by the server (`"17"`, `"+0:12"`, `"3/7"`,
  `"DSQ"`), so the watch stays trivial: it maps known JSON keys to a display value,
  ignores unknown keys, and shows `--` for missing ones. New stats can be added
  server-side without breaking older installs.
- The rider configures the site URL, competition id, bib, and which metric each row
  shows in the Zepp app settings screen.

## Target devices

Round 466x466 Amazfit watches on Zepp OS 3.0+, initially the **Amazfit GTR 4** and
**Amazfit Active 2**. Both share the same screen, so one layout serves both.

## Repository layout

```
app.json                 Zepp OS mini-app manifest (app id, targets, permissions)
app.js                   App entry
lib/
  stats-formatter.js     Pure key -> value / label helpers (unit tested)
  metrics.js             The metric catalogue and settings mapping
page/index.js            The device app page that renders the metrics
app-side/index.js        Side service; the single network request
setting/index.js         The phone settings screen
assets/                  Icons and on-watch i18n strings
```

## Setup

```bash
git clone https://github.com/dchernykh1984/AmazfitRaceStats.git
cd AmazfitRaceStats
npm install
```

### Develop

```bash
npm test           # run the unit tests (Vitest)
npm run lint       # ESLint
npm run format     # rewrite files with Prettier
npm run preview    # QR-preview on a device via the Zepp app in Developer Mode
npm run build      # produce the .zab store bundle
```

`preview` and `build` fetch the [Zeus CLI](https://docs.zepp.com/docs/guides/quick-start/)
on demand (`npx`), so it is not tracked as a dependency; the first run downloads it.
Building on a device also needs the Zepp OS SDK targets that Zeus fetches.

### Pre-commit hooks (contributors)

```bash
pipx install pre-commit   # or: brew install pre-commit
pre-commit install
```

After that the hooks run automatically: Prettier and ESLint and a non-ASCII guard on
commit, Conventional Commits validation on the commit message, and the unit tests on
push.

## Configuration

Edit these in the Zepp phone app, on the mini app's settings screen:

- **Site URL** - defaults to `https://universalbicycle.team`.
- **Competition ID** - the numeric id from the race page URL.
- **Bib number** - the rider's race number.
- **Rows and Row 1..N** - how many metrics to show and which metric each row shows.

## Continuous integration and releases

Every pull request must pass the required checks: Prettier, ESLint, the unit tests,
`pre-commit`, commitizen (Conventional Commits), `actionlint`, and an OSV dependency
scan.

Releases are automated with `release-please`: it maintains a version-bump PR from the
Conventional Commits and, when merged, tags a GitHub Release. The release build
workflow then produces the `.zab` store bundle and attaches it to the release.
Uploading the `.zab` to the Zepp App Store stays manual, because Zepp has no public
publish API.

## License

Released under the [MIT License](LICENSE).
